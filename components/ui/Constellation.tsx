"use client";

import { motion } from "framer-motion";
import {
  MARK_EDGES,
  MARK_SHAPES,
  MARK_SHAPE_ORDER,
} from "@/lib/constellation";
import { useCycle } from "@/lib/hooks";
import { EASE_IN_OUT_QUINT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const S = 100; // viewBox scale

type Props = {
  size?: number;
  className?: string;
  /** Shape keys to morph through (defaults to all). */
  shapes?: readonly string[];
  /** Whether to continuously morph between shapes. */
  morph?: boolean;
  /** Morph interval in ms. */
  interval?: number;
  strokeWidth?: number;
  /** Render a soft glow under the nodes. */
  glow?: boolean;
  /** Draw the connecting edges. */
  edges?: boolean;
};

/**
 * The Morph mark: a 7-node constellation that morphs between silhouettes
 * (M → star → arrow → scatter). Inherits `currentColor`, so it renders white
 * on dark and black on light without extra props.
 */
export default function Constellation({
  size = 32,
  className,
  shapes = MARK_SHAPE_ORDER,
  morph = true,
  interval = 2800,
  strokeWidth = 2.2,
  glow = false,
  edges = true,
}: Props) {
  const index = useCycle(shapes.length, interval, morph);
  const key = shapes[index] ?? "m";
  const pts = MARK_SHAPES[key] ?? MARK_SHAPES.m;
  const transition = { duration: 1.6, ease: EASE_IN_OUT_QUINT };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${S} ${S}`}
      fill="none"
      className={cn("overflow-visible text-current", className)}
      aria-hidden="true"
    >
      {glow && (
        <defs>
          <filter id="mark-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      <g filter={glow ? "url(#mark-glow)" : undefined}>
        {edges &&
          MARK_EDGES.map(([a, b], i) => (
            <motion.line
              key={`e-${i}`}
              stroke="currentColor"
              strokeWidth={strokeWidth * 0.55}
              strokeLinecap="round"
              strokeOpacity={0.4}
              animate={{
                x1: pts[a].x * S,
                y1: pts[a].y * S,
                x2: pts[b].x * S,
                y2: pts[b].y * S,
              }}
              transition={transition}
            />
          ))}

        {pts.map((_, i) => (
          <motion.circle
            key={`n-${i}`}
            r={i === 2 ? strokeWidth * 1.5 : strokeWidth * 1.15}
            fill="currentColor"
            animate={{ cx: pts[i].x * S, cy: pts[i].y * S }}
            transition={transition}
          />
        ))}
      </g>
    </svg>
  );
}
