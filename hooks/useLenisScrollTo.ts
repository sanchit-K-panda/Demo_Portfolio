"use client";

/**
 * useLenisScrollTo — returns a stable scrollTo function that navigates
 * using Lenis when available, falling back to native scrollIntoView.
 *
 * Usage:
 *   const scrollTo = useLenisScrollTo();
 *   <button onClick={() => scrollTo("#contact")}>Contact</button>
 *
 * The offset defaults to -68px (navbar height) so the section headline
 * is never hidden behind the fixed nav.
 */
import { useCallback } from "react";
import { useLenis } from "@/components/providers/LenisProvider";

const DEFAULT_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
const NAV_HEIGHT = 68;

export interface ScrollToOptions {
  /** Pixels to offset from target top. Defaults to −NAV_HEIGHT. */
  offset?: number;
  /** Duration in seconds. Defaults to 1.4. */
  duration?: number;
  /** Called when the scroll animation completes. */
  onComplete?: () => void;
}

export function useLenisScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (href: string, options: ScrollToOptions = {}) => {
      const { offset = -NAV_HEIGHT, duration = 1.4, onComplete } = options;

      if (lenis) {
        lenis.scrollTo(href, {
          offset,
          duration,
          easing: DEFAULT_EASING,
          lock: false,
          onComplete,
        });
      } else {
        // Lenis isn't ready yet (SSR / very first tick) — native fallback
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        onComplete?.();
      }
    },
    [lenis],
  );
}
