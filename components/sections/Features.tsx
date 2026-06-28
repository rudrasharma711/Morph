"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { Section, Eyebrow, SectionHeading, Lede } from "@/components/ui/Section";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, SPRING_SOFT, staggerContainer, staggerItem, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

type FeatureKey =
  | "understanding"
  | "language"
  | "widgets"
  | "persistent"
  | "safe"
  | "cross";

type Feature = {
  key: FeatureKey;
  title: string;
  description: string;
  /** Mono micro-label rendered in the icon row. */
  tag: string;
  /** Bento footprint at the lg breakpoint. */
  span: string;
};

const FEATURES: Feature[] = [
  {
    key: "understanding",
    title: "AI Website Understanding",
    description:
      "Morph reads the DOM, semantics, and layout of any page before it touches a pixel.",
    tag: "Read",
    span: "lg:col-span-2",
  },
  {
    key: "language",
    title: "Natural Language Interface",
    description:
      "Describe changes the way you would tell a teammate. No CSS, no code.",
    tag: "Prompt",
    span: "lg:col-span-1",
  },
  {
    key: "widgets",
    title: "Custom Widgets",
    description:
      "Inject to-do lists, dashboards, timers, and trackers — composable on any site.",
    tag: "Inject",
    span: "lg:col-span-1",
  },
  {
    key: "persistent",
    title: "Persistent Layouts",
    description:
      "Your morphs are saved per-site and reapply automatically on every visit.",
    tag: "Persist",
    span: "lg:col-span-1",
  },
  {
    key: "safe",
    title: "Safe Frontend Modifications",
    description:
      "Changes are sandboxed to the view. Your data and the site logic stay untouched.",
    tag: "Sandbox",
    span: "lg:col-span-1",
  },
  {
    key: "cross",
    title: "Cross-Site Compatibility",
    description:
      "One extension. Works across Gmail, YouTube, LinkedIn, Notion, and the long tail.",
    tag: "Anywhere",
    span: "lg:col-span-2",
  },
];

/* ---------------------------------------------------------------------------
 * Section
 * ------------------------------------------------------------------------- */

export default function Features() {
  return (
    <Section id="features" leadingHairline>
      <div className="flex flex-col gap-5">
        <Eyebrow index="05">Capabilities</Eyebrow>
        <SectionHeading>Engineered for everything you open.</SectionHeading>
        <Lede>
          Six primitives that turn any tab into a surface you control — from deep
          page comprehension to widgets that persist and never break the site
          underneath.
        </Lede>
      </div>

      <motion.div
        variants={staggerContainer(0.08, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3"
      >
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.key} feature={feature} />
        ))}
      </motion.div>
    </Section>
  );
}

/* ---------------------------------------------------------------------------
 * Card — cursor spotlight + magnetic tilt + lift, on a staggered reveal.
 * The icon glyph animates via a `rest`/`active` variant tree toggled by hover.
 * ------------------------------------------------------------------------- */

const TILT_SPRING = { stiffness: 120, damping: 20, mass: 0.6 } as const;

function FeatureCard({ feature }: { feature: Feature }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Raw pointer position within the card (px) drives the radial spotlight.
  const px = useMotionValue(-200);
  const py = useMotionValue(-200);

  // Normalized pointer (-0.5..0.5) for the magnetic tilt, spring-smoothed.
  const ntx = useMotionValue(0);
  const nty = useMotionValue(0);
  const tiltX = useSpring(ntx, TILT_SPRING);
  const tiltY = useSpring(nty, TILT_SPRING);
  const rotateX = useTransform(tiltY, (v) => v * -6);
  const rotateY = useTransform(tiltX, (v) => v * 6);

  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${px}px ${py}px, rgba(255,255,255,0.07), transparent 70%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    px.set(relX);
    py.set(relY);
    if (!reduced) {
      ntx.set(relX / rect.width - 0.5);
      nty.set(relY / rect.height - 0.5);
    }
  };

  const handleLeave = () => {
    px.set(-200);
    py.set(-200);
    ntx.set(0);
    nty.set(0);
  };

  const isWide = feature.span === "lg:col-span-2";

  return (
    <motion.div
      variants={staggerItem}
      className={cn("group/card [perspective:1200px]", feature.span)}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        initial="rest"
        whileHover="active"
        animate="rest"
        style={reduced ? undefined : { rotateX, rotateY }}
        variants={reduced ? undefined : { rest: { y: 0, scale: 1 }, active: { y: -4, scale: 1.006 } }}
        transition={SPRING_SOFT}
        className={cn(
          "relative flex h-full min-h-[15rem] flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] p-6 will-change-transform [transform-style:preserve-3d]",
          "transition-colors duration-500 hover:border-white/[0.22] sm:p-7",
          isWide && "md:min-h-[16rem]",
        )}
      >
        {/* Cursor-following spotlight */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{ background: spotlight }}
        />
        {/* Faint internal dot matrix, masked toward the icon corner */}
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 z-0 opacity-50 [mask-image:radial-gradient(60%_60%_at_85%_15%,black,transparent)]"
        />

        {/* Icon + mini-visual */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <FeatureIcon featureKey={feature.key} reduced={reduced} />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
            {feature.tag}
          </span>
        </div>

        <div className="relative z-10 mt-auto flex flex-col gap-2 pt-10">
          <h3
            className={cn(
              "text-balance font-semibold tracking-tight text-white",
              isWide ? "text-2xl md:text-[1.7rem]" : "text-xl",
            )}
          >
            {feature.title}
          </h3>
          <p className="max-w-md text-pretty text-[15px] leading-relaxed text-white/65">
            {feature.description}
          </p>
        </div>

        {/* Bottom hairline that brightens + extends on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px origin-center scale-x-[0.4] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-500 group-hover/card:scale-x-100 group-hover/card:opacity-100"
        />
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
 * Icons — distinct geometric / constellation glyphs in a 56px glass tile.
 * They inherit the parent card's `rest`/`active` variant state, so the line
 * draws / node drifts fire on hover (and stay static under reduced motion).
 * ------------------------------------------------------------------------- */

function FeatureIcon({
  featureKey,
  reduced,
}: {
  featureKey: FeatureKey;
  reduced: boolean;
}) {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/16 bg-white/[0.06] text-white transition-colors duration-500 group-hover/card:border-white/[0.28] group-hover/card:bg-white/[0.09]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-white/[0.11] opacity-0 blur-md transition-opacity duration-500 group-hover/card:opacity-100"
      />
      <svg
        width="28"
        height="28"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="relative overflow-visible"
      >
        {renderGlyph(featureKey, reduced)}
      </svg>
    </div>
  );
}

const STROKE = {
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Shared draw-on-hover timing for line glyphs. */
const DRAW = { duration: 0.9, ease: EASE_OUT_EXPO } as const;

function renderGlyph(key: FeatureKey, reduced: boolean) {
  switch (key) {
    case "understanding":
      return <UnderstandingGlyph reduced={reduced} />;
    case "language":
      return <LanguageGlyph reduced={reduced} />;
    case "widgets":
      return <WidgetsGlyph reduced={reduced} />;
    case "persistent":
      return <PersistentGlyph reduced={reduced} />;
    case "safe":
      return <SafeGlyph reduced={reduced} />;
    case "cross":
      return <CrossGlyph reduced={reduced} />;
  }
}

/** AI Understanding — a node grid that pulses under a scanning sweep line. */
function UnderstandingGlyph({ reduced }: { reduced: boolean }) {
  const nodes: [number, number][] = [
    [10, 10],
    [20, 10],
    [30, 10],
    [10, 20],
    [20, 20],
    [30, 20],
    [10, 30],
    [20, 30],
    [30, 30],
  ];
  return (
    <g>
      <rect x="6" y="6" width="28" height="28" rx="5" strokeOpacity={0.4} {...STROKE} />
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={1.5}
          fill="currentColor"
          variants={
            reduced
              ? undefined
              : {
                  rest: { opacity: 0.35, scale: 1 },
                  active: {
                    opacity: [0.35, 1, 0.35],
                    scale: [1, 1.4, 1],
                    transition: {
                      duration: 1.4,
                      repeat: Infinity,
                      delay: (i % 3) * 0.18 + Math.floor(i / 3) * 0.1,
                    },
                  },
                }
          }
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
      {!reduced && (
        <motion.line
          x1="6"
          x2="34"
          strokeOpacity={0.9}
          {...STROKE}
          variants={{
            rest: { y1: 6, y2: 6, opacity: 0 },
            active: {
              y1: [6, 34, 6],
              y2: [6, 34, 6],
              opacity: [0, 0.9, 0],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            },
          }}
        />
      )}
    </g>
  );
}

/** Natural Language — a chat bubble whose text lines draw out on hover. */
function LanguageGlyph({ reduced }: { reduced: boolean }) {
  return (
    <g>
      <path
        d="M8 12 a4 4 0 0 1 4-4 h16 a4 4 0 0 1 4 4 v10 a4 4 0 0 1-4 4 h-9 l-6 5 v-5 h-1 a4 4 0 0 1-4-4 z"
        strokeOpacity={0.45}
        {...STROKE}
      />
      <motion.line
        x1="13"
        y1="14"
        x2="27"
        y2="14"
        {...STROKE}
        variants={
          reduced
            ? undefined
            : {
                rest: { pathLength: 1, opacity: 0.8 },
                active: { pathLength: [0, 1], opacity: 1, transition: DRAW },
              }
        }
      />
      <motion.line
        x1="13"
        y1="19"
        x2="22"
        y2="19"
        strokeOpacity={0.6}
        {...STROKE}
        variants={
          reduced
            ? undefined
            : {
                rest: { pathLength: 1 },
                active: { pathLength: [0, 1], transition: { ...DRAW, delay: 0.12 } },
              }
        }
      />
    </g>
  );
}

/** Custom Widgets — a panel with a smaller card sliding into its slot. */
function WidgetsGlyph({ reduced }: { reduced: boolean }) {
  return (
    <g>
      <rect x="6" y="9" width="28" height="22" rx="4" strokeOpacity={0.4} {...STROKE} />
      <line x1="6" y1="15" x2="34" y2="15" strokeOpacity={0.35} {...STROKE} />
      <motion.rect
        x="10"
        width="9"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity={0.9}
        variants={
          reduced
            ? { rest: { y: 19 }, active: { y: 19 } }
            : {
                rest: { y: 19, opacity: 1 },
                active: {
                  y: [27, 19],
                  opacity: [0, 1],
                  transition: { duration: 0.6, ease: EASE_OUT_EXPO },
                },
              }
        }
      />
      <rect x="22" y="19" width="8" height="3.5" rx="1.75" fill="currentColor" fillOpacity={0.3} />
      <rect x="22" y="24" width="6" height="3.5" rx="1.75" fill="currentColor" fillOpacity={0.3} />
    </g>
  );
}

/** Persistent Layouts — a refresh arc whose saved state ticks back into place. */
function PersistentGlyph({ reduced }: { reduced: boolean }) {
  return (
    <g>
      <path d="M30 12 a12 12 0 1 0 2.5 11" strokeOpacity={0.5} {...STROKE} />
      <path d="M31 7 v6 h-6" strokeOpacity={0.6} {...STROKE} />
      <motion.circle
        cx="20"
        cy="20"
        r="4.5"
        strokeOpacity={0.9}
        fill="none"
        {...STROKE}
        style={{ transformOrigin: "20px 20px" }}
        variants={
          reduced
            ? undefined
            : {
                rest: { scale: 1, opacity: 0.9 },
                active: {
                  scale: [0.7, 1.05, 1],
                  opacity: [0, 1, 1],
                  transition: { duration: 0.8, ease: EASE_OUT_EXPO },
                },
              }
        }
      />
      <motion.path
        d="M17.6 20 l1.8 1.8 l3.4 -3.8"
        {...STROKE}
        variants={
          reduced
            ? undefined
            : {
                rest: { pathLength: 1 },
                active: {
                  pathLength: [0, 1],
                  transition: { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.25 },
                },
              }
        }
      />
    </g>
  );
}

/** Safe Modifications — a shield with a rotating dashed sandbox boundary. */
function SafeGlyph({ reduced }: { reduced: boolean }) {
  return (
    <g>
      <path
        d="M20 6 l11 4 v8 c0 7-4.6 12.5-11 15 c-6.4-2.5-11-8-11-15 v-8 z"
        strokeOpacity={0.5}
        {...STROKE}
      />
      <motion.path
        d="M20 11 l6.5 2.4 v5 c0 4.3-2.7 7.6-6.5 9.2 c-3.8-1.6-6.5-4.9-6.5-9.2 v-5 z"
        strokeOpacity={0.35}
        strokeDasharray="2 2.4"
        {...STROKE}
        style={{ transformOrigin: "20px 19px" }}
        variants={
          reduced
            ? undefined
            : {
                rest: { rotate: 0 },
                active: { rotate: 360, transition: { duration: 14, repeat: Infinity, ease: "linear" } },
              }
        }
      />
      <circle cx="20" cy="18" r="1.6" fill="currentColor" />
    </g>
  );
}

/** Cross-Site — a hub radiating edges to four sites, with traveling pulse dots. */
function CrossGlyph({ reduced }: { reduced: boolean }) {
  const sats: [number, number][] = [
    [8, 9],
    [32, 9],
    [8, 31],
    [32, 31],
  ];
  return (
    <g>
      {sats.map(([x, y], i) => (
        <line key={`l-${i}`} x1="20" y1="20" x2={x} y2={y} strokeOpacity={0.35} {...STROKE} />
      ))}
      {sats.map(([x, y], i) => (
        <motion.circle
          key={`s-${i}`}
          cx={x}
          cy={y}
          r="2.6"
          strokeOpacity={0.7}
          fill="none"
          {...STROKE}
          style={{ transformOrigin: `${x}px ${y}px` }}
          variants={
            reduced
              ? undefined
              : {
                  rest: { scale: 1, opacity: 0.7 },
                  active: {
                    scale: [1, 1.25, 1],
                    opacity: [0.7, 1, 0.7],
                    transition: { duration: 1.6, repeat: Infinity, delay: i * 0.2 },
                  },
                }
          }
        />
      ))}
      {!reduced &&
        sats.map(([x, y], i) => (
          <motion.circle
            key={`p-${i}`}
            r="1.4"
            fill="currentColor"
            variants={{
              rest: { opacity: 0, cx: 20, cy: 20 },
              active: {
                cx: [20, x],
                cy: [20, y],
                opacity: [0, 1, 0],
                transition: { duration: 1.4, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" },
              },
            }}
          />
        ))}
      <circle cx="20" cy="20" r="3.4" fill="currentColor" />
    </g>
  );
}
