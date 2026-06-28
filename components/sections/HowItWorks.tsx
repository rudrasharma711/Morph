"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import BrowserFrame from "@/components/ui/BrowserFrame";
import Constellation from "@/components/ui/Constellation";
import Reveal from "@/components/ui/Reveal";
import { useMounted, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Step = {
  index: string;
  title: string;
  copy: string;
  Visual: () => JSX.Element;
};

const STEPS: Step[] = [
  {
    index: "01",
    title: "Open Any Website",
    copy: "Land on any page — your inbox, a dashboard, a docs site. Morph reads the live layout in place.",
    Visual: OpenVisual,
  },
  {
    index: "02",
    title: "Describe What You Want",
    copy: "Type one plain sentence. No CSS, no extensions to configure — just the change you imagine.",
    Visual: DescribeVisual,
  },
  {
    index: "03",
    title: "Watch It Transform",
    copy: "Morph rebuilds the interface around your intent, snapping fresh widgets into a living layout.",
    Visual: TransformVisual,
  },
];

export default function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 60%"],
  });

  return (
    <Section id="how" leadingHairline>
      {/* Header */}
      <div className="flex flex-col items-start gap-6">
        <Eyebrow index="04">How It Works</Eyebrow>
        <SectionHeading>Three steps to a web that&rsquo;s yours.</SectionHeading>
      </div>

      {/* Steps with vertical progress rail */}
      <div ref={trackRef} className="relative mt-20 md:mt-28">
        <ProgressRail progress={scrollYProgress} />

        <div className="flex flex-col gap-28 md:gap-44">
          {STEPS.map((step, i) => (
            <StepBlock key={step.index} step={step} reversed={i % 2 === 1} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
 * Vertical progress rail — fills with scroll via scaleY (transform only)
 * ------------------------------------------------------------------------- */

function ProgressRail({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const scaleY = useTransform(progress, [0, 1], [0, 1]);
  // Traveling pulse dot that rides the filled portion of the rail.
  const dotTop = useTransform(progress, [0, 1], ["0%", "100%"]);
  const dotOpacity = useTransform(progress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-[15px] top-2 hidden w-px md:block"
    >
      {/* Track */}
      <div className="absolute inset-0 w-px bg-white/[0.08]" />
      {/* Fill */}
      <motion.div
        style={{ scaleY }}
        className="absolute inset-0 w-px origin-top bg-gradient-to-b from-white/70 via-white/40 to-white/10 will-change-transform"
      />
      {/* Traveling pulse */}
      <motion.div
        style={{ top: dotTop, opacity: dotOpacity }}
        className="absolute left-1/2 -translate-x-1/2 will-change-transform"
      >
        <span className="relative flex h-2 w-2 -translate-y-1/2 items-center justify-center">
          <span className="absolute h-2 w-2 animate-ping rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Step block — alternating text / visual, revealed on scroll
 * ------------------------------------------------------------------------- */

function StepBlock({ step, reversed }: { step: Step; reversed: boolean }) {
  const { Visual } = step;
  return (
    <div className="relative md:pl-16">
      {/* Number node anchored on the rail (desktop) */}
      <div
        aria-hidden
        className="absolute left-0 top-0 hidden h-8 w-8 -translate-x-[calc(50%-15px)] items-center justify-center md:flex"
      >
        <motion.span
          variants={nodeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-white/30 bg-black"
        >
          <span className="h-1 w-1 rounded-full bg-white" />
        </motion.span>
      </div>

      <Reveal
        stagger={0.12}
        className={cn(
          "grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24",
          reversed && "md:[&>*:first-child]:order-2",
        )}
      >
        {/* Copy column */}
        <Reveal variant="item" className="flex flex-col items-start">
          <span className="font-mono text-7xl font-medium leading-none tracking-tightest text-white/70 sm:text-8xl">
            {step.index}
          </span>
          <h3 className="mt-6 text-3xl font-semibold tracking-tighter text-white sm:text-4xl">
            {step.title}
          </h3>
          <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-white/65 md:text-lg">
            {step.copy}
          </p>
        </Reveal>

        {/* Visual column */}
        <Reveal variant="item" className="will-change-transform">
          <Visual />
        </Reveal>
      </Reveal>
    </div>
  );
}

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

/* ----------------------------------------------------------------------------
 * 01 — Open Any Website: chrome draws in, content fades up
 * ------------------------------------------------------------------------- */

function OpenVisual() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="relative"
    >
      <div className="spotlight pointer-events-none absolute inset-0 opacity-60" />
      <BrowserFrame url="mail.morph.app/inbox" className="relative">
        <div className="grid h-[240px] grid-cols-[88px_1fr] sm:h-[260px] sm:grid-cols-[120px_1fr]">
          {/* Sidebar skeleton */}
          <div className="hidden flex-col gap-2 border-r border-white/12 p-3 sm:flex">
            <div className="mb-1 h-6 rounded-md bg-white/[0.14]" />
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className="h-2 rounded-full bg-white/[0.12]"
                style={{ width: `${80 - i * 12}%` }}
              />
            ))}
          </div>

          {/* Mail rows skeleton */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-white/12 px-4 py-2.5">
              <div className="h-2.5 w-14 rounded-full bg-white/[0.16]" />
              <div className="h-2 w-10 rounded-full bg-white/[0.12]" />
            </div>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-white/40" />
                <div className="h-2 w-16 shrink-0 rounded-full bg-white/[0.16] sm:w-20" />
                <div
                  className="h-2 min-w-0 flex-1 rounded-full bg-white/[0.12]"
                  style={{ maxWidth: `${72 - i * 6}%` }}
                />
                <div className="hidden h-2 w-8 shrink-0 rounded-full bg-white/[0.12] sm:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </BrowserFrame>
    </motion.div>
  );
}

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

/* ----------------------------------------------------------------------------
 * 02 — Describe What You Want: typing command bar + pulsing mark
 * ------------------------------------------------------------------------- */

const PROMPT = "Add a focus mode and hide the sidebar";

function DescribeVisual() {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const [typed, setTyped] = useState("");
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    if (reduced) {
      setTyped(PROMPT);
      setCaret(false);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        timers.push(t);
      });

    const run = async () => {
      while (!cancelled) {
        setCaret(true);
        setTyped("");
        await wait(800);
        for (let i = 1; i <= PROMPT.length; i++) {
          if (cancelled) return;
          setTyped(PROMPT.slice(0, i));
          await wait(46);
        }
        await wait(2200);
        if (cancelled) return;
        // brief delete to reset the loop
        for (let i = PROMPT.length; i >= 0; i--) {
          if (cancelled) return;
          setTyped(PROMPT.slice(0, i));
          await wait(18);
        }
        await wait(500);
      }
    };
    void run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [mounted, reduced]);

  return (
    <div className="relative rounded-2xl border border-white/12 bg-white/[0.05] p-6 sm:p-10">
      <div className="spotlight pointer-events-none absolute inset-0 opacity-50" />
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />

      {/* Pulsing brand mark */}
      <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center">
        <motion.span
          aria-hidden
          animate={
            reduced ? undefined : { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-16 w-16 rounded-full border border-white/[0.22]"
        />
        <motion.span
          aria-hidden
          animate={reduced ? undefined : { scale: [1, 1.18, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-10 w-10 rounded-full bg-white/[0.08]"
        />
        <Constellation
          size={40}
          morph
          interval={2200}
          glow
          className="relative text-white"
        />
      </div>

      {/* Command bar with live typing */}
      <div className="relative mx-auto max-w-md">
        <div className="glass flex items-center gap-3 rounded-xl border border-white/16 px-4 py-3.5">
          <Constellation
            size={16}
            morph
            interval={1800}
            edges={false}
            className="shrink-0 text-white/80"
          />
          <label htmlFor="morph-describe-demo" className="sr-only">
            Describe what you want Morph to build
          </label>
          <div
            id="morph-describe-demo"
            aria-live="polite"
            className="flex min-w-0 flex-1 items-center font-mono text-[13px] text-white/85"
          >
            <span className="truncate">
              {typed || (
                <span className="text-white/40">Describe what you want&hellip;</span>
              )}
            </span>
            {caret && (
              <motion.span
                aria-hidden
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-white"
              />
            )}
          </div>
          <span
            aria-hidden
            className="hidden shrink-0 rounded-md border border-white/16 bg-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-white/55 sm:inline-block"
          >
            &crarr;
          </span>
        </div>

        {/* Suggestion chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {["Dark mode", "Bigger type", "Hide ads"].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * 03 — Watch It Transform: widgets snap into a grid + Morphed chip
 * ------------------------------------------------------------------------- */

type Tile = { col: string; rows: number; lines: number; tag?: boolean };

const TILES: Tile[] = [
  { col: "col-span-2", rows: 2, lines: 3, tag: true },
  { col: "col-span-1", rows: 1, lines: 2 },
  { col: "col-span-1", rows: 1, lines: 2 },
  { col: "col-span-1", rows: 1, lines: 1 },
  { col: "col-span-2", rows: 1, lines: 2 },
];

function TransformVisual() {
  return (
    <div className="relative">
      <div className="spotlight pointer-events-none absolute inset-0 opacity-50" />
      <BrowserFrame
        url="mail.morph.app/inbox"
        className="relative"
        toolbarRight={
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.28] bg-white/[0.1] px-2 py-1">
            <Constellation size={12} morph interval={1600} edges={false} />
          </span>
        }
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          className="grid h-[260px] auto-rows-[1fr] grid-cols-3 gap-3 p-4 sm:h-[280px]"
        >
          {TILES.map((tile, i) => (
            <motion.div
              key={i}
              variants={tileVariants}
              className={cn(
                "relative flex flex-col gap-2.5 rounded-xl border p-3 will-change-transform",
                tile.tag ? "border-white/[0.3] bg-white/[0.07]" : "border-white/12 bg-white/[0.05]",
                tile.col,
                tile.rows === 2 ? "row-span-2" : "row-span-1",
              )}
            >
              {tile.tag && (
                <span className="mb-0.5 inline-flex items-center gap-1.5 self-start rounded-full border border-white/[0.28] bg-white/[0.1] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/45">
                  <Constellation size={11} morph={false} edges={false} />
                  Morph
                </span>
              )}
              <div className="h-2.5 w-2/3 rounded-full bg-white/[0.18]" />
              {Array.from({ length: tile.lines }).map((_, l) => (
                <div
                  key={l}
                  className="h-2 rounded-full bg-white/[0.12]"
                  style={{ width: `${92 - l * 18}%` }}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Morphed status chip */}
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.7 }}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/[0.32] bg-white/[0.18] px-3 py-1.5 backdrop-blur"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-black">
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M2.5 6.5l2.5 2.5 5-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-white">
            Morphed
          </span>
        </motion.div>
      </BrowserFrame>
    </div>
  );
}

const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};
