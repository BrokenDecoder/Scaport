"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import { ChevronUp, ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";
import { getAdjacentRoutes } from "@/lib/routes";

/**
 * Android-style bottom gesture navigation bar.
 *
 * Sits pinned at the bottom-center of the screen.
 * - Shows when scrolling and particularly when reaching the bottom of the page.
 * - Swipe UP   → Navigates to next section (if on Hero) or next page.
 * - Swipe DOWN → Navigates to previous section or previous page.
 * - Tap        → Advances to next section/page or reveals quick nav.
 */
export function SwipeNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const { prev, next } = getAdjacentRoutes(pathname);

  const [isDragging, setIsDragging] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [dragDirection, setDragDirection] = useState<"up" | "down" | null>(null);

  const dragY = useMotionValue(0);

  // Dynamic pill styling based on drag distance
  const pillWidth = useTransform(dragY, [-80, 0, 80], [144, 112, 92]);
  const pillOpacity = useTransform(dragY, [-80, 0, 80], [1, 0.5, 0.4]);

  // Track if user has reached near bottom of the page
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;

          // Within 120px of the bottom
          const reached = scrollY + windowHeight >= docHeight - 120;
          setIsAtBottom(reached);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Listen to drag changes to update preview hint
  useEffect(() => {
    const unsubscribe = dragY.on("change", (latest) => {
      if (latest < -15) {
        setDragDirection("up");
      } else if (latest > 15) {
        setDragDirection("down");
      } else {
        setDragDirection(null);
      }
    });

    return () => unsubscribe();
  }, [dragY]);

  const scrollToElement = (target: HTMLElement | number) => {
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (t: HTMLElement | number, o?: object) => void };
      }
    ).__lenis;

    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } }
  ) => {
    const THRESHOLD = 36;
    const offset = info.offset.y;

    if (offset < -THRESHOLD) {
      // SWIPE UP
      if (pathname === "/") {
        const page2 = document.getElementById("page-2");
        const scrollZone = document.getElementById("hero-scroll-zone");
        const currentY = window.scrollY;

        // If at the top/hero and page2 is below us, scroll to page2
        if (page2 && currentY < (scrollZone?.offsetTop ?? 400) + 100) {
          scrollToElement(page2);
        } else if (next) {
          router.push(next.path);
        }
      } else if (next) {
        router.push(next.path);
      }
    } else if (offset > THRESHOLD) {
      // SWIPE DOWN
      if (pathname === "/") {
        const currentY = window.scrollY;
        if (currentY > 200) {
          scrollToElement(0);
        }
      } else if (prev) {
        router.push(prev.path);
      }
    }

    // Spring back to origin
    animate(dragY, 0, { type: "spring", stiffness: 380, damping: 28 });
    setIsDragging(false);
    setDragDirection(null);
  };

  const handleTap = () => {
    // When tapped, if at bottom of page, advance to next page
    if (pathname === "/") {
      const page2 = document.getElementById("page-2");
      const currentY = window.scrollY;
      if (currentY < 400 && page2) {
        scrollToElement(page2);
        return;
      }
    }

    if (next) {
      router.push(next.path);
    } else if (prev) {
      router.push(prev.path);
    }
  };

  return (
    <aside
      aria-label="Android Gesture Navigation"
      className="fixed bottom-2.5 sm:bottom-3.5 inset-x-0 z-50 flex flex-col items-center pointer-events-none select-none sm:hidden"
    >
      {/* Floating Drag Hint Pill */}
      <AnimatePresence>
        {(isDragging && dragDirection) || (isAtBottom && !isDragging) ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/15 backdrop-blur-md shadow-2xl flex items-center gap-1.5 text-xs text-zinc-200 pointer-events-none"
          >
            {dragDirection === "up" ? (
              <>
                <ChevronUp className="size-3.5 text-indigo-400 animate-pulse" />
                <span className="font-mono text-[11px] text-zinc-300">
                  {next ? `Next: ${next.name}` : "End of portfolio"}
                </span>
                <ArrowRight className="size-3 text-indigo-400" />
              </>
            ) : dragDirection === "down" ? (
              <>
                <ChevronDown className="size-3.5 text-amber-400 animate-pulse" />
                <span className="font-mono text-[11px] text-zinc-300">
                  {pathname === "/" ? "Top: Hero" : prev ? `Back: ${prev.name}` : "Beginning"}
                </span>
                <ArrowLeft className="size-3 text-amber-400" />
              </>
            ) : (
              // Reached bottom idle indicator
              <>
                <ChevronUp className="size-3.5 text-indigo-400 animate-bounce" />
                <span className="font-mono text-[11px] text-zinc-300">
                  {next ? `Swipe up for ${next.name}` : "Swipe up to return"}
                </span>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Android Gesture Bar */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -75, bottom: 65 }}
        dragElastic={0.22}
        dragSnapToOrigin={false}
        style={{ y: dragY }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        role="button"
        tabIndex={0}
        aria-label="Gesture navigation bar: swipe up for next page, swipe down for previous"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleTap();
          }
        }}
        className="pointer-events-auto cursor-grab active:cursor-grabbing px-8 py-3 flex items-center justify-center focus:outline-none"
      >
        <motion.div
          style={{
            width: pillWidth,
            opacity: pillOpacity,
          }}
          animate={{
            backgroundColor: isDragging
              ? "rgba(255, 255, 255, 0.92)"
              : isAtBottom
              ? "rgba(255, 255, 255, 0.72)"
              : "rgba(255, 255, 255, 0.42)",
            boxShadow: isAtBottom
              ? "0 0 14px rgba(168, 85, 247, 0.35), 0 2px 8px rgba(0,0,0,0.6)"
              : "0 1px 6px rgba(0, 0, 0, 0.5)",
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="h-[4.5px] rounded-full"
        />
      </motion.div>
    </aside>
  );
}
