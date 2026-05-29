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
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="border-b border-line bg-surface-2 px-5 py-3">
        <span className="label !text-ink-muted">{t("progress.title")}</span>
      </div>
      <div className="space-y-5 px-5 py-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-ink-muted">
            {!isIndeterminate && <span className="num">{progress}%</span>}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            {isIndeterminate ? (
              <div className="h-full w-2/5 animate-pulse rounded-full bg-accent" />
            ) : (
              <div
                className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#cdd0d4" strokeWidth="3" />
            <path className="opacity-90" fill="#059669" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-ink-muted">{stepText}</p>
        </div>
        <div className="pt-2">
          <button
            onClick={cancelProcessing}
            className="rounded-md border border-line-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
          >
            {t("actions.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
