import { GraduationCap, Award } from "lucide-react";
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
export const metadata = { title: "Education — Himanshu Kushwaha" };

export default function EducationPage() {
  return (
    <main className="relative flex flex-col items-center w-full min-h-screen px-4 sm:px-6 pt-24 pb-28 overflow-x-hidden">
      <BackgroundReveal />

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-10">

        {/* Education */}
        <div className="flex flex-col gap-4">
          <MotionReveal className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Academic Foundation</span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">Education</h1>
          </MotionReveal>

          <MotionStaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {HIMANSHU_DATA.education.map((edu, i) => (
              <MotionStaggerItem key={i}>
                <MotionCardHover className="rounded-2xl border border-zinc-800 bg-[#0d0d12] p-5 flex flex-col gap-2 justify-between h-full hover:border-zinc-700 transition-colors">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <GraduationCap className="size-4 text-purple-400" />
                      <span className="font-mono text-xs">{edu.period}</span>
                    </div>
                    <h2 className="font-display text-sm sm:text-base font-semibold text-white">{edu.degree}</h2>
                    <p className="font-sans text-xs text-zinc-300">{edu.institution}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800/60 font-mono text-[11px] text-zinc-400">
                    Focus: {edu.focus}
                  </div>
                </MotionCardHover>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>

        {/* Certifications */}
        <div className="flex flex-col gap-4">
          <MotionReveal>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="size-5 text-amber-400" />
              <span>Verified Honors & Certifications</span>
            </h2>
          </MotionReveal>

          <MotionStaggerContainer staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {HIMANSHU_DATA.certifications.map((cert, i) => (
              <MotionStaggerItem key={i}>
                <MotionCardHover className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex flex-col justify-between gap-2 h-full hover:border-zinc-700/80 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-zinc-400">{cert.issuer}</span>
                    <h3 className="font-display text-xs sm:text-sm font-semibold text-zinc-100 leading-snug">{cert.title}</h3>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                    <span>{cert.date}</span>
                    <span className="text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{cert.category}</span>
                  </div>
                </MotionCardHover>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>

        <BottomPageNav />
      </div>
    </main>
  );
}
