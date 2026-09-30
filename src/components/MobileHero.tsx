"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Each element has its own scroll window so they leave at different
 * speeds — not uniform fade-everything. The eyebrow fires first,
 * the name lingers longest. Fully reversible: scroll back up and
 * every element returns to origin.
 *
 * Scroll range 0 → ~80% of viewport height drives all transforms.
 */
export function MobileHero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll relative to this section's top edge leaving the viewport
  const { scrollY } = useScroll();

  // Physical distance that drives animations: 0 → threshold px
  const RANGE = typeof window !== "undefined" ? window.innerHeight * 0.65 : 600;

  // ── Portrait: soft fade and float upward on scroll ───────────
  const portraitY  = useTransform(scrollY, [0, RANGE * 0.55], [0, -36]);
  const portraitOp = useTransform(scrollY, [0, RANGE * 0.42], [1, 0]);

  // Direct 1:1 touch response with zero spring lag
  const eyebrowY   = useTransform(scrollY, [0, RANGE * 0.45], [0, -28]);
  const eyebrowOp  = useTransform(scrollY, [0, RANGE * 0.35], [1, 0]);

  // ── "Himanshu" first line: leaves second, smooth drift ───────
  const line1Y     = useTransform(scrollY, [0, RANGE * 0.70], [0, -24]);
  const line1Op    = useTransform(scrollY, [RANGE * 0.08, RANGE * 0.65], [1, 0]);

  // ── "Kushwaha" second line: trails line1 with subtle stagger ──
  const line2Y     = useTransform(scrollY, [0, RANGE * 0.78], [0, -18]);
  const line2Op    = useTransform(scrollY, [RANGE * 0.15, RANGE * 0.72], [1, 0]);

  // ── Tagline: exits after the name, subtle natural drift ───────
  const taglineY   = useTransform(scrollY, [0, RANGE * 0.90], [0, -12]);
  const taglineX   = useTransform(scrollY, [0, RANGE * 0.90], [0, -6]);
  const taglineOp  = useTransform(scrollY, [RANGE * 0.25, RANGE * 0.82], [1, 0]);

  // ── Body copy: last to leave, soft settle ─────────────────────
  const bodyY      = useTransform(scrollY, [0, RANGE], [0, -8]);
  const bodyOp     = useTransform(scrollY, [RANGE * 0.35, RANGE], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col justify-end w-full min-h-screen px-5 pb-8 pt-20 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #09090b 0%, #0d0d11 100%)" }}
    >
      {/* ── Portrait in upper space (scaled +100px) ── */}
      <motion.div
        className="relative w-full max-w-[285px] xs:max-w-[310px] sm:max-w-[340px] aspect-square mx-auto mb-3 flex items-center justify-center shrink-0"
        style={{ y: portraitY, opacity: portraitOp }}
      >
        {/* Soft atmospheric backlight aura */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full blur-3xl opacity-30 pointer-events-none -z-10"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(99,102,241,0.25) 50%, transparent 75%)" }}
        />
        <Image
          src="/images/himanshu-mobile.webp"
          alt="Himanshu Kushwaha"
          width={340}
          height={340}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
        />
      </motion.div>
      {/* ── Eyebrow ──────────────────────────────────────────── */}
      <motion.p
        className="font-mono text-[11px] tracking-[0.22em] text-zinc-400 uppercase mb-5"
        style={{ y: eyebrowY, opacity: eyebrowOp }}
      >
        AI Engineer &amp; Builder
      </motion.p>

      {/* ── Name — each line animates independently ───────────── */}
      <h1
        className="font-display font-bold text-white leading-[1.0] tracking-tight mb-4 overflow-hidden"
        style={{ fontSize: "clamp(3rem, 15vw, 4.5rem)" }}
      >
        <motion.span
          className="block"
          style={{ y: line1Y, opacity: line1Op }}
        >
          Himanshu
        </motion.span>
        <motion.span
          className="block"
          style={{ y: line2Y, opacity: line2Op }}
        >
          Kushwaha
        </motion.span>
      </h1>

      {/* ── Tagline — drifts left and up ─────────────────────── */}
      <motion.p
        className="font-display text-white leading-[1.2] mb-4"
        style={{
          fontSize: "clamp(1.45rem, 6.5vw, 2rem)",
          fontWeight: 400,
          fontStyle: "italic",
          y: taglineY,
          x: taglineX,
          opacity: taglineOp,
        }}
      >
        Intelligence,
        <br />
        thoughtfully built.
      </motion.p>

      {/* ── Body copy — slowest, anchors the hero last ────────── */}
      <motion.p
        className="text-zinc-400 text-[15px] leading-relaxed max-w-xs"
        style={{ y: bodyY, opacity: bodyOp }}
      >
        I build intelligent systems and high-performance software at the
        intersection of AI, physics, and design.
      </motion.p>
    </section>
  );
}
