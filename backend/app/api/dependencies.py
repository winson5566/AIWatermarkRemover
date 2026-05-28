from __future__ import annotations

from typing import Optional

from app.config import settings
from app.services.file_service import FileService
from app.services.task_queue import TaskQueue
from app.services.watermark_service import WatermarkService

# Module-level singletons; initialised in the lifespan handler.
_file_service: Optional[FileService] = None
_watermark_service: Optional[WatermarkService] = None
_task_queue: Optional[TaskQueue] = None


def init_services() -> None:
    global _file_service, _watermark_service, _task_queue
    _file_service = FileService(
        storage_dir=settings.STORAGE_DIR,
        max_size_mb=settings.MAX_FILE_SIZE_MB,
        cleanup_ttl_minutes=settings.CLEANUP_TTL_MINUTES,
    )
    _watermark_service = WatermarkService()
    _task_queue = TaskQueue()


def get_file_service() -> FileService:
    assert _file_service is not None, "FileService not initialised"
    return _file_service


def get_watermark_service() -> WatermarkService:
    assert _watermark_service is not None, "WatermarkService not initialised"
    return _watermark_service


def get_task_queue() -> TaskQueue:
    assert _task_queue is not None, "TaskQueue not initialised"
    return _task_queue
