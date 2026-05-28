import { useTranslation } from "react-i18next";
import type { ProcessingMode } from "../types";
import { useAppDispatch, useAppState } from "../context/AppContext";
import { useProcessing } from "../hooks/useProcessing";

export default function ModeSelector() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { fileId } = useAppState();
  const { startProcessing, isProcessing } = useProcessing(dispatch);

  const handleProcess = () => {
    if (!fileId) return;
    startProcessing(fileId, "quick");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] glass">
      <div className="border-b border-white/[0.04] px-5 py-4">
        <h3 className="text-base font-semibold text-slate-100">{t("mode.title")}</h3>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {/* Standard Clean */}
        <div className="relative flex flex-col rounded-xl border-2 border-brand-500/40 bg-brand-500/5 p-5">
          <span className="mb-3 inline-flex items-center gap-1 self-start rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            {t("mode.free")}
          </span>
          <h4 className="font-semibold text-slate-200">{t("mode.standard")}</h4>
          <p className="mt-1.5 text-sm text-slate-400">{t("mode.standardDesc")}</p>
        </div>

        {/* Deep Clean */}
        <div className="relative flex flex-col rounded-xl border-2 border-white/[0.04] bg-surface-100/50 p-5 opacity-50">
          <span className="mb-3 inline-flex items-center gap-1 self-start rounded-full bg-purple-500/15 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
            {t("mode.gpu")}
          </span>
          <h4 className="font-semibold text-slate-500">{t("mode.deep")}</h4>
          <p className="mt-1.5 text-sm text-slate-600">{t("mode.deepDesc")}</p>
          <span className="mt-3 inline-flex items-center self-start rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500">
            {t("mode.deepBadge")}
          </span>
        </div>
      </div>

      <div className="border-t border-white/[0.04] px-5 py-4">
        <button
          onClick={handleProcess}
          disabled={isProcessing || !fileId}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/20 transition-all hover:from-brand-500 hover:to-brand-400 hover:shadow-brand-500/30 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {t("mode.process")}
        </button>
      </div>
    </div>
  );
}
