"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import {
  Brain01Icon,
  SourceCodeIcon,
  Briefcase01Icon,
  GraduationCapIcon,
  Award01Icon,
  Mail01Icon,
  Rocket01Icon,
  SparklesIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HIMANSHU_DATA } from "@/data/portfolio-data";
import { useMounted } from "@/lib/use-mounted";
import BranchedMenu, { type BranchedMenuItem } from "@/components/ui/BranchedMenu";


function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const PORTFOLIO_MENU_ITEMS: BranchedMenuItem[] = [
  {
    label: "Overview & Identity",
    children: [
      { value: "about", label: "About & Core Focus", icon: UserIcon },
      { value: "research", label: "Neurotech & Systems", icon: Brain01Icon },
    ],
  },
  {
    label: "Selected Engineering",
    children: [
      { value: "projects", label: "All Projects (800+ ★)", icon: SourceCodeIcon },
      { value: "pandora", label: "Pandora Launcher (Rust)", icon: Rocket01Icon },
      { value: "luniq", label: "Luniq Music Player", icon: SparklesIcon },
    ],
  },
  {
    label: "Experience & Track Record",
    children: [
      { value: "experience", label: "Work & Leadership", icon: Briefcase01Icon },
      { value: "education", label: "Academic Roots", icon: GraduationCapIcon },
      { value: "certifications", label: "Verified Honors", icon: Award01Icon },
    ],
  },
  {
    label: "Communication",
    children: [
      { value: "contact", label: "Direct Contact", icon: Mail01Icon },
    ],
  },
];

export function Navbar() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const mounted = useMounted();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled((prev) => {
            if (!prev && currentY > 50) return true;
            if (prev && currentY < 25) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Keyboard navigation & lock body scroll while menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }
  };

  const router = useRouter();

  const handleNavigate = (value: string) => {
    setMenuOpen(false);
    const routeMap: Record<string, string> = {
      about:          "/about",
      research:       "/about",
      projects:       "/projects",
      pandora:        "/projects",
      luniq:          "/projects",
      experience:     "/experience",
      education:      "/education",
      certifications: "/education",
      contact:        "/contact",
    };
    const route = routeMap[value] ?? "/";
    router.push(route);
  };

  return (
    <>
      {/* Blurred Background Overlay when Menu is Open */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-3 sm:px-6">
        {/* Constrained container for Navbar and Dropdown */}
        <motion.div
          initial={false}
          animate={{
            maxWidth: isScrolled ? "1060px" : "1280px",
            y: isScrolled ? 10 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full flex flex-col items-end pointer-events-none"
        >
          {/* Top Navbar Bar */}
          <motion.div
            initial={false}
            animate={isScrolled ? "scrolled" : "top"}
            variants={{
              top: {
                borderRadius: "0px",
                backgroundColor: "rgba(10, 8, 18, 0)",
                borderColor: "rgba(255, 255, 255, 0)",
                boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
                paddingTop: "14px",
                paddingBottom: "14px",
                paddingLeft: "14px",
                paddingRight: "14px",
              },
              scrolled: {
                borderRadius: "18px",
                backgroundColor: "rgba(12, 10, 22, 0.85)",
                borderColor: "rgba(255, 255, 255, 0.12)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255, 255, 255, 0.18), 0 20px 45px -12px rgba(0, 0, 0, 0.75)",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "16px",
                paddingRight: "16px",
              },
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              backdropFilter: isScrolled ? "blur(18px) saturate(180%)" : "none",
              WebkitBackdropFilter: isScrolled ? "blur(18px) saturate(180%)" : "none",
            }}
            className="relative w-full flex items-center justify-between pointer-events-auto border overflow-hidden"
          >
            {/* Subtle glass reflection sheen */}
            <motion.div
              initial={false}
              animate={{ opacity: isScrolled ? 1 : 0 }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.12),transparent_55%)]"
            />

            {/* Left Section: Only Himanshu and the / */}
            <div className="relative z-10 flex items-center gap-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center group text-white hover:text-zinc-200 transition-colors py-1"
              >
                <span className="font-display text-sm sm:text-base font-semibold tracking-tight">
                  Himanshu
                </span>
              </Link>

              <span className="text-zinc-600 font-mono text-xs select-none">
                /
              </span>
            </div>

            {/* Right Section: Lighting + GitHub (Desktop) + Menu Toggle */}
            <div className="relative z-10 flex items-center gap-2">
              {/* Lighting / Theme Toggle Button - hidden on phone view */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle lighting mode"
                className="hidden sm:inline-flex size-8.5 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.08] active:scale-95 transition-all duration-150 cursor-pointer"
                suppressHydrationWarning
              >
                {mounted && theme === "light" ? (
                  <Moon className="size-3.5 sm:size-4 text-zinc-200" strokeWidth={1.8} />
                ) : (
                  <Sun className="size-3.5 sm:size-4 text-zinc-200" strokeWidth={1.8} />
                )}
              </button>

              {/* GitHub Button - hidden on phone view */}
              <a
                href={HIMANSHU_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="hidden sm:inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 sm:px-3 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.08] active:scale-95 transition-all duration-150"
              >
                <GithubIcon className="size-3.5" />
                <span>GitHub</span>
              </a>

              {/* Menu Toggle Icon Button */}
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="inline-flex size-8.5 items-center justify-center text-zinc-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
              >
                {menuOpen ? (
                  <X className="size-5 text-white" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Branched Menu Dropdown directly below Cross button */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scaleY: 0.88 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -16, scaleY: 0.9 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transformOrigin: "top right",
                }}
                className={`pointer-events-auto self-end flex flex-col items-end mt-2 w-auto border-0 bg-transparent shadow-none p-0 ${
                  isScrolled ? "mr-[33px]" : "mr-[31px]"
                }`}
              >
                {/* React Bits BranchedMenu Component showing lines on the right */}
                <div className="w-full flex justify-end">
                  <BranchedMenu
                    items={PORTFOLIO_MENU_ITEMS}
                    defaultOpen={[0]}
                    defaultActive="about"
                    onSelect={(val) => handleNavigate(val)}
                    color="#f4f4f5"
                    accentColor="#ffffff"
                    lineColor="#52525b"
                    width={290}
                    rowHeight={36}
                    indent={38}
                    trunk={14}
                    radius={10}
                    lineWidth={1.5}
                    fontSize={13}
                    drawDuration={350}
                    foldDuration={280}
                    align="right"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>
    </>
  );
}
