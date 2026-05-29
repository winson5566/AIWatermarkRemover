import { useTranslation } from "react-i18next";

const PLATFORMS = [
  "ChatGPT / DALL·E",
  "Google Gemini",
  "Midjourney",
  "Stable Diffusion",
  "Adobe Firefly",
  "xAI Grok",
  "Doubao",
];

export default function PlatformTags() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <h2 className="text-3xl font-medium leading-[1.1] tracking-tight md:text-4xl">
          {t("platforms.title")}
        </h2>
        <p className="mt-5 max-w-[46ch] leading-relaxed text-ink-muted">{t("platforms.subtitle")}</p>
      </div>

      <div className="lg:col-span-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-md border border-line bg-surface/40 p-4"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-accent" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
