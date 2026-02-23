"""
Rate limiter for the Portfolio API.

Uses an in-memory sliding window approach — zero external dependencies.
Tracks requests per IP address with automatic expired-entry cleanup.

Limits:
  - /api/chat:    10 requests per 60 seconds per IP
  - /api/chat/history: 30 requests per 60 seconds per IP
  - Global:       100 requests per 60 seconds per IP (across all endpoints)
"""

import time
import threading
from collections import defaultdict
from fastapi import Request, HTTPException


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RATE_LIMITS = {
    # endpoint_key: (max_requests, window_seconds)
    "chat": (10, 60),         # 10 chat messages per minute
    "history": (30, 60),      # 30 history fetches per minute
    "global": (100, 60),      # 100 total requests per minute across all endpoints
}

# How often to run the cleanup of expired entries (seconds)
CLEANUP_INTERVAL = 120


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Sliding Window Rate Limiter
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class SlidingWindowRateLimiter:
    """
    Thread-safe, in-memory sliding window rate limiter.
    
    Stores timestamps of recent requests per (IP, endpoint) pair.
    Automatically cleans up expired entries to prevent memory leaks.
    """

    def __init__(self):
        # { "ip:endpoint": [timestamp1, timestamp2, ...] }
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._lock = threading.Lock()
        self._last_cleanup = time.time()

    def _cleanup_expired(self):
        """Remove expired timestamps to prevent memory growth."""
        now = time.time()
        if now - self._last_cleanup < CLEANUP_INTERVAL:
            return

        with self._lock:
            keys_to_delete = []
            for key, timestamps in self._requests.items():
                # Keep only timestamps within the largest window (60s)
                self._requests[key] = [
                    ts for ts in timestamps if now - ts < 120
                ]
                if not self._requests[key]:
                    keys_to_delete.append(key)

            for key in keys_to_delete:
                del self._requests[key]

            self._last_cleanup = now

    def is_allowed(self, ip: str, endpoint: str) -> dict:
        """
        Check if a request is allowed under the rate limit.
        
        Returns:
            {
                "allowed": bool,
                "limit": int,
                "remaining": int,
                "retry_after": float (seconds until next allowed request, 0 if allowed)
            }
        """
        self._cleanup_expired()

        if endpoint not in RATE_LIMITS:
            return {"allowed": True, "limit": 0, "remaining": 0, "retry_after": 0}

        max_requests, window_seconds = RATE_LIMITS[endpoint]
        key = f"{ip}:{endpoint}"
        now = time.time()

        with self._lock:
            # Remove expired timestamps for this key
            self._requests[key] = [
                ts for ts in self._requests[key]
                if now - ts < window_seconds
            ]

            current_count = len(self._requests[key])

            if current_count >= max_requests:
                # Calculate when the oldest request in the window expires
                oldest = min(self._requests[key])
                retry_after = round(window_seconds - (now - oldest), 1)
                return {
                    "allowed": False,
                    "limit": max_requests,
                    "remaining": 0,
                    "retry_after": max(retry_after, 0.1),
                }

            # Allowed — record this request
            self._requests[key].append(now)
            return {
                "allowed": True,
                "limit": max_requests,
                "remaining": max_requests - current_count - 1,
                "retry_after": 0,
            }

    def get_stats(self) -> dict:
        """Return current rate limiter stats (for health check)."""
        with self._lock:
            return {
                "tracked_keys": len(self._requests),
                "total_timestamps": sum(
                    len(ts) for ts in self._requests.values()
                ),
            }


# Singleton instance
rate_limiter = SlidingWindowRateLimiter()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Helper to extract client IP
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def get_client_ip(request: Request) -> str:
    """
    Extract the real client IP, accounting for proxies/load balancers.
    Checks common proxy headers before falling back to the direct connection IP.
    """
    # Vercel / Cloudflare / common proxy headers
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        # x-forwarded-for can be "client, proxy1, proxy2" — take the first
        return forwarded_for.split(",")[0].strip()

    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()

    cf_ip = request.headers.get("cf-connecting-ip")
    if cf_ip:
        return cf_ip.strip()

    # Fallback to direct connection
    if request.client:
        return request.client.host

    return "unknown"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FastAPI dependency — plug into any endpoint
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def check_rate_limit(endpoint: str):
    """
    Returns a FastAPI dependency that enforces rate limiting for the given endpoint.
    
    Usage:
        @app.post("/api/chat", dependencies=[Depends(check_rate_limit("chat"))])
    """
    def _dependency(request: Request):
        client_ip = get_client_ip(request)

        # Check endpoint-specific limit
        result = rate_limiter.is_allowed(client_ip, endpoint)
        if not result["allowed"]:
            print(f"[RATE LIMIT] {client_ip} hit {endpoint} limit — retry in {result['retry_after']}s")
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Too many requests. Please slow down.",
                    "retry_after": result["retry_after"],
                    "limit": result["limit"],
                },
                headers={"Retry-After": str(int(result["retry_after"]))},
            )

        # Check global limit
        global_result = rate_limiter.is_allowed(client_ip, "global")
        if not global_result["allowed"]:
            print(f"[RATE LIMIT] {client_ip} hit global limit — retry in {global_result['retry_after']}s")
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Too many requests. Please slow down.",
                    "retry_after": global_result["retry_after"],
                    "limit": global_result["limit"],
                },
                headers={"Retry-After": str(int(global_result["retry_after"]))},
            )

    return _dependency
