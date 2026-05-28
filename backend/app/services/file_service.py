from __future__ import annotations

import logging
import os
import shutil
import time
import uuid
from pathlib import Path
from typing import Optional

from PIL import Image

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
MIME_MAP = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
}


class FileService:
    def __init__(self, storage_dir: str, max_size_mb: int, cleanup_ttl_minutes: int):
        self._storage_dir = Path(storage_dir).resolve()
        self._max_size_bytes = max_size_mb * 1024 * 1024
        self._cleanup_ttl_seconds = cleanup_ttl_minutes * 60
        self._storage_dir.mkdir(parents=True, exist_ok=True)
        logger.info(
            "FileService initialised: storage=%s max_size=%dMB cleanup_ttl=%dmin",
            self._storage_dir,
            max_size_mb,
            cleanup_ttl_minutes,
        )

    # ------------------------------------------------------------------
    # Validation
    # ------------------------------------------------------------------

    def validate_image(self, file_bytes: bytes, filename: str) -> str:
        """Validate the uploaded file is a supported image.

        Returns the normalised extension (lowercased, always with a leading dot).
        Raises ValueError for unsupported types or corrupted images.
        Raises OverflowError if the file exceeds the size limit.
        """
        # Check size
        if len(file_bytes) > self._max_size_bytes:
            raise OverflowError(
                f"File too large ({len(file_bytes)} bytes). "
                f"Maximum allowed is {self._max_size_bytes} bytes."
            )

        # Check extension
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file type '{ext}'. "
                f"Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )

        # Verify image integrity with Pillow
        try:
            from io import BytesIO

            img = Image.open(BytesIO(file_bytes))
            img.verify()
            # Re-open after verify() — Pillow requires this
            img = Image.open(BytesIO(file_bytes))
            img.load()
        except Exception as exc:
            raise ValueError(f"Invalid or corrupted image: {exc}") from exc

        return ext

    # ------------------------------------------------------------------
    # Save / path helpers
    # ------------------------------------------------------------------

    def save_upload(self, file_bytes: bytes, filename: str) -> str:
        """Save uploaded image to disk. Returns the file_id (UUID string)."""
        ext = Path(filename).suffix.lower()
        file_id = uuid.uuid4().hex
        dir_path = self._storage_dir / file_id
        dir_path.mkdir(parents=True, exist_ok=True)

        dest = dir_path / f"original{ext}"
        dest.write_bytes(file_bytes)
        logger.debug("Saved upload %s -> %s", file_id, dest)
        return file_id

    def get_path(self, file_id: str) -> Optional[Path]:
        """Return the path to the original file for a given file_id, or None."""
        dir_path = self._resolve_dir(file_id)
        if dir_path is None or not dir_path.is_dir():
            return None
        for ext in ALLOWED_EXTENSIONS:
            candidate = dir_path / f"original{ext}"
            if candidate.is_file():
                return candidate
        return None

    def get_processed_path(self, file_id: str) -> Optional[Path]:
        """Return the path to the processed file for a given file_id, or None."""
        dir_path = self._resolve_dir(file_id)
        if dir_path is None or not dir_path.is_dir():
            return None
        candidate = dir_path / "processed.png"
        return candidate if candidate.is_file() else None

    def ensure_dir(self, file_id: str) -> Path:
        """Get the directory path for a file_id, creating it if needed."""
        dir_path = self._storage_dir / file_id
        dir_path.mkdir(parents=True, exist_ok=True)
        return dir_path

    # ------------------------------------------------------------------
    # Cleanup
    # ------------------------------------------------------------------

    def delete(self, file_id: str) -> bool:
        """Delete all files for a given file_id. Returns True if something was deleted."""
        dir_path = self._storage_dir / file_id
        if dir_path.exists():
            shutil.rmtree(dir_path)
            logger.debug("Deleted %s", dir_path)
            return True
        return False

    def cleanup_expired(self) -> int:
        """Remove directories older than the TTL. Returns the number removed."""
        now = time.time()
        removed = 0
        for entry in self._storage_dir.iterdir():
            if entry.is_dir():
                try:
                    mtime = entry.stat().st_mtime
                except OSError:
                    continue
                if now - mtime > self._cleanup_ttl_seconds:
                    try:
                        shutil.rmtree(entry)
                        removed += 1
                        logger.debug("Cleanup removed %s", entry)
                    except OSError as exc:
                        logger.warning("Cleanup failed for %s: %s", entry, exc)
        if removed:
            logger.info("Cleanup removed %d expired upload(s)", removed)
        return removed

    # ------------------------------------------------------------------
    # Utilities
    # ------------------------------------------------------------------

    def get_file_size(self, path: Path) -> int:
        """Return file size in bytes, or 0 if the file doesn't exist."""
        try:
            return path.stat().st_size
        except OSError:
            return 0

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _resolve_dir(self, file_id: str) -> Optional[Path]:
        """Safely resolve the directory for a file_id, preventing path traversal."""
        # Only permit hex UUID-like identifiers
        if not file_id or any(c not in "0123456789abcdef" for c in file_id.lower()):
            return None
        dir_path = (self._storage_dir / file_id).resolve()
        if not str(dir_path).startswith(str(self._storage_dir)):
            return None
        return dir_path
