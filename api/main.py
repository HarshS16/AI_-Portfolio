"""
FastAPI backend for Harsh Srivastava's Portfolio AI Chatbot.

Security layers:
  Layer 1: Bulletproof system prompt (resume-only, positive, anti-hallucination)
  Layer 2: Post-response validation (backend catches bad outputs)
  Layer 3: Question classification (pre-filters before hitting LLM)
  Rate Limiting: Per-IP sliding window to prevent DDoS/abuse

Endpoints:
  POST /api/chat         — Send a message, get AI response
  GET  /api/chat/history — Retrieve chat history for a session
  GET  /api/health       — Health check
"""

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from api.database import init_db, get_db, ChatMessage
from api.openrouter_service import get_chat_response
from api.resume_context import (
    RESUME_SYSTEM_PROMPT,
    classify_question,
    validate_response,
    CATEGORY_RESPONSES,
)
from api.rate_limiter import check_rate_limit, rate_limiter, get_client_ip

# ── App Setup ──────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Harsh Srivastava Portfolio API",
    description="AI-powered chatbot backend for the portfolio website",
    version="2.0.0",
)

# CORS — allow frontend dev server and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
        "*",  # For Cloudflare tunnel / production — tighten in prod
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """Initialize the database on app start."""
    init_db()
    print("[OK] Database initialized")
    print("[OK] 3-layer defense system active")
    print("[OK] Rate limiter active")


# ── Schemas ────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    session_id: str


class ChatResponse(BaseModel):
    reply: str
    model_used: str
    session_id: str


class ChatHistoryItem(BaseModel):
    role: str
    content: str
    model_used: str | None
    created_at: str


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "portfolio-chatbot-api",
        "version": "2.1.0",
        "rate_limiter": rate_limiter.get_stats(),
    }


@app.post("/api/chat", response_model=ChatResponse, dependencies=[Depends(check_rate_limit("chat"))])
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Main chat endpoint with 3-layer defense:

    Layer 3 (Pre-filter):  Classify the question and short-circuit obvious
                           jailbreaks, off-topic, and sensitive queries.
    Layer 1 (System Prompt): The LLM is constrained by a bulletproof system
                             prompt with strict resume-only + positive rules.
    Layer 2 (Post-validation): The AI response is validated for negativity,
                               hallucination, and prompt leakage before returning.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    user_message = request.message.strip()

    # ── LAYER 3: Question Classification (pre-filter) ──────────────────────
    category = classify_question(user_message)
    print(f"[L3] Category: {category} | Message: {user_message[:80]}...")

    # Short-circuit for JAILBREAK, OFF_TOPIC, PERSONAL_SENSITIVE
    if category in CATEGORY_RESPONSES:
        preset_reply = CATEGORY_RESPONSES[category]

        # Save user message to DB
        user_msg = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=user_message,
        )
        db.add(user_msg)

        # Save preset response to DB
        assistant_msg = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=preset_reply,
            model_used=f"preset:{category.lower()}",
        )
        db.add(assistant_msg)
        db.commit()

        return ChatResponse(
            reply=preset_reply,
            model_used=f"preset:{category.lower()}",
            session_id=request.session_id,
        )

    # ── Save user message to DB ────────────────────────────────────────────
    user_msg = ChatMessage(
        session_id=request.session_id,
        role="user",
        content=user_message,
    )
    db.add(user_msg)
    db.commit()

    # ── Load recent conversation history for context (last 20 messages) ────
    recent_db_messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == request.session_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(20)
        .all()
    )

    # ── LAYER 1: Build messages with bulletproof system prompt ──────────────
    messages = [{"role": "system", "content": RESUME_SYSTEM_PROMPT}]

    # For ATTACK_NEGATIVE questions, inject an extra reinforcement message
    if category == "ATTACK_NEGATIVE":
        messages.append({
            "role": "system",
            "content": (
                "[REINFORCEMENT] The user is asking a question that could lead to "
                "negative statements about Harsh. Remember: ALWAYS reframe positively. "
                "Highlight Harsh's strengths. NEVER say anything negative."
            ),
        })

    for msg in recent_db_messages:
        messages.append({"role": msg.role, "content": msg.content})

    # ── Call the LLM ───────────────────────────────────────────────────────
    try:
        result = await get_chat_response(messages)
    except Exception as e:
        print(f"[ERROR] LLM call failed: {e}")
        error_content = (
            "I'm having trouble connecting right now. Please try again in a moment, "
            "or reach out to Harsh directly at harshme08@gmail.com! 😊"
        )
        error_msg = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=error_content,
        )
        db.add(error_msg)
        db.commit()
        return ChatResponse(
            reply=error_content,
            model_used="none",
            session_id=request.session_id,
        )

    # ── LAYER 2: Post-response validation ──────────────────────────────────
    validation = validate_response(result["content"])

    if not validation["is_safe"]:
        print(f"[L2] BLOCKED — Issues: {validation['issues']}")
        final_reply = validation["sanitized_response"]
        model_label = f"{result['model_used']}|sanitized"
    else:
        print(f"[L2] PASSED — Response is safe")
        final_reply = result["content"]
        model_label = result["model_used"]

    # ── Save assistant response to DB ──────────────────────────────────────
    assistant_msg = ChatMessage(
        session_id=request.session_id,
        role="assistant",
        content=final_reply,
        model_used=model_label,
    )
    db.add(assistant_msg)
    db.commit()

    return ChatResponse(
        reply=final_reply,
        model_used=model_label,
        session_id=request.session_id,
    )


@app.get("/api/chat/history", response_model=list[ChatHistoryItem], dependencies=[Depends(check_rate_limit("history"))])
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    """Retrieve chat history for a given session."""
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    return [
        ChatHistoryItem(
            role=msg.role,
            content=msg.content,
            model_used=msg.model_used,
            created_at=msg.created_at.isoformat() if msg.created_at else "",
        )
        for msg in messages
    ]
