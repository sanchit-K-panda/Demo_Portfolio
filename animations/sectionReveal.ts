/**
 * sectionReveal — reusable GSAP ScrollTrigger reveal factories.
 *
 * Usage:
 *   import { sectionReveal, glitchReveal } from "@/animations/sectionReveal";
 *
 *   // inside useEffect + gsap.context:
 *   sectionReveal(triggerEl, ".stat-item", { stagger: 0.08 });
 *   glitchReveal(triggerEl, headlineEl);
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface RevealOptions {
  /** Extra vars merged into the fromTo "from" state */
  from?: Partial<gsap.TweenVars>;
  /** Extra vars merged into the fromTo "to" state */
  to?: Partial<gsap.TweenVars>;
  stagger?: number | gsap.StaggerVars;
  start?: string;
  end?: string;
  /** false = trigger once per page load, number = smooth scrub factor */
  scrub?: false | number;
  /** When true the animation plays once and never reverses */
  once?: boolean;
}

/**
 * Standard blur-slide-up reveal.
 * Elements animate from below + blurred → clean.
 */
export function sectionReveal(
  trigger: Element | string | null,
  targets: gsap.DOMTarget,
  opts: RevealOptions = {},
): gsap.core.Timeline {
  const {
    from    = {},
    to      = {},
    stagger = 0.08,
    start   = "top 78%",
    end     = "top 40%",
    scrub   = false,
    once    = true,
  } = opts;

  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: scrub === false ? undefined : scrub,
      toggleActions: once ? "play none none none" : "play none none reverse",
    },
  }).fromTo(
    targets,
    { y: 44, opacity: 0, filter: "blur(8px)", ...from },
    {
      y: 0, opacity: 1, filter: "blur(0px)",
      duration: 0.9, stagger, ease: "power3.out", ...to,
    },
  );
}

/**
 * Glitch materialise reveal — element appears through a brief chromatic flicker.
 * Best for headlines and large single elements.
 */
export function glitchReveal(
  trigger: Element | string | null,
  targets: gsap.DOMTarget,
  opts: Pick<RevealOptions, "start" | "stagger" | "once"> = {},
): gsap.core.Timeline {
  const { start = "top 82%", stagger = 0.06, once = true } = opts;

  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      toggleActions: once ? "play none none none" : "play none none reverse",
    },
  })
    .fromTo(
      targets,
      { x: -5, skewX: 9, opacity: 0, filter: "blur(10px)" },
      { x:  4, skewX: -5, opacity: 0.75, filter: "blur(4px)", duration: 0.07, stagger, ease: "none" },
    )
    .to(targets, {
      x: -2, skewX: 3, opacity: 0.9, duration: 0.06, stagger, ease: "none",
    })
    .to(targets, {
      x: 0, skewX: 0, opacity: 1, filter: "blur(0px)",
      duration: 0.6, stagger, ease: "power3.out",
    });
}

/**
 * Staggered line reveal — each element clips upward from an overflow:hidden parent.
 * Works best when each target is wrapped in overflow:hidden.
 */
export function lineReveal(
  trigger: Element | string | null,
  targets: gsap.DOMTarget,
  opts: Pick<RevealOptions, "start" | "stagger" | "once" | "to"> = {},
): gsap.core.Timeline {
  const { start = "top 80%", stagger = 0.1, once = true, to = {} } = opts;

  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      toggleActions: once ? "play none none none" : "play none none reverse",
    },
  }).fromTo(
    targets,
    { y: "110%", opacity: 0 },
    {
      y: "0%", opacity: 1,
      duration: 1.1, stagger, ease: "expo.out", ...to,
    },
  );
}
