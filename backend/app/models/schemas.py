from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    file_id: str
    filename: str
    size_bytes: int
    mime_type: str


class DetectionResponse(BaseModel):
    file_id: str
    has_visible_watermark: bool
    confidence: float = Field(ge=0.0, le=1.0)
    has_metadata: bool
    watermark_type: Optional[str] = None
    metadata_details: list[str] = Field(default_factory=list)


class ProcessRequest(BaseModel):
    mode: Literal["quick", "full"]


class ProcessResponse(BaseModel):
    task_id: str
    status: str


class TaskStatusResponse(BaseModel):
    task_id: str
    status: Literal["queued", "running", "completed", "failed"]
    progress: int = Field(default=0, ge=0, le=100)
    error: Optional[str] = None
    result_file_id: Optional[str] = None


class HealthResponse(BaseModel):
    status: str


class ErrorResponse(BaseModel):
    detail: str
    status: int = 500
