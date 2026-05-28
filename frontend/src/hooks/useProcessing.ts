import { useState, useCallback, useRef } from "react";
import type { Dispatch } from "react";
import type { AppAction, ProcessingMode } from "../types";
import { startProcessing as apiStartProcessing, getTaskStatus } from "../api/client";

interface UseProcessingReturn {
  startProcessing: (fileId: string, mode: ProcessingMode) => Promise<void>;
  cancelProcessing: () => void;
  isProcessing: boolean;
}

export function useProcessing(dispatch: Dispatch<AppAction>): UseProcessingReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  const cancelProcessing = useCallback(() => {
    cancelledRef.current = true;
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setIsProcessing(false);
  }, []);

  const start = useCallback(
    async (fileId: string, mode: ProcessingMode) => {
      setIsProcessing(true);
      cancelledRef.current = false;

      try {
        const processResp = await apiStartProcessing(fileId, mode);

        if (cancelledRef.current) return;

        dispatch({
          type: "SET_PROCESSING",
          payload: { taskId: processResp.task_id, mode },
        });

        // Start polling
        pollRef.current = setInterval(async () => {
          if (cancelledRef.current) {
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
            return;
          }

          try {
            const status = await getTaskStatus(processResp.task_id);

            if (cancelledRef.current) return;

            switch (status.status) {
              case "processing":
              case "pending":
                dispatch({ type: "SET_PROGRESS", payload: status.progress ?? 0 });
                break;

              case "completed":
                if (pollRef.current) {
                  clearInterval(pollRef.current);
                  pollRef.current = null;
                }
                setIsProcessing(false);
                dispatch({
                  type: "SET_COMPLETED",
                  payload: { resultFileId: status.result_file_id ?? "" },
                });
                break;

              case "failed":
                if (pollRef.current) {
                  clearInterval(pollRef.current);
                  pollRef.current = null;
                }
                setIsProcessing(false);
                dispatch({
                  type: "SET_ERROR",
                  payload: status.error || "Processing failed. Please try again.",
                });
                break;

              default:
                break;
            }
          } catch (err) {
            if (!cancelledRef.current) {
              if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
              }
              setIsProcessing(false);
              const message =
                err instanceof Error ? err.message : "Processing failed. Please try again.";
              dispatch({ type: "SET_ERROR", payload: message });
            }
          }
        }, 1000);
      } catch (err) {
        setIsProcessing(false);
        const message =
          err instanceof Error ? err.message : "Failed to start processing. Please try again.";
        dispatch({ type: "SET_ERROR", payload: message });
      }
    },
    [dispatch]
  );

  return { startProcessing: start, cancelProcessing, isProcessing };
}
