import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-slate-500">
            {t("footer.built")}{" "}
            <a
              href="https://github.com/remove-ai-watermarks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline underline-offset-2 transition-colors hover:text-brand-700"
            >
              {t("footer.github")}
            </a>
          </p>
          <p className="max-w-md text-xs text-slate-400">
            {t("footer.privacy")}
          </p>
        </div>
      </div>
    </footer>
  );
}
