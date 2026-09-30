"use client";

import { useEffect, useState } from "react";
import { BackgroundReveal } from "@/components/BackgroundReveal";
import { RayTechBadges } from "@/components/RayTechBadges";
import { HeroScrollText } from "@/components/HeroScrollText";

export function DesktopHero() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // On phone screens (< 640px), unmount heavy desktop WebGL, 3D Canvas, and listeners
  if (!isDesktop) {
    return null;
  }

  return (
    <div className="hidden sm:block w-full">
      <BackgroundReveal />
      <RayTechBadges />

      {/* Snap section 1 — hero (200vh so the sticky scroll reveal plays out,
          then snaps to the next section once past) */}
      <section
        data-snap
        id="hero-scroll-zone"
        className="relative w-full"
        style={{ height: "200vh" }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center px-4 sm:px-6">
          <div className="relative z-10 w-full max-w-4xl mx-auto">
            <section id="home" className="flex flex-col items-center justify-center text-center">
              <HeroScrollText />
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
