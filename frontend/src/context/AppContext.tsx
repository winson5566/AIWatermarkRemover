import React, { createContext, useContext, useReducer, type Dispatch } from "react";
import type { AppState, AppAction } from "../types";

const initialState: AppState = {
  phase: "idle",
  fileId: null,
  filename: null,
  previewUrl: null,
  detection: null,
  taskId: null,
  mode: null,
  progress: 0,
  resultUrl: null,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_UPLOADED":
      return {
        ...state,
        phase: "uploaded",
        fileId: action.payload.fileId,
        filename: action.payload.filename,
        previewUrl: action.payload.previewUrl,
        detection: null,
        taskId: null,
        resultUrl: null,
        error: null,
      };

    case "SET_DETECTING":
      return {
        ...state,
        phase: "detecting",
        detection: null,
        error: null,
      };

    case "SET_DETECTED":
      return {
        ...state,
        phase: "detected",
        detection: action.payload,
      };

    case "SET_PROCESSING":
      return {
        ...state,
        phase: "processing",
        taskId: action.payload.taskId,
        mode: action.payload.mode,
        progress: 0,
        resultUrl: null,
        error: null,
      };

    case "SET_PROGRESS":
      return {
        ...state,
        progress: action.payload,
      };

    case "SET_COMPLETED":
      return {
        ...state,
        phase: "completed",
        resultUrl: `/api/download/${action.payload.resultFileId}`,
        progress: 100,
      };

    case "SET_ERROR":
      return {
        ...state,
        phase: "error",
        error: action.payload,
      };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

const StateContext = createContext<AppState>(initialState);
const DispatchContext = createContext<Dispatch<AppAction>>(() => {});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppState {
  return useContext(StateContext);
}

export function useAppDispatch(): Dispatch<AppAction> {
  return useContext(DispatchContext);
}
