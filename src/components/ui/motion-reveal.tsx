"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";
import { GlareOverlay } from "./GlareHover";

// Ultra-smooth cubic bezier curve (quint-decelerate)
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

interface MotionRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function MotionReveal({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 18,
  className = "",
  ...props
}: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration,
        delay,
        ease: SMOOTH_EASE,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerContainer({
  children,
  staggerDelay = 0.07,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { children: ReactNode; staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.55,
            ease: SMOOTH_EASE,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionCardHover({
  children,
  className = "",
  enableGlare = true,
  ...props
}: HTMLMotionProps<"div"> & { children: ReactNode; enableGlare?: boolean }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 380, damping: 25 },
      }}
      whileTap={{
        scale: 0.985,
        transition: { type: "spring", stiffness: 450, damping: 30 },
      }}
      data-glare=""
      className={`motion-card-hover group relative ${className}`}
      {...props}
    >
      {enableGlare && <GlareOverlay />}
      {children}
    </motion.div>
  );
}

