"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

/* ─────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────── */
interface PreviewState {
  visible: boolean;
  x: number;       // cursor X relative to viewport (px)
  y: number;       // cursor Y relative to viewport (px)
  content: React.ReactNode;
}

const PreviewCtx = createContext<{
  show: (x: number, y: number, content: React.ReactNode) => void;
  hide: () => void;
  move: (x: number, y: number) => void;
} | null>(null);

/* ─────────────────────────────────────────────
   PROVIDER  — wrap the root layout / page in this
───────────────────────────────────────────── */
export function HoverPreviewProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PreviewState>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((x: number, y: number, content: React.ReactNode) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setState({ visible: true, x, y, content });
  }, []);

  const hide = useCallback(() => {
    // small grace period so brief mouse-leave glitches don't flicker
    hideTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, visible: false }));
    }, 80);
  }, []);

  const move = useCallback((x: number, y: number) => {
    setState((s) => ({ ...s, x, y }));
  }, []);

  return (
    <PreviewCtx.Provider value={{ show, hide, move }}>
      {children}
      <HoverPreviewCard state={state} />
    </PreviewCtx.Provider>
  );
}

/* ─────────────────────────────────────────────
   FLOATING CARD RENDERER
───────────────────────────────────────────── */
function HoverPreviewCard({ state }: { state: PreviewState }) {
  const CARD_W = 220; // approximate width — card anchors away from edges

  // Clamp so it never clips off-screen edges
  const safeX =
    typeof window !== "undefined"
      ? Math.min(state.x, window.innerWidth - CARD_W - 16)
      : state.x;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        // GPU-composited transform only
        transform: `translate3d(${safeX - CARD_W / 2}px, ${state.y}px, 0)`,
        // Spring-like entrance with CSS transitions
        opacity: state.visible ? 1 : 0,
        scale: state.visible ? "1" : "0.88",
        filter: state.visible ? "blur(0px)" : "blur(6px)",
        transition: state.visible
          ? "opacity 220ms cubic-bezier(0.34,1.56,0.64,1), scale 220ms cubic-bezier(0.34,1.56,0.64,1), filter 180ms ease"
          : "opacity 120ms ease, scale 120ms ease, filter 120ms ease",
      }}
    >
      {state.content}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRIGGER WRAPPER  — wrap any element with this
───────────────────────────────────────────── */
interface HoverPreviewTriggerProps {
  children: React.ReactNode;
  preview: React.ReactNode;
  /** Vertical offset above cursor in px (default –120) */
  offsetY?: number;
}

export function HoverPreviewTrigger({
  children,
  preview,
  offsetY = -120,
}: HoverPreviewTriggerProps) {
  const ctx = useContext(PreviewCtx);
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!ctx) {
    console.warn("[HoverPreview] Wrap your app in <HoverPreviewProvider>");
    return <>{children}</>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    ctx.show(e.clientX, e.clientY + offsetY, preview);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    ctx.move(e.clientX, e.clientY + offsetY);
  };

  const handleMouseLeave = () => {
    ctx.hide();
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
}
