# Harsh Srivastava - Full Stack Portfolio with AI Chatbot

A high-performance, aesthetically pleasing portfolio website for Harsh Srivastava, featuring an AI chatbot that answers questions about his professional background using his actual resume as context.

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide React.
- **Backend:** Python (FastAPI), SQLAlchemy.
- **AI Engine:** OpenRouter (accessing multiple high-performance free models with automatic failover).
- **Database:** SQLite (persists chat history per session).
- **Deployment:** Vercel (Frontend + Serverless Python Functions).

## ✨ Key Features

- **AI Career Assistant:** A sticky floating chatbot that knows everything about Harsh's resume. It uses a robust fallback system (Meta Llama 3.3, Mistral, Qwen, DeepSeek R1) to ensure 100% availability.
- **Responsive glassmorphism UI:** Modern, sleek design with smooth animations and interactive elements.
- **Session Persistence:** Chat history is saved locally and on the server, allowing visitors to continue their conversation even after refreshing the page.
- **Optimized Performance:** Fast load times, SEO-friendly meta tags, and high-fidelity assets.

## 🛠️ Project Structure

```text
├── api/                  # Python FastAPI Backend (Vercel Serverless)
│   ├── main.py           # API Entry point & Routes
│   ├── database.py       # SQL Alchemy & SQLite configuration
│   ├── openrouter_service.py # AI logic with multi-model fallback
│   └── resume_context.py # System prompt containing resume data
├── src/                  # React Frontend
│   ├── components/       # UI Components (ChatBot, Hero, About, etc.)
│   ├── pages/            # Page layouts
│   └── lib/              # Utilities
├── public/               # Static assets (Favicon, LOGO, images)
└── vercel.json           # Vercel deployment configuration
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
