"use client";

import { useEffect, useRef } from "react";
import { FallingRays } from "@/components/ui/FallingRays";

// Tune these:
const NAV_H        = 64;   // px — navbar height
const FEATHER      = 80;   // px — soft-edge width at the advancing/receding front
// FULL_AT_PX is computed dynamically from window.innerHeight inside the effect

export function BackgroundReveal() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let raf: number | null = null;
    const applyMask = () => {
      const scrollY = window.scrollY;
      const vh      = window.innerHeight;
      const FULL_AT_PX = vh;

      // How far the waterfall front has traveled below the navbar [0 → vh - NAV_H]
      const maxTravel = vh - NAV_H;
      const progress  = Math.min(1, Math.max(0, scrollY / FULL_AT_PX));
      // Ease-out for natural pour feel going down; linear reversal going up
      const eased     = 1 - Math.pow(1 - progress, 2.2);
      const revealH   = eased * maxTravel; // px below navbar that is revealed

      // Gradient stop positions (absolute from top of viewport)
      const solidTop  = NAV_H;
      const solidBot  = NAV_H + Math.max(0, revealH - FEATHER);
      const fadeBot   = NAV_H + revealH;

      let mask: string;

      if (progress >= 1) {
        // Reached lower edge: fully open mask from navbar to bottom
        mask = `linear-gradient(to bottom,
          transparent 0px,
          transparent ${solidTop}px,
          black        ${solidTop + 2}px,
          black        100%)`;
      } else if (revealH <= 0) {
        // Fully hidden
        mask = "linear-gradient(to bottom, transparent 0px, transparent 100%)";
      } else if (revealH < FEATHER) {
        // Only feather zone visible — tiny soft burst at top
        const alpha = (revealH / FEATHER).toFixed(3);
        mask = `linear-gradient(to bottom,
          transparent 0px,
          transparent ${solidTop}px,
          rgba(0,0,0,${alpha}) ${fadeBot}px,
          transparent ${fadeBot + 1}px)`;
      } else {
        // Normal: solid slab + feathered front
        mask = `linear-gradient(to bottom,
          transparent 0px,
          transparent ${solidTop}px,
          black        ${solidTop + 2}px,
          black        ${solidBot}px,
          transparent  ${fadeBot}px)`;
      }

      el.style.maskImage                                                     = mask;
      (el.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = mask;
      raf = null;
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(applyMask);
    };

    applyMask(); // initial: hidden
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", applyMask,  { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", applyMask);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="hidden md:block fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ maskImage: "linear-gradient(to bottom, transparent 0%, transparent 100%)" }}
    >
      <FallingRays
        color1="#000000"
        color2="#E879F9"
        rayCount={8}
        rayWidth={0.0010}
        pulseSpeed={0.08}
        pulseWidth={0.005}
        trailLength={0.25}
        motionBlur={0.15}
        bgGlow={0.00}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/30 to-[#09090b] pointer-events-none" />
    </div>
  );
}
