from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.dependencies import init_services
from app.api.routes import router as api_router
from app.config import settings
from app.utils.logging import setup_logging

logger = logging.getLogger(__name__)

# Background cleanup task handle
_cleanup_task: asyncio.Task | None = None


async def _cleanup_loop(interval_seconds: int = 300) -> None:
    """Periodically clean up expired upload files."""
    from app.api.dependencies import get_file_service

    while True:
        try:
            await asyncio.sleep(interval_seconds)
            file_service = get_file_service()
            file_service.cleanup_expired()
        except asyncio.CancelledError:
            break
        except Exception:
            logger.exception("Cleanup loop error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    logger.info("Starting AI Watermark Remover v%s", app.version)

    init_services()

    # Ensure storage directory exists
    Path(settings.STORAGE_DIR).mkdir(parents=True, exist_ok=True)

    # Start background cleanup task
    global _cleanup_task
    _cleanup_task = asyncio.create_task(_cleanup_loop())
    logger.info("Background cleanup started")

    yield

    # Shutdown
    if _cleanup_task:
        _cleanup_task.cancel()
        try:
            await _cleanup_task
        except asyncio.CancelledError:
            pass
    logger.info("AI Watermark Remover shut down")


def _resolve_frontend_dir() -> str | None:
    """Find the frontend dist/static directory relative to this file."""
    base = Path(__file__).resolve().parent.parent.parent  # backend/
    candidates = [
        base / "frontend" / "dist",
        base / ".." / "frontend" / "dist",
    ]
    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved.is_dir():
            return str(resolved)
    return None


app = FastAPI(
    title="AI Watermark Remover",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(api_router, prefix="/api")

# Static file serving for the frontend SPA
frontend_dir = _resolve_frontend_dir()
if frontend_dir:
    logger.info("Serving frontend static files from %s", frontend_dir)
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
else:
    logger.info("No frontend dist directory found; API-only mode")
