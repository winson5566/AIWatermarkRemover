import { useAppDispatch, useAppState } from "../context/AppContext";

export default function FilePreview() {
  const dispatch = useAppDispatch();
  const { filename, previewUrl } = useAppState();

  if (!previewUrl || !filename) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 glass">
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-100 sm:h-24 sm:w-24">
          <img src={previewUrl} alt={filename} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800" title={filename}>{filename}</p>
          <p className="mt-0.5 text-xs text-slate-500">Image ready</p>
        </div>
        <button
          onClick={() => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            dispatch({ type: "RESET" });
          }}
          className="flex-shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
