"use client";

/**
 * LenisProvider — Lenis smooth scroll + GSAP ScrollTrigger integration.
 *
 * Architecture
 * ─────────────
 *  1. Lenis instance lives in React context so any component can reliably
 *     bind to it AFTER it has been created (via useLenis()).
 *
 *  2. We drive Lenis from gsap.ticker instead of a raw requestAnimationFrame
 *     loop.  This ensures Lenis ticks on the same frame as every GSAP tween,
 *     eliminating off-frame jitter.
 *
 *  3. Every Lenis scroll event calls ScrollTrigger.update() so that
 *     GSAP pinned sections, parallax layers, and scrub timelines all advance
 *     in perfect lock-step with the smoothed scroll position.
 *
 *  4. ScrollTrigger.refresh() is deferred with a double-RAF so it fires
 *     AFTER the browser has painted the full initial layout.  Calling it any
 *     earlier can produce wrong start/end offsets for pinned sections.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createLenis, destroyLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// ── Context ───────────────────────────────────────────────────────────────────
const LenisContext = createContext<Lenis | null>(null);

/**
 * useLenis — returns the Lenis instance.
 * Will be null on the first render (before LenisProvider's effect runs).
 * Components should treat null as "not ready yet":
 *
 *   const lenis = useLenis();
 *   useEffect(() => {
 *     if (!lenis) return;          // wait for it
 *     lenis.on("scroll", handler);
 *     return () => lenis.off("scroll", handler);
 *   }, [lenis]);                   // re-runs once lenis is available
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const l = createLenis();

    // ── 1. Push the instance into context so descendant components can bind ──
    setLenis(l);

    // ── 2. Sync Lenis → ScrollTrigger ───────────────────────────────────────
    // Every time Lenis fires a scroll event we tell ScrollTrigger the new
    // position, so all scrub timelines and pinned sections update correctly.
    l.on("scroll", ScrollTrigger.update);

    // ── 3. Drive Lenis from GSAP ticker (single rAF, no double-loop) ────────
    const gsapTick = (time: number) => {
      // GSAP passes seconds; Lenis.raf() expects DOMHighResTimeStamp (ms)
      l.raf(time * 1000);
    };
    gsap.ticker.add(gsapTick);
    // Disable lag smoothing — we want frame-accurate scroll positions
    gsap.ticker.lagSmoothing(0);

    // ── 4. Refresh ScrollTrigger after the first full paint ─────────────────
    // Double-RAF: outer = after this commit; inner = after next paint.
    // By then every section's useEffect has registered its triggers.
    let rafA: number;
    let rafB: number;
    rafA = requestAnimationFrame(() => {
      rafB = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(rafA);
      cancelAnimationFrame(rafB);
      l.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(gsapTick);
      destroyLenis();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
