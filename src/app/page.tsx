import { DesktopHero } from "@/components/DesktopHero";
import { MobileHero } from "@/components/MobileHero";
import { HomeSnapScroll } from "@/components/HomeSnapScroll";
import { Page2 } from "@/components/Page2";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center w-full overflow-x-hidden">

      {/* Mandatory full-page snap — attaches to every [data-snap] section */}
      <HomeSnapScroll />

      {/* ── Mobile hero (< 640px) ── */}
      <div className="block sm:hidden w-full">
        {/* Hero section snaps full-viewport */}
        <section data-snap className="min-h-screen w-full">
          <MobileHero />
        </section>
      </div>

      {/* ── Desktop hero: animated scroll reveal (>= 640px) ── */}
      <DesktopHero />

      {/* ── Page 2 — only for phone view (< 640px) ── */}
      <div className="block sm:hidden w-full">
        <Page2 />
      </div>

    </main>
  );
}
