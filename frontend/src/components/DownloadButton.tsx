import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppState } from "../context/AppContext";
import { getDownloadUrl } from "../api/client";

export default function DownloadButton() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { resultUrl } = useAppState();

  const handleDownload = () => {
    if (resultUrl) {
      // Trigger download by navigating to the download URL
      const link = document.createElement("a");
      link.href = resultUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Download button */}
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2.5 rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {t("result.download")}
      </button>

      {/* Reset link */}
      <button
        onClick={handleReset}
        className="text-sm font-medium text-brand-600 underline underline-offset-2 transition-colors hover:text-brand-700"
      >
        {t("result.newImage")}
      </button>
    </div>
  );
}
