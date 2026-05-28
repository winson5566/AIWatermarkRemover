import { useTranslation } from "react-i18next";
import { useAppState } from "../context/AppContext";

export default function ComparisonView() {
  const { t } = useTranslation();
  const { previewUrl, resultUrl } = useAppState();

  return (
    <div className="rounded-card border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:gap-8 sm:p-6">
        {/* Before */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("result.before")}
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Original"
                className="h-64 w-full object-contain sm:h-80"
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400 sm:h-80">
                No preview available
              </div>
            )}
          </div>
        </div>

        {/* After */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              {t("result.after")}
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-brand-200 bg-slate-100">
            {resultUrl ? (
              <img
                src={resultUrl}
                alt="Processed result"
                className="h-64 w-full object-contain sm:h-80"
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400 sm:h-80">
                Result not available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
