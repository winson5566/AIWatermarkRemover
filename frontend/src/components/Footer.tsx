import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <p className="max-w-md text-xs text-slate-500">{t("footer.privacy")}</p>
        </div>
      </div>
    </footer>
  );
}
