import { useState, useCallback } from "react";
import type { Dispatch } from "react";
import type { AppAction } from "../types";
import { uploadImage } from "../api/client";

interface UseUploadReturn {
  uploadFile: (file: File) => Promise<void>;
  uploading: boolean;
  error: string | null;
}

export function useUpload(dispatch: Dispatch<AppAction>): UseUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      // Create local preview URL
      const previewUrl = URL.createObjectURL(file);

      try {
        const response = await uploadImage(file);

        dispatch({
          type: "SET_UPLOADED",
          payload: {
            fileId: response.file_id,
            filename: response.filename,
            previewUrl,
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload image. Please try again.";
        setError(message);
        dispatch({ type: "SET_ERROR", payload: message });
      } finally {
        setUploading(false);
      }
    },
    [dispatch]
  );

  return { uploadFile, uploading, error };
}
