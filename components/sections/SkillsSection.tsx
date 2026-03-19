"use client";

/**
 * SkillsSection — Futuristic skill matrix.
 *
 * Layout: responsive auto-grid of skill cells.
 * Each cell has: index number, category badge, skill name.
 * Entry: GSAP center-outward reveal triggered by scroll.
 * A scanline sweep runs across the grid on entry.
 * Hover: cell inverts to white with black text.
 */
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SkillGroup { category: string; items: string[] }

const SKILLS: SkillGroup[] = [
  { category: "Framework",  items: ["Next.js", "React", "Vue", "Astro"] },
  { category: "Language",   items: ["TypeScript", "JavaScript", "Python", "Rust"] },
  { category: "3D / XR",    items: ["Three.js", "R3F", "WebGL", "Blender"] },
  { category: "Animation",  items: ["GSAP", "Framer Motion", "Lottie", "CSS"] },
  { category: "Styling",    items: ["Tailwind", "Sass", "Radix UI", "Figma"] },
  { category: "Backend",    items: ["Node.js", "tRPC", "Prisma", "PostgreSQL"] },
  { category: "DevOps",     items: ["Docker", "CI/CD", "Vercel", "AWS Lambda"] },
  { category: "Tools",      items: ["Git", "pnpm", "Vite", "Webpack"] },
];

export default function SkillsSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const scanRef      = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const sublineRef   = useRef<HTMLParagraphElement>(null);

  // Flatten with index for center-outward ordering
  const allSkills = SKILLS.flatMap((g) =>
    g.items.map((item) => ({ item, category: g.category })),
  );
  const N = allSkills.length;

  // Compute distance from center for stagger ordering
  function centerDistOrder(totalItems: number): number[] {
    const center = (totalItems - 1) / 2;
    return Array.from({ length: totalItems }, (_, i) =>
      Math.abs(i - center),
    );
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cells = gridRef.current?.querySelectorAll(".sk-cell");

      // Headline slide then glitch — single timeline fires once on scroll entry
      const headlineTL = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
      headlineTL
        .fromTo(
          [headlineRef.current, sublineRef.current],
          { y: 40, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.1, ease: "power3.out" },
        )
        .to(headlineRef.current, {
          keyframes: [
            { x: -5, skewX:  8, filter: "brightness(1.8) blur(1.5px)", duration: 0.05 },
            { x:  6, skewX: -6, filter: "brightness(0.6)",             duration: 0.05 },
            { x: -2, skewX:  3, filter: "brightness(1.4)",             duration: 0.04 },
            { x:  0, skewX:  0, filter: "brightness(1)",               duration: 0.15, ease: "power2.out" },
          ],
          ease: "none",
          clearProps: "transform,filter",
        }, "+=0.05");

      if (!cells) return;

      // Center-outward: sort cells by dist
      const dists = centerDistOrder(N);
      const sorted = Array.from(cells).sort((a, b) => {
        const ia = parseInt((a as HTMLElement).dataset.idx ?? "0", 10);
        const ib = parseInt((b as HTMLElement).dataset.idx ?? "0", 10);
        return dists[ia] - dists[ib];
      });

      gsap.fromTo(
        sorted,
        { scale: 0.6, opacity: 0, y: 12 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 0.55, stagger: 0.025, ease: "elastic.out(1.1, 0.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            once: true,
          },
        },
      );

      // Scanline sweep
      if (scanRef.current) {
        gsap.fromTo(
          scanRef.current,
          { scaleX: 0, opacity: 1 },
          {
            scaleX: 1, duration: 0.9, ease: "power2.inOut",
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
          },
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [N]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative bg-black py-28 px-6 md:px-14 overflow-hidden"
      aria-labelledby="skills-headline"
    >
      {/* Scanline */}
      <div
        ref={scanRef}
        className="absolute top-0 bottom-0 left-0 w-full pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
        }}
      />

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[90rem] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-5 flex items-center gap-3">
              <span className="block w-6 h-px bg-white/20" />
              03 — Skills
            </p>
            <h2
              id="skills-headline"
              ref={headlineRef}
              className="font-display font-bold"
              style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)", lineHeight: 0.95 }}
            >
              TECHNICAL
              <br />
              <span
                style={{
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.45)",
                  color: "transparent",
                }}
              >
                ARSENAL.
              </span>
            </h2>
          </div>
          <p
            ref={sublineRef}
            className="hidden md:block font-mono text-[12px] text-white/28 max-w-xs text-right leading-relaxed"
          >
            Tools, libraries, and frameworks used in production.
            Continuously evolving.
          </p>
        </div>

        {/* Category legend */}
        <div className="flex flex-wrap gap-2 mb-10">
          {SKILLS.map(({ category }) => (
            <span
              key={category}
              className="font-mono text-[9px] px-2.5 py-1 border border-white/10 text-white/28 tracking-widest uppercase"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Skills grid */}
        <div
          ref={gridRef}
          className="grid gap-px"
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))" }}
          role="list"
          aria-label="Skills list"
        >
          {allSkills.map(({ item, category }, idx) => (
            <div
              key={`${item}-${idx}`}
              data-idx={idx}
              className="sk-cell group relative p-4 border border-white/8 bg-white/[0.018] hover:bg-white hover:border-white cursor-default transition-colors duration-200"
              role="listitem"
              aria-label={`${item}, ${category}`}
            >
              {/* Blink decoration on hover */}
              <span
                className="absolute top-2 right-2 w-1 h-1 bg-white/15 group-hover:bg-black/20 rounded-full"
                aria-hidden="true"
              />
              <span className="block font-mono text-[9px] text-white/22 group-hover:text-black/45 mb-1.5 tracking-widest">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="block font-mono text-[11px] font-medium text-white/80 group-hover:text-black leading-snug">
                {item}
              </span>
              <span className="block font-mono text-[8px] text-white/20 group-hover:text-black/40 uppercase mt-1.5 tracking-widest">
                {category.slice(0, 4)}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/8">
          <span className="font-mono text-[10px] text-white/18 tracking-widest uppercase">
            {N} technologies · growing
          </span>
          <span className="font-mono text-[9px] text-white/15 tracking-widest hidden sm:block">
            03 / 05
          </span>
        </div>
      </div>
    </section>
  );
}
