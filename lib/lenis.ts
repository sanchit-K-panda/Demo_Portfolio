/**
 * Lenis smooth-scroll singleton.
 * Initialised once in the root layout client component.
 * Exposes the instance so GSAP ScrollTrigger can sync with it.
 */
import Lenis from "@studio-freight/lenis";

let lenisInstance: Lenis | null = null;

export function createLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration:    1.2,
    easing:      (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/**
 * Scroll to a target using Lenis (falls back to native if Lenis not ready).
 * Safe to call at any time — no-ops if instance is null.
 */
export function lenisScrollTo(
  target: string | number | HTMLElement,
  options?: {
    offset?:     number;
    duration?:   number;
    easing?:     (t: number) => number;
    immediate?:  boolean;
    lock?:       boolean;
    onComplete?: () => void;
  },
): void {
  if (lenisInstance) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (lenisInstance as any).scrollTo(target, options);
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}
