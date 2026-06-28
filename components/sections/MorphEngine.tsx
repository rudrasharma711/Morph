"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Eyebrow, Lede, SectionHeading } from "@/components/ui/Section";
import Constellation from "@/components/ui/Constellation";
import StarField from "@/components/ui/StarField";
import { useMounted, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, fadeUp, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Stage definitions
 * ------------------------------------------------------------------------ */

type StageId = "prompt" | "analysis" | "structure" | "plan" | "result";

type Stage = {
  id: StageId;
  step: string;
  label: string;
  title: string;
  blurb: string;
};

const STAGES: Stage[] = [
  {
    id: "prompt",
    step: "01",
    label: "User Prompt",
    title: "You describe it.",
    blurb: "One plain sentence. No code, no config, no design tools.",
  },
  {
    id: "analysis",
    step: "02",
    label: "AI Analysis",
    title: "Morph parses intent.",
    blurb: "Your words are decomposed into structure, action and target.",
  },
  {
    id: "structure",
    step: "03",
    label: "Understanding",
    title: "It reads the page.",
    blurb: "The live DOM is mapped into a semantic model of the site.",
  },
  {
    id: "plan",
    step: "04",
    label: "Transformation Plan",
    title: "A plan is drafted.",
    blurb: "Surgical edits — inject, resize, restyle — never destructive.",
  },
  {
    id: "result",
    step: "05",
    label: "New Interface",
    title: "A new interface ships.",
    blurb: "Rendered instantly, in place, on the site you were already using.",
  },
];

const STAGE_COUNT = STAGES.length;

/* ---------------------------------------------------------------------------
 * Section
 * ------------------------------------------------------------------------ */

export default function MorphEngine() {
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The line fills early — completing while the pipeline is still on screen —
  // so every stage (including Transformation Plan + New Interface) is seen to
  // light up rather than activating after the rail has scrolled past the top.
  const fill = useTransform(scrollYProgress, [0.1, 0.42], [0, 1]);
  // Continuous 0..STAGE_COUNT value used to light nodes one-by-one.
  const progress = useTransform(fill, (v) => v * STAGE_COUNT);

  return (
    <section
      id="engine"
      ref={ref}
      className="grain relative w-full overflow-hidden border-t border-white/[0.06] px-6 py-20 sm:px-8 md:py-24 lg:py-28"
    >
      {/* Ambient backdrop */}
      <div className="spotlight pointer-events-none absolute inset-0" />
      <StarField count={48} seed={205} parallax={48} opacity={0.45} />
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Eyebrow index="02">The Engine</Eyebrow>
          <SectionHeading className="mt-6">
            One sentence in. A new interface out.
          </SectionHeading>
          <Lede className="mt-6">
            Behind the simplicity is a five-stage pipeline — your words become
            intent, intent becomes a plan, and the plan becomes a living
            redesign of the page in front of you.
          </Lede>
        </div>

        {/* Pipeline */}
        <div className="mt-20 md:mt-28">
          <Pipeline progress={progress} fill={fill} reduced={reduced} />
        </div>

        {/* Stage panels */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {STAGES.map((stage, i) => (
            <StagePanel
              key={stage.id}
              stage={stage}
              index={i}
              progress={progress}
              reduced={reduced}
              mounted={mounted}
            />
          ))}
        </div>
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Pipeline — the connected 5-node flow
 * ------------------------------------------------------------------------ */

function Pipeline({
  progress,
  fill,
  reduced,
}: {
  progress: MotionValue<number>;
  fill: MotionValue<number>;
  reduced: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-5xl" aria-hidden>
      {/* ---- Desktop: horizontal rail ---- */}
      <div className="relative hidden h-24 items-center lg:flex">
        {/* Base track */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.08]" />
        {/* Filling progress line (transform-only) */}
        <motion.div
          style={{ scaleX: reduced ? 1 : fill }}
          className="absolute left-0 right-0 top-1/2 h-px origin-left -translate-y-1/2 bg-gradient-to-r from-white/30 via-white/70 to-white/30"
        />
        {/* Traveling data dots */}
        {!reduced && <TravelDots axis="x" />}

        {/* Nodes */}
        <div className="relative flex w-full items-center justify-between">
          {STAGES.map((stage, i) => (
            <Node
              key={stage.id}
              stage={stage}
              index={i}
              progress={progress}
              reduced={reduced}
              axis="x"
            />
          ))}
        </div>
      </div>

      {/* ---- Mobile / tablet: vertical rail ---- */}
      <div className="relative flex w-full flex-col gap-12 pl-2 lg:hidden">
        <div className="absolute bottom-3 left-[13px] top-3 w-px bg-white/[0.08]" />
        <motion.div
          style={{ scaleY: reduced ? 1 : fill }}
          className="absolute bottom-3 left-[13px] top-3 w-px origin-top bg-gradient-to-b from-white/30 via-white/70 to-white/30"
        />
        {!reduced && <TravelDots axis="y" />}

        {STAGES.map((stage, i) => (
          <div key={stage.id} className="relative flex items-center gap-4">
            <Node
              stage={stage}
              index={i}
              progress={progress}
              reduced={reduced}
              axis="y"
            />
            <NodeCaption stage={stage} index={i} progress={progress} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Node — pulsing constellation point that lights when its stage activates
 * ------------------------------------------------------------------------ */

function Node({
  stage,
  index,
  progress,
  reduced,
  axis,
}: {
  stage: Stage;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
  axis: "x" | "y";
}) {
  // Activation ramps in as progress crosses this node's threshold.
  const active = useTransform(progress, [index + 0.05, index + 0.55], [0, 1]);
  const ringScale = useTransform(active, [0, 1], [0.6, 1]);
  const ringOpacity = useTransform(active, [0, 1], [0, 0.85]);
  const coreScale = useTransform(active, [0, 1], [0.7, 1]);
  const haloOpacity = useTransform(active, [0, 1], [0, 1]);
  const coreActiveOpacity = useTransform(active, [0, 1], [0, 1]);

  return (
    <div className="relative flex shrink-0 flex-col items-center">
      {/* Halo glow */}
      <motion.span
        style={{ opacity: reduced ? 0.5 : haloOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35),transparent_70%)] blur-md"
      />

      {/* Expanding ring */}
      <motion.span
        style={{
          x: "-50%",
          y: "-50%",
          scale: reduced ? 1 : ringScale,
          opacity: reduced ? 0.6 : ringOpacity,
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 rounded-full border border-white/60"
      />

      {/* Soft continuous pulse (transform / opacity only) */}
      {!reduced && (
        <motion.span
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.35, 0, 0.35] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-7 w-7 rounded-full border border-white/20"
        />
      )}

      {/* Core node */}
      <motion.span
        style={{ scale: reduced ? 1 : coreScale }}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-ink-900"
      >
        <motion.span
          style={{ opacity: reduced ? 1 : coreActiveOpacity }}
          className="absolute inset-0 rounded-full border border-white bg-white/25 shadow-[0_0_12px_2px_rgba(255,255,255,0.35)]"
        />
        <Constellation
          size={13}
          edges={false}
          morph={false}
          shapes={[stage.id === "result" ? "arrow" : "m"]}
          className="relative z-10 text-white/85"
        />
      </motion.span>

      {/* Desktop label below node */}
      {axis === "x" && (
        <NodeCaption
          stage={stage}
          index={index}
          progress={progress}
          className="mt-5 w-28 text-center"
        />
      )}
    </div>
  );
}

function NodeCaption({
  stage,
  index,
  progress,
  className,
}: {
  stage: Stage;
  index: number;
  progress: MotionValue<number>;
  className?: string;
}) {
  const opacity = useTransform(progress, [index - 0.1, index + 0.5], [0.4, 1]);
  return (
    <motion.div style={{ opacity }} className={className}>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
        {stage.step}
      </div>
      <div className="mt-1 text-[13px] font-medium leading-tight text-white/80">
        {stage.label}
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
 * Traveling data dots — looping pulses along the rail (transform-only)
 * ------------------------------------------------------------------------ */

function TravelDots({ axis }: { axis: "x" | "y" }) {
  const dots = [0, 1, 2, 3];
  return (
    <div
      className={cn(
        "pointer-events-none absolute",
        axis === "x"
          ? "left-0 right-0 top-1/2 h-px -translate-y-1/2"
          : "bottom-3 left-[13px] top-3 w-px",
      )}
    >
      {dots.map((d) => (
        <motion.span
          key={d}
          className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]"
          style={
            axis === "x"
              ? { top: "50%", left: 0, x: "-50%", y: "-50%" }
              : { left: "50%", top: 0, x: "-50%", y: "-50%" }
          }
          animate={
            axis === "x" ? { left: ["0%", "100%"] } : { top: ["0%", "100%"] }
          }
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: d * 0.85,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * StagePanel — scroll reveal + activation wash + per-stage micro-visual
 * ------------------------------------------------------------------------ */

function StagePanel({
  stage,
  index,
  progress,
  reduced,
  mounted,
}: {
  stage: Stage;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
  mounted: boolean;
}) {
  const active = useTransform(progress, [index + 0.1, index + 0.7], [0, 1]);
  const lift = useTransform(active, [0, 1], [10, 0]);
  const borderColor = useTransform(
    active,
    [0, 1],
    ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.16)"],
  );

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay: index * 0.06 }}
      className="group relative"
    >
      <motion.div
        style={{
          y: reduced ? 0 : lift,
          borderColor: reduced ? "rgba(255,255,255,0.12)" : borderColor,
        }}
        className="glass relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white/[0.05] p-5"
      >
        {/* Active wash */}
        <motion.div
          aria-hidden
          style={{ opacity: reduced ? 0.6 : active }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]"
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
            {stage.step} · {stage.label}
          </span>
          <motion.span
            style={{ opacity: reduced ? 1 : active }}
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
        </div>

        {/* Micro-visual */}
        <div className="relative z-10 mt-4 h-28">
          <StageVisual id={stage.id} reduced={reduced} mounted={mounted} />
        </div>

        {/* Copy */}
        <div className="relative z-10 mt-4">
          <h3 className="text-[15px] font-semibold tracking-tight text-white">
            {stage.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
            {stage.blurb}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
 * Per-stage micro-visuals
 * ------------------------------------------------------------------------ */

function StageVisual({
  id,
  reduced,
  mounted,
}: {
  id: StageId;
  reduced: boolean;
  mounted: boolean;
}) {
  switch (id) {
    case "prompt":
      return <PromptVisual reduced={reduced} />;
    case "analysis":
      return <AnalysisVisual reduced={reduced} mounted={mounted} />;
    case "structure":
      return <StructureVisual />;
    case "plan":
      return <PlanVisual reduced={reduced} />;
    case "result":
      return <ResultVisual />;
    default:
      return null;
  }
}

/* 01 — Prompt: a command bar with a mono sentence + caret */
function PromptVisual({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex items-center gap-2.5 rounded-lg border border-white/16 bg-black/40 px-3 py-3">
        <Constellation size={14} morph={!reduced} interval={1800} edges={false} />
        <span className="font-mono text-[12px] leading-none text-white/85">
          Add a to-do list to Gmail
        </span>
        {reduced ? (
          <span className="ml-0.5 inline-block h-[1.05em] w-[2px] bg-white/80" />
        ) : (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="ml-0.5 inline-block h-[1.05em] w-[2px] bg-white"
          />
        )}
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="rounded border border-white/16 bg-white/[0.08] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/55">
          ⌘ K
        </span>
        <span className="font-mono text-[10px] text-white/55">
          to invoke Morph
        </span>
      </div>
    </div>
  );
}

/* 02 — Analysis: scan line over a faint DOM grid, tokens lighting up */
function AnalysisVisual({
  reduced,
  mounted,
}: {
  reduced: boolean;
  mounted: boolean;
}) {
  const tokens = ["add", "to-do", "list", "→", "Gmail"];
  return (
    <div className="relative h-full overflow-hidden rounded-lg border border-white/12 bg-black/30">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      {/* Scan line */}
      {!reduced && mounted && (
        <motion.div
          aria-hidden
          initial={{ y: "-120%" }}
          animate={{ y: "120%" }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-white/[0.22] to-transparent"
        />
      )}
      {/* Tokens */}
      <div className="relative flex h-full flex-wrap content-center items-center gap-1.5 p-3">
        {tokens.map((t, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.3 }}
            animate={reduced ? { opacity: 0.8 } : { opacity: [0.3, 1, 0.3] }}
            transition={
              reduced
                ? undefined
                : { duration: 2.2, repeat: Infinity, delay: i * 0.18 }
            }
            className={cn(
              "rounded border px-2 py-1 font-mono text-[10px]",
              t === "→"
                ? "border-white/16 text-white/55"
                : "border-white/22 bg-white/[0.09] text-white/80",
            )}
          >
            {t}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* 03 — Understanding: a parsed DOM tree with hairlines */
function StructureVisual() {
  const nodes: { label: string; depth: number; tag: string }[] = [
    { label: "body", depth: 0, tag: "root" },
    { label: "header", depth: 1, tag: "nav" },
    { label: "sidebar", depth: 1, tag: "list" },
    { label: "inbox", depth: 2, tag: "feed" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {nodes.map((n, i) => (
        <div
          key={i}
          className="flex items-center gap-2"
          style={{ paddingLeft: n.depth * 14 }}
        >
          {n.depth > 0 && (
            <span className="h-2.5 w-2.5 shrink-0 rounded-bl-[3px] border-b border-l border-white/22" />
          )}
          <span className="rounded border border-white/18 bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-white/75">
            {n.label}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/45">
            {n.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

/* 04 — Plan: a diff / checklist with mono markers */
function PlanVisual({ reduced }: { reduced: boolean }) {
  const lines: { marker: "+" | "~" | "✓"; text: string }[] = [
    { marker: "+", text: "inject TaskPanel" },
    { marker: "~", text: "resize InboxList" },
    { marker: "~", text: "restyle toolbar" },
    { marker: "✓", text: "keep all data" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{
            duration: 0.5,
            ease: EASE_OUT_EXPO,
            delay: reduced ? 0 : i * 0.08,
          }}
          className="flex items-center gap-2 font-mono text-[11px]"
        >
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border text-[10px]",
              l.marker === "✓"
                ? "border-white/60 bg-white text-black"
                : "border-white/28 text-white/80",
            )}
          >
            {l.marker}
          </span>
          <span className="text-white/70">{l.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* 05 — Result: a clean two-pane mock with a Morph badge + check */
function ResultVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-lg border border-white/12 bg-black/30 p-2">
      <div className="flex h-full gap-2">
        {/* Left pane (original) */}
        <div className="flex flex-1 flex-col gap-1.5 rounded-md bg-white/[0.05] p-2">
          <div className="h-1.5 w-3/4 rounded-full bg-white/[0.18]" />
          <div className="h-1.5 w-full rounded-full bg-white/[0.12]" />
          <div className="h-1.5 w-5/6 rounded-full bg-white/[0.12]" />
          <div className="mt-auto h-1.5 w-1/2 rounded-full bg-white/[0.12]" />
        </div>
        {/* Right pane (Morph-injected) */}
        <div className="flex flex-1 flex-col gap-1.5 rounded-md border border-white/[0.28] bg-white/[0.09] p-2">
          <div className="flex items-center justify-between">
            <Constellation
              size={12}
              morph={false}
              edges={false}
              className="text-white/80"
            />
            <span className="font-mono text-[8px] uppercase tracking-wider text-white/45">
              Morph
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-[2px] border border-white bg-white text-black">
              <svg width="6" height="6" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M2.5 6.5l2.5 2.5 5-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="h-1.5 flex-1 rounded-full bg-white/[0.2]" />
          </div>
          <div className="ml-4 h-1.5 w-3/4 rounded-full bg-white/[0.16]" />
          <div className="ml-4 h-1.5 w-2/3 rounded-full bg-white/[0.16]" />
        </div>
      </div>
      {/* Morphed badge */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full border border-white/28 bg-black/60 px-2 py-0.5">
        <span className="font-mono text-[8px] uppercase tracking-wider text-white">
          Morphed
        </span>
        <svg
          width="8"
          height="8"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className="text-white"
        >
          <path
            d="M2.5 6.5l2.5 2.5 5-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
