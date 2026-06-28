"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Eyebrow,
  Lede,
  Section,
  SectionHeading,
} from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Constellation from "@/components/ui/Constellation";
import StarField from "@/components/ui/StarField";
import {
  useMounted,
  useMousePosition,
  usePrefersReducedMotion,
} from "@/lib/hooks";
import { EASE_OUT_EXPO, EASE_OUT_QUART, VIEWPORT } from "@/lib/motion";
import { mulberry32 } from "@/lib/constellation";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * The Future — a constellation network of websites expanding across the page.
 *  - Central "Morph" node radiates hairline edges to a ring of site nodes.
 *  - Edges DRAW IN via SVG pathLength; the whole network scales/expands on
 *    scroll and fades up. Nodes float on infinite transform-only oscillation.
 *  - Traveling pulse dots ride a few spokes. StarField + spotlight add depth.
 * ------------------------------------------------------------------------- */

const HEADLINE = ["Every Website", "Becomes Yours."];

// Site nodes laid out deterministically around the central Morph node.
const SITES = [
  "Gmail",
  "YouTube",
  "X",
  "Instagram",
  "LinkedIn",
  "Reddit",
  "ChatGPT",
  "Notion",
  "GitHub",
  "Figma",
  "Spotify",
  "Netflix",
  "Amazon",
  "WhatsApp",
  "Discord",
  "Slack",
  "TikTok",
  "Twitch",
  "Docs",
  "Maps",
] as const;

const VB_W = 1000;
const VB_H = 560;
const CENTER = { x: VB_W / 2, y: VB_H / 2 };

type Node = {
  label: string;
  x: number;
  y: number;
  /** Float oscillation params (deterministic). */
  amp: number;
  phase: number;
  dur: number;
  /** Reveal order index. */
  order: number;
};

/**
 * Build the node field at module scope with a fixed seed so SSR === CSR
 * (hydration-safe — no Math.random / Date during render). Nodes sit on two
 * concentric elliptical rings with small seeded jitter for an organic web.
 */
const NODES: Node[] = (() => {
  const rand = mulberry32(20260607);
  const n = SITES.length;
  return SITES.map((label, i) => {
    const ring = i % 2 === 0 ? 0 : 1;
    const rx = ring === 0 ? 358 : 466;
    const ry = ring === 0 ? 176 : 236;
    const base = (i / n) * Math.PI * 2;
    const offset =
      ring === 0 ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / n;
    const jitter = (rand() - 0.5) * 0.1;
    const angle = base + offset + jitter;
    const radial = 1 + (rand() - 0.5) * 0.05;
    const x = CENTER.x + Math.cos(angle) * rx * radial;
    const y = CENTER.y + Math.sin(angle) * ry * radial;
    return {
      label,
      x,
      y,
      amp: 4 + rand() * 6,
      phase: rand() * Math.PI * 2,
      dur: 5.5 + rand() * 3.5,
      order: i,
    };
  });
})();

// A few inter-node edges (besides the spokes) so it reads like a web.
const CROSS_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 6],
  [2, 8],
  [4, 10],
  [6, 12],
  [8, 14],
  [10, 16],
  [12, 18],
  [1, 7],
  [3, 9],
  [5, 11],
  [7, 13],
  [9, 15],
  [11, 17],
  [13, 19],
];

// Spokes (node indices) that carry a traveling pulse dot.
const PULSE_SPOKES = [0, 4, 8, 12, 16] as const;

export default function TheFuture() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();

  // Scroll-linked expansion: the network grows toward the viewport on entry.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const netScale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const netOpacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);

  // Subtle mouse parallax on the whole field for depth.
  const { x: mx, y: my } = useMousePosition({
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });
  const px = useTransform(mx, (v) => v * 22);
  const py = useTransform(my, (v) => v * 16);

  const staticMode = reduced || !mounted;

  return (
    <Section id="future" className="overflow-hidden">
      {/* Ambient depth */}
      <StarField count={64} seed={606} parallax={50} opacity={0.55} />
      <div
        aria-hidden
        className="spotlight pointer-events-none absolute inset-0"
      />

      <div ref={sectionRef} className="relative">
        {/* Copy block — centered */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <Eyebrow index="06" className="justify-center">
            The Future
          </Eyebrow>

          <SectionHeading className="text-gradient mt-6 max-w-none text-center tracking-tightest">
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
                  className="block"
                >
                  {line}
                </motion.span>
              </motion.span>
            ))}
          </SectionHeading>

          <Lede className="mx-auto mt-6 text-center">
            One canvas for the entire internet — every site a node you can
            reshape.
          </Lede>
        </div>

        {/* Network — near full-bleed, wider than the text column */}
        <motion.div
          style={{
            x: "-50%",
            scale: staticMode ? 1 : netScale,
            opacity: staticMode ? 1 : netOpacity,
          }}
          className="relative left-1/2 z-10 mt-16 w-screen max-w-none will-change-transform md:mt-24"
        >
          <motion.div
            style={{ x: staticMode ? 0 : px, y: staticMode ? 0 : py }}
            className="mask-fade-edges mx-auto w-full max-w-[1400px] px-6 sm:px-8"
          >
            <NetworkGraph reduced={staticMode} />
          </motion.div>
        </motion.div>

        {/* Closing line */}
        <Reveal
          variant="fadeUp"
          delay={0.1}
          className="relative z-10 mx-auto mt-16 max-w-xl text-center md:mt-20"
        >
          <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-white/55">
            {SITES.length}+ sites today. The whole web tomorrow.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------------------
 * NetworkGraph — the SVG constellation web + overlaid HTML node labels.
 * ------------------------------------------------------------------------- */

function NetworkGraph({ reduced }: { reduced: boolean }) {
  const crossLines = useMemo(
    () =>
      CROSS_EDGES.map(([a, b]) => ({
        x1: NODES[a].x,
        y1: NODES[a].y,
        x2: NODES[b].x,
        y2: NODES[b].y,
      })),
    [],
  );

  return (
    <div className="relative aspect-[1000/560] w-full">
      {/* Soft central glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_70%)] blur-2xl"
      />

      {/* Edges + pulses (SVG) */}
      <motion.svg
        aria-hidden
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full overflow-visible text-white"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {/* Cross-web hairlines (very faint) draw in first */}
        {crossLines.map((l, i) => (
          <motion.line
            key={`x-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="currentColor"
            strokeWidth={0.8}
            strokeOpacity={0.1}
            vectorEffect="non-scaling-stroke"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { duration: 1.1, ease: EASE_OUT_QUART },
                  opacity: { duration: 0.6 },
                  delay: 0.1 + i * 0.05,
                },
              },
            }}
          />
        ))}

        {/* Spokes: center → each site node */}
        {NODES.map((node, i) => (
          <motion.line
            key={`s-${i}`}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={node.x}
            y2={node.y}
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.28}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { duration: 0.9, ease: EASE_OUT_EXPO },
                  opacity: { duration: 0.4 },
                  delay: 0.25 + (NODES[i].order % SITES.length) * 0.06,
                },
              },
            }}
          />
        ))}

        {/* Traveling pulse dots along selected spokes */}
        {!reduced &&
          PULSE_SPOKES.map((idx, i) => (
            <PulseDot
              key={`p-${idx}`}
              from={CENTER}
              to={{ x: NODES[idx].x, y: NODES[idx].y }}
              delay={1.1 + i * 0.55}
            />
          ))}

      </motion.svg>

      {/* Central Morph node */}
      <CenterNode reduced={reduced} />

      {/* Site node labels */}
      {NODES.map((node, i) => (
        <SiteNode key={node.label} node={node} index={i} reduced={reduced} />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * PulseDot — a dot that travels from `from` to `to` along a spoke.
 * ------------------------------------------------------------------------- */

function PulseDot({
  from,
  to,
  delay,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
}) {
  return (
    <motion.circle
      r={2.6}
      fill="currentColor"
      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
      animate={{
        cx: [from.x, to.x],
        cy: [from.y, to.y],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2.6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1.6,
        delay,
        times: [0, 0.12, 0.85, 1],
      }}
    />
  );
}

/* ----------------------------------------------------------------------------
 * CenterNode — the Morph mark at the heart of the network.
 * ------------------------------------------------------------------------- */

function CenterNode({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      style={{ x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
      className="absolute left-1/2 top-1/2 z-20"
    >
      <div className="relative">
        {/* Expanding rings — the network "breathing" outward */}
        {!reduced &&
          [0, 1].map((r) => (
            <motion.span
              key={r}
              aria-hidden
              style={{ x: "-50%", y: "-50%" }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-white/15"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.8], opacity: [0.45, 0] }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: "easeOut",
                delay: r * 1.7,
              }}
            />
          ))}

        <div className="glass-strong relative flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2.5 will-change-transform">
          <Constellation size={20} morph interval={2600} glow edges={false} />
          <span className="text-[15px] font-medium tracking-tighter text-white">
            Morph
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * SiteNode — a website chip pinned over its SVG coordinate, floating gently.
 * ------------------------------------------------------------------------- */

function SiteNode({
  node,
  index,
  reduced,
}: {
  node: Node;
  index: number;
  reduced: boolean;
}) {
  // Convert viewBox coordinates → percentage of the aspect-locked container.
  const leftPct = (node.x / VB_W) * 100;
  const topPct = (node.y / VB_H) * 100;

  // Deterministic float offsets (transform-only).
  const dy = node.amp;
  const dx = node.amp * 0.5;

  return (
    <motion.div
      className="absolute z-10 will-change-transform"
      style={{ left: `${leftPct}%`, top: `${topPct}%`, x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{
        duration: 0.7,
        ease: EASE_OUT_EXPO,
        delay: 0.45 + index * 0.06,
      }}
    >
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                y: [0, -dy, 0, dy, 0],
                x: [0, dx, 0, -dx, 0],
              }
        }
        transition={
          reduced
            ? undefined
            : {
                duration: node.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: node.phase,
              }
        }
        className="group relative"
      >
        <span
          className={cn(
            "flex items-center gap-2 whitespace-nowrap rounded-full border bg-white/[0.03] px-3 py-1.5 backdrop-blur-md transition-colors",
            "border-white/10 hover:border-white/25",
          )}
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/55"
          />
          <span className="text-[12px] font-medium tracking-tight text-white/75 group-hover:text-white">
            {node.label}
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}
