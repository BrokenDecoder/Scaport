"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TechText } from "@/components/ui/TechText";

interface RayTechItem {
  id: number;
  name: string;
  svgPath?: string;
  color: string;       // accent colour for the card
  category: string;    // e.g. "Frontend", "Runtime"
  since: string;       // year user started using it
  desc: string;        // one-liner
}

const RAY_TECHS: RayTechItem[] = [
  {
    id: 1,
    name: "React",
    svgPath: "/icons/tech/react-svgrepo-com.svg",
    color: "#61DAFB",
    category: "UI Library",
    since: "2021",
    desc: "Component-driven UIs with declarative state",
  },
  {
    id: 2,
    name: "JavaScript",
    svgPath: "/icons/tech/js-svgrepo-com.svg",
    color: "#F7DF1E",
    category: "Language",
    since: "2020",
    desc: "The lingua franca of the modern web",
  },
  {
    id: 3,
    name: "Node.js",
    svgPath: "/icons/tech/node-js-svgrepo-com.svg",
    color: "#8CC84B",
    category: "Runtime",
    since: "2021",
    desc: "Server-side JS with event-driven I/O",
  },
  {
    id: 4,
    name: "Python",
    svgPath: "/icons/tech/python-svgrepo-com.svg",
    color: "#3776AB",
    category: "Language",
    since: "2020",
    desc: "Backbone of ML pipelines and data work",
  },
  {
    id: 5,
    name: "Git",
    svgPath: "/icons/tech/git-svgrepo-com.svg",
    color: "#F05032",
    category: "VCS",
    since: "2020",
    desc: "Version control powering every project",
  },
  {
    id: 6,
    name: "CSS3",
    svgPath: "/icons/tech/css-3-svgrepo-com.svg",
    color: "#1572B6",
    category: "Styling",
    since: "2020",
    desc: "Layouts, animations, and visual craft",
  },
  {
    id: 7,
    name: "VS Code",
    svgPath: "/icons/tech/vs-code-svgrepo-com.svg",
    color: "#007ACC",
    category: "Editor",
    since: "2020",
    desc: "Primary IDE — fast, extensible, sharp",
  },
  {
    id: 8,
    name: "Redux",
    svgPath: "/icons/tech/redux-svgrepo-com.svg",
    color: "#764ABC",
    category: "State Mgmt",
    since: "2022",
    desc: "Predictable global state for large apps",
  },
];

// Exact flare geometry matching FallingRays shader at t = 1.0
const BOTTOM_FLOW_WIDTH = 0.96;


interface TechShowcaseItem {
  letter: string;
  name: string;
  svgPath: string;
  color: string;
  tagline: string;
}

const TECH_SHOWCASE_MAP: Record<number, TechShowcaseItem> = {
  0: {
    letter: "T",
    name: "TypeScript",
    svgPath: "/icons/tech/typescript.svg",
    color: "#3178C6",
    tagline: "Strict type-safe systems & robust software architecture",
  },
  1: {
    letter: "E",
    name: "Electron",
    svgPath: "/icons/tech/electron.svg",
    color: "#47848F",
    tagline: "Luniq Music — High-fidelity desktop audio player (100+ stars)",
  },
  2: {
    letter: "C",
    name: "C Language",
    svgPath: "/icons/tech/c.svg",
    color: "#00599C",
    tagline: "Low-level systems programming, algorithms & raw performance",
  },
  3: {
    letter: "H",
    name: "HTML5",
    svgPath: "/icons/tech/html5.svg",
    color: "#E34F26",
    tagline: "Semantic web architectures, Canvas 2D & WebGL pipelines",
  },
  4: {
    letter: "S",
    name: "Svelte",
    svgPath: "/icons/tech/svelte.svg",
    color: "#FF3E00",
    tagline: "Reactive compiler-driven web UI & zero-runtime applications",
  },
  5: {
    letter: "T",
    name: "Tailwind CSS",
    svgPath: "/icons/tech/tailwind.svg",
    color: "#38BDF8",
    tagline: "Design system tokens, fluid layouts & responsive aesthetics",
  },
  6: {
    letter: "A",
    name: "Astro",
    svgPath: "/icons/tech/astro.svg",
    color: "#BC52EE",
    tagline: "Ultra-fast content-driven static & server-rendered web systems",
  },
  7: {
    letter: "C",
    name: "CUDA",
    svgPath: "/icons/tech/cuda.svg",
    color: "#76B900",
    tagline: "Massively parallel GPU computing for neural signal & ML pipelines",
  },
  8: {
    letter: "K",
    name: "Kotlin",
    svgPath: "/icons/tech/kotlin.svg",
    color: "#7F52FF",
    tagline: "Modern expressive multiplatform systems & Android development",
  },
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export function RayTechBadges() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeShowcase = hoveredIndex !== null ? TECH_SHOWCASE_MAP[hoveredIndex] : null;

  // Lock scroll while a letter is hovered; unlock on unhover
  useEffect(() => {
    if (activeShowcase) {
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new Event("lenis:stop"));
      return () => {
        document.body.style.overflow = "";
        window.dispatchEvent(new Event("lenis:start"));
      };
    }
  }, [activeShowcase]);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const vh = window.innerHeight || 800;
        const p = Math.min(1, Math.max(0, window.scrollY / vh));
        setScrollProgress(p);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const rayCount = RAY_TECHS.length;

  const textArrival = 0.70;
  const textFull = 0.88;
  const textProgress = Math.min(1, Math.max(0, (scrollProgress - textArrival) / (textFull - textArrival)));
  const textEase = 1 - Math.pow(1 - textProgress, 3);
  const textOpacity = Math.min(1, textEase * 1.4);
  const textTranslateY = (1 - textEase) * 20;
  const textScale = 0.94 + 0.06 * textEase;

  return (
    <>
      {/* ── Dynamic Letter Hover Backdrop Blur & Tech Showcase (Locked Scroll, No Pills) ── */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-300 pointer-events-none flex flex-col items-center justify-center ${
          activeShowcase
            ? "opacity-100 backdrop-blur-md bg-black/35"
            : "opacity-0 backdrop-blur-none bg-transparent"
        }`}
        aria-hidden={!activeShowcase}
      >
        {activeShowcase && (
          <div
            key={activeShowcase.name}
            className="relative flex flex-col items-center justify-center gap-5 animate-in fade-in zoom-in-95 duration-200 -translate-y-12 sm:-translate-y-16"
          >
            {/* Ambient radial glow matching tech accent color */}
            <div
              className="absolute size-72 rounded-full blur-3xl pointer-events-none opacity-30 -z-10 transition-colors duration-300"
              style={{ background: activeShowcase.color }}
            />

            {/* Scaled Tech SVG in the middle — clean showcase, no pills */}
            <div className="relative size-32 sm:size-40 md:size-44 flex items-center justify-center transition-transform duration-300 transform scale-100">
              <Image
                src={activeShowcase.svgPath}
                alt={activeShowcase.name}
                width={160}
                height={160}
                priority
                className="size-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Hovered Letter & Tech Name */}
            <div className="flex flex-col items-center gap-1.5 text-center px-4 max-w-lg">
              <span className="font-mono text-xs tracking-[0.25em] text-sky-400 font-semibold uppercase">
                [{activeShowcase.letter}] &bull; {activeShowcase.name}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {activeShowcase.name}
              </h3>
              <p className="font-sans text-sm sm:text-base text-zinc-300 font-medium leading-relaxed mt-0.5">
                {activeShowcase.tagline}
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className="hidden sm:block fixed inset-0 z-40 pointer-events-none overflow-hidden"
      >
        {/* ── Interactive Techstack wordmark positioned just above the logos ── */}
        <div
          className="absolute left-1/2 w-full max-w-4xl h-[170px] sm:h-[200px] flex items-center justify-center pointer-events-auto z-40"
          style={{
            bottom: "80px",
            opacity: textOpacity,
            transform: `translate3d(-50%, ${textTranslateY}px, 0) scale(${textScale})`,
            pointerEvents: textOpacity > 0.05 ? "auto" : "none",
          }}
        >
          <TechText
            text="Techstack"
            fontFamily='"Bricolage Grotesque", system-ui, sans-serif'
            fontWeight={700}
            fontSize={140}
            letterSpacing={0.06}
            color="#ffffff"
            accentColor="#38bdf8"
            reveal="letter"
            reach={200}
            dashLength={4}
            dashGap={2}
            strokeWidth={1.5}
            lineStyle="dashed"
            specks={16}
            selection={true}
            labels={true}
            draggable={true}
            sweep={true}
            speed={0.8}
            onHoverLetter={(info) => {
              setHoveredIndex(info ? info.index : null);
            }}
          />
        </div>
      {RAY_TECHS.map((tech, index) => {
        const rayIdx = index / (rayCount - 1);
        const H = rayIdx - 0.5;
        const centerXFraction = 0.5 + H * BOTTOM_FLOW_WIDTH;
        const leftPercent = (centerXFraction * 100).toFixed(4);

        const arrivalScroll = 0.72 + Math.abs(H) * 0.16;
        const fullScaleScroll = Math.min(1.0, arrivalScroll + 0.14);
        const keyframeProgress = Math.min(
          1,
          Math.max(0, (scrollProgress - arrivalScroll) / (fullScaleScroll - arrivalScroll || 0.01))
        );

        const ease = 1 - Math.pow(1 - keyframeProgress, 3);
        const scale = ease;
        const opacity = Math.min(1, ease * 1.4);
        const translateY = (1 - ease) * 24;

        return (
          <div
            key={tech.id}
            className="absolute bottom-6 flex items-center justify-center transition-opacity duration-200"
            style={{
              left: `${leftPercent}%`,
              transform: `translate3d(-50%, ${translateY}px, 0) scale(${scale})`,
              opacity: activeShowcase ? 0 : opacity,
              pointerEvents: activeShowcase ? "none" : "auto",
              willChange: "transform, opacity",
            }}
          >
            {tech.svgPath ? (
              <div className="relative size-12 sm:size-14 flex items-center justify-center hover:scale-115 transition-transform duration-200 cursor-pointer">
                <Image
                  src={tech.svgPath}
                  alt={tech.name}
                  width={52}
                  height={52}
                  className="object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.95)]"
                />
              </div>
            ) : (
              <span className="font-mono text-base font-bold text-zinc-300">
                {tech.id}
              </span>
            )}
          </div>
        );
      })}
    </div>
    </>
  );
}
