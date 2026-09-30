"use client";

import { useEffect } from "react";
import Snap from "lenis/snap";

/**
 * Activates mandatory full-page scroll snapping (one viewport at a time)
 * for sections that carry the data-snap attribute on the page.
 *
 * Drop this component anywhere inside a page that's already wrapped in
 * <SmoothScroll> (i.e. has window.__lenis available).
 *
 * Sections to snap: pass their heights as cumulative pixel offsets or
 * use addElement() to let lenis-snap detect them automatically.
 */
export function HomeSnapScroll({ sectionSelector = "[data-snap]" }: { sectionSelector?: string }) {
  useEffect(() => {
    // On touch mobile screens (< 640px), avoid JS scroll-snapping so touch momentum is 100% fluid
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return;
    }

    // Wait one frame for lenis to initialise via SmoothScroll
    const id = requestAnimationFrame(() => {
      const lenis = (window as unknown as { __lenis?: import("lenis").default }).__lenis;
      if (!lenis) return;

      const snap = new Snap(lenis, {
        type: "proximity",
        duration: 1.1,
        // Only snap when within 20% of a snap point — far enough away it won't
        // trigger while scrolling freely through Page 2's content.
        distanceThreshold: "20%",
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const allEls = Array.from(
        document.querySelectorAll<HTMLElement>(sectionSelector)
      );
      // Only snap to elements that are actually rendered and visible on the current viewport
      const els = allEls.filter((el) => {
        return el.offsetParent !== null || window.getComputedStyle(el).display !== "none";
      });

      if (els.length < 2) return;

      const removers = els.map((el) => snap.addElement(el));

      return () => {
        removers.forEach((rm) => rm());
        snap.destroy();
      };
    });

    return () => cancelAnimationFrame(id);
  }, [sectionSelector]);

  return null;
}
