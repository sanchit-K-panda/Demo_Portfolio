"use client";

/**
 * useScrollAnimation — attaches a GSAP ScrollTrigger animation to a React
 * element ref, with automatic cleanup on unmount.
 *
 * Why:
 *   Section components that use GSAP ScrollTrigger all follow the same
 *   pattern (gsap.context → cleanup on revert).  This hook centralises
 *   that boilerplate so section files only need to describe WHAT happens.
 *
 * Usage:
 *   const ref = useScrollAnimation<HTMLElement>((el, gsapCtx) => {
 *     gsapCtx.add(() => {
 *       gsap.to(el, { ... scrollTrigger: { trigger: el, ... } });
 *     });
 *   });
 *
 *   return <section ref={ref}>...</section>;
 *
 * The setup callback is called once after the element mounts.
 * deps[] can be provided if the animation depends on changing props/state.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SetupFn<T extends Element> = (
  element: T,
  ctx: gsap.Context,
) => void;

export function useScrollAnimation<T extends Element>(
  setup: SetupFn<T>,
  deps: React.DependencyList = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      setup(el, ctx);
    }, el);

    return () => ctx.revert();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Convenience helper: create a ScrollTrigger-animated section entrance.
 *
 * Returns a RefObject<T>.  Mount it on the section's root element.
 * The stagger-reveal runs once when the section enters the viewport.
 *
 * @param selectors  CSS selectors for child elements to reveal, in order.
 * @param triggerStart  ScrollTrigger start value (e.g. "top 80%").
 */
export function useSectionEntrance<T extends Element>(
  selectors: string[],
  triggerStart = "top 75%",
) {
  return useScrollAnimation<T>(
    (el, ctx) => {
      ctx.add(() => {
        selectors.forEach((selector, i) => {
          const targets = el.querySelectorAll(selector);
          if (!targets.length) return;

          gsap.fromTo(
            targets,
            { y: 36, opacity: 0, filter: "blur(6px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.85,
              stagger: 0.07,
              ease: "power3.out",
              delay: i * 0.05,
              scrollTrigger: {
                trigger: el,
                start: triggerStart,
                once: true,
              },
            },
          );
        });
      });
    },
    [],
  );
}
