"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Eyebrow, Lede, SectionHeading } from "@/components/ui/Section";
import BrowserFrame from "@/components/ui/BrowserFrame";
import Constellation from "@/components/ui/Constellation";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, VIEWPORT, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Data — four live transformations
 * ------------------------------------------------------------------------- */

type ExampleId = "gmail" | "youtube" | "linkedin" | "chatgpt";

type Example = {
  id: ExampleId;
  tab: string;
  from: string;
  to: string;
  url: string;
  prompt: string;
};

const EXAMPLES: Example[] = [
  {
    id: "gmail",
    tab: "Gmail",
    from: "Inbox",
    to: "Productivity Workspace",
    url: "mail.google.com/u/0/#inbox",
    prompt: "Add a to-do list and focus timer to Gmail",
  },
  {
    id: "youtube",
    tab: "YouTube",
    from: "Video Grid",
    to: "Netflix Layout",
    url: "youtube.com/feed/subscriptions",
    prompt: "Turn YouTube into a cinematic Netflix layout",
  },
  {
    id: "linkedin",
    tab: "LinkedIn",
    from: "Feed",
    to: "CRM Dashboard",
    url: "linkedin.com/feed",
    prompt: "Add a CRM pipeline to LinkedIn",
  },
  {
    id: "chatgpt",
    tab: "ChatGPT",
    from: "Chat Thread",
    to: "Study Companion",
    url: "chat.openai.com/c/study",
    prompt: "Turn ChatGPT into a study companion with flashcards",
  },
];

const ADVANCE_MS = 7200;
const RESUME_MS = 16000;

/* ----------------------------------------------------------------------------
 * Skeleton primitives — shared mock-UI building blocks
 * ------------------------------------------------------------------------- */

function Line({ w = "70%", className }: { w?: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block h-2 rounded-full bg-white/[0.16]", className)}
      style={{ width: w }}
    />
  );
}

function MorphTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/[0.10] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55",
        className,
      )}
    >
      <Constellation size={12} morph={false} edges={false} strokeWidth={2.6} />
      Morph
    </span>
  );
}

/** Staggered-assembly variants for "after" mock pieces. */
const assembleGroup = (stagger = 0.07, delay = 0.12): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const assembleItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

/* ----------------------------------------------------------------------------
 * GMAIL — inbox → productivity workspace
 * ------------------------------------------------------------------------- */

const GMAIL_MAIL = [
  { from: "Figma", subject: "Your weekly design digest", time: "9:41" },
  { from: "Linear", subject: "5 issues assigned to you", time: "8:12" },
  { from: "Vercel", subject: "Deployment ready — morph.new", time: "7:30" },
  { from: "Stripe", subject: "Payout of $4,820.00 sent", time: "Yest" },
  { from: "GitHub", subject: "[morph] PR #128 was merged", time: "Tue" },
  { from: "Notion", subject: "3 pages shared with you", time: "Mon" },
];

const GMAIL_TODOS = [
  { text: "Reply to design review", done: true },
  { text: "Ship the beta build", done: false },
  { text: "Approve Stripe payout", done: false },
];

function GmailMock({ after }: { after: boolean }) {
  return (
    <div className="grid h-full grid-cols-[0_1fr] sm:grid-cols-[150px_1fr]">
      {/* Sidebar */}
      <div className="hidden flex-col gap-1 border-r border-white/12 p-3 sm:flex">
        <div className="mb-2 flex items-center gap-2 rounded-full bg-white/[0.11] px-3 py-2 text-[11px] text-white/80">
          <span className="text-sm leading-none">+</span> Compose
        </div>
        {["Inbox", "Starred", "Snoozed", "Sent", "Drafts"].map((it, i) => (
          <div
            key={it}
            className={cn(
              "flex items-center justify-between rounded-md px-3 py-1.5 text-[11px]",
              i === 0 ? "bg-white/[0.14] text-white" : "text-white/45",
            )}
          >
            <span>{it}</span>
            {i === 0 && <span className="font-mono text-[9px] text-white/45">24</span>}
          </div>
        ))}
      </div>

      {/* Mail + injected panels */}
      <div className="flex min-w-0">
        <div className={cn("flex min-w-0 flex-col", after ? "w-3/5" : "w-full")}>
          <div className="flex items-center justify-between border-b border-white/12 px-4 py-2.5">
            <span className="text-[11px] font-medium text-white/80">Inbox</span>
            <span className="font-mono text-[9px] text-white/45">1–24 of 312</span>
          </div>
          {GMAIL_MAIL.map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 border-b border-white/[0.08] px-4 py-2.5"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <span className="w-12 shrink-0 truncate text-[11px] font-medium text-white/75">
                {e.from}
              </span>
              <span className="min-w-0 flex-1 truncate text-[11px] text-white/45">
                {e.subject}
              </span>
              <span className="shrink-0 font-mono text-[9px] text-white/45">{e.time}</span>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {after && (
            <motion.aside
              key="gmail-panel"
              variants={assembleGroup()}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 24, transition: { duration: 0.4 } }}
              className="flex min-w-0 flex-1 flex-col gap-3 border-l border-white/22 bg-white/[0.05] p-3"
            >
              {/* Tasks */}
              <motion.div
                variants={assembleItem}
                className="rounded-xl border border-white/22 bg-white/[0.05] p-3"
              >
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-white">
                    <Constellation size={12} morph={false} edges={false} strokeWidth={2.6} />
                    Tasks
                  </span>
                  <MorphTag />
                </div>
                <div className="flex flex-col gap-1.5">
                  {GMAIL_TODOS.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border",
                          t.done ? "border-white bg-white text-black" : "border-white/35",
                        )}
                      >
                        {t.done && (
                          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path
                              d="M2.5 6.5l2.5 2.5 5-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-[11px]",
                          t.done ? "text-white/45 line-through" : "text-white/80",
                        )}
                      >
                        {t.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Pomodoro */}
              <motion.div
                variants={assembleItem}
                className="flex flex-col items-center rounded-xl border border-white/22 bg-white/[0.05] p-3"
              >
                <div className="mb-2 flex w-full items-center justify-between">
                  <span className="text-[11px] font-medium text-white">Focus</span>
                  <MorphTag />
                </div>
                <div className="relative my-1 flex h-16 w-16 items-center justify-center">
                  <svg
                    viewBox="0 0 40 40"
                    className="absolute inset-0 h-full w-full -rotate-90"
                    aria-hidden
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="17"
                      stroke="white"
                      strokeOpacity="0.18"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="17"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 17}
                      strokeDashoffset={2 * Math.PI * 17 * 0.32}
                    />
                  </svg>
                  <span className="font-mono text-[15px] font-medium tracking-tight text-white">
                    17:04
                  </span>
                </div>
                <div className="mt-1 flex w-full items-center gap-1.5">
                  <span className="flex-1 rounded-md bg-white/[0.16] py-1 text-center font-mono text-[9px] uppercase tracking-wider text-white/70">
                    Pause
                  </span>
                  <span className="rounded-md border border-white/16 px-2 py-1 text-center font-mono text-[9px] uppercase tracking-wider text-white/45">
                    Reset
                  </span>
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * YOUTUBE — video grid → cinematic Netflix layout
 * ------------------------------------------------------------------------- */

const YT_GRID = [0, 1, 2, 3, 4, 5];
const YT_ROWS = [
  { label: "Continue Watching", n: 5 },
  { label: "Because you watched Design", n: 5 },
  { label: "Trending in Tech", n: 5 },
];

function YouTubeMock({ after }: { after: boolean }) {
  if (!after) {
    return (
      <div className="grid h-full grid-cols-[0_1fr] sm:grid-cols-[120px_1fr]">
        <div className="hidden flex-col gap-1 border-r border-white/12 p-3 sm:flex">
          {["Home", "Shorts", "Subs", "Library", "History"].map((it, i) => (
            <div
              key={it}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px]",
                i === 0 ? "bg-white/[0.14] text-white" : "text-white/45",
              )}
            >
              <span className="h-2.5 w-2.5 rounded-sm bg-white/[0.28]" />
              {it}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 content-start gap-3 overflow-hidden p-4 md:grid-cols-3">
          {YT_GRID.map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="aspect-video rounded-lg border border-white/12 bg-white/[0.08]">
                <div className="flex h-full items-center justify-center">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.16]">
                    <svg width="9" height="9" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 2.5v11l9-5.5-9-5.5Z" fill="white" fillOpacity="0.7" />
                    </svg>
                  </span>
                </div>
              </div>
              <Line w="90%" className="h-1.5" />
              <Line w="55%" className="h-1.5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={assembleGroup(0.06)}
      initial="hidden"
      animate="visible"
      className="flex h-full flex-col gap-4 overflow-hidden p-4"
    >
      {/* Cinematic hero */}
      <motion.div
        variants={assembleItem}
        className="relative flex h-32 shrink-0 flex-col justify-end overflow-hidden rounded-xl border border-white/22 bg-gradient-to-tr from-white/[0.12] via-white/[0.05] to-transparent p-4 sm:h-40"
      >
        <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <MorphTag />
            <div className="h-3.5 w-40 rounded bg-white/55" />
            <Line w="70%" className="h-1.5" />
            <div className="mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-medium text-black">
                <svg width="8" height="8" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor" />
                </svg>
                Play
              </span>
              <span className="rounded-full border border-white/28 px-3 py-1 text-[10px] text-white/70">
                + List
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Netflix-style rows */}
      {YT_ROWS.map((row) => (
        <motion.div key={row.label} variants={assembleItem} className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-white/80">{row.label}</span>
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: row.n }).map((_, i) => (
              <div
                key={i}
                className="aspect-video w-1/4 shrink-0 rounded-md border border-white/12 bg-white/[0.08]"
              />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * LINKEDIN — feed → CRM pipeline board
 * ------------------------------------------------------------------------- */

const LI_FEED = [
  { name: "Ava Chen", role: "VP Product · Vercel" },
  { name: "Noah Park", role: "Design Lead · Linear" },
  { name: "Mia Reyes", role: "Founder · Morph" },
];

const LI_PIPELINE: { stage: string; cards: { name: string; co: string }[] }[] = [
  {
    stage: "Lead",
    cards: [
      { name: "Ava Chen", co: "Vercel" },
      { name: "Leo Tran", co: "Stripe" },
    ],
  },
  {
    stage: "Contacted",
    cards: [
      { name: "Noah Park", co: "Linear" },
      { name: "Zoe Kim", co: "Figma" },
    ],
  },
  {
    stage: "Won",
    cards: [{ name: "Mia Reyes", co: "Morph" }],
  },
];

function LinkedInMock({ after }: { after: boolean }) {
  if (!after) {
    return (
      <div className="grid h-full grid-cols-[0_1fr] sm:grid-cols-[150px_1fr]">
        <div className="hidden flex-col gap-3 border-r border-white/12 p-3 sm:flex">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] p-3">
            <span className="h-9 w-9 rounded-full bg-white/[0.22]" />
            <Line w="80%" className="h-1.5" />
            <Line w="55%" className="h-1.5" />
          </div>
          {["Connections", "Jobs", "Saved"].map((it) => (
            <div key={it} className="px-1 text-[11px] text-white/45">
              {it}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden p-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5">
            <span className="h-7 w-7 rounded-full bg-white/[0.22]" />
            <Line w="60%" />
          </div>
          {LI_FEED.map((p, i) => (
            <div
              key={i}
              className="flex flex-col gap-2.5 rounded-xl border border-white/12 bg-white/[0.05] p-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-8 w-8 shrink-0 rounded-full bg-white/[0.22]" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-white/80">{p.name}</span>
                  <span className="text-[10px] text-white/45">{p.role}</span>
                </div>
              </div>
              <Line w="95%" className="h-1.5" />
              <Line w="80%" className="h-1.5" />
              <div className="aspect-[3/1] rounded-lg bg-white/[0.08]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/22 px-4 py-3">
        <span className="flex items-center gap-2 text-[12px] font-medium text-white">
          <Constellation size={13} morph={false} edges={false} strokeWidth={2.4} />
          Pipeline
        </span>
        <MorphTag />
      </div>
      <motion.div
        variants={assembleGroup(0.09)}
        initial="hidden"
        animate="visible"
        className="grid flex-1 grid-cols-3 gap-3 overflow-hidden p-4"
      >
        {LI_PIPELINE.map((col) => (
          <motion.div
            key={col.stage}
            variants={assembleItem}
            className="flex min-w-0 flex-col gap-2 rounded-xl border border-white/22 bg-white/[0.05] p-2.5"
          >
            <div className="flex items-center justify-between px-0.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
                {col.stage}
              </span>
              <span className="font-mono text-[9px] text-white/45">{col.cards.length}</span>
            </div>
            {col.cards.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-white/14 bg-white/[0.06] p-2"
              >
                <span className="h-6 w-6 shrink-0 rounded-full bg-white/[0.22]" />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-[10px] font-medium text-white/80">{c.name}</span>
                  <span className="truncate text-[9px] text-white/45">{c.co}</span>
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-white/18 py-1.5 text-center text-[10px] text-white/40">
              + Add
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * CHATGPT — chat thread → study companion
 * ------------------------------------------------------------------------- */

const GPT_THREAD: { role: "user" | "ai"; w: string }[] = [
  { role: "user", w: "55%" },
  { role: "ai", w: "92%" },
  { role: "user", w: "40%" },
  { role: "ai", w: "85%" },
];

function ChatBubble({ role, w }: { role: "user" | "ai"; w: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[78%] flex-col gap-1.5 rounded-2xl px-3 py-2.5",
          isUser ? "bg-white/[0.14]" : "border border-white/12 bg-white/[0.05]",
        )}
        style={{ width: w }}
      >
        <Line w="100%" className="h-1.5" />
        {!isUser && <Line w="70%" className="h-1.5" />}
      </div>
    </div>
  );
}

function ChatGPTMock({ after }: { after: boolean }) {
  return (
    <div
      className={cn(
        "grid h-full",
        after ? "grid-cols-[1fr] sm:grid-cols-[1fr_220px]" : "grid-cols-[1fr]",
      )}
    >
      {/* Thread */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between border-b border-white/12 px-4 py-2.5">
          <span className="text-[11px] font-medium text-white/80">Photosynthesis · Bio 101</span>
          <span className="font-mono text-[9px] text-white/45">GPT-4</span>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4">
          {GPT_THREAD.map((m, i) => (
            <ChatBubble key={i} role={m.role} w={m.w} />
          ))}
        </div>
        <div className="border-t border-white/12 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/16 bg-black/40 px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-white/40">
              Ask anything…
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.22] text-white/70">
              ↑
            </span>
          </div>
        </div>
      </div>

      {/* Study companion */}
      <AnimatePresence>
        {after && (
          <motion.aside
            key="gpt-study"
            variants={assembleGroup()}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: 24, transition: { duration: 0.4 } }}
            className="flex min-w-0 flex-col gap-3 border-t border-white/22 bg-white/[0.05] p-3 sm:border-l sm:border-t-0"
          >
            {/* Flashcard */}
            <motion.div
              variants={assembleItem}
              className="flex flex-col gap-2 rounded-xl border border-white/22 bg-white/[0.05] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-white">Flashcards</span>
                <MorphTag />
              </div>
              <div className="relative flex aspect-[5/3] items-center justify-center rounded-lg border border-white/14 bg-white/[0.06] p-3">
                <span className="absolute right-2 top-2 font-mono text-[8px] text-white/45">
                  3 / 12
                </span>
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
                    Define
                  </span>
                  <Line w="80px" className="h-2" />
                  <Line w="56px" className="h-1.5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex-1 rounded-md border border-white/16 py-1 text-center font-mono text-[9px] uppercase tracking-wider text-white/55">
                  Again
                </span>
                <span className="flex-1 rounded-md bg-white/[0.16] py-1 text-center font-mono text-[9px] uppercase tracking-wider text-white/80">
                  Got it
                </span>
              </div>
            </motion.div>

            {/* Progress */}
            <motion.div
              variants={assembleItem}
              className="flex flex-col gap-2.5 rounded-xl border border-white/22 bg-white/[0.05] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-white">Progress</span>
                <span className="font-mono text-[10px] text-white/55">68%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.14]">
                <div className="h-full rounded-full bg-white/70" style={{ width: "68%" }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[13px] font-medium text-white">8</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/45">
                    Mastered
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[13px] font-medium text-white">4</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/45">
                    Review
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[13px] font-medium text-white">5</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/45">
                    Streak
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Mock router
 * ------------------------------------------------------------------------- */

function MockUI({ id, after }: { id: ExampleId; after: boolean }) {
  switch (id) {
    case "gmail":
      return <GmailMock after={after} />;
    case "youtube":
      return <YouTubeMock after={after} />;
    case "linkedin":
      return <LinkedInMock after={after} />;
    case "chatgpt":
      return <ChatGPTMock after={after} />;
  }
}

/* ----------------------------------------------------------------------------
 * Section
 * ------------------------------------------------------------------------- */

type MorphPhase = "before" | "analyzing" | "after";

export default function LiveTransformations() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<MorphPhase>("before");
  const [autoPlay, setAutoPlay] = useState(true);
  const [runKey, setRunKey] = useState(0);

  const example = EXAMPLES[active];

  // Drive the morph: before → analyzing → after each time the example or
  // an explicit replay (runKey) changes. Reduced motion lands straight on after.
  useEffect(() => {
    if (reduced) {
      setPhase("after");
      return;
    }
    setPhase("before");
    const t1 = setTimeout(() => setPhase("analyzing"), 650);
    const t2 = setTimeout(() => setPhase("after"), 2050);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [runKey, active, reduced]);

  // Auto-advance through the examples.
  useEffect(() => {
    if (!autoPlay || reduced) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % EXAMPLES.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [autoPlay, reduced]);

  // Resume auto-advance a while after a manual interaction.
  useEffect(() => {
    if (autoPlay) return;
    const id = setTimeout(() => setAutoPlay(true), RESUME_MS);
    return () => clearTimeout(id);
  }, [autoPlay]);

  const select = useCallback((i: number) => {
    setAutoPlay(false);
    setActive(i);
  }, []);

  const replay = useCallback(() => {
    setAutoPlay(false);
    setRunKey((k) => k + 1);
  }, []);

  const isAfter = phase === "after";

  return (
    <section
      id="showcase"
      className="relative w-full overflow-hidden px-6 py-28 sm:px-8 md:py-36 lg:py-44"
    >
      {/* Ambient backdrop */}
      <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />

      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5">
          <Eyebrow index="03">Live Transformations</Eyebrow>
          <SectionHeading>Watch the web rearrange itself.</SectionHeading>
          <Lede>
            One sentence, one click. Morph reads the page you&rsquo;re on and rebuilds it
            around the way you actually work — live, in the browser.
          </Lede>
        </div>

        {/* Tabs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-12 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Live transformation examples"
        >
          {EXAMPLES.map((ex, i) => {
            const isActive = i === active;
            return (
              <button
                key={ex.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => select(i)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[13px] font-medium tracking-tight transition-colors duration-300 will-change-transform",
                  isActive ? "text-black" : "text-white/55 hover:text-white",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="showcase-tab-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-white"
                    aria-hidden
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span
                    className={cn(
                      "hidden font-mono text-[10px] sm:inline",
                      isActive ? "text-black/45" : "text-white/55",
                    )}
                  >
                    0{i + 1}
                  </span>
                  {ex.tab}
                  <span className={cn(isActive ? "text-black/45" : "text-white/55")}>→</span>
                  <span className="hidden sm:inline">{ex.to}</span>
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Stage */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative mt-8"
        >
          <BrowserFrame
            url={example.url}
            className="mx-auto"
            toolbarRight={
              <motion.div
                animate={{ opacity: phase === "analyzing" ? [0.4, 1, 0.4] : 1 }}
                transition={{ duration: 1, repeat: phase === "analyzing" ? Infinity : 0 }}
                className="flex items-center gap-1.5 rounded-full border border-white/16 bg-white/[0.08] px-2 py-1"
              >
                <Constellation size={13} morph interval={1500} edges={false} />
              </motion.div>
            }
          >
            {/* Viewport: the morphing mock */}
            <div className="relative h-[400px] sm:h-[440px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${example.id}-${isAfter ? "after" : "before"}-${runKey}`}
                  initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.01, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                  className="absolute inset-0 overflow-hidden text-white will-change-transform"
                >
                  <MockUI id={example.id} after={isAfter} />
                </motion.div>
              </AnimatePresence>

              {/* Analyzing scan overlay */}
              <AnimatePresence>
                {phase === "analyzing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    aria-hidden
                  >
                    <div className="bg-grid absolute inset-0 opacity-40" />
                    <motion.div
                      initial={{ y: "-110%" }}
                      animate={{ y: "110%" }}
                      transition={{ duration: 1.4, ease: "easeInOut" }}
                      className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Prompt / command bar */}
            <div className="border-t border-white/16 bg-ink-900/60 p-3 backdrop-blur">
              <div className="flex items-center gap-3 rounded-xl border border-white/16 bg-black/40 px-3.5 py-3">
                <Constellation size={16} morph interval={1700} edges={false} />
                <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-white/85">
                  {example.prompt}
                </span>

                <button
                  type="button"
                  onClick={replay}
                  className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/16 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/45 transition-colors hover:border-white/28 hover:text-white sm:inline-flex"
                  aria-label="Replay this transformation"
                >
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M13 8a5 5 0 1 1-1.46-3.54M13 2v3h-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Replay
                </button>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={phase}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
                      phase === "after"
                        ? "border-white/35 bg-white/[0.16] text-white"
                        : "border-white/16 text-white/45",
                    )}
                  >
                    {phase === "before" && "Ready"}
                    {phase === "analyzing" && "Analyzing"}
                    {phase === "after" && (
                      <>
                        Morphed
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path
                            d="M2.5 6.5l2.5 2.5 5-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </BrowserFrame>

          {/* Caption row under the frame */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
              <span className="text-white/55">{example.from}</span>
              <span className="mx-2 text-white/55">→</span>
              <span className="text-white/55">{example.to}</span>
            </p>
            <div className="flex items-center gap-1.5" aria-hidden>
              {EXAMPLES.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    i === active ? "w-6 bg-white/70" : "w-1.5 bg-white/[0.28]",
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
