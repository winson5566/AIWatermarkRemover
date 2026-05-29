import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 border-t border-line px-6 py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="label flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-sm bg-accent" />
          <span>{t("header.title")}</span>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-ink-dim">{t("footer.privacy")}</p>
      </div>
    </footer>
  );
}
