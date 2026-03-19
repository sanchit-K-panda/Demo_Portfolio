"use client";

import { useEffect, useRef } from "react";

export interface MousePos {
  x: number; // normalised  −1..1
  y: number; // normalised  −1..1
}

/**
 * Returns a ref that tracks a smoothly interpolated mouse position.
 * x/y are normalised to −1..1 (centre = 0).
 *
 * @param lerpFactor  How fast to chase the cursor (0.04 = slow, 0.15 = snappy)
 */
export function useMousePosition(lerpFactor = 0.07) {
  const pos    = useRef<MousePos>({ x: 0, y: 0 });
  const target = useRef<MousePos>({ x: 0, y: 0 });
  const raf    = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * lerpFactor;
      pos.current.y += (target.current.y - pos.current.y) * lerpFactor;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [lerpFactor]);

  return pos;
}
