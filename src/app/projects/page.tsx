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
export const metadata = { title: "Projects — Himanshu Kushwaha" };

function GithubIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function ProjectsPage() {
  return (
    <main className="relative flex flex-col items-center w-full min-h-screen px-4 sm:px-6 pt-24 pb-28 overflow-x-hidden">
      <BackgroundReveal />

      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl flex flex-col gap-8 lg:pr-20 xl:pr-24">
        <MotionReveal className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Featured Engineering</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Selected Systems & AI Work
          </h1>
          <p className="font-sans text-sm text-zinc-400">
            Production desktop software, neural signal processors, and high-performance open-source tools.
          </p>
        </MotionReveal>

        <MotionStaggerContainer staggerDelay={0.08} className="flex flex-col gap-4">
          {HIMANSHU_DATA.projects.map((project) => (
            <MotionStaggerItem key={project.id}>
              <MotionCardHover className="relative rounded-2xl border border-zinc-800 bg-[#0d0d12] p-5 sm:p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
                {/* PC View: Only GitHub icon pill placed outside, just to the right of the card */}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden lg:flex items-center justify-center size-10 rounded-xl border border-zinc-800 bg-[#0d0d12] hover:border-zinc-600 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all shadow-md hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] group absolute left-full ml-3.5 top-8 -translate-y-1/2 z-20"
                    aria-label={`${project.title} GitHub Repository`}
                    title="View Repository"
                  >
                    <GithubIcon className="size-5 text-zinc-300 group-hover:text-white transition-colors" />
                  </a>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-medium text-xs tracking-wide text-sky-400">
                      {project.category}
                    </span>
                    {project.stars && (
                      <>
                        <span className="text-zinc-700 text-xs select-none">•</span>
                        <span className="inline-flex items-center gap-1 font-display font-medium text-xs text-amber-400/90">
                          <span className="text-[13px]">★</span>
                          <span>{project.stars}+ stars</span>
                        </span>
                      </>
                    )}
                  </div>
                  {/* Mobile View: Icon button inside header */}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:hidden inline-flex items-center justify-center size-8 rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                      aria-label={`${project.title} GitHub Repository`}
                    >
                      <GithubIcon className="size-4" />
                    </a>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                    {project.title}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  {project.metrics.map((m, idx) => (
                    <div key={m} className="flex items-center gap-2">
                      {idx > 0 && <span className="text-zinc-600 text-[10px] select-none">•</span>}
                      <span className="font-display font-medium text-[12px] text-zinc-300 tracking-tight">
                        {m}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-2.5 border-t border-zinc-800/50">
                  {project.tags.map((t, idx) => (
                    <div key={t} className="flex items-center gap-2">
                      {idx > 0 && <span className="text-zinc-700 text-[10px] select-none">•</span>}
                      <span className="font-display text-[12px] text-zinc-400 hover:text-zinc-200 transition-colors">
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </MotionCardHover>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>

        <BottomPageNav />
      </div>
    </main>
  );
}
