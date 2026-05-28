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

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo + Title */}
        <div className="flex items-center gap-2.5">
          <svg
            className="h-8 w-8 flex-shrink-0 text-brand-600"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              d="M16 8C13 12 10 14 8 16C10 18 13 20 16 24C19 20 22 18 24 16C22 14 19 12 16 8Z"
              fill="currentColor"
              opacity="0.4"
            />
            <circle cx="16" cy="16" r="3" fill="currentColor" />
          </svg>
          <span className="text-lg font-semibold text-slate-900 sm:text-xl">
            {t("header.title")}
          </span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  isActive
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
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
