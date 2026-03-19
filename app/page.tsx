import type { Metadata } from "next";
import React from "react";
import { HeroSection } from "@/components/hero";
import {
  AboutSection,
  SkillsSection,
  ContactSection,
} from "@/components/sections";
import { getAbout } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Sanchit — Full-Stack Engineer & Designer",
  description:
    "Full-stack engineer crafting high-performance web experiences with Next.js, GSAP, Three.js, and pixel-perfect design.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const about = await getAbout();

  return (
    <>
      <HeroSection />
      <AboutSection about={about} />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
