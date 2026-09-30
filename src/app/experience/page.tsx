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
export const metadata = { title: "Experience — Himanshu Kushwaha" };

export default function ExperiencePage() {
  return (
    <main className="relative flex flex-col items-center w-full min-h-screen px-4 sm:px-6 pt-24 pb-28 overflow-x-hidden">
      <BackgroundReveal />

      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl flex flex-col gap-8 lg:pl-36 xl:pl-44">
        <MotionReveal className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Leadership & Track Record</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Work & Research History
          </h1>
        </MotionReveal>

        <MotionStaggerContainer staggerDelay={0.08} className="flex flex-col gap-4">
          {HIMANSHU_DATA.experiences.map((exp, i) => {
            const isGSoC =
              exp.role.includes("GSoC") || exp.role.includes("Open Source");
            const isGTec =
              exp.organization.includes("g.tec") ||
              exp.role.includes("Neurotechnology");

            return (
              <MotionStaggerItem key={i}>
                <MotionCardHover className="relative rounded-2xl border border-zinc-800 bg-[#0d0d12] p-5 sm:p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
                  {/* PC View: g.tec Logo on Left with Soft Ambient Aura & Connector Line */}
                  {isGTec && (
                    <div className="hidden lg:flex items-center absolute right-full mr-3 xl:mr-4 top-8 -translate-y-1/2 z-20 pointer-events-none select-none">
                      {/* Pure g.tec Vector Logo with Reduced Subtle Ambient Aura */}
                      <div className="relative flex items-center justify-center">
                        <div
                          aria-hidden="true"
                          className="absolute -inset-1 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,transparent_65%)] blur-sm pointer-events-none"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/gtec-logo.svg"
                          alt="g.tec Medical Engineering"
                          className="w-20 xl:w-24 h-auto max-h-14 object-contain relative select-none drop-shadow-[0_0_8px_rgba(56,189,248,0.2)]"
                        />
                      </div>

                      {/* Connector Line leading into the card */}
                      <div className="flex items-center ml-2.5">
                        <div className="w-8 xl:w-12 h-[1.5px] bg-gradient-to-r from-sky-400/80 via-sky-500/40 to-zinc-700/80" />
                        <div className="size-1.5 rounded-full bg-sky-400/90 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                      </div>
                    </div>
                  )}

                  {/* PC View: GSoC Icon on Left with Increased Scale, Reduced Subtle Ambient Aura & Connector Line */}
                  {isGSoC && (
                    <div className="hidden lg:flex items-center absolute right-full mr-3 xl:mr-4 top-8 -translate-y-1/2 z-20 pointer-events-none select-none">
                      {/* Pure GSoC Logo with Soft Ambient Aura (No Pill Container) */}
                      <div className="relative flex items-center justify-center">
                        <div
                          aria-hidden="true"
                          className="absolute -inset-1 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_65%)] blur-sm pointer-events-none"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/gsoc-logo.png"
                          alt="Google Summer of Code"
                          className="w-24 xl:w-28 h-auto max-h-28 object-contain relative select-none drop-shadow-[0_0_10px_rgba(245,158,11,0.22)] brightness-105"
                        />
                      </div>

                      {/* Connector Line leading into the card */}
                      <div className="flex items-center ml-2.5">
                        <div className="w-8 xl:w-12 h-[1.5px] bg-gradient-to-r from-amber-400/80 via-amber-500/40 to-zinc-700/80" />
                        <div className="size-1.5 rounded-full bg-amber-400/90 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <h2 className="font-display text-base sm:text-lg font-bold text-white">{exp.role}</h2>
                    <div className="font-sans text-xs sm:text-sm text-zinc-300 font-medium">{exp.organization}</div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                    <span>{exp.period}</span>
                    {exp.location && <span>• {exp.location}</span>}
                  </div>
                </div>

                <ul className="flex flex-col gap-2 font-sans text-xs sm:text-sm text-zinc-400">
                  {exp.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="text-zinc-600 font-mono text-xs mt-0.5 select-none">▸</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-2.5 border-t border-zinc-800/50">
                  {exp.badges.map((b, idx) => (
                    <div key={b} className="flex items-center gap-2">
                      {idx > 0 && <span className="text-zinc-600 text-[10px] select-none">•</span>}
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

        <BottomPageNav />
      </div>
    </main>
  );
}
