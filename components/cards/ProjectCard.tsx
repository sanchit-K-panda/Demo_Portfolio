"use client";

/**
 * ProjectCard — premium large project card with:
 * - Full-bleed image with hover overlay
 * - Project number + year
 * - Framer Motion hover lift + border glow
 */
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types";

// Gradient placeholders (shown if image fails to load)
const GRADIENTS = [
  "from-violet-600 via-purple-700 to-indigo-800",
  "from-cyan-500 via-blue-600 to-indigo-700",
  "from-fuchsia-500 via-pink-600 to-rose-700",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-amber-500 via-orange-600 to-red-700",
  "from-blue-500 via-indigo-600 to-violet-700",
];

interface Props {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: Props) {
  const [imgError, setImgError] = useState(false);
  const gradientClass = GRADIENTS[index % GRADIENTS.length];
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="group relative card overflow-hidden cursor-pointer"
      aria-label={`Project: ${project.title}`}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
      >
        {/* Image area */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {/* Placeholder gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-80`} />

          {/* Real image */}
          {!imgError && (
            <Image
              src={project.coverImage}
              alt={`Cover image for ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
              priority={index < 2}
            />
          )}

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-bg/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg/80 backdrop-blur-sm border border-border text-sm font-medium text-text">
              View Project
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          {/* Project number */}
          <span className="absolute top-3 left-3 font-mono text-xs text-white/50">
            {num}
          </span>

          {/* Featured badge */}
          {project.featured && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-primary/80 text-white text-xs font-medium backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="p-6">
          {/* Year + category */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-text-muted">{project.year}</span>
            {project.tags[0] && (
              <span className="tag-sky tag text-[10px]">{project.tags[0]}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-xl text-text mb-2 group-hover:text-primary-light transition-colors duration-200">
            {project.title}
          </h3>

          {/* Blurb */}
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-5">
            {project.blurb}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.slice(1, 4).map((t) => (
              <span key={t} className="tag text-[11px]">{t}</span>
            ))}
          </div>

          {/* Footer links */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo: ${project.title}`}
                className="link-arrow text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M4.5 11.5l7-7M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source: ${project.title}`}
                className="link-arrow text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M4.5 11.5l7-7M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}


interface ProjectCardProps {
  project: Project;
}
