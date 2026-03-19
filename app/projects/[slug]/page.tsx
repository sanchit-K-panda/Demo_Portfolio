import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjects, getProjectBySlug } from "@/lib/cms";
import { Tag } from "@/components/ui";

interface PageProps {
  params: { slug: string };
}

// Generate static params from content
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title:       project.title,
    description: project.blurb,
    openGraph:   { images: [{ url: project.coverImage }] },
  };
}

export const revalidate = 3600;

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <article className="min-h-screen bg-surface pt-24">
      {/* Hero image */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image
          src={project.coverImage}
          alt={`Cover image for ${project.title}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" aria-hidden="true" />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {/* Back link */}
        <Link href="/projects" className="text-sm text-slate-500 hover:text-brand-400 transition-colors mb-8 inline-block">
          ← Back to Projects
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {project.tags.map((tag) => <Tag key={tag} label={tag} />)}
            <span className="text-xs text-slate-500 ml-auto">{project.year}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
          <p className="text-xl text-slate-400">{project.blurb}</p>
        </header>

        {/* Links */}
        <div className="flex gap-4 mb-10">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
            >
              Live Demo ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full border border-surface-border hover:border-brand-500 text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              GitHub ↗
            </a>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-invert prose-slate max-w-none">
          {project.description.split("\n\n").map((para, i) => (
            <p key={i} className="text-slate-400 leading-relaxed mb-4">{para}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
