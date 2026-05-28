import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../context/AppContext";
import Spinner from "./Spinner";

export default function DetectionResult() {
  const { t } = useTranslation();
  const { detection, phase } = useAppState();
  const [showDetails, setShowDetails] = useState(false);
  const isLoading = phase === "detecting";

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] glass">
      <div className="border-b border-white/[0.04] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          <h3 className="text-base font-semibold text-slate-100">{t("detection.title")}</h3>
        </div>
      </div>

      <div className="px-5 py-4">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Spinner size="md" />
            <p className="text-sm text-slate-400">{t("detection.scanning")}</p>
          </div>
        )}

        {!isLoading && detection && !detection.has_visible_watermark && !detection.has_metadata && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-emerald-400">{t("detection.none")}</p>
              <p className="mt-1 text-sm text-slate-400">{t("detection.clean")}</p>
            </div>
          </div>
        )}

        {!isLoading && detection && (detection.has_visible_watermark || detection.has_metadata) && (
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
                </svg>
              </div>
              <p className="font-medium text-slate-200">{t("detection.found")}</p>
            </div>

            <div className="space-y-2">
              {detection.has_visible_watermark && (
                <div className="flex items-center justify-between rounded-lg bg-amber-500/5 border border-amber-500/10 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400">{t("detection.visible")}</span>
                    <span className="text-sm text-slate-300">{detection.watermark_type || "—"}</span>
                  </div>
                  <span className="text-xs text-slate-500">{t("detection.confidence")}: {(detection.confidence * 100).toFixed(0)}%</span>
                </div>
              )}
              {detection.has_metadata && (
                <div className="flex items-center justify-between rounded-lg bg-blue-500/5 border border-blue-500/10 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-400">{t("detection.metadata")}</span>
                    <span className="text-sm text-slate-300">
                      {detection.metadata_details?.slice(0, 3).join(", ")}
                      {(detection.metadata_details?.length || 0) > 3 && " ..."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {detection.metadata_details && detection.metadata_details.length > 3 && (
              <div className="mt-3">
                <button onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-1.5 text-xs font-medium text-brand-400 transition-colors hover:text-brand-300">
                  {t("detection.details")}
                  <svg className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {showDetails && (
                  <ul className="mt-2 space-y-1 rounded-lg bg-surface-100 px-4 py-3">
                    {detection.metadata_details.map((d, i) => (
                      <li key={i} className="text-xs text-slate-400">{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {!isLoading && !detection && (
          <p className="py-4 text-center text-sm text-slate-500">—</p>
        )}
      </div>
    </div>
  );
}
