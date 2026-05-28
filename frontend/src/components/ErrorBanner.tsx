import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ErrorBannerProps {
  message: string;
  recoverable?: boolean;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, recoverable = false, onRetry }: ErrorBannerProps) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="animate-slide-in rounded-lg border border-rose-200 bg-rose-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Error icon */}
        <svg
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-medium text-rose-800">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {recoverable && onRetry && (
            <button
              onClick={onRetry}
              className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700"
            >
              {t("error.retry")}
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="rounded-md p-1 text-rose-400 transition-colors hover:text-rose-600"
            aria-label={t("error.dismiss")}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
