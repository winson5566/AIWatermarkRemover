from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from app.api.dependencies import (
    get_file_service,
    get_task_queue,
    get_watermark_service,
)
from app.models.schemas import (
    DetectionResponse,
    ErrorResponse,
    ProcessRequest,
    ProcessResponse,
    TaskStatusResponse,
    UploadResponse,
)
from app.services.file_service import FileService
from app.services.task_queue import TaskQueue
from app.services.watermark_service import WatermarkService

logger = logging.getLogger(__name__)

router = APIRouter()


# ---------------------------------------------------------------------------
# POST /api/upload
# ---------------------------------------------------------------------------
@router.post(
    "/upload",
    response_model=UploadResponse,
    responses={
        413: {"model": ErrorResponse, "description": "File too large"},
        400: {"model": ErrorResponse, "description": "Invalid file"},
    },
)
async def upload(
    file: UploadFile = File(...),
    file_service: FileService = Depends(get_file_service),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    try:
        contents = await file.read()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to read uploaded file: {exc}")

    try:
        ext = file_service.validate_image(contents, file.filename)
    except OverflowError as exc:
        raise HTTPException(status_code=413, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    file_id = file_service.save_upload(contents, file.filename)
    path = file_service.get_path(file_id)
    size_bytes = file_service.get_file_size(path) if path else len(contents)

    mime_type = "image/png"
    if ext in (".jpg", ".jpeg"):
        mime_type = "image/jpeg"
    elif ext == ".webp":
        mime_type = "image/webp"

    logger.info("Uploaded file_id=%s filename=%s size=%d", file_id, file.filename, size_bytes)
    return UploadResponse(
        file_id=file_id,
        filename=file.filename,
        size_bytes=size_bytes,
        mime_type=mime_type,
    )


# ---------------------------------------------------------------------------
# POST /api/detect/{file_id}
# ---------------------------------------------------------------------------
@router.post(
    "/detect/{file_id}",
    response_model=DetectionResponse,
    responses={404: {"model": ErrorResponse, "description": "File not found"}},
)
async def detect(
    file_id: str,
    file_service: FileService = Depends(get_file_service),
    watermark_service: WatermarkService = Depends(get_watermark_service),
):
    path = file_service.get_path(file_id)
    if path is None:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        result = watermark_service.detect(path)
    except Exception as exc:
        logger.exception("Detection failed for %s", file_id)
        raise HTTPException(status_code=500, detail=f"Detection failed: {exc}")

    return DetectionResponse(
        file_id=file_id,
        has_visible_watermark=result["has_visible_watermark"],
        confidence=result["confidence"],
        has_metadata=result["has_metadata"],
        watermark_type=result.get("watermark_type"),
        metadata_details=result.get("metadata_details", []),
    )


# ---------------------------------------------------------------------------
# POST /api/process/{file_id}
# ---------------------------------------------------------------------------
@router.post(
    "/process/{file_id}",
    response_model=ProcessResponse,
    responses={
        404: {"model": ErrorResponse, "description": "File not found"},
        501: {"model": ErrorResponse, "description": "GPU processing not available"},
    },
)
async def process(
    file_id: str,
    body: ProcessRequest,
    file_service: FileService = Depends(get_file_service),
    watermark_service: WatermarkService = Depends(get_watermark_service),
    task_queue: TaskQueue = Depends(get_task_queue),
):
    if body.mode == "full":
        raise HTTPException(
            status_code=501,
            detail="GPU processing is not yet available. Please use Quick Clean mode.",
        )

    path = file_service.get_path(file_id)
    if path is None:
        raise HTTPException(status_code=404, detail="File not found")

    task_id = task_queue.create_task()

    # Launch background processing
    asyncio.create_task(
        _run_processing(task_id, file_id, path, file_service, watermark_service, task_queue)
    )

    return ProcessResponse(task_id=task_id, status="queued")


async def _run_processing(
    task_id: str,
    file_id: str,
    image_path: Path,
    file_service: FileService,
    watermark_service: WatermarkService,
    task_queue: TaskQueue,
) -> None:
    """Background coroutine that runs the quick processing pipeline."""
    try:
        task_queue.update_task(task_id, status="running", progress=10)

        output_path = file_service.ensure_dir(file_id) / "processed.png"
        task_queue.update_task(task_id, progress=30)

        # Run the pipeline in a thread to avoid blocking the event loop
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(
            None,
            watermark_service.process_quick,
            image_path,
            output_path,
        )
        task_queue.update_task(task_id, progress=90)

        if not output_path.is_file() or output_path.stat().st_size == 0:
            raise RuntimeError("Processing produced an empty or missing output file.")

        task_queue.update_task(
            task_id,
            status="completed",
            progress=100,
            result_file_id=file_id,
        )
        logger.info("Task %s completed for file %s", task_id, file_id)

    except Exception as exc:
        logger.exception("Task %s failed for file %s", task_id, file_id)
        task_queue.update_task(
            task_id,
            status="failed",
            error=str(exc),
        )


# ---------------------------------------------------------------------------
# GET /api/status/{task_id}
# ---------------------------------------------------------------------------
@router.get(
    "/status/{task_id}",
    response_model=TaskStatusResponse,
    responses={404: {"model": ErrorResponse, "description": "Task not found"}},
)
async def task_status(
    task_id: str,
    task_queue: TaskQueue = Depends(get_task_queue),
):
    task = task_queue.get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found or expired")

    return TaskStatusResponse(
        task_id=task["task_id"],
        status=task["status"],
        progress=task["progress"],
        error=task.get("error"),
        result_file_id=task.get("result_file_id"),
    )


# ---------------------------------------------------------------------------
# GET /api/download/{file_id}
# ---------------------------------------------------------------------------
@router.get(
    "/download/{file_id}",
    responses={404: {"model": ErrorResponse, "description": "File not found"}},
)
async def download(
    file_id: str,
    file_service: FileService = Depends(get_file_service),
):
    path = file_service.get_processed_path(file_id)
    if path is None:
        raise HTTPException(status_code=404, detail="Processed file not found")

    return FileResponse(
        path=str(path),
        media_type="image/png",
        filename="cleaned.png",
    )


# ---------------------------------------------------------------------------
# GET /api/health
# ---------------------------------------------------------------------------
@router.get("/health", response_model=dict)
async def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# DELETE /api/files/{file_id}
# ---------------------------------------------------------------------------
@router.delete("/files/{file_id}")
async def delete_file(
    file_id: str,
    file_service: FileService = Depends(get_file_service),
):
    deleted = file_service.delete(file_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="File not found")
    return {"deleted": True}
