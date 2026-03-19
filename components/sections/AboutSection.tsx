"use client";

/**
 * AboutSection — Pinned 420vh scroll-storytelling section.
 *
 * GSAP ScrollTrigger scrub timeline (4 phases):
 *   Phase 0  0–20% : Headline words reveal upward + "SYSTEM LOADING..." wipe
 *   Phase 1 20–45% : Stats slide in from left, counter anim
 *   Phase 2 45–70% : Bio paragraph wipe (clip-path left→right)
 *   Phase 3 70–100%: Skill pixels assemble (scale 0→1, top-left→bottom-right)
 *
 * Background subtle shift: pixel grid position animates during scrub.
 */
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AboutContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface Props { about: AboutContent }

export default function AboutSection({ about }: Props) {
  const sectionRef   = useRef<HTMLElement>(null);
  const pinRef       = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const bioRef       = useRef<HTMLDivElement>(null);
  const skillsRef    = useRef<HTMLDivElement>(null);
  const loadingRef   = useRef<HTMLSpanElement>(null);
  const bgGridRef    = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const leftColRef   = useRef<HTMLDivElement>(null);  // column differential parallax
  const rightColRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll(".word-mask span");
      const statItems = statsRef.current?.querySelectorAll(".stat-item");
      const cells = skillsRef.current?.querySelectorAll(".skill-cell");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          pin:     true,
          start:   "top top",
          end:     "+=420%",
          scrub:   2.2,        // smoother deceleration
          onUpdate(self) {
            // Progress bar
            if (progressRef.current)
              progressRef.current.style.width = `${self.progress * 100}%`;
          },
        },
      });

      // Phase 0: Headline reveal + loading text wipe (blur-clear for depth)
      if (words) {
        tl.fromTo(
          words,
          { y: "110%", opacity: 0, filter: "blur(10px)" },
          { y: "0%",   opacity: 1, filter: "blur(0px)", stagger: 0.04, duration: 0.28, ease: "power3.out" },
          0,
        );
      }
      if (loadingRef.current) {
        tl.fromTo(
          loadingRef.current,
          { scaleX: 1 },
          { scaleX: 0, duration: 0.2, ease: "power2.inOut", transformOrigin: "left center" },
          0.08,
        );
      }

      // Background grid: position shift + subtle scale zoom (creates depth-pull sensation)
      if (bgGridRef.current) {
        tl.fromTo(
          bgGridRef.current,
          { backgroundPosition: "0px 0px", scale: 0.94 },
          { backgroundPosition: "44px 44px", scale: 1.06, duration: 1, ease: "none" },
          0,
        );
      }

      // Phase 1: Stats — emerge from depth (blur + translate)
      if (statItems) {
        tl.fromTo(
          statItems,
          { x: -40, y: 10, opacity: 0, filter: "blur(8px)" },
          { x:   0, y:  0, opacity: 1, filter: "blur(0px)", stagger: 0.06, duration: 0.24, ease: "power3.out" },
          0.22,
        );
      }

      // Phase 2: Bio clip-path wipe
      if (bioRef.current) {
        tl.fromTo(
          bioRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.3, ease: "power2.inOut" },
          0.48,
        );
      }

      // Phase 3: Skills pixel assembly — center-outward, blur materialise
      if (cells) {
        tl.fromTo(
          cells,
          { scale: 0, opacity: 0, filter: "blur(8px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", stagger: { amount: 0.5, from: "center" }, duration: 0.15, ease: "back.out(2)" },
          0.72,
        );
      }

      // Column differential parallax — adds 3D separation between the two halves
      // Left col drifts up slowly; right col starts lower and ends higher (arrives first)
      gsap.fromTo(leftColRef.current,
        { y: "0%" },
        { y: "-4%", ease: "none",
          scrollTrigger: { trigger: pinRef.current, start: "top top", end: "+=420%", scrub: 2.2 } },
      );
      gsap.fromTo(rightColRef.current,
        { y: "5%", opacity: 0.75 },
        { y: "-8%", opacity: 1, ease: "none",
          scrollTrigger: { trigger: pinRef.current, start: "top top", end: "+=420%", scrub: 2.2 } },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Collect all skill items flat
  const allSkills = about.skills.flatMap((g) =>
    g.items.map((item) => ({ item, category: g.category[0] })),
  );

  const STATS = [
    { num: "5+",  label: "Years experience" },
    { num: "30+", label: "Projects shipped" },
    { num: "99",  label: "Lighthouse score" },
    { num: "∞",   label: "Coffee cups" },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative" aria-labelledby="about-headline">
      <div ref={pinRef} className="relative w-full min-h-screen overflow-hidden bg-black flex items-center">

        {/* Background pixel grid */}
        <div
          ref={bgGridRef}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Corner vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%,transparent 30%,#000 90%)",
          }}
        />

        {/* Progress indicator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/8 z-50" aria-hidden="true">
          <div
            ref={progressRef}
            className="h-full bg-white/60 transition-none"
            style={{ width: "0%" }}
          />
        </div>

        {/* Section label */}
        <div className="absolute top-8 left-6 md:left-14 flex items-center gap-3" aria-hidden="true">
          <span className="block w-6 h-px bg-white/20" />
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20">
            02 — About
          </span>
        </div>

        {/* ── Main content ──────────────────────────────── */}
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-14 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">

            {/* Left column */}
            <div ref={leftColRef}>
              {/* System loading indicator */}
              <div className="mb-10 overflow-hidden">
                <span
                  ref={loadingRef}
                  className="block font-mono text-[10px] tracking-[0.35em] uppercase text-white/30 bg-white/5 px-3 py-1.5 inline-block"
                  style={{ transformOrigin: "left center" }}
                >
                  ▌ SYSTEM LOADING...
                </span>
              </div>

              {/* Headline */}
              <div ref={headlineRef}>
                <h2
                  id="about-headline"
                  className="font-display font-bold mb-16"
                  style={{ fontSize: "clamp(2.4rem, 6vw, 5.5rem)", lineHeight: 0.95 }}
                >
                  {about.headline.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className="word-mask inline-block overflow-hidden mr-[0.18em]"
                    >
                      <span className="block">{word}</span>
                    </span>
                  ))}
                </h2>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="grid grid-cols-2 gap-x-8 gap-y-8 mb-14">
                {STATS.map(({ num, label }) => (
                  <div key={label} className="stat-item border-l border-white/12 pl-4">
                    <span
                      className="block font-display font-bold text-white"
                      style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1 }}
                    >
                      {num}
                    </span>
                    <span className="block font-mono text-[11px] tracking-wider text-white/35 uppercase mt-1">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div
                ref={bioRef}
                style={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                className="border-l border-white/10 pl-5"
              >
                <p className="text-[15px] leading-relaxed text-white/50 max-w-md">
                  {about.bio}
                </p>
                {about.resume && (
                  <a
                    href={about.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 font-mono text-[11px] tracking-[0.25em] uppercase text-white/45 hover:text-white transition-colors duration-200 border-b border-white/15 hover:border-white/50 pb-0.5"
                  >
                    Download Resume
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" aria-hidden="true">
                      <path d="M8 3v9M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Right column — Skill pixel matrix */}
            <div ref={rightColRef}>
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/22 mb-8 flex items-center gap-3">
                <span className="block w-4 h-px bg-white/20" />
                Technical Stack
              </p>
              <div
                ref={skillsRef}
                className="grid gap-1.5"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
                }}
              >
                {allSkills.map(({ item, category }, idx) => (
                  <div
                    key={`${item}-${idx}`}
                    className="skill-cell group relative p-3 border border-white/10 bg-white/[0.025] hover:bg-white hover:border-white cursor-default transition-colors duration-200"
                    title={item}
                    style={{ scale: "0", opacity: 0 }}
                  >
                    <span className="block font-mono text-[9px] text-white/25 group-hover:text-black/50 mb-1 tracking-widest">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="block font-mono text-[11px] font-medium text-white/75 group-hover:text-black truncate leading-tight">
                      {item}
                    </span>
                    <span className="block font-mono text-[8px] text-white/20 group-hover:text-black/40 uppercase mt-1 tracking-widest">
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
