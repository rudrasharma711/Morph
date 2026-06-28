"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useSpring,
  type MotionValue,
  type SpringOptions,
} from "framer-motion";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Track normalized pointer position (-0.5..0.5 from viewport center), spring-smoothed. */
export function useMousePosition(spring: SpringOptions = { stiffness: 120, damping: 20, mass: 0.4 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return { x: sx, y: sy };
}

/**
 * Magnetic interaction: returns a ref + spring-smoothed offsets that pull an
 * element toward the cursor while hovered.
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  strength = 0.4,
  spring: SpringOptions = { stiffness: 200, damping: 15, mass: 0.5 },
): {
  ref: React.RefObject<T>;
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const ref = useRef<T>(null);
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const x = useSpring(mvx, spring);
  const y = useSpring(mvy, spring);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      mvx.set(relX * strength);
      mvy.set(relY * strength);
    };
    const onLeave = () => {
      mvx.set(0);
      mvy.set(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mvx, mvy, strength]);

  return { ref, x, y };
}

/** Whether the user prefers reduced motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Returns true once the component has mounted on the client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Cycles an index 0..length-1 on an interval (for morph loops). */
export function useCycle(length: number, intervalMs: number, active = true) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active || length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [length, intervalMs, active]);
  return index;
}
