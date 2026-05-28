import { useState } from "react";
import { useTranslation } from "react-i18next";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

function FaqItem({ faqKey }: { faqKey: string }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/[0.06] glass transition-colors hover:border-white/[0.08]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-slate-200">{t(`faq.${faqKey}.q`)}</span>
        <svg
          className={`mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <p className="border-t border-white/[0.04] px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-400">
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
      <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
        {t("faq.title")}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {FAQ_KEYS.map((key) => (
          <FaqItem key={key} faqKey={key} />
        ))}
      </div>
    </div>
  );
}
