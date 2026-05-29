import { useTranslation } from "react-i18next";

const steps = [
  { key: "visible", num: "01" },
  { key: "invisible", num: "02" },
  { key: "metadata", num: "03" },
] as const;

export default function FeatureCards() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <h2 className="text-3xl font-medium leading-[1.1] tracking-tight md:text-4xl">
          {t("features.title")}
        </h2>
      </div>

      <ol className="divide-y divide-line lg:col-span-8">
        {steps.map(({ key, num }) => (
          <li key={key} className="grid grid-cols-12 gap-6 py-6 lg:py-8">
            <div className="label col-span-2 pt-1 lg:col-span-1">{num}</div>
            <div className="col-span-10 lg:col-span-11">
              <h3 className="text-lg tracking-tight md:text-xl">{t(`features.${key}.title`)}</h3>
              <p className="mt-2 max-w-[64ch] leading-relaxed text-ink-muted">{t(`features.${key}.desc`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
