"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

type FlipWordsProps = {
  words: string[];
  className?: string;
  interval?: number;
};

export function FlipWords({ words, className, interval = 2500 }: FlipWordsProps) {
  const [index, setIndex] = useState(0);
  const mounted = useMounted();

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [interval, words.length]);

  const word = words[index] ?? words[0] ?? "";

  return (
    <span className="relative inline-flex max-w-full overflow-hidden align-baseline" suppressHydrationWarning>
      <span aria-hidden className={cn("invisible select-none inline-block", className)}>
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      {mounted ? (
        <AnimatePresence mode="wait">
          <motion.span
            key={word}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cn("absolute inset-0 inline-block whitespace-nowrap", className)}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className={cn("absolute inset-0 inline-block whitespace-nowrap", className)}>
          {words[0]}
        </span>
      )}
    </span>
  );
}
