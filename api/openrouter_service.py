"""
OpenRouter API service with automatic model fallback.
Tries multiple free models if one is rate-limited (429) or errors (400).
"""

import os
import re
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Free models to try, in order of preference
# NOTE: Avoid models that don't support system instructions (e.g. Gemma)
# NOTE: Reasoning models (R1) placed last — slower and use <think> tags
FREE_MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "qwen/qwen3-4b:free",
    "openai/gpt-oss-120b:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "deepseek/deepseek-r1-0528:free",
]


def clean_response(text: str) -> str:
    """Strip <think>...</think> blocks from reasoning model outputs."""
    if not text:
        return ""
    cleaned = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    return cleaned if cleaned else text.strip()


async def get_chat_response(
    messages: list[dict],
    max_tokens: int = 500,
    temperature: float = 0.7,
) -> dict:
    """
    Send messages to OpenRouter and return the AI response.
    Automatically falls back to the next model on 429/400/empty responses.

    Returns:
        dict with 'content' (str) and 'model_used' (str)
    """
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not set in environment variables.")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "https://harsh-srivastava.dev",
        "X-Title": "Harsh Srivastava Portfolio",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        last_error = ""

        for model in FREE_MODELS:
            payload = {
                "model": model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }

            try:
                response = await client.post(
                    OPENROUTER_API_URL,
                    headers=headers,
                    json=payload,
                )

                if response.status_code == 200:
                    data = response.json()
                    raw_content = (
                        data.get("choices", [{}])[0]
                        .get("message", {})
                        .get("content", "")
                    )
                    content = clean_response(raw_content)

                    if content:
                        return {
                            "content": content,
                            "model_used": model,
                        }
                    # Empty response — try next model
                    print(f"[WARN] Model {model} returned empty, trying next...")
                    continue

                # On rate-limit (429) or bad request (400), try next model
                if response.status_code in (429, 400):
                    reason = "rate-limited" if response.status_code == 429 else "error"
                    print(f"[WARN] Model {model} {reason} ({response.status_code}), trying next...")
                    continue

                # Other error — log and continue
                last_error = f"API error {response.status_code}: {response.text}"
                print(f"[ERROR] OpenRouter error ({model}): {last_error}")
                continue

            except httpx.TimeoutException:
                print(f"[TIMEOUT] Model {model} timed out, trying next...")
                continue
            except Exception as e:
                last_error = str(e)
                print(f"[ERROR] Unexpected error ({model}): {e}")
                continue

        raise RuntimeError(
            last_error or "All models are currently rate-limited. Please try again shortly."
        )
