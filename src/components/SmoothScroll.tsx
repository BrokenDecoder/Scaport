"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const handleStop = () => lenis.stop();
    const handleStart = () => lenis.start();

    window.addEventListener("lenis:stop", handleStop);
    window.addEventListener("lenis:start", handleStart);

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    animId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("lenis:stop", handleStop);
      window.removeEventListener("lenis:start", handleStart);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
