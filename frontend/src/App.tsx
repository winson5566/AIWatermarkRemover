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

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-16 pb-8 sm:pt-24 sm:pb-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="gradient-text">{t("app.title")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-slate-400 sm:text-base">
          {t("app.description")}
        </p>
        <div className="mx-auto mt-10 h-px w-16 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
        <div className="mt-10">
          <UploadZone />
        </div>
      </div>
    </section>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

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

  if (state.phase !== "idle") {
    let title = "";
    if (state.phase === "uploaded" || state.phase === "detecting") title = t("detection.title");
    else if (state.phase === "detected") title = t("mode.title");
    else if (state.phase === "processing") title = t("processing.title");
    else if (state.phase === "completed") title = "";
    else if (state.phase === "error") title = t("error.title");

    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="absolute inset-0 bg-grid" />
        </div>

        <Header />

        <main className="relative flex-1 pt-20 pb-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            {title && (
              <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">{title}</h1>
              </div>
            )}
            {errorBanner}

            {(state.phase === "uploaded" || state.phase === "detecting") && (
              <div className="space-y-5">
                <FilePreview />
                <DetectionResult />
              </div>
            )}

            {state.phase === "detected" && (
              <div className="space-y-5">
                <FilePreview />
                <DetectionResult />
                <ModeSelector />
              </div>
            )}

            {state.phase === "processing" && (
              <div className="space-y-5">
                <FilePreview />
                <ProcessingProgress />
              </div>
            )}

            {state.phase === "completed" && (
              <div className="space-y-5">
                <ComparisonView />
                <DownloadButton />
              </div>
            )}

            {state.phase === "error" && (
              <div className="space-y-5">
                <UploadZone />
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <Header />

      <main className="relative flex-1 pb-12">
        <HeroSection />
        <Divider />
        <Section>
          <FeatureCards />
        </Section>
        <Divider />
        <Section>
          <CapabilityTable />
        </Section>
        <Divider />
        <Section>
          <FaqSection />
        </Section>
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
