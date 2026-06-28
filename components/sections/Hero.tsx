"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import BrowserFrame from "@/components/ui/BrowserFrame";
import Constellation from "@/components/ui/Constellation";
import MagneticButton from "@/components/ui/MagneticButton";
import StarField from "@/components/ui/StarField";
import { useMounted, useMousePosition, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const HEADLINE = ["The Internet Was", "Never Meant", "To Be Static."];

export default function Hero() {
  const { x: mx, y: my } = useMousePosition({ stiffness: 60, damping: 18, mass: 0.6 });
  const px = useTransform(mx, (v) => v * 28);
  const py = useTransform(my, (v) => v * 22);
  const pxNeg = useTransform(mx, (v) => v * -16);
  const pyNeg = useTransform(my, (v) => v * -12);

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="main"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-start overflow-hidden px-6 pb-24 pt-36 sm:px-8"
    >
      {/* Ambient backdrop */}
      <div className="spotlight pointer-events-none absolute inset-0" />
      <StarField count={70} seed={42} parallax={60} opacity={0.7} />
      <motion.div
        style={{ x: pxNeg, y: pyNeg }}
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]"
      />

      {/* Copy */}
      <motion.div
        style={{ y: copyY }}
        className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center"
      >
        <motion.a
          href="#waitlist"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[13px] text-white/60 backdrop-blur-md transition-colors hover:text-white"
        >
          <span className="flex h-1.5 w-1.5 items-center justify-center">
            <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-white/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Now in private beta
          <span className="text-white/55 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </motion.a>

        <h1 className="text-balance font-semibold tracking-tightest text-white">
          {HEADLINE.map((line, i) => (
            <span key={i} className="block overflow-hidden py-[0.06em]">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.1,
                  ease: EASE_OUT_EXPO,
                  delay: 0.15 + i * 0.12,
                }}
                className={cn(
                  "block text-[2.6rem] leading-[0.98] sm:text-6xl md:text-7xl lg:text-[5.6rem]",
                  // Line 3 holds the nested <StaticWord/>; background-clip:text does
                  // not paint through its nested inline-block spans, so use a solid
                  // bright fill instead of a clipped gradient.
                  i === 2 ? "text-white" : "text-gradient",
                )}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.6 }}
          className="mt-7 max-w-xl text-pretty text-lg text-white/65 md:text-xl"
        >
          Morph lets you redesign any website with a single sentence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.75 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <MagneticButton href="#waitlist" variant="primary" icon={<span>→</span>}>
            Join the Waitlist
          </MagneticButton>
          <MagneticButton href="#showcase" variant="secondary" icon={<PlayIcon />}>
            Watch Demo
          </MagneticButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.95 }}
          className="mt-5 text-sm text-white/45"
        >
          No spam — just one email the moment Morph goes live.
        </motion.p>
      </motion.div>

      {/* Hero visual */}
      <motion.div
        style={{ y: visualY, scale: visualScale, opacity: visualOpacity }}
        className="relative z-10 mt-16 w-full max-w-5xl will-change-transform md:mt-20"
      >
        <motion.div style={{ x: px, y: py }}>
          <HeroDemo />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
          <motion.span
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-white/70"
          />
        </div>
      </motion.div>

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * HeroDemo — the looping "Add a to-do list to Gmail" transformation
 * ------------------------------------------------------------------------- */

const PROMPT = "Add a to-do list to Gmail";
type Phase = "typing" | "analyzing" | "done";

const EMAILS = [
  { from: "Figma", subject: "Your weekly design digest", time: "9:41 AM" },
  { from: "Linear", subject: "5 issues assigned to you", time: "8:12 AM" },
  { from: "Vercel", subject: "Deployment ready — morph.new", time: "Yesterday" },
  { from: "Stripe", subject: "Payout of $4,820.00 sent", time: "Yesterday" },
  { from: "GitHub", subject: "[morph] PR #128 was merged", time: "Tue" },
];

const TODOS = [
  { text: "Reply to Figma design review", done: true },
  { text: "Ship the Morph beta build", done: false },
  { text: "Approve Stripe payout", done: false },
  { text: "Draft launch announcement", done: false },
];

function HeroDemo() {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (!mounted) return;
    if (reduced) {
      setTyped(PROMPT);
      setPhase("done");
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        const t = setTimeout(res, ms);
        timers.push(t);
      });

    const run = async () => {
      while (!cancelled) {
        setPhase("typing");
        setTyped("");
        await wait(900);
        for (let i = 1; i <= PROMPT.length; i++) {
          if (cancelled) return;
          setTyped(PROMPT.slice(0, i));
          await wait(48);
        }
        await wait(500);
        if (cancelled) return;
        setPhase("analyzing");
        await wait(1500);
        if (cancelled) return;
        setPhase("done");
        await wait(5200);
      }
    };
    void run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [mounted, reduced]);

  const transformed = phase === "done";

  return (
    <BrowserFrame
      url="mail.google.com/u/0/#inbox"
      className="mx-auto"
      toolbarRight={
        <motion.div
          animate={{
            opacity: phase === "analyzing" ? [0.4, 1, 0.4] : 1,
          }}
          transition={{ duration: 1, repeat: phase === "analyzing" ? Infinity : 0 }}
          className="flex items-center gap-1.5 rounded-full border border-white/16 bg-white/[0.09] px-2 py-1"
        >
          <Constellation size={13} morph interval={1400} edges={false} />
        </motion.div>
      }
    >
      <div className="relative grid h-[330px] grid-cols-[120px_1fr] sm:h-[380px] sm:grid-cols-[160px_1fr]">
        {/* Sidebar */}
        <div className="hidden flex-col gap-1 border-r border-white/12 p-3 sm:flex">
          <div className="mb-2 flex items-center gap-2 rounded-full bg-white/[0.11] px-3 py-2 text-xs text-white/80">
            <span className="text-base leading-none">+</span> Compose
          </div>
          {["Inbox", "Starred", "Snoozed", "Sent", "Drafts"].map((it, i) => (
            <div
              key={it}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-1.5 text-[12px]",
                i === 0 ? "bg-white/[0.14] text-white" : "text-white/45",
              )}
            >
              <span>{it}</span>
              {i === 0 && <span className="text-[10px] text-white/45">24</span>}
            </div>
          ))}
        </div>

        {/* Mail area */}
        <div className="relative flex min-w-0">
          {/* Email list */}
          <motion.div
            animate={{ width: transformed ? "58%" : "100%" }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            className="min-w-0 shrink-0 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/12 px-4 py-2.5">
              <span className="text-[12px] font-medium text-white/80">Inbox</span>
              <span className="font-mono text-[10px] text-white/45">1–24 of 312</span>
            </div>
            {EMAILS.map((e, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-2.5 transition-colors hover:bg-white/[0.05]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                <span className="w-16 shrink-0 truncate text-[12px] font-medium text-white/75 sm:w-20">
                  {e.from}
                </span>
                <span className="min-w-0 flex-1 truncate text-[12px] text-white/45">
                  {e.subject}
                </span>
                <span className="hidden shrink-0 font-mono text-[10px] text-white/45 sm:block">
                  {e.time}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Injected to-do panel */}
          <AnimatePresence>
            {transformed && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                className="relative flex min-w-0 flex-1 flex-col border-l border-white/20 bg-white/[0.06]"
              >
                <div className="flex items-center justify-between border-b border-white/12 px-4 py-2.5">
                  <span className="flex items-center gap-2 text-[12px] font-medium text-white">
                    <Constellation size={13} morph={false} edges={false} />
                    To-do
                  </span>
                  <span className="font-mono text-[10px] text-white/45">Morph</span>
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
                  }}
                  className="flex flex-col gap-1 p-3"
                >
                  {TODOS.map((t, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: { duration: 0.5, ease: EASE_OUT_EXPO },
                        },
                      }}
                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5"
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          t.done
                            ? "border-white bg-white text-black"
                            : "border-white/35",
                        )}
                      >
                        {t.done && (
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2.5 6.5l2.5 2.5 5-6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-[12px]",
                          t.done ? "text-white/45 line-through" : "text-white/80",
                        )}
                      >
                        {t.text}
                      </span>
                    </motion.div>
                  ))}
                  <div className="mt-1 flex items-center gap-2 rounded-md border border-dashed border-white/18 px-2 py-1.5 text-[12px] text-white/40">
                    <span>+</span> Add task
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyzing scan overlay */}
          <AnimatePresence>
            {phase === "analyzing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                <motion.div
                  initial={{ y: "-100%" }}
                  animate={{ y: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent"
                />
                <div className="bg-grid absolute inset-0 opacity-40" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Command bar */}
      <div className="border-t border-white/16 bg-ink-900/60 p-3 backdrop-blur">
        <div className="flex items-center gap-3 rounded-xl border border-white/16 bg-black/40 px-3.5 py-3">
          <Constellation size={16} morph interval={1600} edges={false} />
          <div className="flex min-w-0 flex-1 items-center font-mono text-[13px] text-white/85">
            <span className="truncate">
              {typed || (
                <span className="text-white/40">Describe what you want…</span>
              )}
            </span>
            {phase === "typing" && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-white"
              />
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
                phase === "done"
                  ? "border-white/40 bg-white/[0.16] text-white"
                  : "border-white/16 text-white/55",
              )}
            >
              {phase === "typing" && "Type"}
              {phase === "analyzing" && "Analyzing"}
              {phase === "done" && "Morphed ✓"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </BrowserFrame>
  );
}
