import { useState } from "react";
import { useTranslation } from "react-i18next";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

function FaqItem({ faqKey }: { faqKey: string }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-card border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/50"
      >
        <span className="text-sm font-semibold text-slate-800 sm:text-base">
          {t(`faq.${faqKey}.q`)}
        </span>
        <svg
          className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          <p className="text-sm leading-relaxed text-slate-600">
            {t(`faq.${faqKey}.a`)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const { t } = useTranslation();

  return (
    <section>
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
        {t("faq.title")}
      </h2>
      <div className="mx-auto max-w-2xl space-y-3">
        {FAQ_KEYS.map((key) => (
          <FaqItem key={key} faqKey={key} />
        ))}
      </div>
    </section>
  );
}
