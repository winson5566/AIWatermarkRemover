export type ProcessingMode = "quick" | "full";

export type AppPhase =
  | "idle"
  | "uploaded"
  | "detecting"
  | "detected"
  | "processing"
  | "completed"
  | "error";

export interface UploadResponse {
  file_id: string;
  filename: string;
  size_bytes: number;
  mime_type: string;
}

export interface DetectionResult {
  file_id: string;
  has_visible_watermark: boolean;
  confidence: number;
  has_metadata: boolean;
  watermark_type: string | null;
  metadata_details: string[];
}

export interface ProcessResponse {
  task_id: string;
  status: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: string;
  progress: number;
  error: string | null;
  result_file_id: string | null;
}

export interface AppState {
  phase: AppPhase;
  fileId: string | null;
  filename: string | null;
  previewUrl: string | null;
  detection: DetectionResult | null;
  taskId: string | null;
  mode: ProcessingMode | null;
  progress: number;
  resultUrl: string | null;
  error: string | null;
}

export type AppAction =
  | { type: "SET_UPLOADED"; payload: { fileId: string; filename: string; previewUrl: string } }
  | { type: "SET_DETECTING" }
  | { type: "SET_DETECTED"; payload: DetectionResult }
  | { type: "SET_PROCESSING"; payload: { taskId: string; mode: ProcessingMode } }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_COMPLETED"; payload: { resultFileId: string } }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" };
