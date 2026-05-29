import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../context/AppContext";
import { useUpload } from "../hooks/useUpload";
import Spinner from "./Spinner";

const MAX_SIZE = 15 * 1024 * 1024;
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
        if (firstError.code === "file-too-large") setLocalError(t("error.fileTooLarge"));
        else if (firstError.code === "file-invalid-type") setLocalError(t("error.invalidFormat"));
        else setLocalError(t("error.uploadFailed"));
        return;
      }
      if (acceptedFiles.length > 0) uploadFile(acceptedFiles[0]);
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
    <div className="mx-auto max-w-lg">
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-lg border border-dashed p-10 text-center transition-colors ${
          isDragActive
            ? "border-accent bg-accent-soft"
            : localError
              ? "border-red-300 bg-red-50"
              : "border-line-strong bg-surface hover:border-ink-muted"
        } ${uploading ? "pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Spinner size="lg" />
            <p className="text-sm text-ink-muted">{t("upload.uploading")}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-2">
            <svg
              className={`h-9 w-9 transition-colors ${isDragActive ? "text-accent" : "text-ink-muted"}`}
              fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              <p className="text-sm text-ink">{t("upload.dropzone")}</p>
              <p className="label mt-2">{t("upload.formats")}</p>
            </div>
          </div>
        )}
      </div>
      {localError && <p className="mt-3 text-center text-sm text-red-600">{localError}</p>}
    </div>
  );
}
