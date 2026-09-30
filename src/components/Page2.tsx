"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { BottomPageNav } from "@/components/BottomPageNav";

// ── Tech stack showcase — "Built with intention."

const SECTIONS = [
  {
    label: "Full-stack development",
    index: "01",
    featured: {
      eyebrow: "THE INTERFACE",
      name: "React",
      icon: "/icons/react.svg",
      desc: "Thoughtful interfaces.\nSeamless experiences.",
      tags: [
        { icon: "/icons/js.svg", name: "JavaScript" },
        { icon: "/icons/nodejs.svg", name: "Node.js" },
      ],
    },
    row: [
      { icon: "/icons/nodejs.svg", name: "Node.js", sub: "SERVER" },
      { icon: "/icons/python.svg", name: "Python", sub: "BACKEND" },
    ],
  },
  {
    label: "Frontend toolchain",
    index: "02",
    twins: [
      { icon: "/icons/angular.svg", name: "Angular", desc: "Structure.\nAt scale.", sub: "FRAMEWORK" },
      { icon: "/icons/vue.svg",     name: "Vue",     desc: "Reactive.\nElegant.",   sub: "FRAMEWORK" },
      { icon: "/icons/redux.svg",   name: "Redux",   desc: "Predictable.\nGlobal state.", sub: "STATE" },
      { icon: "/icons/css3.svg",    name: "CSS 3",   desc: "Pixel-perfect.\nEvery time.",  sub: "STYLING" },
    ],
  },
  {
    label: "The everyday essentials",
    index: "03",
    tools: [
      { icon: "/icons/git.svg",          name: "Git" },
      { icon: "/icons/vscode.svg",       name: "VS Code" },
      { icon: "/icons/after-effects.svg",name: "After Effects" },
      { icon: "/icons/android.svg",      name: "Android" },
      { icon: "/icons/atom.svg",         name: "Atom" },
      { icon: "/icons/ruby.svg",         name: "Ruby" },
      { icon: "/icons/php.svg",          name: "PHP" },
      { icon: "/icons/react-alt.svg",    name: "React Native" },
    ],
  },
];

export function Page2() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll as this section enters the viewport from the bottom
  // Progress 0 → 1: section bottom aligns with viewport bottom → section top at viewport top
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // Direct 1:1 touch response with zero spring lag
  const headY  = useTransform(scrollYProgress, [0, 0.45], [24, 0]);
  const headOp = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  // ── Sub-copy under heading — trails the headline ───────────
  const subY   = useTransform(scrollYProgress, [0.05, 0.45], [20, 0]);
  const subOp  = useTransform(scrollYProgress, [0.05, 0.38], [0, 1]);

  // ── Section 01 label — arrives after heading settles ───────
  const s1LabelY  = useTransform(scrollYProgress, [0.10, 0.48], [18, 0]);
  const s1LabelOp = useTransform(scrollYProgress, [0.10, 0.42], [0, 1]);

  // ── React card — slides up after the section label ─────────
  const cardY  = useTransform(scrollYProgress, [0.15, 0.55], [20, 0]);
  const cardOp = useTransform(scrollYProgress, [0.15, 0.48], [0, 1]);

  // ── Node/Python row — last piece of section 01 ─────────────
  const rowY   = useTransform(scrollYProgress, [0.22, 0.62], [16, 0]);
  const rowOp  = useTransform(scrollYProgress, [0.22, 0.54], [0, 1]);

  // ── Section 02 — enters as section 01 finishes ─────────────
  const s2Y    = useTransform(scrollYProgress, [0.30, 0.70], [18, 0]);
  const s2Op   = useTransform(scrollYProgress, [0.30, 0.62], [0, 1]);

  // ── Section 03 — last block, lingers at bottom ─────────────
  const s3Y    = useTransform(scrollYProgress, [0.40, 0.80], [16, 0]);
  const s3Op   = useTransform(scrollYProgress, [0.40, 0.72], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="page-2"
      className="relative w-full min-h-screen block sm:hidden"
      style={{ background: "#09090b" }}
    >
      <div className="w-full max-w-sm mx-auto px-5 py-14 flex flex-col gap-10 sm:max-w-2xl sm:px-8 md:max-w-4xl md:px-10">

        {/* ── Heading ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <motion.h2
            className="font-display font-bold text-white leading-[1.0] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 12vw, 4.5rem)", y: headY, opacity: headOp }}
          >
            Built with
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa 0%, #818cf8 60%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              intention.
            </span>
          </motion.h2>

          <motion.p
            className="text-zinc-400 text-[15px] leading-snug max-w-xs mt-1"
            style={{ y: subY, opacity: subOp }}
          >
            From the interface to the engine.
            <br />
            The tools behind what I build.
          </motion.p>
        </div>

        {/* ── Section 01 — Full-stack ─────────────────────────── */}
        <div className="flex flex-col gap-3">
          <motion.div style={{ y: s1LabelY, opacity: s1LabelOp }}>
            <SectionLabel label={SECTIONS[0].label} index={SECTIONS[0].index} />
          </motion.div>

          {/* Featured React card */}
          {SECTIONS[0].featured && (
            <motion.div
              className="rounded-2xl p-5 flex items-start justify-between gap-4"
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.07)",
                y: cardY,
                opacity: cardOp,
              }}
            >
              <div className="flex flex-col gap-3 flex-1">
                <span className="font-mono text-[10px] tracking-[0.18em] text-indigo-400 uppercase">
                  {SECTIONS[0].featured.eyebrow}
                </span>
                <h3 className="font-display font-bold text-white text-3xl leading-none">
                  {SECTIONS[0].featured.name}
                </h3>
                <p className="text-zinc-400 text-[13px] leading-snug whitespace-pre-line">
                  {SECTIONS[0].featured.desc}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SECTIONS[0].featured.icon}
                alt={SECTIONS[0].featured.name}
                className="w-20 h-20 object-contain flex-shrink-0 opacity-90"
              />
            </motion.div>
          )}

          {/* ── Triangle dependency layout: Node.js ← TS → Python ── */}
          <motion.div
            className="relative pt-4"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              y: rowY,
              opacity: rowOp,
            }}
          >
            {/* Top row: Node.js left | Python right */}
            <div className="flex items-start justify-between px-1">
              {/* Node.js */}
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/nodejs.svg" alt="Node.js" className="w-7 h-7 object-contain" />
                <div>
                  <p className="font-display font-semibold text-white text-[15px] leading-none">Node.js</p>
                  <p className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase mt-0.5">SERVER</p>
                </div>
              </div>

              {/* Python */}
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/python.svg" alt="Python" className="w-7 h-7 object-contain" />
                <div>
                  <p className="font-display font-semibold text-white text-[15px] leading-none">Python</p>
                  <p className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase mt-0.5">BACKEND</p>
                </div>
              </div>
            </div>



            {/* TypeScript — centred below */}
            <div className="flex flex-col items-center mt-4 pb-1">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/typescript.png"
                  alt="TypeScript"
                  className="w-8 h-8 object-contain"
                />
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{ boxShadow: "0 0 18px rgba(49,120,198,0.45)" }}
                />
              </div>
              <p className="font-display font-semibold text-white text-[14px] leading-none mt-2">TypeScript</p>
              <p className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase mt-0.5">LANGUAGE</p>
            </div>
          </motion.div>
        </div>

        {/* ── Section 02 — Frontend toolchain ─────────────────── */}
        <motion.div className="flex flex-col" style={{ y: s2Y, opacity: s2Op }}>
          <SectionLabel label={SECTIONS[1].label} index={SECTIONS[1].index} />
          {/* Editorial list — no cards, hairline dividers */}
          <div className="flex flex-col mt-3">
            {SECTIONS[1].twins?.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain flex-shrink-0" />
                  <div>
                    <span className="font-display font-semibold text-white text-[17px] leading-none">
                      {item.name}
                    </span>
                    <p className="text-zinc-500 text-[12px] leading-snug mt-0.5 whitespace-pre-line">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[9px] tracking-[0.18em] text-zinc-600 uppercase ml-4 flex-shrink-0">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Section 03 — Everyday essentials ────────────────── */}
        <motion.div className="flex flex-col gap-3 pb-6" style={{ y: s3Y, opacity: s3Op }}>
          <SectionLabel label={SECTIONS[2].label} index={SECTIONS[2].index} />
          <div className="flex flex-wrap items-center gap-5">
            {SECTIONS[2].tools?.map((tool) => (
              <div key={tool.name} className="flex flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tool.icon} alt={tool.name} className="w-9 h-9 object-contain" />
                <span className="font-mono text-[10px] text-zinc-500">{tool.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom Page Navigator ──────────────────────────── */}
        <BottomPageNav />

      </div>
    </section>
  );
}

function SectionLabel({ label, index }: { label: string; index: string }) {
  return (
    <div
      className="flex items-end justify-between pb-1"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.09)" }}
    >
      <span className="font-display font-semibold text-white text-[13px] tracking-wide uppercase">
        {label}
      </span>
      <span
        className="font-display font-bold leading-none"
        style={{
          fontSize: "clamp(1.6rem, 6vw, 2.4rem)",
          color: "rgba(255,255,255,0.08)",
          letterSpacing: "-0.02em",
        }}
      >
        {index}
      </span>
    </div>
  );
}
