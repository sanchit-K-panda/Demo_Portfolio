"use client";

/**
 * Navbar — Animated B&W navigation.
 *
 * Architecture
 * ────────────
 *  • GSAP: entrance slide-in from top (on mount)
 *  • Framer Motion: active-link indicator (layoutId spring), progress bar
 *    (motionValue → no state re-renders), mobile menu (clipPath wipe)
 *  • Lenis: scrollTo() for smooth section jumps (via useLenis context)
 *  • CSS group-hover: letter-slide effect on each nav label
 *  • Glitch: whileTap filter-drop-shadow burst on each link
 */
import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { useLenis } from "@/components/providers/LenisProvider";
import { lenisScrollTo } from "@/lib/lenis";

const SCROLL_EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
const SCROLL_DURATION = 1.6;

const LINKS = [
  { href: "#hero",     label: "Home",     num: "01" },
  { href: "#about",    label: "About",    num: "02" },
  { href: "#skills",   label: "Skills",   num: "03" },
  { href: "#projects", label: "Projects", num: "04" },
  { href: "#contact",  label: "Contact",  num: "05" },
];

// ── Hover: per-letter Framer Motion stagger ──────────────────────────────────
// isHovered is passed from parent state — no CSS group-hover dependencies.
function NavLabel({ label, isHovered }: { label: string; isHovered: boolean }) {
  const chars = label.split("");
  const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];
  return (
    <span
      className="relative flex overflow-hidden pointer-events-none"
      style={{ height: "1.1em", lineHeight: "1.1em" }}
    >
      {/* Primary row — slides up per-letter */}
      {chars.map((ch, i) => (
        <motion.span
          key={`a${i}`}
          animate={{ y: isHovered ? "-100%" : "0%" }}
          transition={{ duration: 0.2, delay: i * 0.022, ease: easing }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {ch}
        </motion.span>
      ))}
      {/* Ghost row — rises from below per-letter */}
      <span className="absolute inset-0 flex opacity-55">
        {chars.map((ch, i) => (
          <motion.span
            key={`b${i}`}
            animate={{ y: isHovered ? "0%" : "100%" }}
            transition={{ duration: 0.22, delay: i * 0.022, ease: easing }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

export default function Navbar() {
  const headerRef     = useRef<HTMLElement>(null);
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive]         = useState("#hero");
  const lenis = useLenis();

  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const ctaScanRef  = useRef<HTMLSpanElement>(null);
  const prevActive  = useRef(active);

  // ── Cursor spotlight — pure MotionValues, zero re-renders ─────────────────
  const spotlightX      = useMotionValue(-300);
  const navHoverOpacity = useMotionValue(0);
  const navHoverSpring  = useSpring(navHoverOpacity, { damping: 22, stiffness: 100 });
  const spotlightBg     = useTransform(
    spotlightX,
    (v) => `radial-gradient(260px circle at ${v}px 34px, rgba(255,255,255,0.05), transparent 65%)`,
  );

  // MotionValue for progress bar — avoids React re-renders on every scroll tick
  const barProgress = useMotionValue(0);

  // ── GSAP entrance ───────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -72, opacity: 0 },
        { y:   0, opacity: 1, duration: 1.0, ease: "expo.out", delay: 0.25,
          clearProps: "transform" },
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  // ── Scroll progress + backdrop (driven by Lenis or native fallback) ────────
  useEffect(() => {
    const update = ({ progress, scroll }: { progress: number; scroll: number }) => {
      barProgress.set(progress);
      setScrolled(scroll > 40);
    };

    if (lenis) {
      // Lenis exposes `progress` directly — zero calculation overhead
      lenis.on("scroll", update);
      return () => lenis.off("scroll", update);
    }

    // Fallback: native scroll (covers SSR hydration gap)
    const onNative = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(1, window.scrollY / Math.max(1, total));
      barProgress.set(p);
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onNative, { passive: true });
    onNative();
    return () => window.removeEventListener("scroll", onNative);
  }, [lenis, barProgress]);

  // ── Active section (stable IntersectionObserver ranking by visibility) ───
  useEffect(() => {
    const ratioByHref = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const href = `#${(entry.target as HTMLElement).id}`;
          ratioByHref.set(href, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        setActive((prev) => {
          let next = prev;
          let bestRatio = 0;

          LINKS.forEach(({ href }) => {
            const ratio = ratioByHref.get(href) ?? 0;
            if (ratio > bestRatio) {
              bestRatio = ratio;
              next = href;
            }
          });

          return bestRatio > 0 ? next : prev;
        });
      },
      {
        rootMargin: "-22% 0px -22% 0px",
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
      },
    );

    LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      ratioByHref.set(href, 0);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Close mobile on resize ─────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Glitch burst when active section changes ───────────────────────────────
  useEffect(() => {
    if (active === prevActive.current) return;
    const el = headerRef.current?.querySelector<HTMLElement>(`[data-href="${active}"]`);
    if (el) {
      gsap.to(el, {
        keyframes: [
          { opacity: 0.8, x: -1, duration: 0.06 },
          { opacity: 1, x: 0, duration: 0.18, ease: "power2.out" },
        ],
        ease: "none",
        overwrite: "auto",
        clearProps: "opacity,transform",
      });
    }
    prevActive.current = active;
  }, [active]);

  // ── Smooth scroll to section ───────────────────────────────────────────────
  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    lenisScrollTo(href, { duration: SCROLL_DURATION, easing: SCROLL_EASE });
  }, []);

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ opacity: 0 }} // GSAP sets this to 1
        aria-label="Main navigation"
        onMouseMove={(e) => {
          spotlightX.set(e.clientX - e.currentTarget.getBoundingClientRect().left);
          navHoverOpacity.set(1);
        }}
        onMouseLeave={() => navHoverOpacity.set(0)}
      >
        {/* Cursor spotlight — radial glow follows mouse X across navbar */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: spotlightBg, opacity: navHoverSpring }}
          aria-hidden="true"
        />
        {/* Animated backdrop (motion separates it from GSAP target) */}
        <motion.div
          className="absolute inset-0 border-b"
          animate={{
            backdropFilter:  scrolled ? "blur(16px) saturate(140%)" : "blur(0px)",
            backgroundColor: scrolled ? "rgba(0,0,0,0.84)" : "rgba(0,0,0,0)",
            borderColor:     scrolled ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0)",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          aria-hidden="true"
        />

        <div className="relative max-w-[90rem] mx-auto px-6 md:px-14 h-[68px] flex items-center justify-between">

          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={e => { e.preventDefault(); scrollTo("#hero"); }}
            className="font-mono text-[11px] tracking-[0.4em] uppercase text-white/55 relative z-10"
            whileHover={{ color: "rgba(255,255,255,1)", letterSpacing: "0.52em" }}
            whileTap={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))", scale: 0.97 }}
            transition={{ duration: 0.25 }}
            aria-label="Scroll to top"
          >
            S_DEV
          </motion.a>

          {/* Desktop nav */}
          <nav aria-label="Section navigation" className="hidden md:flex items-center gap-8">
            {LINKS.map(({ href, label, num }) => {
              const isActive = active === href;
              return (
                <motion.a
                  key={href}
                  href={href}
                  data-href={href}
                  onClick={e => { e.preventDefault(); scrollTo(href); }}
                  onHoverStart={() => setHoveredHref(href)}
                  onHoverEnd={() => setHoveredHref(null)}
                  whileTap={{
                    filter: "drop-shadow(2px 0 0 rgba(255,255,255,0.9)) drop-shadow(-2px 0 0 rgba(255,255,255,0.6))",
                    opacity: 0.75,
                  }}
                  animate={{ color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.30)" }}
                  className="relative flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em] uppercase py-1 select-none"
                  transition={{ color: { duration: 0.22 }, filter: { duration: 0.12 } }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Index number */}
                  <motion.span
                    className="font-mono text-[9px] leading-none transition-opacity duration-200"
                    animate={{ opacity: isActive ? 0.5 : 0.2 }}
                  >
                    {num}
                  </motion.span>

                  {/* Label — per-letter Framer Motion stagger */}
                  <NavLabel label={label} isHovered={hoveredHref === href} />

                  {/* Spring-animated active underline */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-white/70"
                      transition={{ type: "spring", stiffness: 300, damping: 34, mass: 0.8 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          {/* CTA */}
          <motion.a
            href="#contact"
            onClick={e => { e.preventDefault(); scrollTo("#contact"); }}
            className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase px-4 py-2 border border-white/16 text-white/38 relative overflow-hidden"
            whileHover={{ borderColor: "rgba(255,255,255,0.65)", color: "rgba(255,255,255,1)" }}
            whileTap={{ scale: 0.96, opacity: 0.7 }}
            transition={{ duration: 0.2 }}
            onHoverStart={() => {
              const el = ctaScanRef.current;
              if (!el) return;
              gsap.fromTo(
                el,
                { x: "-101%", opacity: 0.22 },
                { x: "101%", duration: 0.5, ease: "power1.in",
                  onComplete: () => { gsap.set(el, { x: "-101%", opacity: 0 }); } },
              );
            }}
          >
            <span
              ref={ctaScanRef}
              className="absolute inset-0 bg-white pointer-events-none"
              style={{ opacity: 0, transform: "translateX(-101%)" }}
              aria-hidden="true"
            />
            Hire me
          </motion.a>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex md:hidden flex-col gap-[5px] p-2 z-10"
            onClick={() => setMobileOpen(v => !v)}
          >
            <motion.span
              className="block h-px bg-white"
              animate={mobileOpen ? { rotate: 45, y: 6, width: "24px" } : { rotate: 0, y: 0, width: "24px" }}
              transition={{ duration: 0.24 }}
            />
            <motion.span
              className="block h-px bg-white"
              animate={mobileOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: "16px" }}
              transition={{ duration: 0.18 }}
            />
            <motion.span
              className="block h-px bg-white"
              animate={mobileOpen ? { rotate: -45, y: -6, width: "24px" } : { rotate: 0, y: 0, width: "24px" }}
              transition={{ duration: 0.24 }}
            />
          </button>
        </div>

        {/* Progress bar — GPU-composited scaleX, no width thrashing */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-white/6" aria-hidden="true">
          <motion.div
            className="h-full w-full bg-white/50 origin-left"
            style={{ scaleX: barProgress }}
          />
        </div>
      </header>

      {/* ── Mobile overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center"
          >
            {/* Pixel grid overlay inside mobile menu */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)," +
                  "linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <nav className="relative flex flex-col items-center gap-8" aria-label="Mobile navigation">
              {LINKS.map(({ href, label, num }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={e => { e.preventDefault(); scrollTo(href); }}
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.96, opacity: 0.6 }}
                  className={`flex items-center gap-4 font-display font-bold transition-colors ${
                    active === href ? "text-white" : "text-white/40"
                  }`}
                  style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}
                >
                  <span className="font-mono text-[10px] text-white/22 self-start" style={{ marginTop: "0.45em" }}>
                    {num}
                  </span>
                  {label}
                </motion.a>
              ))}
            </nav>

            {/* Close chip */}
            <button
              type="button"
              aria-label="Close menu"
              className="absolute top-5 right-6 font-mono text-[10px] text-white/30 tracking-widest uppercase hover:text-white transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              [ESC]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
