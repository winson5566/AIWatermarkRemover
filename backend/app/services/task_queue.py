from __future__ import annotations

import logging
import threading
import time
import uuid
from typing import Any, Dict, Literal, Optional

logger = logging.getLogger(__name__)

TaskStatus = Literal["queued", "running", "completed", "failed"]
TASK_TTL_SECONDS = 30 * 60  # 30 minutes


class TaskQueue:
    """Simple thread-safe in-memory task tracker with auto-expiry."""

    def __init__(self):
        self._tasks: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()

    def create_task(self) -> str:
        task_id = uuid.uuid4().hex
        now = time.time()
        with self._lock:
            self._tasks[task_id] = {
                "task_id": task_id,
                "status": "queued",
                "progress": 0,
                "error": None,
                "result_file_id": None,
                "created_at": now,
                "updated_at": now,
            }
        logger.debug("Task %s created", task_id)
        return task_id

    def update_task(self, task_id: str, **kwargs: Any) -> None:
        with self._lock:
            task = self._tasks.get(task_id)
            if task is None:
                logger.warning("Attempt to update unknown task %s", task_id)
                return
            task.update(kwargs)
            task["updated_at"] = time.time()
            # Ensure task_id is consistent
            task["task_id"] = task_id
        logger.debug("Task %s updated: %s", task_id, {k: v for k, v in kwargs.items() if k != "updated_at"})

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            task = self._tasks.get(task_id)
            if task is None:
                return None
            # Check expiry
            if time.time() - task["updated_at"] > TASK_TTL_SECONDS:
                del self._tasks[task_id]
                logger.debug("Task %s expired and removed", task_id)
                return None
            return dict(task)  # Return a copy for safety

    def _cleanup_expired(self) -> int:
        """Internal: remove all expired tasks. Returns count removed."""
        now = time.time()
        removed = 0
        with self._lock:
            expired = [
                tid
                for tid, t in self._tasks.items()
                if now - t["updated_at"] > TASK_TTL_SECONDS
            ]
            for tid in expired:
                del self._tasks[tid]
                removed += 1
        if removed:
            logger.debug("Task cleanup removed %d expired tasks", removed)
        return removed
