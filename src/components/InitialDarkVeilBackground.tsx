"use client";

import { useEffect, useRef } from "react";
import DarkVeil from "@/components/ui/DarkVeil";

/**
 * Initial homepage background using <DarkVeil /> from React Bits.
 *
 * Requirements:
 * - Sits at the upper edge initially behind hero content.
 * - When the user scrolls, it scrolls smoothly down toward the lower edge
 *   with forward and reverse scroll responses, ensuring it gracefully
 *   clears/travels down so the scroll background (waterfall / rays / cards)
 *   won't get affected or collided with.
 */
export function InitialDarkVeilBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight || 800;

        // Progress over the first viewport scroll: 0 (at top) -> 1 (scrolled 1 screen)
        const progress = Math.min(1, Math.max(0, scrollY / (vh * 0.85)));

        // Smooth cubic easing for fluid forward & reverse scroll motion
        const eased = Math.min(1, Math.max(0, progress * progress * (3 - 2 * progress)));

        // Translates from 0px (top edge) down to +100vh (lower edge)
        const translateY = eased * (vh * 0.9);

        // Gently fades out and scales as it reaches the lower edge
        const opacity = Math.max(0, 1 - Math.pow(progress, 1.4));
        const scale = 1 + eased * 0.08;

        el.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        el.style.opacity = `${opacity}`;

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

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
      style={{
        transform: "translate3d(0, 0px, 0)",
        opacity: 1,
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      {/* DarkVeil WebGL canvas */}
      <DarkVeil
        hueShift={280}
        noiseIntensity={0.03}
        scanlineIntensity={0.08}
        speed={0.4}
        scanlineFrequency={0.05}
        warpAmount={0.08}
        resolutionScale={1}
      />

      {/* Atmospheric vignette & gradient wash so it melts smoothly into the deep dark background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#09090b] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#09090b_95%)] pointer-events-none" />
    </div>
  );
}
