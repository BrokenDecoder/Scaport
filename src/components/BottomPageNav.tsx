"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { getAdjacentRoutes, type RouteInfo } from "@/lib/routes";

export function BottomPageNav({
  customNext,
  customPrev,
}: {
  customNext?: RouteInfo;
  customPrev?: RouteInfo;
}) {
  const pathname = usePathname();
  const { prev, next } = getAdjacentRoutes(pathname);

  const prevItem = customPrev || prev;
  const nextItem = customNext || next;

  const scrollToTop = () => {
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (t: number | HTMLElement, o?: object) => void };
      }
    ).__lenis;

    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Page navigation"
      className="hidden sm:flex w-full pt-8 pb-14 mt-6 border-t border-white/[0.08] flex-row items-center justify-between gap-6"
    >
      {/* Left side: Back to previous page or back to top */}
      {prevItem ? (
        <Link
          href={prevItem.path}
          className="group flex items-center gap-3.5 py-2 text-left transition-colors duration-200"
        >
          <ArrowLeft className="size-6 text-zinc-400 group-hover:text-white group-hover:-translate-x-1 transition-all duration-200 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 group-hover:text-zinc-400 transition-colors">
              {prevItem.number ? `${prevItem.number} / Previous` : "Previous"}
            </span>
            <span className="font-display text-sm sm:text-base font-semibold text-zinc-200 group-hover:text-white transition-colors">
              {prevItem.name}
            </span>
          </div>
        </Link>
      ) : (
        <button
          type="button"
          onClick={scrollToTop}
          className="group flex items-center gap-3.5 py-2 text-left transition-colors duration-200 cursor-pointer"
        >
          <ArrowUp className="size-6 text-zinc-400 group-hover:text-white group-hover:-translate-y-1 transition-all duration-200 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 group-hover:text-zinc-400 transition-colors">
              Beginning
            </span>
            <span className="font-display text-sm sm:text-base font-semibold text-zinc-200 group-hover:text-white transition-colors">
              Back to Top
            </span>
          </div>
        </button>
      )}

      {/* Right side: Next page */}
      {nextItem && (
        <Link
          href={nextItem.path}
          className="group flex items-center justify-between sm:justify-end gap-3.5 py-2 text-right transition-colors duration-200"
        >
          <div className="flex flex-col text-left sm:text-right">
            <span className="font-mono text-[10px] tracking-wider uppercase text-indigo-400 group-hover:text-indigo-300 transition-colors">
              {nextItem.number ? `${nextItem.number} / Next Chapter` : "Next"}
            </span>
            <span className="font-display text-sm sm:text-base font-semibold text-white group-hover:text-indigo-200 transition-colors">
              {nextItem.name}
            </span>
          </div>
          <ArrowRight className="size-6 text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 shrink-0" />
        </Link>
      )}
    </nav>
  );
}
