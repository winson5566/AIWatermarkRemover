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
  const [selectedMode, setSelectedMode] = useState<ProcessingMode>("quick");

  const handleProcess = () => {
    if (!fileId) return;
    startProcessing(fileId, selectedMode);
  };

  const isQuick = selectedMode === "quick";

  return (
    <div className="rounded-card border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-900">{t("mode.title")}</h3>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {/* Quick Clean */}
        <button
          onClick={() => setSelectedMode("quick")}
          className={`relative flex flex-col rounded-xl border-2 p-5 text-left transition-all ${
            isQuick
              ? "border-brand-500 bg-brand-50/50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          {/* Badge */}
          <span className="mb-3 inline-flex items-center gap-1 self-start rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            {t("mode.free")}
          </span>

          {/* Icon */}
          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${isQuick ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-500"}`}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
            </svg>
          </div>

          {/* Content */}
          <h4 className="font-semibold text-slate-900">{t("mode.quick")}</h4>
          <p className="mt-1.5 text-sm text-slate-500">{t("mode.quickDesc")}</p>
          <p className="mt-3 text-xs font-medium text-slate-400">{t("mode.quickTime")}</p>
        </button>

        {/* All-in-One */}
        <div className="group relative">
          <button
            disabled
            onClick={() => setSelectedMode("all-in-one" as ProcessingMode)}
            className={`relative flex w-full flex-col rounded-xl border-2 p-5 text-left opacity-60 ${
              !isQuick
                ? "border-slate-200 bg-slate-50"
                : "border-slate-200 bg-white"
            }`}
          >
            {/* Badge */}
            <span className="mb-3 inline-flex items-center gap-1 self-start rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
              {t("mode.gpu")}
            </span>

            {/* Icon */}
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            </div>

            {/* Content */}
            <h4 className="font-semibold text-slate-500">{t("mode.full")}</h4>
            <p className="mt-1.5 text-sm text-slate-400">{t("mode.fullDesc")}</p>

            {/* Coming Soon badge */}
            <span className="mt-3 inline-flex items-center self-start rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {t("mode.fullComingSoon")}
            </span>
          </button>

          {/* Tooltip */}
          <div className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            GPU infrastructure is being provisioned
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
          </div>
        </div>
      </div>

      {/* Process button */}
      <div className="border-t border-slate-100 px-5 py-4">
        <button
          onClick={handleProcess}
          disabled={isProcessing || !fileId}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isProcessing ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("processing.title")}
            </>
          ) : (
            t("mode.process")
          )}
        </button>
      </div>
    </div>
  );
}
