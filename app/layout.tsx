import type { Metadata } from "next";
import React from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Navbar, Footer } from "@/components/layout";
import LenisProvider from "@/components/providers/LenisProvider";
import { getAuthor } from "@/lib/cms";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sanchit — Full-Stack Engineer & Designer",
    template: "%s | Sanchit",
  },
  description:
    "Full-stack engineer crafting high-performance web experiences with Next.js, React, GSAP, Three.js, and world-class design.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanchit.dev"),
  openGraph: {
    type:     "website",
    siteName: "Sanchit",
    locale:   "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const author = await getAuthor();

  return (
    <html
      lang="en"
      className={`lenis ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name:     author.name,
              url:      process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanchit.dev",
              sameAs:   Object.values(author.social).filter(Boolean),
              jobTitle: "Full-Stack Engineer & Designer",
            }),
          }}
        />
      </head>
      <body>
        <LenisProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
