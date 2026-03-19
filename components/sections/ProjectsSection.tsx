"use client";

/**
 * ProjectsSection — Horizontal scroll gallery driven by vertical scroll.
 *
 * GSAP ScrollTrigger pins the section and translates the track horizontally.
 * Cards emerge from depth: enter as translateZ(-80px) opacity(0) blur(8px)
 * and settle to normal as they near center.
 * 3D tilt on hover via Framer Motion.
 * Images are forced grayscale (CSS).
 */
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/types";

gsap.registerPlugin(ScrollTrigger);

// ── 3-D tilt card wrapper ─────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref   = useRef<HTMLDivElement>(null);
  const rotX  = useMotionValue(0);
  const rotY  = useMotionValue(0);
  const sx    = useSpring(rotX, { damping: 22, stiffness: 180 });
  const sy    = useSpring(rotY, { damping: 22, stiffness: 180 });

  const rX = useTransform(sx, [-1, 1], ["-10deg", "10deg"]);
  const rY = useTransform(sy, [-1, 1], ["10deg", "-10deg"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rotX.set((e.clientY - rect.top)  / rect.height * 2 - 1);
    rotY.set((e.clientX - rect.left) / rect.width  * 2 - 1);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Single project card ───────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <TiltCard className="h-track-card group relative flex-shrink-0 overflow-hidden border border-white/10 bg-[#0c0c0c] hover:border-white/35 transition-colors duration-300 w-[340px] md:w-[420px] lg:w-[480px]">
      {/* Image */}
      {project.coverImage && (
        <div className="relative h-52 md:h-60 overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 340px, (max-width: 1024px) 420px, 480px"
            className="object-cover grayscale group-hover:grayscale-0 transition-[filter,transform] duration-500 group-hover:scale-105"
          />
          {/* Depth overlay */}
          <div
            className="absolute inset-0 bg-black/40 group-hover:bg-black/15 transition-colors duration-400"
            aria-hidden="true"
          />
          {/* Index badge */}
          <span className="absolute top-4 left-4 font-mono text-[10px] text-white/60 tracking-widest bg-black/60 px-2 py-1">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.featured && (
            <span className="absolute top-4 right-4 font-mono text-[9px] text-white/80 tracking-widest px-2 py-1 border border-white/25 bg-black/60 uppercase">
              Featured
            </span>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] px-2 py-0.5 border border-white/12 text-white/30 tracking-widest uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display font-bold text-white/88 group-hover:text-white transition-colors duration-200 mb-2" style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)" }}>
          {project.title}
        </h3>
        <p className="font-light text-[13px] leading-relaxed text-white/38 mb-5 line-clamp-2">
          {project.blurb}
        </p>

        <div className="flex items-center gap-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45 hover:text-white border-b border-white/15 hover:border-white transition-all duration-200 pb-px"
            >
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white border-b border-white/10 hover:border-white/50 transition-all duration-200 pb-px"
            >
              GitHub
            </a>
          )}
          <span className="ml-auto font-mono text-[10px] text-white/18 tracking-wider">
            {project.year}
          </span>
        </div>
      </div>
    </TiltCard>
  );
}

// ── Projects section ──────────────────────────────────────────────────────────
interface Props { projects: Project[] }

export default function ProjectsSection({ projects }: Props) {
  const sectionRef  = useRef<HTMLElement>(null);
  const pinRef      = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      // Headline — blur enter + glitch settle
      const headlineTL = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });
      headlineTL
        .fromTo(
          headlineRef.current,
          { y: 30, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
        )
        .to(headlineRef.current, {
          keyframes: [
            { x: -4, skewX:  6, filter: "brightness(1.6) blur(1px)", duration: 0.05 },
            { x:  5, skewX: -5, filter: "brightness(0.7)",           duration: 0.05 },
            { x:  0, skewX:  0, filter: "brightness(1)",             duration: 0.12, ease: "power2.out" },
          ],
          ease: "none",
          clearProps: "transform,filter",
        }, "+=0.04");

      const getScrollDist = () => Math.max(0, track.scrollWidth - pin.clientWidth + 120);

      // Horizontal scroll driven by vertical
      const horizontalTween = gsap.to(track, {
        x: () => -getScrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          pin:     true,
          start:   "top top",
          end:     () => `+=${getScrollDist()}`,
          scrub:   1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Fade/slide emergence as each card enters viewport during horizontal scroll
      const cards = track.querySelectorAll(".h-track-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.35, y: 36 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 88%",
              end: "left 58%",
              scrub: 0.7,
            },
          },
        );
      });

      const refresh = () => ScrollTrigger.refresh();
      const images = Array.from(track.querySelectorAll("img"));
      images.forEach((img) => {
        if (!img.complete) img.addEventListener("load", refresh, { once: true });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      aria-labelledby="projects-headline"
    >
      {/* Header (outside pin so it doesn't pin with the cards) */}
      <div
        ref={headlineRef}
        className="max-w-[90rem] mx-auto px-6 md:px-14 pt-24 pb-12"
      >
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-5 flex items-center gap-3">
          <span className="block w-6 h-px bg-white/20" />
          04 — Projects
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <h2
            id="projects-headline"
            className="font-display font-bold"
            style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)", lineHeight: 0.95 }}
          >
            SELECTED
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px rgba(255,255,255,0.45)",
                color: "transparent",
              }}
            >
              WORK.
            </span>
          </h2>
          <div className="text-right">
            <p className="font-mono text-[11px] text-white/28 mb-2 tracking-wider">
              {projects.length} projects
            </p>
            <p className="font-mono text-[10px] text-white/18 hidden sm:block">
              Scroll to explore →
            </p>
          </div>
        </div>
      </div>

      {/* Pinned horizontal gallery */}
      <div ref={pinRef} className="relative overflow-hidden" style={{ height: "100vh" }}>
        <div
          ref={trackRef}
          className="flex items-center gap-6 h-full px-6 md:px-14"
          style={{ width: "max-content", perspective: "900px" }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-32 h-full flex flex-col items-center justify-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/28 hover:text-white transition-colors duration-200 [writing-mode:vertical-rl] border border-white/10 px-3 py-6 hover:border-white/35"
            >
              All projects ↗
            </a>
          </div>
        </div>

        {/* Build fade edges */}
        <div
          className="absolute top-0 left-0 w-40 h-full pointer-events-none z-10"
          aria-hidden="true"
          style={{ background: "linear-gradient(90deg, #000, transparent)" }}
        />
        <div
          className="absolute top-0 right-0 w-40 h-full pointer-events-none z-10"
          aria-hidden="true"
          style={{ background: "linear-gradient(-90deg, #000, transparent)" }}
        />
      </div>

      {/* Bottom count */}
      <div className="max-w-[90rem] mx-auto px-6 md:px-14 py-8 flex items-center justify-between border-t border-white/5">
        <span className="font-mono text-[10px] text-white/18 tracking-widest uppercase">
          {projects.filter((p) => p.featured).length} featured · {projects.length} total
        </span>
        <span className="font-mono text-[9px] text-white/12 tracking-widest hidden sm:block">
          04 / 05
        </span>
      </div>
    </section>
  );
}
