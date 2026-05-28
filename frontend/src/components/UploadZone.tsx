import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../context/AppContext";
import { useUpload } from "../hooks/useUpload";
import Spinner from "./Spinner";

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
const ACCEPTED = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

export default function UploadZone() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { uploadFile, uploading } = useUpload(dispatch);
  const [localError, setLocalError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setLocalError(null);

      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        if (firstError.code === "file-too-large") {
          setLocalError(t("error.fileTooLarge"));
        } else if (firstError.code === "file-invalid-type") {
          setLocalError(t("error.invalidFormat"));
        } else {
          setLocalError(t("error.uploadFailed"));
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        uploadFile(acceptedFiles[0]);
      }
    },
    [uploadFile, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    multiple: false,
    disabled: uploading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 sm:p-16 ${
          isDragActive
            ? "border-brand-500 bg-brand-50"
            : localError
              ? "border-rose-300 bg-rose-50/50"
              : "border-slate-300 bg-white hover:border-brand-400 hover:bg-brand-50/30"
        } ${uploading ? "pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-base font-medium text-slate-600">{t("upload.uploading")}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* Upload icon */}
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                isDragActive ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-400"
              }`}
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-medium text-slate-700">
                {isDragActive
                  ? t("upload.dropzone")
                  : t("upload.dropzone")}
              </p>
              <p className="mt-1 text-sm text-slate-400">{t("upload.formats")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Local error message */}
      {localError && (
        <p className="mt-3 text-center text-sm text-rose-600">{localError}</p>
      )}
    </div>
  );
}
