import { useTranslation } from "react-i18next";

interface ErrorBannerProps {
  message: string;
  recoverable?: boolean;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, recoverable = false, onRetry }: ErrorBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {recoverable && onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
          >
            {t("error.retry")}
          </button>
        )}
      </div>
    </div>
  );
}
