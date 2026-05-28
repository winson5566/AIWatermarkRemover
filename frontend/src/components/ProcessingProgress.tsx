import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppState } from "../context/AppContext";
import { useProcessing } from "../hooks/useProcessing";

function getStepText(progress: number, t: (key: string) => string): string {
  if (progress <= 10) return t("progress.step1");
  if (progress <= 40) return t("progress.step2");
  if (progress <= 80) return t("progress.step3");
  return t("progress.step4");
}

export default function ProcessingProgress() {
  const { t } = useTranslation();
  const { progress } = useAppState();
  const dispatch = useAppDispatch();
  const { cancelProcessing } = useProcessing(dispatch);

  const stepText = getStepText(progress, t);
  const isIndeterminate = progress <= 0;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] glass">
      <div className="border-b border-white/[0.04] px-5 py-4">
        <h3 className="text-base font-semibold text-slate-100">{t("progress.title")}</h3>
      </div>
      <div className="space-y-5 px-5 py-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-400">
            {!isIndeterminate && <span>{progress}%</span>}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-200">
            {isIndeterminate ? (
              <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
            ) : (
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-10" cx="12" cy="12" r="10" stroke="#818cf8" strokeWidth="3" />
            <path className="opacity-80" fill="url(#pp-spg)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            <defs>
              <linearGradient id="pp-spg" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#818cf8" /><stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <p className="text-sm text-slate-400">{stepText}</p>
        </div>
        <div className="pt-2">
          <button
            onClick={cancelProcessing}
            className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-200"
          >
            {t("actions.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
