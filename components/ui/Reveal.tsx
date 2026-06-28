"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, scaleIn, staggerContainer, staggerItem, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const presets: Record<string, Variants> = {
  fadeUp,
  scaleIn,
  item: staggerItem,
};

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Animation preset for a single element. Ignored when `stagger` is set. */
  variant?: keyof typeof presets;
  /** If set, treat children as a stagger group with this delay between items. */
  stagger?: number;
  delay?: number;
  /** Render element tag. */
  as?: "div" | "section" | "ul" | "span" | "li";
};

/**
 * Scroll-triggered reveal. Use standalone for a single element, or pass
 * `stagger` and wrap `<Reveal variant="item">` children for staggered groups.
 */
export default function Reveal({
  children,
  className,
  variant = "fadeUp",
  stagger,
  delay = 0,
  as = "div",
}: Props) {
  const MotionTag = motion[as] as typeof motion.div;

  if (stagger != null) {
    return (
      <MotionTag
        className={className}
        variants={staggerContainer(stagger, delay)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={cn(className)}
      variants={presets[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
