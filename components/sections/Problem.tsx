"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Eyebrow, Lede } from "@/components/ui/Section";
import BrowserFrame from "@/components/ui/BrowserFrame";
import Constellation from "@/components/ui/Constellation";
import { useMousePosition, usePrefersReducedMotion } from "@/lib/hooks";
import {
  EASE_OUT_EXPO,
  SPRING_SNAPPY,
  VIEWPORT,
  fadeUp,
  staggerContainer,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/* The headline, split into clip-revealed lines. */
const HEADLINE: readonly string[] = [
  "Why Are We Still Using",
  "The Internet The Way",
  "Someone Else Designed It?",
];

type FrozenSite = {
  url: string;
  caption: string;
  render: () => JSX.Element;
};

export default function Problem() {
  const reduced = usePrefersReducedMotion();

  // Section-wide scroll progress for the suspended-card parallax.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const driftA = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 56, reduced ? 0 : -56]);
  const driftB = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 28, reduced ? 0 : -84]);
  const driftC = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 72, reduced ? 0 : -24]);
  const drifts: MotionValue<number>[] = [driftA, driftB, driftC];

  // Subtle mouse parallax so the frozen cards feel suspended in cold air.
  const { x: mx, y: my } = useMousePosition({ stiffness: 50, damping: 18, mass: 0.6 });
  const tiltX = useTransform(mx, (v) => (reduced ? 0 : v * 14));
  const tiltY = useTransform(my, (v) => (reduced ? 0 : v * 10));

  const sites: FrozenSite[] = [
    { url: "mail.google.com", caption: "No tasks. No focus.", render: GmailMock },
    { url: "linkedin.com/feed", caption: "No CRM. No pipeline.", render: LinkedInMock },
    { url: "youtube.com", caption: "Endless distractions.", render: YouTubeMock },
  ];

  return (
    <section
      id="problem"
      ref={ref}
      className="relative w-full overflow-hidden border-t border-white/[0.06] px-6 py-20 sm:px-8 md:py-24 lg:py-28"
    >
      {/* Cold, static backdrop */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-start">
          <Eyebrow index="01">The Problem</Eyebrow>

          <h2 className="mt-6 max-w-4xl text-balance font-semibold leading-[1.02] tracking-tighter text-white">
            {HEADLINE.map((line, i) => (
              <motion.span
                key={line}
                className="block overflow-hidden py-[0.04em]"
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
              >
                <motion.span
                  variants={{
                    hidden: { y: "110%" },
                    visible: {
                      y: "0%",
                      transition: {
                        duration: 1,
                        ease: EASE_OUT_EXPO,
                        delay: 0.08 + i * 0.1,
                      },
                    },
                  }}
                  className={cn(
                    "block text-4xl sm:text-5xl md:text-6xl",
                    i === HEADLINE.length - 1 ? "text-gradient-muted" : "text-gradient",
                  )}
                >
                  {line}
                </motion.span>
              </motion.span>
            ))}
          </h2>

          <Lede className="mt-7">
            We pour our days into the same handful of sites — yet none of them bend to
            how we actually work.
          </Lede>
        </div>

        {/* Centerpiece: three frozen, someone-else-designed sites */}
        <motion.div
          variants={staggerContainer(0.14, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-20 grid grid-cols-1 gap-8 md:mt-28 md:grid-cols-3 md:gap-6 lg:gap-8"
        >
          {sites.map((site, i) => (
            <FrozenCard
              key={site.url}
              site={site}
              drift={drifts[i]}
              tiltX={tiltX}
              tiltY={tiltY}
              reduced={reduced}
            />
          ))}
        </motion.div>

        {/* Transitional handoff */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-14 max-w-xl text-balance text-center text-lg font-medium tracking-tight text-white/70 md:mt-16 md:text-xl"
        >
          It doesn&apos;t have to be this way.
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * FrozenCard — a suspended, locked website mockup with a frustration micro-int.
 * ------------------------------------------------------------------------- */

function FrozenCard({
  site,
  drift,
  tiltX,
  tiltY,
  reduced,
}: {
  site: FrozenSite;
  drift: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  reduced: boolean;
}) {
  const Mock = site.render;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 36, scale: 0.97, filter: "blur(8px)" },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.85, ease: EASE_OUT_EXPO },
        },
      }}
      style={{ y: drift }}
      className="group/card relative will-transform"
    >
      <motion.div style={{ x: tiltX, y: tiltY }} className="will-transform">
        <BrowserFrame
          url={site.url}
          className="transition-shadow duration-500 group-hover/card:shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95)]"
          toolbarRight={
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
              <LockGlyph />
              Static
            </span>
          }
        >
          <div className="relative h-[260px] overflow-hidden sm:h-[280px]">
            {/* The frozen interface, desaturated and dimmed */}
            <div className="absolute inset-0 opacity-[0.78] [filter:saturate(0)]">
              <Mock />
            </div>

            {/* Frost / cold wash */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/40"
            />

            {/* Faint static scanlines — the "stuck" treatment */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.9)_3px,transparent_4px)]"
            />

            {/* Idle scan sweep — removed entirely under reduced motion */}
            {!reduced && (
              <motion.div
                aria-hidden
                initial={{ y: "-20%" }}
                animate={{ y: ["-20%", "120%"] }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.6,
                }}
                className="pointer-events-none absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent"
              />
            )}

            {/* The disabled control that jitters on hover — the click that goes nowhere */}
            <JitterControl reduced={reduced} />
          </div>
        </BrowserFrame>
      </motion.div>

      {/* Caption */}
      <div className="mt-5 flex items-center justify-between gap-3 px-1">
        <p className="text-sm font-medium tracking-tight text-white/70">
          {site.caption}
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <span className="h-1 w-1 rounded-full bg-white/[0.32]" />
          Locked
        </span>
      </div>
    </motion.div>
  );
}

/* A frozen "+ Add" affordance. Hovering it briefly shakes and snaps back. */
function JitterControl({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute bottom-4 right-4 z-10">
      <motion.button
        type="button"
        aria-label="Add — disabled on this static site"
        disabled
        whileHover={
          reduced ? undefined : { x: [0, -3, 3, -2, 2, 0], transition: { duration: 0.4 } }
        }
        transition={SPRING_SNAPPY}
        className="flex cursor-not-allowed items-center gap-1.5 rounded-md border border-dashed border-white/16 bg-white/[0.045] px-2.5 py-1.5 font-mono text-[11px] text-white/40 backdrop-blur-sm"
      >
        <span className="text-[13px] leading-none">+</span>
        Add
      </motion.button>
    </div>
  );
}

function LockGlyph() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * Mock interfaces — monochrome skeletons, recognizable in silhouette.
 * ------------------------------------------------------------------------- */

function TextLine({ w, dim = false }: { w: string; dim?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("block h-2 rounded-full", dim ? "bg-white/[0.12]" : "bg-white/[0.18]")}
      style={{ width: w }}
    />
  );
}

function GmailMock() {
  const rows: { from: string; len: string }[] = [
    { from: "62%", len: "82%" },
    { from: "48%", len: "64%" },
    { from: "70%", len: "90%" },
    { from: "44%", len: "55%" },
    { from: "58%", len: "76%" },
  ];
  return (
    <div className="grid h-full grid-cols-[64px_1fr] sm:grid-cols-[88px_1fr]">
      {/* Sidebar */}
      <div className="flex flex-col gap-2 border-r border-white/10 p-3">
        <span className="mb-2 h-7 rounded-full bg-white/[0.12]" />
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-2 rounded-full",
              i === 0 ? "bg-white/[0.18]" : "bg-white/[0.12]",
            )}
            style={{ width: i === 0 ? "70%" : `${60 - i * 6}%` }}
          />
        ))}
      </div>
      {/* List */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <TextLine w="40px" />
          <span className="h-2 w-12 rounded-full bg-white/[0.12]" />
        </div>
        {rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-2.5"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
            <span
              className="h-2 shrink-0 rounded-full bg-white/[0.18]"
              style={{ width: r.from }}
            />
            <span className="flex-1" />
            <span
              className="h-2 rounded-full bg-white/[0.12]"
              style={{ width: r.len, maxWidth: "55%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkedInMock() {
  return (
    <div className="grid h-full grid-cols-[1fr_72px] sm:grid-cols-[1fr_96px]">
      {/* Feed */}
      <div className="flex flex-col gap-3 p-4">
        {/* Post card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-full bg-white/[0.14]" />
            <div className="flex flex-1 flex-col gap-1.5">
              <TextLine w="50%" />
              <TextLine w="32%" dim />
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <TextLine w="92%" dim />
            <TextLine w="78%" dim />
          </div>
          <div className="mt-3 h-16 rounded-md bg-white/[0.12]" />
        </div>
        {/* Second post (peeking) */}
        <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-full bg-white/[0.14]" />
            <div className="flex flex-1 flex-col gap-1.5">
              <TextLine w="44%" />
              <TextLine w="28%" dim />
            </div>
          </div>
        </div>
      </div>
      {/* Rail */}
      <div className="flex flex-col gap-2.5 border-l border-white/10 p-3">
        <TextLine w="80%" dim />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-white/[0.14]" />
            <span
              className="h-2 rounded-full bg-white/[0.12]"
              style={{ width: `${60 - i * 8}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function YouTubeMock() {
  const tiles: number[] = [0, 1, 2, 3];
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="h-4 w-4 rounded-sm bg-white/[0.19]" />
        <span
          className="h-6 flex-1 rounded-full bg-white/[0.12]"
          style={{ maxWidth: "60%" }}
        />
        <span className="h-6 w-6 rounded-full bg-white/[0.14]" />
      </div>
      {/* Thumbnail grid */}
      <div className="grid flex-1 grid-cols-2 gap-3 p-4">
        {tiles.map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="relative aspect-video overflow-hidden rounded-md bg-white/[0.12]">
              <span className="absolute inset-0 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M5 3.5v9l7-4.5-7-4.5Z" fill="rgba(255,255,255,0.32)" />
                </svg>
              </span>
              <span className="absolute bottom-1.5 right-1.5 h-2 w-6 rounded-sm bg-black/50" />
            </div>
            <div className="flex gap-2">
              <span className="h-5 w-5 shrink-0 rounded-full bg-white/[0.14]" />
              <div className="flex flex-1 flex-col gap-1.5">
                <TextLine w="88%" />
                <TextLine w="50%" dim />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The missing focus widget — a ghosted "Morph could add this" hint */}
      <div className="flex items-center justify-between border-t border-white/14 px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <Constellation size={12} morph={false} edges={false} className="opacity-40" />
          Focus mode
        </span>
        <span className="font-mono text-[10px] text-white/40">unavailable</span>
      </div>
    </div>
  );
}
