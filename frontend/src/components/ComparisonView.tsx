import { useTranslation } from "react-i18next";
import { useAppState } from "../context/AppContext";

export default function ComparisonView() {
  const { t } = useTranslation();
  const { previewUrl, resultUrl } = useAppState();

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:gap-8 sm:p-6">
        <div>
          <p className="label mb-3">{t("result.before")}</p>
          <div className="overflow-hidden rounded-md border border-line bg-surface-2">
            {previewUrl ? (
              <img src={previewUrl} alt="Original" className="max-h-[60vh] w-full object-contain" />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-ink-dim">—</div>
            )}
          </div>
        </div>
        <div>
          <p className="label mb-3 !text-accent">{t("result.after")}</p>
          <div className="overflow-hidden rounded-md border border-accent/40 bg-surface-2">
            {resultUrl ? (
              <img src={resultUrl} alt="Result" className="max-h-[60vh] w-full object-contain" />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-ink-dim">—</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
