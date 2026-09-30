import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { HoverPreviewProvider } from "@/components/ui/HoverPreview";
import { SwipeNavigator } from "@/components/SwipeNavigator";

// oxlint-disable-next-line react/only-export-components
export const metadata: Metadata = {
  title: "Himanshu Kushwaha",
  description: "AI/ML Engineer, Neurotechnology Researcher, and Full-Stack Systems Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Gochi+Hand&family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-white/20 selection:text-white"
        suppressHydrationWarning
      >
        <PageLoader />
        <HoverPreviewProvider>
          <SmoothScroll>
            <Navbar />
            {children}
            <SwipeNavigator />
          </SmoothScroll>
        </HoverPreviewProvider>
      </body>
    </html>
  );
}
