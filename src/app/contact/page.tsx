import { Phone } from "lucide-react";
import { HIMANSHU_DATA } from "@/data/portfolio-data";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { BackgroundReveal } from "@/components/BackgroundReveal";
import { MotionReveal, MotionCardHover } from "@/components/ui/motion-reveal";
import { BottomPageNav } from "@/components/BottomPageNav";
import GradientText from "@/components/ui/GradientText";

// oxlint-disable-next-line react/only-export-components
export const metadata = { title: "Contact — Himanshu Kushwaha" };

const CURRENT_YEAR = 2026;

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <main className="relative flex flex-col items-center justify-between w-full min-h-screen px-4 sm:px-6 pt-24 pb-8 overflow-x-hidden">
      <BackgroundReveal />

      <div className="relative z-10 w-full max-w-2xl flex-1 flex flex-col justify-between">
        <div className="my-auto w-full flex flex-col gap-6">
          <MotionReveal>
            <MotionCardHover className="rounded-none border border-zinc-800 bg-[#0d0d12] p-6 sm:p-10 flex flex-col gap-8 hover:border-zinc-700 transition-colors">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Direct Communication</span>
                <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
                  Let&apos;s build something extraordinary.
                </h1>
                <p className="font-sans text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Focused on applied AI & neurotech research, open-source systems engineering, and deep learning architectures.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <CopyEmailButton email={HIMANSHU_DATA.email} />
                <a
                  href={`tel:${HIMANSHU_DATA.phone.replace(/\s+/g, "")}`}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-none border border-zinc-700 bg-zinc-900/80 px-4 text-sm font-medium text-zinc-200 active:scale-95 transition-all hover:border-zinc-500 hover:text-white"
                >
                  <Phone className="size-4 text-zinc-400" />
                  <span>{HIMANSHU_DATA.phone}</span>
                </a>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-5 text-xs text-zinc-400 font-mono">
                <a href={HIMANSHU_DATA.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors py-1">
                  <GithubIcon className="size-3.5" />
                  <span>GitHub</span>
                </a>
                <a href={HIMANSHU_DATA.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors py-1">
                  <LinkedinIcon className="size-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </MotionCardHover>
          </MotionReveal>

          <BottomPageNav />
        </div>

        <div className="w-full flex flex-col items-center justify-center py-12 sm:py-16">
          <GradientText
            colors={["#ffffff", "#38bdf8", "#c084fc", "#f43f5e", "#38bdf8", "#ffffff"]}
            animationSpeed={5}
            showBorder={false}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-center select-none"
          >
            Thank you.
          </GradientText>
        </div>

        <footer className="w-full text-center pb-28 sm:pb-6 font-mono text-[11px] text-zinc-500 flex flex-col items-center gap-1 select-none">
          <div>© {CURRENT_YEAR} Himanshu Kushwaha • Engineered for high performance</div>
          <div className="text-[10px] text-zinc-600">Zero-drift systems • Next.js & TypeScript</div>
        </footer>
      </div>
    </main>
  );
}
