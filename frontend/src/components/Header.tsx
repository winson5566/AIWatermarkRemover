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
    <header className="sticky top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <button onClick={() => dispatch({ type: "RESET" })} className="group flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-line-strong">
            <span className="h-2 w-2 rounded-sm bg-accent transition-colors group-hover:bg-accent-hover" />
          </span>
          <span className="font-medium tracking-tight">{t("header.title")}</span>
          <span className="label ml-1 hidden sm:inline">v1.0</span>
        </button>

        <div className="flex items-center gap-1 rounded-md border border-line bg-surface-3 p-0.5">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`h-6 rounded px-2 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "bg-surface text-ink"
                    : "text-ink-muted hover:text-ink"
                }`}
                aria-pressed={isActive}
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
