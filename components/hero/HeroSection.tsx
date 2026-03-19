"use client";

/**
 * HeroSection — Immersive full-screen hero with 4 depth layers.
 *
 * Layer system (back → front):
 *   Z0 — React Three Fiber pixel grid (camera parallax only)
 *   Z1 — CSS pixel grid overlay       (scroll: slow / mouse: small)
 *   Z2 — Main typography + CTA        (scroll: mid + scale/blur exit)
 *   Z3 — Floating UI decorations      (scroll: fast / mouse: large)
 *
 * Each layer reacts to both scroll (GSAP) and mouse (Framer Motion springs).
 * Entrance: words clip-reveal, staggered upward.
 */
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ThreeScene = dynamic(() => import("./ThreeScene"), { ssr: false });

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const floatRef   = useRef<HTMLDivElement>(null);
  const topRef     = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLSpanElement>(null);
  const line2Ref   = useRef<HTMLSpanElement>(null);
  const line3Ref   = useRef<HTMLSpanElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const midGridRef = useRef<HTMLDivElement>(null);  // Z1.5 intermediate layer
  const deepBgRef  = useRef<HTMLDivElement>(null);  // Z0.75 — faint landmark grid
  const ultraFgRef = useRef<HTMLDivElement>(null);  // Z4   — ultra-fast corner accents

  // ── Mouse motion values ─────────────────────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Z1 — background grid, far away: slowest, max damping
  const g1X = useSpring(useTransform(rawX, [-1, 1], [-14,  14]), { damping: 90, stiffness: 30 });
  const g1Y = useSpring(useTransform(rawY, [-1, 1], [ -9,   9]), { damping: 90, stiffness: 30 });
  // Z1.5 — intermediate CSS layer: mid-distance, wider range
  const g15X = useSpring(useTransform(rawX, [-1, 1], [-30,  30]), { damping: 52, stiffness: 65 });
  const g15Y = useSpring(useTransform(rawY, [-1, 1], [-19,  19]), { damping: 52, stiffness: 65 });
  // Z2 — content: strong parallax, less damping
  const g2X = useSpring(useTransform(rawX, [-1, 1], [-42,  42]), { damping: 32, stiffness: 90 });
  const g2Y = useSpring(useTransform(rawY, [-1, 1], [-26,  26]), { damping: 32, stiffness: 90 });
  // Z3 — foreground decorations: aggressive, snappy
  const g3X = useSpring(useTransform(rawX, [-1, 1], [-75,  75]), { damping: 10, stiffness: 200 });
  const g3Y = useSpring(useTransform(rawY, [-1, 1], [-50,  50]), { damping: 10, stiffness: 200 });
  // Z0 — deep background (almost imperceptible, creates subconscious depth)
  const g0X = useSpring(useTransform(rawX, [-1, 1], [ -6,   6]), { damping: 120, stiffness: 18 });
  const g0Y = useSpring(useTransform(rawY, [-1, 1], [ -4,   4]), { damping: 120, stiffness: 18 });
  // Z4 — ultra-fast foreground corner accents (most aggressive)
  const g4X = useSpring(useTransform(rawX, [-1, 1], [-90,  90]), { damping: 6,  stiffness: 320 });
  const g4Y = useSpring(useTransform(rawY, [-1, 1], [-60,  60]), { damping: 6,  stiffness: 320 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  // ── Entrance animation ──────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.5 });
      tl
        .fromTo(topRef.current,
          { y: -24, opacity: 0, filter: "blur(6px)" },
          { y:   0, opacity: 1, filter: "blur(0px)", duration: 0.8 })
        .fromTo(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          { y: "115%", opacity: 0, filter: "blur(14px)" },
          { y: "0%",   opacity: 1, filter: "blur(0px)", duration: 1.5, stagger: 0.13 },
          "-=0.55",
        )
        // Cascading pixel-glitch burst across all 3 headline lines
        .to([line1Ref.current, line2Ref.current, line3Ref.current], {
          keyframes: [
            { x: -5, skewX:  8, filter: "brightness(1.6) blur(1px)", duration: 0.055, ease: "none" },
            { x:  6, skewX: -6, filter: "brightness(0.8) blur(0px)", duration: 0.055, ease: "none" },
            { x: -3, skewX:  3, filter: "brightness(1.3)",           duration: 0.055, ease: "none" },
            { x:  0, skewX:  0, filter: "brightness(1.0)",           duration: 0.12,  ease: "power2.out" },
          ],
          stagger: 0.06,
          clearProps: "transform,filter",
        }, "+=0.08")
        .fromTo(subRef.current,
          { x: 40, opacity: 0 },
          { x:  0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.9",
        )
        .fromTo(ctaRef.current?.children ?? [],
          { y: 18, opacity: 0 },
          { y:  0, opacity: 1, duration: 0.6, stagger: 0.08 },
          "-=0.65",
        )
        .fromTo(scrollRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2",
        );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Scroll exit per layer ───────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // scrub: 1.5 — smooth deceleration instead of instant scrub
      const base = { trigger: sectionRef.current, start: "top top", scrub: 1.1 };

      // Z1 — bg grid barely moves; slight scale-down simulates recession
      gsap.to(gridRef.current, {
        y: "-16%", scale: 0.96, ease: "none",
        scrollTrigger: { ...base, end: "100% top" },
      });

      // Z0.75 — landmark grid: almost stationary, fades subtly
      gsap.to(deepBgRef.current, {
        y: "-8%", opacity: 0.5, ease: "none",
        scrollTrigger: { ...base, end: "100% top" },
      });

      // Z1.5 — intermediate layer, mid-speed fade
      gsap.to(midGridRef.current, {
        y: "-28%", opacity: 0, ease: "none",
        scrollTrigger: { ...base, end: "70% top" },
      });

      // Z2 — content: faster exit + perspective lean-back
      gsap.to(contentRef.current, {
        y: "-26%", scale: 0.92,
        autoAlpha: 0,
        transformPerspective: 900, rotateX: 4,
        transformOrigin: "50% 20%",
        force3D: true,
        ease: "none",
        scrollTrigger: { ...base, end: "50% top" },
      });

      // Z3 — foreground: fastest, fully fades as it whips away
      gsap.to(floatRef.current, {
        y: "-58%", opacity: 0, ease: "none",
        scrollTrigger: { ...base, end: "55% top" },
      });

      // Z4 — ultra-fast corner accents: exit first
      gsap.to(ultraFgRef.current, {
        y: "-78%", opacity: 0, scale: 0.92, ease: "none",
        scrollTrigger: { ...base, end: "38% top" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Hero"
      className="relative min-h-screen overflow-hidden bg-black flex flex-col"
    >
      {/* ── Z0: R3F Pixel Grid (deepest) ────────────────── */}
      <ThreeScene />

      {/* ── Z0.5: Scanline overlay — horizontal CRT-style bands ─ */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg," +
            "rgba(255,255,255,0.013) 0px," +
            "rgba(255,255,255,0.013) 1px," +
            "transparent 1px," +
            "transparent 4px)",
        }}
      />

      {/* ── Z0.75: Deep landmark grid — 160px coarse + dot accents ── */}
      <motion.div
        ref={deepBgRef}
        style={{ x: g0X, y: g0Y }}
        className="absolute inset-0 pointer-events-none z-[3]"
        aria-hidden="true"
      >
        {/* 160px anchor grid — barely visible at reading distance */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.016) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,0.016) 1px,transparent 1px)",
            backgroundSize: "160px 160px",
          }}
        />
        {/* Intersection dot accents */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "160px 160px",
          }}
        />
      </motion.div>

      {/* ── Z1: CSS Pixel Grid Overlay ───────────────────── */}
      <motion.div
        ref={gridRef}
        style={{ x: g1X, y: g1Y }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* 40px coarse grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* 8px fine grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 25%, #000 88%)",
          }}
        />
      </motion.div>

      {/* Bottom fade to black */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, #000000, transparent)" }}
        aria-hidden="true"
      />

      {/* ── Z1.5: Intermediate CSS layer (sparse grid + diagonals) ── */}
      <motion.div
        ref={midGridRef}
        style={{ x: g15X, y: g15Y }}
        className="absolute inset-0 pointer-events-none z-[5]"
        aria-hidden="true"
      >
        {/* Sparse 80px grid — feels mid-distance between R3F and content */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Diagonal hash lines — angular energy */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,rgba(255,255,255,0.015) 0px,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 64px)",
          }}
        />
      </motion.div>

      {/* ── Z2: Main Content (mid depth) ─────────────────── */}
      <motion.div
        ref={contentRef}
        style={{ x: g2X, y: g2Y, willChange: "transform, opacity" }}
        className="relative z-10 flex flex-col flex-1 min-h-screen"
      >
        <div className="h-[68px] shrink-0" />

        {/* Status bar */}
        <div
          ref={topRef}
          className="flex items-center justify-between px-6 md:px-14 max-w-[90rem] mx-auto w-full pt-8"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25">
              Portfolio&thinsp;·&thinsp;2025
            </span>
            <span className="text-white/15 font-mono">|</span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/20">
              AR_DEV
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            <span className="relative flex h-[6px] w-[6px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
              <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-white opacity-80" />
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/45">
              Available for work
            </span>
          </div>
        </div>

        {/* Hero typography */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-14 max-w-[90rem] mx-auto w-full py-12">

          {/* Scene label */}
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/20 mb-10 flex items-center gap-3">
            <span className="block w-8 h-px bg-white/20" />
            01 — INTRODUCTION
          </p>

          {/* Main headline — massive, 3 stacked lines */}
          <h1 className="font-display font-bold overflow-visible mb-10" style={{ lineHeight: 0.9 }}>
            {/* Line 1: filled */}
            <span className="block overflow-hidden">
              <span
                ref={line1Ref}
                className="block tracking-[-0.04em]"
                style={{ fontSize: "clamp(3.8rem, 11vw, 10.5rem)" }}
              >
                FULL·STACK
              </span>
            </span>
            {/* Line 2: outline (appears behind) */}
            <span className="block overflow-hidden">
              <span
                ref={line2Ref}
                className="block tracking-[-0.04em]"
                style={{
                  fontSize: "clamp(3.8rem, 11vw, 10.5rem)",
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.55)",
                  color: "transparent",
                }}
              >
                ENGINEER.
              </span>
            </span>
            {/* Line 3: small mono */}
            <span className="block overflow-hidden mt-2">
              <span
                ref={line3Ref}
                className="block font-mono font-normal tracking-[0.06em] text-white/30"
                style={{ fontSize: "clamp(1rem, 2.6vw, 2.6rem)" }}
              >
                &amp;&nbsp;DESIGNER
              </span>
            </span>
          </h1>

          {/* Sub description */}
          <div ref={subRef} className="max-w-lg mb-12">
            <p className="text-[15px] leading-relaxed text-white/40 font-light">
              Building immersive web experiences where design meets engineering —
              Next.js, GSAP, React Three Fiber, and obsessive attention to detail.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex items-center gap-4 flex-wrap">
            <a
              href="#projects"
              className="flex items-center gap-3 px-7 py-3.5 bg-white text-black font-mono text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-colors duration-200"
            >
              View Work
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#contact"
              className="px-7 py-3.5 border border-white/22 text-white/60 font-mono text-xs tracking-[0.2em] uppercase hover:border-white/55 hover:text-white transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div
          ref={scrollRef}
          className="flex items-center justify-between px-6 md:px-14 max-w-[90rem] mx-auto w-full pb-10"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-px h-10 origin-top"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }}
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25">
              Scroll to explore
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/18 tracking-widest hidden md:block">
            01 / 05
          </span>
        </div>
      </motion.div>

      {/* ── Z3: Floating Interface Decorations (foreground) ─ */}
      <motion.div
        ref={floatRef}
        style={{ x: g3X, y: g3Y, willChange: "transform, opacity" }}
        className="absolute inset-0 pointer-events-none z-20"
        aria-hidden="true"
      >
        {/* Coordinates display */}
        <div className="absolute top-28 right-8 md:right-16 text-right hidden sm:block">
          <p className="font-mono text-[10px] text-white/18 tracking-widest leading-loose">
            37.7749° N<br />
            122.4194° W<br />
            <span className="text-white/12">SAN FRANCISCO</span>
          </p>
        </div>

        {/* Vertical tech pill stack — left edge */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6 flex flex-col gap-1.5">
          {["Next.js", "GSAP", "R3F"].map((t) => (
            <span
              key={t}
              className="font-mono text-[9px] px-2 py-1 border border-white/10 text-white/25 tracking-widest uppercase writing-mode-vertical"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Corner bracket — bottom right */}
        <div className="absolute bottom-24 right-8 md:right-16">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-18">
            <path d="M0 48 V0 H48" stroke="white" strokeWidth="0.75" />
            <path d="M8 48 V8 H48" stroke="white" strokeWidth="0.75" opacity="0.5" />
          </svg>
        </div>

        {/* System init text — top-left area */}
        <div className="absolute top-1/3 right-8 md:right-20 hidden lg:block">
          <p className="font-mono text-[9px] text-white/12 tracking-widest leading-loose">
            SYSTEM ONLINE<br />
            RENDER_ENGINE: R3F<br />
            BUILD: PRODUCTION
          </p>
        </div>
      </motion.div>

      {/* ── Z4: Ultra-fast corner accents (most responsive to mouse) ── */}
      <motion.div
        ref={ultraFgRef}
        style={{ x: g4X, y: g4Y, willChange: "transform, opacity" }}
        className="absolute inset-0 pointer-events-none z-[25]"
        aria-hidden="true"
      >
        {/* Top-left frame corner */}
        <div className="absolute top-20 left-10 md:left-16 w-10 h-10 border-l border-t border-white/15" />
        {/* Bottom-right frame corner */}
        <div className="absolute bottom-20 right-10 md:right-16 w-10 h-10 border-r border-b border-white/15" />
        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
        </div>
      </motion.div>
    </section>
  );
}
