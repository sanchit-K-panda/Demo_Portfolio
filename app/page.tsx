import type { Metadata } from "next";
import React from "react";
import { HeroSection } from "@/components/hero";
import {
  AboutSection,
  ProjectsSection,
  SkillsSection,
  ContactSection,
} from "@/components/sections";
import { getProjects, getAbout } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Alex Rivera — Full-Stack Engineer & Designer",
  description:
    "Full-stack engineer crafting high-performance web experiences with Next.js, GSAP, Three.js, and pixel-perfect design.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const [projects, about] = await Promise.all([getProjects(), getAbout()]);

  return (
    <>
      <HeroSection />
      <AboutSection about={about} />
      <ProjectsSection projects={projects} />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
