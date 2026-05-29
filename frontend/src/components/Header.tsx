import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../context/AppContext";

const languages = [
  { code: "en", labelKey: "language.en" },
  { code: "zh", labelKey: "language.zh" },
  { code: "es", labelKey: "language.es" },
  { code: "fr", labelKey: "language.fr" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLang = i18n.language?.split("-")[0] || "en";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => dispatch({ type: "RESET" })} className="flex items-center gap-2.5 group">
          <svg className="h-7 w-7 flex-shrink-0" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="hdr-logo" x1="2" y1="2" x2="30" y2="30">
                <stop stopColor="#818cf8" />
                <stop offset="0.5" stopColor="#06b6d4" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#hdr-logo)" opacity="0.1" />
            <path d="M16 6C13 10 11 12 9 16C11 20 13 22 16 26C19 22 21 20 23 16C21 12 19 10 16 6Z" stroke="url(#hdr-logo)" strokeWidth="2" fill="none" strokeLinejoin="round" />
            <circle cx="16" cy="16" r="3" fill="url(#hdr-logo)" />
          </svg>
          <span className="text-base font-semibold text-slate-900 transition-colors group-hover:text-brand-600 sm:text-lg">
            {t("header.title")}
          </span>
        </button>

        <div className="flex items-center gap-0.5 rounded-lg bg-surface-100 p-1">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-all sm:px-2.5 sm:text-sm ${
                  isActive
                    ? "bg-brand-600/20 text-brand-600"
                    : "text-slate-600 hover:text-slate-800"
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
