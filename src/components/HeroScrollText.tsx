"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PaperCrumpleRef {
  crumple: () => void;
  release: () => void;
  reset: () => void;
}

interface PaperCrumpleProps {
  src: string;
  alt?: string;
  backSrc?: string;
  width?: number;
  height?: number;
  sceneHeight?: number;
  imageFit?: "cover" | "contain";
  releaseBehavior?: "stay" | "restore" | "creased";
  crumpleAmount?: number;
  crumpleDuration?: number;
  releaseDuration?: number;
  foldCount?: number;
  foldSharpness?: number;
  wrinkleDepth?: number;
  creaseStrength?: number;
  paperColor?: string;
  roughness?: number;
  paperTexture?: number;
  lightIntensity?: number;
  lightAngle?: number;
  shadow?: boolean;
  shadowOpacity?: number;
  draggable?: boolean;
  dragRotation?: number;
  dragRadius?: number;
  returnToOrigin?: boolean;
  rotation?: number;
  seed?: number;
  detail?: number;
  disabled?: boolean;
  resetKey?: number | string;
  onStateChange?: (state: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<PaperCrumpleRef>;
}

import dynamic from "next/dynamic";

const PaperCrumple = dynamic<PaperCrumpleProps>(
  () =>
    import("@/components/ui/PaperCrumple").then(
      (mod) => mod.default as unknown as React.ComponentType<PaperCrumpleProps>
    ),
  { ssr: false }
);

const PROFILE_IMAGE = "/profile.jpg";

export function HeroScrollText() {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Eagerly pre-decode the image into browser cache on mount
  useEffect(() => {
    const img = new Image();
    img.src = PROFILE_IMAGE;
    if (img.decode) {
      img.decode().catch(() => {});
    }
  }, []);
  const [showPaper, setShowPaper] = useState(false);
  const [paperExiting, setPaperExiting] = useState(false);

  // Ref to PaperCrumple imperative handles
  const paperRef = useRef<{ crumple: () => void; release: () => void; reset: () => void } | null>(null);

  // Ref to the name span so we can snapshot its viewport rect
  const nameRef = useRef<HTMLSpanElement>(null);
  const [triggerRect, setTriggerRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* ── scroll dissolve ──────────────────────────────────────── */
  useEffect(() => {
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / 450));
        setProgress(p);
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── snapshot name rect once on mount ──────────────────────── */
  useEffect(() => {
    if (!nameRef.current) return;
    const r = nameRef.current.getBoundingClientRect();
    setTriggerRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, []);

  const [activeFlank, setActiveFlank] = useState<"left" | "right" | null>(null);
  const leaveDebounceRef = useRef<NodeJS.Timeout | null>(null);

  /* ── hover enter ───────────────────────────────────────────── */
  const onEnter = useCallback(() => {
    // Lock scrolling while viewing interactive hero
    window.dispatchEvent(new CustomEvent("lenis:stop"));

    // Cancel any pending exit
    if (leaveDebounceRef.current) {
      clearTimeout(leaveDebounceRef.current);
      leaveDebounceRef.current = null;
    }
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (nameRef.current) {
      const r = nameRef.current.getBoundingClientRect();
      setTriggerRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    setHovered(true);
    setShowPaper(true);
    setPaperExiting(false);
    paperRef.current?.reset();
  }, []);

  /* ── hover leave: debounced so subtle movements don't flicker ── */
  const onLeave = useCallback(() => {
    // Unlock scrolling when leaving
    window.dispatchEvent(new CustomEvent("lenis:start"));

    setActiveFlank(null);
    if (leaveDebounceRef.current) clearTimeout(leaveDebounceRef.current);
    leaveDebounceRef.current = setTimeout(() => {
      setHovered(false);

      // Trigger crumple collapse
      paperRef.current?.crumple();
      setPaperExiting(true);

      // After crumple animation and falling down, remove from view
      exitTimerRef.current = setTimeout(() => {
        setShowPaper(false);
        setPaperExiting(false);
        paperRef.current?.reset();
      }, 950);
    }, 120);
  }, []);

  // Clean timers & ensure scroll unlocked on unmount
  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent("lenis:start"));
      if (leaveDebounceRef.current) clearTimeout(leaveDebounceRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  /* ── derived values ───────────────────────────────────────── */
  const blurPx = (progress * 16).toFixed(2);
  const opacity = (1 - progress).toFixed(3);
  const scrollY = (-progress * 35).toFixed(1);
  const scale = (1 - progress * 0.04).toFixed(3);
  const hoverY = hovered ? 340 : 0;

  return (
    <>
      {/* ── fullscreen blur backdrop ────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 18,
          backdropFilter: hovered
            ? "blur(22px) brightness(0.35)"
            : "blur(0px) brightness(1)",
          WebkitBackdropFilter: hovered
            ? "blur(22px) brightness(0.35)"
            : "blur(0px) brightness(1)",
          opacity: hovered ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 450ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 450ms cubic-bezier(0.16, 1, 0.3, 1), -webkit-backdrop-filter 450ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* ── Fixed hit area: accurately covers only the portrait and hero name ── */}
      {triggerRect && (
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseMove={(e) => {
            const centerX = window.innerWidth / 2;
            const diff = e.clientX - centerX;
            // Generous deadzone in the center (~300px wide total) so hovering near/over the face keeps the clean portrait view
            if (diff < -150) {
              setActiveFlank("left");
            } else if (diff > 150) {
              setActiveFlank("right");
            } else {
              setActiveFlank(null);
            }
          }}
          style={{
            position: "fixed",
            top: triggerRect.top - 200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1200,
            height: 380,
            zIndex: 35,
            cursor: "pointer",
          }}
        />
      )}

      {/* ── Ambient Architectural Atmosphere & MUJ University Image on Left Flank Hover ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[25] overflow-hidden"
        style={{
          opacity: showPaper && !paperExiting && activeFlank === "left" ? 1 : 0,
          transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Soft Golden/Warm Amber Ambient Aura behind the university building */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "80vw",
            height: "90vh",
            background: "radial-gradient(ellipse at 85% 90%, rgba(245, 158, 11, 0.25) 0%, rgba(180, 83, 9, 0.12) 45%, transparent 75%)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        {/* Scaled MUJ University Building: Anchored flush to bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: "-30px",
            transform: activeFlank === "left"
              ? "translate3d(0, 0, 0) scale(1)"
              : "translate3d(70px, 45px, 0) scale(0.96)",
            width: "min(1180px, 77vw)",
            maxHeight: "88vh",
            transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease",
            pointerEvents: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/muj-university.webp"
            alt="Manipal University Jaipur Campus"
            className="w-full h-auto object-contain object-bottom select-none block"
            style={{
              filter: "drop-shadow(0 -15px 50px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 60px rgba(245, 158, 11, 0.22)) brightness(0.95) contrast(1.05)",
              maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 100%)",
            }}
          />
        </div>
      </div>

      {/* ── PaperCrumple Container ── */}
      {triggerRect && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "50%",
            transform: `translate3d(-50%, ${paperExiting ? "120px" : "0px"}, 0) scale(${paperExiting ? 0.55 : 1}) rotate(${paperExiting ? "15deg" : "0deg"})`,
            top: triggerRect.top + hoverY - 500,
            width: 520,
            height: 520,
            zIndex: 40,
            pointerEvents: "none",
            opacity: showPaper && !paperExiting ? 1 : 0,
            transition: paperExiting
              ? "transform 850ms cubic-bezier(0.55, 0.055, 0.675, 0.19), opacity 800ms cubic-bezier(0.55, 0.055, 0.675, 0.19)"
              : "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease",
          }}
        >
          {/* ── Animated Left Connector Line & Bottom-Left Typography Callout (Education) ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: showPaper && !paperExiting && activeFlank === "left" ? 1 : 0,
              transition: "opacity 350ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Bottom-Left Typography Callout (NO BOX, clean editorial typography) */}
            <div
              style={{
                position: "absolute",
                top: 500,
                left: -480,
                width: 360,
                textAlign: "left",
                transform: activeFlank === "left"
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(-30px, 40px, 0)",
                transition: "transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease",
              }}
            >
              {/* Monospace subtle eyebrow */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[11px] tracking-wider text-purple-400/90 font-medium">
                  2025 — 2028
                </span>
                <span className="text-zinc-600 text-[10px]">•</span>
                <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                  ACADEMIC
                </span>
              </div>

              {/* Manipal Logo: Cleanly scaled with smooth forward and reverse hover animation */}
              <div
                className="mb-2.5 overflow-hidden"
                style={{
                  transform: activeFlank === "left"
                    ? "translate3d(0, 0, 0) scale(1)"
                    : "translate3d(-20px, 12px, 0) scale(0.9)",
                  opacity: activeFlank === "left" ? 1 : 0,
                  transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/manipal-logo.png"
                  alt="Online Manipal Logo"
                  className="h-7 w-auto object-contain filter brightness-110 contrast-105"
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(255, 120, 40, 0.25))",
                  }}
                />
              </div>

              {/* Institution Title in Bricolage Grotesque */}
              <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-tight">
                Manipal University Jaipur
              </h3>

              {/* Degree */}
              <p className="font-display text-base text-purple-300 font-semibold mt-1">
                BCA in Artificial Intelligence
              </p>

              {/* Core Focus tags (no boxes, clean inline dots) */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2.5 text-[12px] text-zinc-400 font-mono">
                <span>Deep Learning</span>
                <span className="text-zinc-600">/</span>
                <span>Transformers</span>
                <span className="text-zinc-600">/</span>
                <span>Cognitive Models</span>
              </div>
            </div>

            {/* ── High School Building Image (Above College on Left Flank — Clean Image Only, No Text) ── */}
            <div
              style={{
                position: "absolute",
                top: -50,
                left: -530,
                width: 420,
                transform: activeFlank === "left"
                  ? "translate3d(0, 0, 0) scale(1)"
                  : "translate3d(-40px, -20px, 0) scale(0.95)",
                opacity: activeFlank === "left" ? 1 : 0,
                transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease",
              }}
            >
              {/* Subtle ambient backlight glow */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: -20,
                  background: "radial-gradient(ellipse at center, rgba(192, 132, 252, 0.22) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 75%)",
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              {/* Pure School Building Photo (No Text) */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-700/60 shadow-2xl shadow-black/80 bg-zinc-950/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/abps-school-building.png"
                  alt="The Aditya Birla Public School Building"
                  className="w-full h-auto max-h-56 object-cover object-center select-none block filter brightness-105 contrast-105"
                />
              </div>
            </div>

            {/* Top-Right Secondary Callout: High School Education (NO BOX, clean editorial typography) */}
            <div
              style={{
                position: "absolute",
                top: -80,
                left: 700,
                width: 520,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 24,
                textAlign: "left",
                transform: activeFlank === "left"
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(30px, -20px, 0)",
                transition: "transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease",
              }}
            >
              {/* Text Information */}
              <div style={{ flex: 1 }}>
                {/* Monospace subtle eyebrow */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[11px] tracking-wider text-purple-400 font-medium">
                    HIGH SCHOOL • FOUNDATION
                  </span>
                  <span className="text-zinc-600 text-[10px]">•</span>
                  <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                    SCIENCE & MATH
                  </span>
                </div>

                {/* Institution Title */}
                <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-tight">
                  High School
                </h3>

                {/* Focus Details */}
                <p className="font-display text-base text-purple-300 font-semibold mt-1">
                  Physics, Chemistry & Mathematics (PCM)
                </p>

                {/* Core areas */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2.5 text-[12px] text-zinc-400 font-mono">
                  <span>Higher Secondary</span>
                  <span className="text-zinc-600">/</span>
                  <span>Foundational Sciences</span>
                  <span className="text-zinc-600">/</span>
                  <span>Mathematics</span>
                </div>
              </div>

              {/* School Logo (ABPS Emblem) with Ambient Backlight & Forward/Reverse Hover Animation */}
              <div
                style={{
                  position: "relative",
                  flexShrink: 0,
                  transform: activeFlank === "left"
                    ? "translate3d(0, 0, 0) scale(1)"
                    : "translate3d(18px, -8px, 0) scale(0.88)",
                  opacity: activeFlank === "left" ? 1 : 0,
                  transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 120ms, opacity 400ms ease 120ms",
                }}
              >
                {/* Ambient Backlight Aura matching the emblem's warm gold & crimson hues */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: -16,
                    background: "radial-gradient(circle, rgba(217, 119, 6, 0.35) 0%, rgba(159, 18, 57, 0.2) 50%, transparent 75%)",
                    filter: "blur(22px)",
                    pointerEvents: "none",
                  }}
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/abps-logo.png"
                  alt="School Emblem Logo"
                  className="w-24 h-24 object-contain relative select-none block"
                  style={{
                    filter: "drop-shadow(0 4px 18px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 25px rgba(245, 158, 11, 0.28)) brightness(1.05)",
                  }}
                />
              </div>
            </div>

            {/* SVG Connecting Lines (From Profile to Bottom-Left & to Top-Right High School) */}
            <svg
              className="absolute -inset-60 w-[calc(100%+480px)] h-[calc(100%+480px)] pointer-events-none overflow-visible"
              viewBox="0 0 1000 1000"
              fill="none"
            >
              <defs>
                <linearGradient id="curvedLaserLeft" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="30%" stopColor="#c084fc" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="curvedLaserTopRight" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="30%" stopColor="#c084fc" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Bottom-Left path to Manipal */}
              <path
                d="M 290 490 L 100 490 Q 64 490 64 526 L 64 715 Q 64 745 34 745 L -10 745"
                stroke="url(#curvedLaserLeft)"
                strokeWidth="1.8"
                strokeDasharray="650"
                strokeDashoffset={activeFlank === "left" ? "0" : "650"}
                style={{
                  transition: "stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />

              {/* Stepped laser line matching user drawing: from building right edge, curving right, going up, then horizontal to High School */}
              <path
                d="M -110 220 Q -20 220 5 190 L 5 110 Q 5 88 28 88 L 935 88"
                stroke="url(#curvedLaserTopRight)"
                strokeWidth="1.8"
                strokeDasharray="1400"
                strokeDashoffset={activeFlank === "left" ? "0" : "1400"}
                style={{
                  transition: "stroke-dashoffset 650ms cubic-bezier(0.16, 1, 0.3, 1) 90ms",
                }}
              />

              {/* Origin node on profile */}
              <circle
                cx="290"
                cy="490"
                r="3.5"
                fill="#ffffff"
                style={{
                  opacity: activeFlank === "left" ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              />

              {/* Origin node on School Building right edge */}
              <circle
                cx="-110"
                cy="220"
                r="3"
                fill="#c084fc"
                style={{
                  opacity: activeFlank === "left" ? 1 : 0,
                  transition: "opacity 250ms ease 100ms",
                }}
              />

              {/* Target node at Manipal text anchor */}
              <circle
                cx="-10"
                cy="745"
                r="3"
                fill="#c084fc"
                style={{
                  opacity: activeFlank === "left" ? 1 : 0,
                  transition: "opacity 300ms ease 300ms",
                }}
              />

              {/* Target node at High School anchor */}
              <circle
                cx="935"
                cy="88"
                r="3"
                fill="#c084fc"
                style={{
                  opacity: activeFlank === "left" ? 1 : 0,
                  transition: "opacity 300ms ease 320ms",
                }}
              />
            </svg>
          </div>

          {/* ── Animated Right Connector Line & Top-Right Typography Callout (Experience) ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: showPaper && !paperExiting && activeFlank === "right" ? 1 : 0,
              transition: "opacity 350ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Top-Right Typography Callout (Shifted cleanly to the right) */}
            <div
              style={{
                position: "absolute",
                top: 40,
                left: 600,
                paddingLeft: 24,
                width: 380,
                textAlign: "left",
                transform: activeFlank === "right"
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(24px, -15px, 0)",
                transition: "transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease",
              }}
            >
              {/* Monospace subtle eyebrow */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] tracking-wider text-amber-400 font-semibold">
                  APR 2026 — PRESENT
                </span>
                <span className="text-zinc-600 text-[10px]">•</span>
                <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                  LEADERSHIP / R&D
                </span>
              </div>

              {/* Organization */}
              <h3 className="font-display text-3xl font-extrabold text-white tracking-tight leading-tight">
                Medinest
              </h3>

              {/* Role Title */}
              <p className="font-display text-base text-amber-200/90 font-semibold mt-1">
                Head of Research and Development
              </p>

              {/* Core areas / accomplishments */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-[12px] text-zinc-400 font-mono">
                <span>Medical AI</span>
                <span className="text-zinc-600">/</span>
                <span>Deep Learning</span>
                <span className="text-zinc-600">/</span>
                <span>R&D Strategy</span>
              </div>
            </div>

            {/* SVG Connecting Line with Smooth Rounded Corner (From Profile Right edge to Top-Right text) */}
            <svg
              className="absolute -inset-60 w-[calc(100%+480px)] h-[calc(100%+480px)] pointer-events-none overflow-visible"
              viewBox="0 0 1000 1000"
              fill="none"
            >
              <defs>
                <linearGradient id="curvedLaserRight" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/*
                Path originates from the right side of the photo (x: 480, y: 640 in container space):
                Travels right horizontally to x: 730
                Curves upward to x: 760, y: 610
                Travels up vertically to y: 316
                Curves cleanly rightwards towards the text to x: 790, y: 286
                Extends smoothly to the eyebrow anchor at x: 815, y: 286
              */}
              <path
                d="M 680 640 L 730 640 Q 760 640 760 610 L 760 316 Q 760 286 790 286 L 815 286"
                stroke="url(#curvedLaserRight)"
                strokeWidth="1.8"
                strokeDasharray="650"
                strokeDashoffset={activeFlank === "right" ? "0" : "650"}
                style={{
                  transition: "stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />

              {/* Origin node on profile right flank */}
              <circle
                cx="680"
                cy="640"
                r="3.5"
                fill="#ffffff"
                style={{
                  opacity: activeFlank === "right" ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              />

              {/* Target node at text anchor */}
              <circle
                cx="815"
                cy="286"
                r="3"
                fill="#fbbf24"
                style={{
                  opacity: activeFlank === "right" ? 1 : 0,
                  transition: "opacity 300ms ease 300ms",
                }}
              />
            </svg>
          </div>

          <div
            style={{
              filter: activeFlank ? "blur(14px) brightness(0.4)" : "blur(0px) brightness(1)",
              opacity: activeFlank ? 0.35 : 1,
              transform: activeFlank ? "scale(0.97)" : "scale(1)",
              transition: "filter 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms cubic-bezier(0.16, 1, 0.3, 1), transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <PaperCrumple
              ref={paperRef}
              src={PROFILE_IMAGE}
              alt="Himanshu Kushwaha"
              width={460}
              height={480}
              sceneHeight={520}
              releaseBehavior="stay"
              crumpleAmount={0.92}
              crumpleDuration={0.45}
              releaseDuration={0.4}
              foldCount={8}
              foldSharpness={0.65}
              wrinkleDepth={0.75}
              paperColor="#121214"
              paperTexture={0.015}
              roughness={0.95}
              lightIntensity={1.5}
              shadow={true}
              shadowOpacity={0.3}
              draggable={false}
              returnToOrigin={false}
            />
          </div>
        </div>
      )}

      {/* ── Sliding text block: moves down smoothly and blurs when either flank is hovered ── */}
      <div
        style={{
          filter: activeFlank
            ? "blur(18px)"
            : `blur(${blurPx}px)`,
          opacity: activeFlank ? 0.2 : Number(opacity),
          transform: `translate3d(0, calc(${scrollY}px + ${hoverY}px), 0) scale(${activeFlank ? 0.96 : Number(scale)})`,
          transition: hovered
            ? "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 450ms ease, opacity 450ms ease",
          willChange: "transform, filter, opacity",
          pointerEvents: "none",
          position: "relative",
          zIndex: 19,
        }}
        className="flex flex-col items-center justify-center text-center gap-6 p-2 sm:p-4 max-w-3xl mx-auto"
      >
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] text-center">
          <span ref={nameRef}>Himanshu Kushwaha</span>
          {"  "}
          {/* Subtitle: dissolves out on hover with blur & fade */}
          <span
            className="block text-purple-400 mt-2 transition-all duration-500 ease-out"
            style={{
              opacity: hovered ? 0 : 1,
              filter: hovered ? "blur(8px)" : "blur(0px)",
              transform: hovered ? "translate3d(0, 15px, 0) scale(0.95)" : "translate3d(0, 0, 0) scale(1)",
              maxHeight: hovered ? 0 : 80,
              overflow: "hidden",
            }}
          >
            AI Geek and builder
          </span>
        </h1>

        {/* Description: dissolves out on hover with blur & fade */}
        <p
          className="text-base sm:text-lg text-zinc-400 font-normal max-w-xl leading-relaxed text-center transition-all duration-500 ease-out"
          style={{
            opacity: hovered ? 0 : 1,
            filter: hovered ? "blur(8px)" : "blur(0px)",
            transform: hovered ? "translate3d(0, 20px, 0) scale(0.95)" : "translate3d(0, 0, 0) scale(1)",
            maxHeight: hovered ? 0 : 120,
            overflow: "hidden",
            marginTop: hovered ? 0 : undefined,
          }}
        >
          Building robust algorithmic systems, deep learning models, and
          high-performance software at the intersection of AI, physics, and
          design.
        </p>
      </div>
    </>
  );
}
