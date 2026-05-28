import { useTranslation } from "react-i18next";
import { useAppState } from "../context/AppContext";

export default function ComparisonView() {
  const { t } = useTranslation();
  const { previewUrl, resultUrl } = useAppState();

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] glass">
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:gap-8 sm:p-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-surface-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t("result.before")}
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-surface-100">
            {previewUrl ? (
              <img src={previewUrl} alt="Original" className="h-64 w-full object-contain sm:h-80" />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-slate-500 sm:h-80">No preview</div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
              {t("result.after")}
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-brand-500/20 bg-surface-100">
            {resultUrl ? (
              <img src={resultUrl} alt="Result" className="h-64 w-full object-contain sm:h-80" />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-slate-500 sm:h-80">Not available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
