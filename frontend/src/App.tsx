import { useTranslation } from "react-i18next";
import { AppProvider, useAppState, useAppDispatch } from "./context/AppContext";
import { useDetection } from "./hooks/useDetection";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadZone from "./components/UploadZone";
import FilePreview from "./components/FilePreview";
import DetectionResult from "./components/DetectionResult";
import ModeSelector from "./components/ModeSelector";
import ProcessingProgress from "./components/ProcessingProgress";
import ComparisonView from "./components/ComparisonView";
import DownloadButton from "./components/DownloadButton";
import FeatureCards from "./components/FeatureCards";
import CapabilityTable from "./components/CapabilityTable";
import FaqSection from "./components/FaqSection";
import ErrorBanner from "./components/ErrorBanner";

function AppContent() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // Auto-run detection when file is uploaded
  useDetection(state.fileId, dispatch);

  const handleRetry = () => {
    dispatch({ type: "RESET" });
  };

  const renderMainContent = () => {
    const { phase, error } = state;

    // Error banner is shown across multiple phases
    const errorBanner = error && (
      <div className="mb-6">
        <ErrorBanner
          message={error}
          recoverable={phase === "error"}
          onRetry={handleRetry}
        />
      </div>
    );

    switch (phase) {
      case "idle":
        return (
          <>
            <UploadZone />
            <div className="mt-16 space-y-16">
              <FeatureCards />
              <CapabilityTable />
              <FaqSection />
            </div>
          </>
        );

      case "uploaded":
        return (
          <>
            {errorBanner}
            <div className="space-y-6">
              <FilePreview />
              <DetectionResult />
            </div>
          </>
        );

      case "detecting":
        return (
          <>
            {errorBanner}
            <div className="space-y-6">
              <FilePreview />
              <DetectionResult />
            </div>
          </>
        );

      case "detected":
        return (
          <>
            {errorBanner}
            <div className="space-y-6">
              <FilePreview />
              <DetectionResult />
              <ModeSelector />
            </div>
          </>
        );

      case "processing":
        return (
          <>
            {errorBanner}
            <div className="space-y-6">
              <FilePreview />
              <ProcessingProgress />
            </div>
          </>
        );

      case "completed":
        return (
          <>
            {errorBanner}
            <div className="space-y-6">
              <ComparisonView />
              <DownloadButton />
            </div>
          </>
        );

      case "error":
        return (
          <>
            {errorBanner}
            {/* Show relevant content based on what was happening */}
            {state.fileId && state.previewUrl ? (
              <div className="space-y-6">
                <FilePreview />
                {state.detection && <DetectionResult />}
                {!state.detection && state.phase !== "error" && <UploadZone />}
              </div>
            ) : (
              <UploadZone />
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 pt-20 pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Hero section - only shown on idle */}
          {state.phase === "idle" && (
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {t("app.title")}
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:text-lg">
                {t("app.description")}
              </p>
            </div>
          )}

          {/* Phase title for non-idle states */}
          {state.phase !== "idle" && state.phase !== "error" && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {state.phase === "uploaded" || state.phase === "detecting"
                  ? t("detection.title")
                  : state.phase === "detected"
                    ? t("mode.title")
                    : state.phase === "processing"
                      ? t("processing.title")
                      : state.phase === "completed"
                        ? t("result.download")
                        : ""}
              </h1>
            </div>
          )}

          {state.phase === "error" && !state.fileId && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {t("error.title")}
              </h1>
            </div>
          )}

          {renderMainContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
