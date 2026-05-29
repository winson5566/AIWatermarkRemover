import { useTranslation } from "react-i18next";
import BeforeAfter from "./BeforeAfter";

const EXAMPLES = [
  { original: "/showcase/street-original.jpg", cleaned: "/showcase/street-cleaned.jpg", alt: "Shimokitazawa street" },
  { original: "/showcase/alley-original.jpg", cleaned: "/showcase/alley-cleaned.jpg", alt: "Alley portrait" },
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

      <div className="lg:col-span-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {EXAMPLES.map((ex) => (
            <BeforeAfter key={ex.original} original={ex.original} cleaned={ex.cleaned} alt={ex.alt} />
          ))}
        </div>
      </div>
    </div>
  );
}
