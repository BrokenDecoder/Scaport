"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "drawing" | "scaling" | "welcoming" | "exiting" | "done";

export function PageLoader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("drawing");
  const [welcomingComplete, setWelcomingComplete] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem("page_intro_seen"));
    } catch {
      // storage unavailable
    }
    if (seen) return;

    setMounted(true);

    // Hard fallback: loader must unconditionally dismiss within 1.8s
    const hardTimer = setTimeout(() => {
      setPhase("exiting");
      setTimeout(() => {
        try {
          sessionStorage.setItem("page_intro_seen", "1");
        } catch {
          // ignore
        }
        setPhase("done");
      }, 400);
    }, 1800);

    return () => clearTimeout(hardTimer);
  }, []);

  // Normal progression: dismiss once welcoming text finishes
  useEffect(() => {
    if (welcomingComplete && phase === "welcoming") {
      const t = setTimeout(() => setPhase("exiting"), 250);
      return () => clearTimeout(t);
    }
  }, [welcomingComplete, phase]);

  if (!mounted || phase === "done") return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        try {
          sessionStorage.setItem("page_intro_seen", "1");
        } catch {
          // ignore
        }
        setPhase("done");
      }}
    >
      {phase !== "exiting" && (
        <motion.div
          key="loader-overlay"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090b]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Logo SVG */}
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
            animate={
              phase === "drawing"
                ? { width: 48, height: 48, opacity: 1 }
                : { width: 96, height: 96, opacity: 1 }
            }
            initial={{ width: 48, height: 48, opacity: 0 }}
            transition={
              phase === "scaling"
                ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                : { duration: 0.25, ease: "easeOut" }
            }
            onAnimationComplete={() => {
              if (phase === "scaling") setPhase("welcoming");
            }}
          >
            {/* Nucleus */}
            <motion.circle
              cx="12"
              cy="12"
              r="1.8"
              fill="currentColor"
              stroke="none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.2, ease: "easeOut" }}
            />

            {/* Orbit 1 — 0° */}
            <motion.ellipse
              cx="12"
              cy="12"
              rx="8.5"
              ry="3.2"
              stroke="currentColor"
              strokeWidth="1.8"
              transform="rotate(0 12 12)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Orbit 2 — 60° */}
            <motion.ellipse
              cx="12"
              cy="12"
              rx="8.5"
              ry="3.2"
              stroke="currentColor"
              strokeWidth="1.8"
              transform="rotate(60 12 12)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Orbit 3 — 120° — triggers scale phase */}
            <motion.ellipse
              cx="12"
              cy="12"
              rx="8.5"
              ry="3.2"
              stroke="currentColor"
              strokeWidth="1.8"
              transform="rotate(120 12 12)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onAnimationComplete={() => {
                if (phase === "drawing") setPhase("scaling");
              }}
            />
          </motion.svg>

          {/* "Welcome" — appears after scale */}
          <AnimatePresence>
            {phase === "welcoming" && (
              <motion.p
                key="welcome-text"
                className="mt-6 font-mono text-xs tracking-[0.3em] uppercase text-zinc-400"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onAnimationComplete={() => {
                  setWelcomingComplete(true);
                }}
              >
                Welcome
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
