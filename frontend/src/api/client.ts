import type {
  UploadResponse,
  DetectionResult,
  ProcessResponse,
  TaskStatusResponse,
  ProcessingMode,
} from "../types";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.detail) {
        detail = body.detail;
      } else if (body.message) {
        detail = body.message;
      }
    } catch {
      // Could not parse JSON; use default detail
    }
    throw new Error(detail);
  }
  return response.json();
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  return handleResponse<UploadResponse>(response);
}

export async function detectWatermarks(fileId: string): Promise<DetectionResult> {
  const response = await fetch(`/api/detect/${fileId}`, {
    method: "POST",
  });

  return handleResponse<DetectionResult>(response);
}

export async function startProcessing(
  fileId: string,
  mode: ProcessingMode
): Promise<ProcessResponse> {
  const response = await fetch(`/api/process/${fileId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode }),
  });

  return handleResponse<ProcessResponse>(response);
}

export async function getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  const response = await fetch(`/api/status/${taskId}`, {
    method: "GET",
  });

  return handleResponse<TaskStatusResponse>(response);
}

export function getDownloadUrl(fileId: string): string {
  return `/api/download/${fileId}`;
}

export async function deleteFiles(fileId: string): Promise<void> {
  const response = await fetch(`/api/files/${fileId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let detail = `Delete failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.detail) {
        detail = body.detail;
      }
    } catch {
      // Could not parse JSON; use default detail
    }
    throw new Error(detail);
  }
}
