"""
OpenRouter API service with parallel model requests.
Fires requests to ALL free models simultaneously and uses whichever responds first.
"""

import os
import re
import asyncio
import httpx
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Free models — all tried in parallel for fastest response
# More models = higher chance at least one isn't rate-limited
FREE_MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "qwen/qwen3-4b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "arcee-ai/trinity-large-preview:free",
    "stepfun/step-3.5-flash:free",
    "deepseek/deepseek-r1-0528:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
]


def clean_response(text: str) -> str:
    """Strip <think>...</think> blocks from reasoning model outputs."""
    if not text:
        return ""
    cleaned = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    return cleaned if cleaned else text.strip()


async def _try_model(
    client: httpx.AsyncClient,
    model: str,
    headers: dict,
    messages: list[dict],
    max_tokens: int,
    temperature: float,
) -> dict | None:
    """
    Try a single model. Returns the parsed result dict on success, or None on failure.
    """
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
                return {"content": content, "model_used": model}

        # Log non-200 for debugging
        if response.status_code != 200:
            print(f"[{response.status_code}] {model}")

    except httpx.TimeoutException:
        print(f"[TIMEOUT] {model}")
    except Exception as e:
        print(f"[ERROR] {model}: {e}")

    return None


async def get_chat_response(
    messages: list[dict],
    max_tokens: int = 500,
    temperature: float = 0.7,
) -> dict:
    """
    Fire requests to ALL models in parallel and return the first successful response.
    This dramatically reduces latency compared to sequential fallback.
    """
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not set in environment variables.")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "https://harsh-srivastava.dev",
        "X-Title": "Harsh Srivastava Portfolio",
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        # Create a task for each model
        tasks = [
            asyncio.create_task(
                _try_model(client, model, headers, messages, max_tokens, temperature)
            )
            for model in FREE_MODELS
        ]

        # As each task completes, check if it succeeded
        for coro in asyncio.as_completed(tasks):
            result = await coro
            if result is not None:
                # Cancel all remaining tasks to save resources
                for task in tasks:
                    task.cancel()
                return result

    raise RuntimeError("All models failed. Please try again shortly.")
