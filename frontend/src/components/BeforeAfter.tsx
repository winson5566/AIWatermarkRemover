import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface BeforeAfterProps {
  original: string;
  cleaned: string;
  alt?: string;
}

/**
 * Drag-to-compare slider. The left side shows the original image (clipped),
 * the right side the cleaned result. Drag the handle, click anywhere, or use
 * the arrow keys to move the divider.
 */
export default function BeforeAfter({ original, cleaned, alt = "" }: BeforeAfterProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* setPointerCapture can throw for synthetic/unknown pointers — non-fatal */
    }
    setDragging(true);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  };

  const endDrag = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 2));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 2));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
  };

  return (
    <figure
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="group relative cursor-ew-resize touch-none select-none overflow-hidden rounded-lg border border-line bg-surface-2"
    >
      {/* Base layer: cleaned result (right side) */}
      <img src={cleaned} alt={alt ? `${alt} — ${t("showcase.cleaned")}` : ""} draggable={false} className="block h-auto w-full" />

      {/* Top layer: original, clipped to the left of the divider */}
      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={original} alt={alt ? `${alt} — ${t("showcase.original")}` : ""} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      {/* Corner labels */}
      <span className="label pointer-events-none absolute left-3 top-3 rounded bg-surface/85 px-1.5 py-0.5 backdrop-blur-sm">
        {t("showcase.original")}
      </span>
      <span className="label pointer-events-none absolute right-3 top-3 rounded bg-surface/85 px-1.5 py-0.5 !text-accent backdrop-blur-sm">
        {t("showcase.cleaned")}
      </span>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-surface/90" />
        <button
          type="button"
          role="slider"
          aria-label={t("showcase.hint")}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 -ml-4 -mt-4 flex h-8 w-8 -translate-y-0 items-center justify-center rounded-full border border-line-strong bg-surface text-ink shadow-sm outline-none transition-colors hover:border-accent focus-visible:border-accent"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </button>
      </div>

      {/* Hint pill (fades out once the user starts dragging) */}
      <figcaption
        className={`label pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-surface/85 px-2.5 py-1 backdrop-blur-sm transition-opacity ${dragging ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
      >
        {t("showcase.hint")}
      </figcaption>
    </figure>
  );
}
