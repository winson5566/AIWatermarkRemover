import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", labelKey: "language.en" },
  { code: "zh", labelKey: "language.zh" },
  { code: "es", labelKey: "language.es" },
  { code: "fr", labelKey: "language.fr" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.split("-")[0] || "en";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.04] bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <svg className="h-7 w-7 flex-shrink-0" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#818cf8" />
                <stop offset="0.5" stopColor="#06b6d4" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="14" stroke="url(#logo-grad)" strokeWidth="2" fill="none" />
            <path d="M16 8C13 12 10 14 8 16C10 18 13 20 16 24C19 20 22 18 24 16C22 14 19 12 16 8Z" fill="url(#logo-grad)" opacity="0.3" />
            <circle cx="16" cy="16" r="3" fill="url(#logo-grad)" />
          </svg>
          <span className="text-base font-semibold text-white sm:text-lg">{t("header.title")}</span>
        </div>

        <div className="flex items-center gap-0.5 rounded-lg bg-surface-100 p-1">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-all sm:px-2.5 sm:text-sm ${
                  isActive
                    ? "bg-brand-600/20 text-brand-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t(lang.labelKey)}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
