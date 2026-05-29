import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppState } from "../context/AppContext";

export default function DownloadButton() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { resultUrl } = useAppState();

  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement("a");
      link.href = resultUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleDownload}
        className="inline-flex h-11 items-center gap-2.5 rounded-md bg-accent px-6 text-sm font-medium text-[#06281e] transition-colors hover:bg-accent-hover"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {t("actions.download")}
      </button>
      <button
        onClick={() => dispatch({ type: "RESET" })}
        className="text-sm text-ink-muted transition-colors hover:text-ink"
      >
        {t("actions.startOver")}
      </button>
    </div>
  );
}
