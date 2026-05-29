import { useTranslation } from "react-i18next";

const steps = [
  { key: "visible", num: "01", color: "brand" },
  { key: "invisible", num: "02", color: "accent" },
  { key: "metadata", num: "03", color: "purple" },
] as const;

const colorMap: Record<string, string> = {
  brand: "from-brand-500/10 to-brand-600/5 border-brand-500/20 hover:border-brand-500/30",
  accent: "from-accent-500/10 to-accent-600/5 border-accent-500/20 hover:border-accent-500/30",
  purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/30",
};

const numColorMap: Record<string, string> = {
  brand: "text-brand-600/30",
  accent: "text-accent-400/30",
  purple: "text-purple-600/30",
};

export default function FeatureCards() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
        {t("features.title")}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map(({ key, num, color }) => (
          <div
            key={key}
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 ${colorMap[color]}`}
          >
            <span
              className={`absolute -right-2 -top-2 text-7xl font-black leading-none ${numColorMap[color]} transition-transform group-hover:scale-110`}
            >
              {num}
            </span>
            <div className="relative">
              <h3 className="text-lg font-semibold text-slate-900">{t(`features.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{t(`features.${key}.desc`)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
