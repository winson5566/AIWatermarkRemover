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
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="border-b border-line bg-surface-2 px-5 py-3">
        <span className="label !text-ink-muted">{t("mode.title")}</span>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {/* Standard Clean */}
        <div className="relative flex flex-col rounded-md border border-accent bg-accent-soft p-5">
          <span className="label mb-3 self-start !text-accent">{t("mode.free")}</span>
          <h4 className="font-medium text-ink">{t("mode.standard")}</h4>
          <p className="mt-1.5 text-sm text-ink-muted">{t("mode.standardDesc")}</p>
        </div>

        {/* Deep Clean */}
        <div className="relative flex flex-col rounded-md border border-line bg-surface-2 p-5 opacity-60">
          <span className="label mb-3 self-start">{t("mode.gpu")}</span>
          <h4 className="font-medium text-ink-muted">{t("mode.deep")}</h4>
          <p className="mt-1.5 text-sm text-ink-dim">{t("mode.deepDesc")}</p>
          <span className="label mt-3 self-start !text-amber-600">{t("mode.deepBadge")}</span>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4">
        <button
          onClick={handleProcess}
          disabled={isProcessing || !fileId}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-medium text-[#06281e] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {t("mode.process")}
        </button>
      </div>
    </div>
  );
}
