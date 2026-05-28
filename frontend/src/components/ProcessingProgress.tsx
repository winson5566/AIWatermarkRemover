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
    <div className="overflow-hidden rounded-xl border border-white/[0.06] glass">
      <div className="border-b border-white/[0.04] px-5 py-4">
        <h3 className="text-base font-semibold text-slate-100">{t("processing.title")}</h3>
      </div>
      <div className="space-y-5 px-5 py-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            {!isIndeterminate && <span className="text-sm font-medium text-slate-400">{progress}%</span>}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-200">
            {isIndeterminate ? (
              <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
            ) : (
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <p className="text-sm text-slate-400">{statusText}</p>
        </div>
        <div className="pt-2">
          <button
            onClick={cancelProcessing}
            className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-200"
          >
            {t("processing.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Spinner({ size = "sm" }: { size?: "sm" }) {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-10" cx="12" cy="12" r="10" stroke="#818cf8" strokeWidth="3" />
      <path className="opacity-80" fill="url(#spg)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      <defs>
        <linearGradient id="spg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#818cf8" /><stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
