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

  useDetection(state.fileId, dispatch);

  const errorBanner = state.error && (
    <div className="mb-6">
      <ErrorBanner message={state.error} recoverable={state.phase === "error"} onRetry={() => dispatch({ type: "RESET" })} />
    </div>
  );

  const renderMainContent = () => {
    const { phase } = state;

    switch (phase) {
      case "idle":
        return (
          <>
            <UploadZone />
            <div className="mt-20 space-y-20">
              <FeatureCards />
              <CapabilityTable />
              <FaqSection />
            </div>
          </>
        );

      case "uploaded":
      case "detecting":
        return (
          <>
            {errorBanner}
            <div className="space-y-5">
              <FilePreview />
              <DetectionResult />
            </div>
          </>
        );

      case "detected":
        return (
          <>
            {errorBanner}
            <div className="space-y-5">
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
            <div className="space-y-5">
              <FilePreview />
              <ProcessingProgress />
            </div>
          </>
        );

      case "completed":
        return (
          <>
            {errorBanner}
            <div className="space-y-5">
              <ComparisonView />
              <DownloadButton />
            </div>
          </>
        );

      case "error":
        return (
          <>
            {errorBanner}
            {state.fileId && state.previewUrl ? (
              <div className="space-y-5">
                <FilePreview />
                {state.detection && <DetectionResult />}
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

  const getPhaseTitle = () => {
    const { phase } = state;
    if (phase === "idle") return null;
    if (phase === "uploaded" || phase === "detecting") return t("detection.title");
    if (phase === "detected") return t("mode.title");
    if (phase === "processing") return t("processing.title");
    if (phase === "completed") return "";
    if (phase === "error" && !state.fileId) return t("error.title");
    return "";
  };

  const phaseTitle = getPhaseTitle();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <Header />

      <main className="relative flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Hero section */}
          {state.phase === "idle" && (
            <div className="mb-12 text-center pt-8 sm:pt-16">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="gradient-text">{t("app.title")}</span>
              </h1>
              <p className="mt-5 text-base text-slate-400 sm:text-lg max-w-xl mx-auto">
                {t("app.description")}
              </p>
              {/* Decorative line */}
              <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
            </div>
          )}

          {/* Phase title for non-idle states */}
          {phaseTitle && (
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">{phaseTitle}</h1>
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
