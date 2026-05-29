import { useTranslation } from "react-i18next";
import { AppProvider, useAppState, useAppDispatch } from "./context/AppContext";
import { useDetection } from "./hooks/useDetection";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadZone from "./components/UploadZone";
import FilePreview from "./components/FilePreview";
import DetectionResult from "./components/DetectionResult";
import ProcessingProgress from "./components/ProcessingProgress";
import ComparisonView from "./components/ComparisonView";
import DownloadButton from "./components/DownloadButton";
import ModeSelector from "./components/ModeSelector";
import FeatureCards from "./components/FeatureCards";
import PlatformTags from "./components/PlatformTags";
import FaqSection from "./components/FaqSection";
import ErrorBanner from "./components/ErrorBanner";

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-20 pb-10 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-xs font-medium text-brand-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {t("hero.badge")}
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="gradient-text">{t("app.title")}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-400 sm:text-base">
          {t("app.description")}
        </p>

        <div className="mt-10">
          <UploadZone />
        </div>
      </div>
    </section>
  );
}

function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="absolute inset-0 bg-grid" />
    </div>
  );
}

function AppContent() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useDetection(state.fileId, dispatch);

  const errorBlock = state.error ? (
    <div className="mb-6">
      <ErrorBanner message={state.error} recoverable={state.phase === "error"} onRetry={() => dispatch({ type: "RESET" })} />
    </div>
  ) : null;

  // --- Non-idle: processing flow ---
  if (state.phase !== "idle") {
    let heading = "";
    if (state.phase === "uploaded" || state.phase === "detecting") heading = t("detection.title");
    else if (state.phase === "processing") heading = t("progress.title");
    else if (state.phase === "completed") heading = "";

    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <Background />
        <Header />
        <main className="relative flex-1 pt-20 pb-12">
          <div className={`mx-auto px-4 sm:px-6 ${state.phase === "completed" ? "max-w-5xl" : "max-w-2xl"}`}>
            {heading && <h1 className="mb-6 text-xl font-bold text-slate-100 sm:text-2xl">{heading}</h1>}
            {errorBlock}

            {(state.phase === "uploaded" || state.phase === "detecting") && (
              <div className="space-y-5"><FilePreview /><DetectionResult /></div>
            )}
            {state.phase === "detected" && (
              <div className="space-y-5"><FilePreview /><DetectionResult /><ModeSelector /></div>
            )}
            {state.phase === "processing" && (
              <div className="space-y-5"><FilePreview /><ProcessingProgress /></div>
            )}
            {state.phase === "completed" && (
              <div className="space-y-5"><ComparisonView /><DownloadButton /></div>
            )}
            {state.phase === "error" && !state.fileId && (
              <UploadZone />
            )}
            {state.phase === "error" && state.fileId && (
              <div className="space-y-5"><FilePreview />{state.detection && <DetectionResult />}</div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Idle: landing page ---
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Background />
      <Header />
      <main className="relative flex-1">
        <Hero />

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        </div>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <FeatureCards />
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        </div>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <PlatformTags />
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        </div>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <FaqSection />
          </div>
        </section>
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
