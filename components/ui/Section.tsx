"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, VIEWPORT } from "@/lib/motion";

/** Outer section wrapper with consistent vertical rhythm + max width. */
export function Section({
  id,
  className,
  children,
  leadingHairline = false,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** Draw a hairline divider along the top edge. */
  leadingHairline?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full px-6 py-20 sm:px-8 md:py-24 lg:py-28",
        leadingHairline && "border-t border-white/[0.06]",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

/** Small monospace eyebrow label with a leading dot. */
export function Eyebrow({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60",
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-white/70" />
      {index && <span className="text-white/45">{index}</span>}
      <span>{children}</span>
    </motion.div>
  );
}

/** Large display heading, balanced. */
export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn(
        "max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-tighter text-white sm:text-5xl md:text-6xl",
        className,
      )}
    >
      {children}
    </motion.h2>
  );
}

/** Supporting paragraph under a heading. */
export function Lede({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn(
        "max-w-2xl text-pretty text-lg leading-relaxed text-white/55 md:text-xl",
        className,
      )}
    >
      {children}
    </motion.p>
  );
}
