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
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
        {t("platforms.title")}
      </div>
      <p className="mb-6 text-sm text-slate-500">{t("platforms.subtitle")}</p>

      <div className="flex flex-wrap gap-2.5">
        {PLATFORMS.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-200 bg-surface-100 px-4 py-2 text-sm text-slate-700 transition-all hover:border-slate-300 hover:bg-surface-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
