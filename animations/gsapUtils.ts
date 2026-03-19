/**
 * Shared GSAP animation utilities — import helpers rather than
 * re-registering ScrollTrigger in every component.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once at module level (safe to call multiple times)
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// ── Scroll-reveal: fade + translateY ─────────────────────────
export function revealY(
  target: gsap.TweenTarget,
  triggerEl: Element,
  opts: { y?: number; stagger?: number; start?: string; delay?: number } = {}
) {
  const { y = 50, stagger = 0.1, start = "top 82%", delay = 0 } = opts;
  return gsap.from(target, {
    y,
    opacity: 0,
    duration: 0.85,
    delay,
    stagger,
    ease: "power3.out",
    scrollTrigger: {
      trigger: triggerEl,
      start,
      toggleActions: "play none none none",
    },
  });
}

// ── Horizontal scrub gallery ──────────────────────────────────
export function createHorizontalScrub(
  sectionEl: Element,
  trackEl: Element,
  opts: { scrub?: number; padding?: number } = {}
) {
  const { scrub = 1.5, padding = 0 } = opts;
  const totalWidth = trackEl.scrollWidth - window.innerWidth + padding;

  return gsap.to(trackEl, {
    x: -totalWidth,
    ease: "none",
    scrollTrigger: {
      trigger: sectionEl,
      start: "top top",
      end: `+=${totalWidth}`,
      scrub,
      pin: true,
      anticipatePin: 1,
    },
  });
}

// ── Pinned section timeline ───────────────────────────────────
export function createPinnedTimeline(
  sectionEl: Element,
  opts: { duration?: number; scrub?: number } = {}
) {
  const { scrub = 1.2 } = opts;
  return gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: "top top",
      end: "+=180%",
      scrub,
      pin: true,
      anticipatePin: 1,
    },
  });
}
