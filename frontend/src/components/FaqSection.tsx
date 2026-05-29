import { useState } from "react";
import { useTranslation } from "react-i18next";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

function FaqItem({ faqKey }: { faqKey: string }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-md border border-line bg-surface transition-colors hover:border-line-strong">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-ink">{t(`faq.${faqKey}.q`)}</span>
        <svg
          className={`mt-0.5 h-5 w-5 flex-shrink-0 text-ink-dim transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <p className="border-t border-line px-5 pb-5 pt-4 text-sm leading-relaxed text-ink-muted">
          {t(`faq.${faqKey}.a`)}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="mb-8 text-3xl font-medium leading-[1.1] tracking-tight md:text-4xl">
        {t("faq.title")}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {FAQ_KEYS.map((key) => (
          <FaqItem key={key} faqKey={key} />
        ))}
      </div>
    </div>
  );
}
