import { useAppDispatch, useAppState } from "../context/AppContext";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilePreview() {
  const dispatch = useAppDispatch();
  const { filename, previewUrl } = useAppState();

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    dispatch({ type: "RESET" });
  };

  if (!previewUrl || !filename) {
    return null;
  }

  // Estimate size from the preview URL is unreliable, so we use a placeholder
  return (
    <div className="overflow-hidden rounded-card border-l-4 border-l-brand-500 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-4 sm:p-5">
        {/* Thumbnail */}
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-24 sm:w-24">
          <img
            src={previewUrl}
            alt={filename}
            className="h-full w-full object-cover"
          />
        </div>

        {/* File Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900" title={filename}>
            {filename}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {/* We'll show a placeholder for size since we don't track it in state;
                a real implementation would read the blob size before upload */}
            Image ready
          </p>
        </div>

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Remove file"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
