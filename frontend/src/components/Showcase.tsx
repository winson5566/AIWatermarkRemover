import { useTranslation } from "react-i18next";
import WatermarkCompare from "./WatermarkCompare";

const EXAMPLES = [
  {
    original: "/showcase/street-original.webp",
    cleaned: "/showcase/street-cleaned.webp",
    zoomOriginal: "/showcase/street-original-zoom.webp",
    zoomCleaned: "/showcase/street-cleaned-zoom.webp",
    alt: "Doubao text watermark",
  },
  {
    original: "/showcase/alley-original.webp",
    cleaned: "/showcase/alley-cleaned.webp",
    zoomOriginal: "/showcase/alley-original-zoom.webp",
    zoomCleaned: "/showcase/alley-cleaned-zoom.webp",
    alt: "Gemini sparkle watermark",
  },
];

export default function Showcase() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <h2 className="text-3xl font-medium leading-[1.1] tracking-tight md:text-4xl">
          {t("showcase.title")}
        </h2>
        <p className="mt-5 max-w-[46ch] leading-relaxed text-ink-muted">{t("showcase.subtitle")}</p>
      </div>

      <div className="space-y-8 lg:col-span-8">
        {EXAMPLES.map((ex) => (
          <WatermarkCompare key={ex.original} {...ex} />
        ))}
      </div>
    </div>
  );
}
