"use client";

/**
 * useGlitch — reusable GSAP-driven pixel glitch effect hook.
 *
 * Usage:
 *   const { trigger, triggerFull } = useGlitch();
 *
 *   // Quick micro-glitch (for hover/click feedback):
 *   <button onMouseEnter={() => trigger(buttonRef.current)} />
 *
 *   // Full dramatic glitch (for entrance reveals):
 *   triggerFull(headlineRef.current, 1.5);
 */
import { useCallback } from "react";
import { gsap } from "gsap";

export interface GlitchOptions {
  /** Multiplier for displacement/skew intensity. Default: 1 */
  intensity?: number;
  /** Total timeline duration in seconds. Default: 0.28 */
  duration?: number;
}

export function useGlitch(defaults: GlitchOptions = {}) {
  const { intensity: defaultIntensity = 1, duration: defaultDuration = 0.28 } = defaults;

  /**
   * Micro-glitch — fast chromatic offset burst.
   * Ideal for nav click feedback, button presses.
   */
  const trigger = useCallback(
    (el: HTMLElement | null, opts: GlitchOptions = {}) => {
      if (!el) return;
      const k = opts.intensity ?? defaultIntensity;
      const d = opts.duration  ?? defaultDuration;

      return gsap.to(el, {
        keyframes: [
          { x: -3 * k, skewX:  6 * k, filter: "brightness(1.5)", duration: 0.05 },
          { x:  4 * k, skewX: -5 * k, filter: "brightness(0.6)", duration: 0.05 },
          { x: -1 * k, skewX:  2 * k, filter: "brightness(1.2)", duration: 0.05 },
          { x: 0,      skewX:  0,     filter: "brightness(1)",   duration: d * 0.65, ease: "power2.out" },
        ],
        ease: "none",
        clearProps: "transform,filter",
      });
    },
    [defaultIntensity, defaultDuration],
  );

  /**
   * Full glitch — dramatic entrance/reveal effect.
   * X-displacement + skew + opacity stutter.
   */
  const triggerFull = useCallback(
    (el: HTMLElement | null, opts: GlitchOptions = {}) => {
      if (!el) return;
      const k = opts.intensity ?? defaultIntensity;
      const d = opts.duration  ?? defaultDuration;

      return gsap.to(el, {
        keyframes: [
          { x:  -6 * k, skewX:  10 * k, opacity: 0.8, duration: 0.06 },
          { x:   7 * k, skewX:  -7 * k, opacity: 0.6, duration: 0.06 },
          { x:  -4 * k, skewX:   5 * k, opacity: 0.9, duration: 0.05 },
          { x:   2 * k, skewX:  -2 * k, opacity: 1,   duration: 0.05 },
          { x:   0,     skewX:   0,     opacity: 1,   duration: d * 0.7, ease: "expo.out" },
        ],
        ease: "none",
        clearProps: "transform,opacity",
      });
    },
    [defaultIntensity, defaultDuration],
  );

  /**
   * Scanline burst — fills element with brief horizontal scan brightness.
   * Purely CSS filter-based, no transform conflict.
   */
  const triggerScan = useCallback(
    (el: HTMLElement | null, opts: GlitchOptions = {}) => {
      if (!el) return;
      const d = opts.duration ?? defaultDuration;

      return gsap.to(el, {
        keyframes: [
          { filter: "brightness(1.8) contrast(1.2)", duration: 0.04 },
          { filter: "brightness(0.5) contrast(0.8)", duration: 0.04 },
          { filter: "brightness(1.3)",               duration: 0.04 },
          { filter: "brightness(1)",                 duration: d * 0.7, ease: "power2.out" },
        ],
        ease: "none",
        clearProps: "filter",
      });
    },
    [defaultDuration],
  );

  return { trigger, triggerFull, triggerScan };
}
