import type { Metadata } from "next";
import React from "react";
import { getProjects } from "@/lib/cms";
import ProjectCard from "@/components/cards/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description: "A curated collection of full-stack engineering and design work.",
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-surface pt-28 section-padding">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Selected Work
          </p>
          <h1 className="section-title text-white mb-4">
            All <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-slate-400 max-w-xl">
            {projects.length} projects spanning design systems, SaaS platforms, 3D experiences, and more.
          </p>
        </header>

        <section aria-label="Projects grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
