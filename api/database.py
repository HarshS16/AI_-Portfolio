"""
Database setup and models for the chat history.
Uses SQLAlchemy with SQLite (easily swappable to PostgreSQL).
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv(Path(__file__).parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./chat.db")

# Vercel serverless functions have a read-only filesystem except for /tmp
if os.getenv("VERCEL") and DATABASE_URL.startswith("sqlite:///./"):
    DATABASE_URL = "sqlite:////tmp/chat.db"

# For SQLite, need check_same_thread=False
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class ChatMessage(Base):
    """Stores every chat message (user and assistant) with session tracking."""
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, index=True, nullable=False)
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    model_used = Column(String, nullable=True)  # which OpenRouter model responded
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


def init_db():
    """Create all tables if they don't exist."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for FastAPI — yields a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
