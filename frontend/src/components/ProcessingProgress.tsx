import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppState } from "../context/AppContext";
import { useProcessing } from "../hooks/useProcessing";

function getStatusText(progress: number, t: (key: string) => string): string {
  if (progress <= 0) return t("processing.analyzing");
  if (progress <= 30) return t("processing.removing");
  if (progress <= 70) return t("processing.stripping");
  return t("processing.finalizing");
}

export default function ProcessingProgress() {
  const { t } = useTranslation();
  const { progress } = useAppState();
  const dispatch = useAppDispatch();
  const { cancelProcessing } = useProcessing(dispatch);

  const statusText = getStatusText(progress, t);
  const isIndeterminate = progress <= 0;

  return (
    <div className="rounded-card border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-900">{t("processing.title")}</h3>
      </div>

      <div className="space-y-5 px-5 py-6">
        {/* Progress bar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            {!isIndeterminate && (
              <span className="text-sm font-medium text-slate-600">{progress}%</span>
            )}
            {isIndeterminate && (
              <span className="text-sm font-medium text-slate-400">&nbsp;</span>
            )}
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            {isIndeterminate ? (
              <div className="h-full w-1/3 animate-indeterminate rounded-full bg-brand-500" />
            ) : (
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-slate-600">{statusText}</p>
        </div>

        {/* Cancel button */}
        <div className="pt-2">
          <button
            onClick={cancelProcessing}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            {t("processing.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
