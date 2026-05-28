import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ProcessingMode } from "../types";
import { useAppDispatch, useAppState } from "../context/AppContext";
import { useProcessing } from "../hooks/useProcessing";

export default function ModeSelector() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { fileId } = useAppState();
  const { startProcessing, isProcessing } = useProcessing(dispatch);
  const [selectedMode] = useState<ProcessingMode>("quick");

  const handleProcess = () => {
    if (!fileId) return;
    startProcessing(fileId, selectedMode);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] glass">
      <div className="border-b border-white/[0.04] px-5 py-4">
        <h3 className="text-base font-semibold text-slate-100">{t("mode.title")}</h3>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {/* Quick Clean */}
        <button
          onClick={() => {}}
          className="relative flex flex-col rounded-xl border-2 border-brand-500/40 bg-brand-500/5 p-5 text-left transition-all hover:border-brand-400/60"
        >
          <span className="mb-3 inline-flex items-center gap-1 self-start rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            {t("mode.free")}
          </span>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
            </svg>
          </div>
          <h4 className="font-semibold text-slate-200">{t("mode.quick")}</h4>
          <p className="mt-1.5 text-sm text-slate-400">{t("mode.quickDesc")}</p>
          <p className="mt-3 text-xs font-medium text-slate-500">{t("mode.quickTime")}</p>
        </button>

        {/* All-in-One */}
        <div className="group relative">
          <button
            disabled
            className="relative flex w-full flex-col rounded-xl border-2 border-white/[0.04] bg-surface-100/50 p-5 text-left opacity-50"
          >
            <span className="mb-3 inline-flex items-center gap-1 self-start rounded-full bg-purple-500/15 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
              {t("mode.gpu")}
            </span>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-200 text-slate-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-500">{t("mode.full")}</h4>
            <p className="mt-1.5 text-sm text-slate-600">{t("mode.fullDesc")}</p>
            <span className="mt-3 inline-flex items-center self-start rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500">
              {t("mode.fullComingSoon")}
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-white/[0.04] px-5 py-4">
        <button
          onClick={handleProcess}
          disabled={isProcessing || !fileId}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-500 hover:shadow-brand-500/30 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isProcessing ? (
            <><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>{t("processing.title")}</>
          ) : (
            t("mode.process")
          )}
        </button>
      </div>
    </div>
  );
}
