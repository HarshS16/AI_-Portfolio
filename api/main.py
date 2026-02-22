"""
FastAPI backend for Harsh Srivastava's Portfolio AI Chatbot.

Endpoints:
  POST /api/chat         — Send a message, get AI response
  GET  /api/chat/history — Retrieve chat history for a session
  GET  /api/health       — Health check
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from api.database import init_db, get_db, ChatMessage
from api.openrouter_service import get_chat_response
from api.resume_context import RESUME_SYSTEM_PROMPT

# ── App Setup ──────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Harsh Srivastava Portfolio API",
    description="AI-powered chatbot backend for the portfolio website",
    version="1.0.0",
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
    return {"status": "ok", "service": "portfolio-chatbot-api"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Main chat endpoint.
    1. Loads recent chat history from DB for the session
    2. Builds a message list with the resume system prompt
    3. Calls OpenRouter with fallback models
    4. Stores both user and assistant messages in DB
    5. Returns the AI response
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Save user message to DB
    user_msg = ChatMessage(
        session_id=request.session_id,
        role="user",
        content=request.message.strip(),
    )
    db.add(user_msg)
    db.commit()

    # Load recent conversation history for context (last 20 messages)
    recent_db_messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == request.session_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(20)
        .all()
    )

    # Build the OpenRouter message list
    messages = [{"role": "system", "content": RESUME_SYSTEM_PROMPT}]
    for msg in recent_db_messages:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        result = await get_chat_response(messages)
    except Exception as e:
        # Save error as assistant message
        error_content = "I'm having trouble connecting right now. Please try again in a moment, or reach out to Harsh directly at harshme08@gmail.com!"
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

    # Save assistant response to DB
    assistant_msg = ChatMessage(
        session_id=request.session_id,
        role="assistant",
        content=result["content"],
        model_used=result["model_used"],
    )
    db.add(assistant_msg)
    db.commit()

    return ChatResponse(
        reply=result["content"],
        model_used=result["model_used"],
        session_id=request.session_id,
    )


@app.get("/api/chat/history", response_model=list[ChatHistoryItem])
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
