# Harsh Srivastava - Full Stack Portfolio with AI Chatbot

A high-performance, aesthetically pleasing portfolio website for Harsh Srivastava, featuring an AI chatbot that answers questions about his professional background using his actual resume as context.

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide React.
- **Backend:** Python (FastAPI), SQLAlchemy.
- **AI Engine:** OpenRouter (accessing multiple high-performance free models with automatic failover).
- **Database:** SQLite (persists chat history per session).
- **Deployment:** Vercel (Frontend + Serverless Python Functions).

## ✨ Key Features

- **AI Career Assistant:** A sticky floating chatbot that knows everything about Harsh's resume. Protected by a **3-layer defense system** to prevent hallucinations, negative responses, and prompt injection attacks. Uses parallel requests to 10 free LLM models (Meta Llama 3.3, Mistral, Qwen, DeepSeek R1, etc.) for near-instant responses and 100% availability.
- **Responsive glassmorphism UI:** Modern, sleek design with smooth animations and interactive elements.
- **Session Persistence:** Chat history is saved locally and on the server, allowing visitors to continue their conversation even after refreshing the page.
- **Optimized Performance:** Fast load times, SEO-friendly meta tags, and high-fidelity assets.

## 🛡️ 3-Layer AI Defense System

The chatbot is protected by a multi-layered defense architecture that ensures it **only says positive, accurate things** about Harsh — no matter what the user asks.

### Layer 1: Bulletproof System Prompt (LLM-level)

The system prompt uses XML-tagged sections for maximum LLM compliance:

| Section | Purpose |
|---------|---------|
| `<SYSTEM_IDENTITY>` | Defines the bot as "Harsh Bot" — a professional brand ambassador |
| `<CORE_RULES>` | 7 absolute rules: resume-only answers, positive framing, no negatives, no hallucination, jailbreak defense, scope boundary, no negative comparisons |
| `<RESPONSE_FORMAT>` | Enforces 2–4 sentence responses, friendly/confident tone, light emoji, no markdown headers |
| `<HALLUCINATION_PREVENTION>` | Explicit zero-knowledge boundary — blocks guessing of dates, numbers, skills, or facts not in the resume |
| `<POSITIVE_REFRAME_EXAMPLES>` | Few-shot examples showing how to spin negative questions into positives |
| `<JAILBREAK_DEFENSE>` | Enumerates common attack patterns with a scripted polite redirect |
| `<FINAL_REMINDER>` | Reinforces all rules at the end of the prompt (recency bias) |

### Layer 2: Post-Response Validation (Backend-level)

Every LLM response is validated **before** it reaches the user:

- **Negative Blocklist** — 30+ banned words/phrases (e.g., "unfortunately", "lacks", "incompetent"). If detected, the response is replaced with a safe fallback.
- **Hallucination Detection** — Flags mentions of companies (Google, Amazon…), degrees (Master's, PhD…), or skills (Docker, Kubernetes…) that are NOT in Harsh's resume.
- **Prompt Leakage Detection** — Catches if the LLM accidentally reveals system prompt tags like `<CORE_RULES>` or `<SYSTEM_IDENTITY>`.
- **Auto-Sanitization** — Any flagged response is swapped with a pre-written, positive fallback message.

### Layer 3: Question Classification (Pre-filter)

Incoming questions are classified **before** they reach the LLM, allowing instant responses and saving API calls:

| Category | Action | Example |
|----------|--------|---------|
| `PROFESSIONAL` | ✅ Normal LLM call | *"Tell me about his projects"* |
| `ATTACK_NEGATIVE` | ⚠️ Extra reinforcement injected + LLM call | *"What is Harsh bad at?"* |
| `JAILBREAK` | 🚫 Preset response — no LLM call | *"Ignore previous instructions"* |
| `OFF_TOPIC` | 🚫 Preset response — no LLM call | *"What's the weather?"* |
| `PERSONAL_SENSITIVE` | 🚫 Preset response — no LLM call | *"What's Harsh's salary?"* |

### Additional Hardening

- **Low Temperature (0.3)** — Reduces creativity/randomness, making hallucination less likely.
- **Token Limit (300)** — Enforces concise responses, matching the format rules.
- **Console Logging** — Every request logs its classification (`[L3]`) and validation status (`[L2]`) for debugging.

## 🛠️ Project Structure

```text
├── api/                      # Python FastAPI Backend (Vercel Serverless)
│   ├── main.py               # API entry point — routes + 3-layer defense orchestration
│   ├── database.py           # SQLAlchemy & SQLite configuration
│   ├── openrouter_service.py # Parallel multi-model AI requests
│   └── resume_context.py     # System prompt, question classifier & response validator
├── src/                      # React Frontend
│   ├── components/           # UI Components (ChatBot, Hero, About, etc.)
│   ├── pages/                # Page layouts
│   └── lib/                  # Utilities
├── public/                   # Static assets (Favicon, LOGO, images)
└── vercel.json               # Vercel deployment configuration
```

## 📦 Local Development

### 1. Backend Setup
1. Navigate to the root folder.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory (copy from `api/.env`) and add your `OPENROUTER_API_KEY`.
4. Start the backend:
   ```bash
   python -m uvicorn api.main:app --reload
   ```

### 2. Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment to Vercel

The project is pre-configured for Vercel.

1. Push the code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add the following **Environment Variable** in the Vercel Dashboard:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key.
4. Vercel will automatically deploy the React frontend and the Python serverless functions in the `api/` folder.

---

Built with Passion by [Harsh Srivastava](https://linkedin.com/in/harsh-tsx)
