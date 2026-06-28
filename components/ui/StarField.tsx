"use client";

import { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { generateField, buildProximityEdges } from "@/lib/constellation";
import { cn } from "@/lib/utils";

type Props = {
  count?: number;
  seed?: number;
  className?: string;
  /** Connect nearby stars with hairlines. */
  edges?: boolean;
  edgeDist?: number;
  /** Parallax drift on scroll (px). 0 disables. */
  parallax?: number;
  opacity?: number;
};

/**
 * Deterministic background constellation field. Stars twinkle and (optionally)
 * connect into a network; the whole field can parallax on scroll.
 */
export default function StarField({
  count = 80,
  seed = 7,
  className,
  edges = false,
  edgeDist = 13,
  parallax = 0,
  opacity = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const stars = useMemo(() => generateField(count, seed), [count, seed]);
  const links = useMemo(
    () => (edges ? buildProximityEdges(stars, edgeDist) : []),
    [edges, stars, edgeDist],
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ y: parallax ? y : undefined, opacity }}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={stars[a].x}
            y1={stars[a].y}
            x2={stars[b].x}
            y2={stars[b].y}
            stroke="white"
            strokeOpacity={0.06}
            strokeWidth={0.08}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.r,
              height: s.r,
            }}
            initial={{ opacity: s.o * 0.4 }}
            animate={{ opacity: [s.o * 0.3, s.o, s.o * 0.3] }}
            transition={{
              duration: s.dur,
              delay: s.d,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
