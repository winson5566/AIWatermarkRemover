import { useEffect, useRef } from "react";
import type { Dispatch } from "react";
import type { AppAction } from "../types";
import { detectWatermarks } from "../api/client";

export function useDetection(fileId: string | null, dispatch: Dispatch<AppAction>): void {
  const hasRunRef = useRef<string | null>(null);

  useEffect(() => {
    if (!fileId || fileId === hasRunRef.current) {
      return;
    }

    hasRunRef.current = fileId;
    const currentFileId: string = fileId;

    let cancelled = false;

    async function runDetection() {
      dispatch({ type: "SET_DETECTING" });

      try {
        const result = await detectWatermarks(currentFileId);

        if (!cancelled) {
          dispatch({ type: "SET_DETECTED", payload: result });
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Detection failed. Please try again.";
          dispatch({ type: "SET_ERROR", payload: message });
        }
      }
    }

    runDetection();

    return () => {
      cancelled = true;
    };
  }, [fileId, dispatch]);
}
