import { Brain, Activity, Cpu } from "lucide-react";
import { HIMANSHU_DATA } from "@/data/portfolio-data";
import { BackgroundReveal } from "@/components/BackgroundReveal";
import {
  MotionReveal,
  MotionStaggerContainer,
  MotionStaggerItem,
  MotionCardHover,
} from "@/components/ui/motion-reveal";
import { BottomPageNav } from "@/components/BottomPageNav";

// oxlint-disable-next-line react/only-export-components
export const metadata = { title: "About — Himanshu Kushwaha" };

export default function AboutPage() {
  return (
    <main className="relative flex flex-col items-center w-full min-h-screen px-4 sm:px-6 pt-24 pb-28 overflow-x-hidden">
      <BackgroundReveal />

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-10">
        <MotionReveal className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Core Focus & Research</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Neurotechnology, AI & Native Systems
          </h1>
          <p className="font-sans text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Synthesizing rigorous mathematical modeling, real-time biological signal capture, and hardware-accelerated desktop runtimes.
          </p>
        </MotionReveal>

        <MotionStaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Brain,
              color: "purple",
              title: "Brain-Computer Interfaces",
              desc: "Real-time EEG telemetry, spatial covariance filtering (CSP), and artifact rejection filters for motor imagery decoding.",
              badges: ["g.tec BCI Club", "Br41NI.IO Award"],
            },
            {
              icon: Activity,
              color: "blue",
              title: "Clinical AI & Transformers",
              desc: "Segmented CNNs and transformer-based architectures for clinical diagnostics with zero-drift evaluation pipelines.",
              badges: ["Medinest R&D", "PyTorch / DL"],
            },
            {
              icon: Cpu,
              color: "emerald",
              title: "High-Performance Systems",
              desc: "Native GPU-accelerated desktop runtimes in Rust (GPUI) and Electron 30 with sub-10ms UI latency and zero-latency audio.",
              badges: ["Rust & GPUI", "Electron 30"],
            },
          ].map(({ icon: Icon, color, title, desc, badges }) => {
            const iconColor =
              color === "purple"
                ? "text-purple-400"
                : color === "blue"
                ? "text-blue-400"
                : "text-emerald-400";

            return (
              <MotionStaggerItem key={title}>
                <MotionCardHover className="h-full rounded-2xl border border-zinc-800 bg-[#0d0d12] p-5 flex flex-col gap-4 justify-between hover:border-zinc-700 transition-colors">
                  <div className="flex flex-col gap-3">
                    <Icon className={`size-7 ${iconColor}`} strokeWidth={1.8} />
                    <h2 className="font-display text-base font-semibold text-white">{title}</h2>
                    <p className="font-sans text-xs text-zinc-400 leading-relaxed">{desc}</p>
                  </div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-2.5 border-t border-zinc-800/50">
                  {badges.map((b, i) => (
                    <div key={b} className="flex items-center gap-2">
                      {i > 0 && <span className="text-zinc-600 text-[10px] select-none">•</span>}
                      <span className="font-display font-medium text-[12px] text-zinc-300 tracking-tight">
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </MotionCardHover>
            </MotionStaggerItem>
          );
        })}
        </MotionStaggerContainer>

        {/* Background Statement */}
        <MotionReveal className="flex flex-col gap-4 pt-6 border-t border-zinc-800/60">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            Background &amp; Philosophy
          </span>
          <p className="font-display text-lg sm:text-2xl text-zinc-200 font-normal leading-[1.65] sm:leading-[1.6] tracking-[-0.01em]">
            {HIMANSHU_DATA.about}
          </p>
        </MotionReveal>

        <BottomPageNav />
      </div>
    </main>
  );
}
