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
import Showcase from "./components/Showcase";
import PlatformTags from "./components/PlatformTags";
import FaqSection from "./components/FaqSection";
import ErrorBanner from "./components/ErrorBanner";

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="px-6 pb-16 pt-20 sm:pb-20 lg:px-8 lg:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="label !text-ink-muted">{t("hero.badge")}</span>
        </div>

        <h1 className="text-grad text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
          {t("app.title")}
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ink-muted">
          {t("app.description")}
        </p>

        <div className="mt-10">
          <UploadZone />
        </div>
      </div>
    </section>
  );
}

function Grain() {
  return <div className="grain pointer-events-none fixed inset-0 z-0 opacity-60" />;
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
      <div className="relative flex min-h-screen flex-col">
        <Grain />
        <Header />
        <main className="relative z-10 flex-1 px-6 pb-16 pt-24 lg:px-8">
          <div className={`mx-auto ${state.phase === "completed" ? "max-w-5xl" : "max-w-2xl"}`}>
            {heading && <h1 className="mb-6 text-2xl font-medium tracking-tight">{heading}</h1>}
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
    <div className="relative flex min-h-screen flex-col">
      <Grain />
      <Header />
      <main className="relative z-10 flex-1">
        <Hero />

        <section className="border-t border-line px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl">
            <Showcase />
          </div>
        </section>

        <section className="border-t border-line px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl">
            <FeatureCards />
          </div>
        </section>

        <section className="border-t border-line px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl">
            <PlatformTags />
          </div>
        </section>

        <section className="border-t border-line px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl">
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
