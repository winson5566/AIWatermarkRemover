import { useTranslation } from "react-i18next";

interface CardProps {
  src: string;
  zoom: string;
  label: string;
  accent?: boolean;
  alt: string;
}

function Card({ src, zoom, label, accent = false, alt }: CardProps) {
  const { t } = useTranslation();
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="relative">
        <img src={src} alt={alt} draggable={false} className="block w-full" />
        <span
          className={`label pointer-events-none absolute left-3 top-3 rounded bg-surface/85 px-1.5 py-0.5 backdrop-blur-sm ${accent ? "!text-accent" : ""}`}
        >
          {label}
        </span>
      </div>

      {/* Magnified bottom-right corner where the watermark lives */}
      <div className="border-t border-line bg-surface-2 px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="label">{t("showcase.detail")}</span>
          {accent ? (
            <span className="label inline-flex items-center gap-1 !text-accent">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {t("showcase.removed")}
            </span>
          ) : (
            <span className="label inline-flex items-center gap-1.5 !text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {t("showcase.watermark")}
            </span>
          )}
        </div>
        <div className="overflow-hidden rounded border border-line">
          <img src={zoom} alt="" aria-hidden draggable={false} className="block w-full" />
        </div>
      </div>
    </figure>
  );
}

interface WatermarkCompareProps {
  original: string;
  cleaned: string;
  zoomOriginal: string;
  zoomCleaned: string;
  alt?: string;
}

export default function WatermarkCompare({ original, cleaned, zoomOriginal, zoomCleaned, alt = "" }: WatermarkCompareProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card src={original} zoom={zoomOriginal} label={t("showcase.original")} alt={alt ? `${alt} — ${t("showcase.original")}` : ""} />
      <Card src={cleaned} zoom={zoomCleaned} accent label={t("showcase.cleaned")} alt={alt ? `${alt} — ${t("showcase.cleaned")}` : ""} />
    </div>
  );
}
