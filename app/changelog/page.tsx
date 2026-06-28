import type { ReactNode } from "react";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Changelog — Morph",
  description:
    "Every release of Morph — new transformations, engine improvements, and fixes that make the internet yours.",
};

/* ----------------------------------------------------------------------------
 * Data model
 * ------------------------------------------------------------------------- */

type ChangeKind = "New" | "Improved" | "Fixed";

type Change = {
  kind: ChangeKind;
  text: ReactNode;
};

type Release = {
  version: string;
  date: string; // human-readable
  iso: string; // for <time dateTime>
  title?: string;
  summary?: string;
  changes: Change[];
};

const releases: Release[] = [
  {
    version: "v0.9.4",
    date: "Jun 2, 2026",
    iso: "2026-06-02",
    title: "Private beta, widened",
    summary:
      "Onboarding polish ahead of the next waitlist wave, plus a faster first paint for morphed pages.",
    changes: [
      {
        kind: "New",
        text: (
          <>
            Added a <strong className="text-white/90">guided first-run tour</strong>{" "}
            that morphs a sandboxed demo page so new beta users can try a sentence
            before touching a real site.
          </>
        ),
      },
      {
        kind: "New",
        text: (
          <>
            Waitlist invites now arrive in batches with a personal{" "}
            <strong className="text-white/90">starter prompt pack</strong> tailored to
            the sites you said you live in.
          </>
        ),
      },
      {
        kind: "Improved",
        text: (
          <>
            Cut median time-to-first-morph by <strong className="text-white/90">38%</strong>{" "}
            by pre-warming the engine the moment a tab gains focus.
          </>
        ),
      },
      {
        kind: "Fixed",
        text: "Resolved a rare flash of the original layout before a saved morph reapplied on reload.",
      },
    ],
  },
  {
    version: "v0.9.2",
    date: "May 14, 2026",
    iso: "2026-05-14",
    title: "Custom widgets",
    summary:
      "Build your own panels from a sentence and pin them to any site — they persist exactly where you left them.",
    changes: [
      {
        kind: "New",
        text: (
          <>
            Introduced <strong className="text-white/90">custom widgets</strong>:
            describe a panel (“a focus timer in the corner,” “a running word count”)
            and Morph mounts it as a draggable, resizable surface.
          </>
        ),
      },
      {
        kind: "New",
        text: (
          <>
            Widgets and layout positions now save to a{" "}
            <strong className="text-white/90">per-site profile</strong>, so your
            arrangement returns on every visit.
          </>
        ),
      },
      {
        kind: "Improved",
        text: "Natural-language editor now understands relative placement — “put it under the search bar,” “move it left of the sidebar.”",
      },
      {
        kind: "Fixed",
        text: "Widgets no longer overlap fixed headers on sites with sticky navigation.",
      },
    ],
  },
  {
    version: "v0.9.0",
    date: "Apr 28, 2026",
    iso: "2026-04-28",
    title: "The LinkedIn → CRM transform",
    summary:
      "Turn a noisy feed into a quiet pipeline — locally, on your screen only.",
    changes: [
      {
        kind: "New",
        text: (
          <>
            Added the <strong className="text-white/90">LinkedIn → CRM</strong>{" "}
            transform: profiles you open become contact cards with notes, tags, and a
            simple stage column — all stored on-device.
          </>
        ),
      },
      {
        kind: "New",
        text: "New “stages” primitive lets any list-style site be reorganized into kanban-style columns from a single sentence.",
      },
      {
        kind: "Improved",
        text: "The engine now reuses a site’s own components when restyling, so morphed pages keep native interactions instead of re-implementing them.",
      },
      {
        kind: "Improved",
        text: "Sharper element targeting on infinite-scroll feeds — newly loaded items inherit your morph automatically.",
      },
    ],
  },
  {
    version: "v0.8.6",
    date: "Mar 19, 2026",
    iso: "2026-03-19",
    title: "Cross-site styles",
    summary:
      "Teach Morph a look once, then carry it everywhere you browse.",
    changes: [
      {
        kind: "New",
        text: (
          <>
            <strong className="text-white/90">Cross-site themes</strong>: save a morph
            as a reusable style and apply it across unrelated domains — “make
            everything read like my reader app.”
          </>
        ),
      },
      {
        kind: "Improved",
        text: "Layout persistence is now keyed per-route, so a morphed inbox and a morphed settings page can differ on the same domain.",
      },
      {
        kind: "Improved",
        text: "Reduced memory footprint on long-lived tabs by 22% by releasing stale transform observers.",
      },
      {
        kind: "Fixed",
        text: "Fixed dark-mode sites bleeding pure-white surfaces during the morph transition.",
      },
    ],
  },
  {
    version: "v0.8.2",
    date: "Feb 24, 2026",
    iso: "2026-02-24",
    title: "ChatGPT → study companion",
    changes: [
      {
        kind: "New",
        text: (
          <>
            Added the <strong className="text-white/90">ChatGPT → study companion</strong>{" "}
            transform: long threads collapse into a notes rail, a flashcard deck, and a
            “quiz me” button — generated from the conversation on your screen.
          </>
        ),
      },
      {
        kind: "Improved",
        text: "Multi-step prompts now run as a preview-then-apply flow, so you can see a morph before it commits.",
      },
      {
        kind: "Improved",
        text: "Undo is now unlimited per session and survives a page refresh.",
      },
      {
        kind: "Fixed",
        text: "Resolved keyboard focus being trapped inside generated study widgets.",
      },
    ],
  },
  {
    version: "v0.7.5",
    date: "Jan 21, 2026",
    iso: "2026-01-21",
    title: "Accessibility pass",
    summary:
      "Morphs that respect how you actually use the web.",
    changes: [
      {
        kind: "New",
        text: "Morph now honors prefers-reduced-motion and your OS contrast settings when restyling a page.",
      },
      {
        kind: "Improved",
        text: "Every generated surface ships with sane ARIA roles and a logical tab order out of the box.",
      },
      {
        kind: "Improved",
        text: "Screen-reader announcements when a morph is applied, reverted, or saved.",
      },
      {
        kind: "Fixed",
        text: "Restored visible focus rings that some aggressive restyles were stripping.",
      },
    ],
  },
  {
    version: "v0.7.0",
    date: "Dec 9, 2025",
    iso: "2025-12-09",
    title: "YouTube → Netflix layout",
    summary:
      "A cinema-style grid for the things you actually want to watch.",
    changes: [
      {
        kind: "New",
        text: (
          <>
            Added the <strong className="text-white/90">YouTube → Netflix layout</strong>{" "}
            transform: subscriptions become rails of large posters, with autoplay
            previews and recommendations dialed down.
          </>
        ),
      },
      {
        kind: "New",
        text: "Saved layouts now sync across your own devices via end-to-end encrypted profiles (opt-in).",
      },
      {
        kind: "Improved",
        text: "Faster diffing means video pages re-morph in a single frame when navigating between clips.",
      },
      {
        kind: "Fixed",
        text: "Fixed thumbnails occasionally loading at the wrong aspect ratio in the new grid.",
      },
    ],
  },
  {
    version: "v0.6.0",
    date: "Oct 30, 2025",
    iso: "2025-10-30",
    title: "First public beta of the Morph engine",
    summary:
      "One sentence in, a redesigned site out — running entirely in your browser.",
    changes: [
      {
        kind: "New",
        text: (
          <>
            The <strong className="text-white/90">Morph engine</strong> ships:
            natural-language editing that rewrites a site’s frontend locally, with
            changes sandboxed to your view only — never the real site, never anyone
            else.
          </>
        ),
      },
      {
        kind: "New",
        text: (
          <>
            Launch transform: <strong className="text-white/90">Gmail → tasks</strong>,
            turning your inbox into a checklist with a built-in Pomodoro timer.
          </>
        ),
      },
      {
        kind: "New",
        text: "Per-site persistence so a morph reapplies automatically the next time you open the page.",
      },
      {
        kind: "Improved",
        text: "Hardened the sandbox so morphs can never read credentials, send network requests, or escape the current tab.",
      },
    ],
  },
];

/* ----------------------------------------------------------------------------
 * Small presentational pieces
 * ------------------------------------------------------------------------- */

const pillStyles: Record<ChangeKind, string> = {
  New: "border-white/25 bg-white/[0.08] text-white/90",
  Improved: "border-white/12 bg-white/[0.03] text-white/65",
  Fixed: "border-white/12 bg-white/[0.03] text-white/55",
};

function KindPill({ kind }: { kind: ChangeKind }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        pillStyles[kind],
      )}
    >
      {kind}
    </span>
  );
}

function TimelineNode() {
  return (
    <span
      aria-hidden
      className="absolute left-0 top-1.5 hidden sm:block"
      style={{ transform: "translateX(-50%)" }}
    >
      <span className="block h-3 w-3 rounded-full border border-white/25 bg-black">
        <span className="block h-full w-full scale-[0.42] rounded-full bg-white/80" />
      </span>
    </span>
  );
}

function ReleaseEntry({ release }: { release: Release }) {
  return (
    <Reveal variant="fadeUp" as="li" className="relative sm:pl-10">
      <TimelineNode />

      {/* Header: version + date */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-sm font-medium tracking-tight text-white">
          {release.version}
        </span>
        <time
          dateTime={release.iso}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45"
        >
          {release.date}
        </time>
      </div>

      {release.title && (
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">
          {release.title}
        </h3>
      )}
      {release.summary && (
        <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-white/55">
          {release.summary}
        </p>
      )}

      {/* Change list card */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/15 sm:p-6">
        <ul className="flex flex-col gap-4">
          {release.changes.map((change, i) => (
            <li
              key={i}
              className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3.5"
            >
              <span className="pt-0.5">
                <KindPill kind={change.kind} />
              </span>
              <span className="text-pretty text-sm leading-relaxed text-white/70">
                {change.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function Page() {
  return (
    <PageShell
      eyebrow="Changelog"
      title="What's new in Morph."
      intro="Every release that brings the internet a little closer to yours — new transformations, a sharper engine, and the small fixes in between."
      width="default"
    >
      {/* Timeline rail (sm+): a hairline on the left, nodes per entry */}
      <div className="relative">
        <span
          aria-hidden
          className="absolute bottom-2 left-0 top-2 hidden w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent sm:block"
        />
        <ol className="flex flex-col gap-16 sm:gap-20">
          {releases.map((release) => (
            <ReleaseEntry key={release.version} release={release} />
          ))}
        </ol>
      </div>

      {/* Footer note */}
      <Reveal
        variant="fadeUp"
        className="mt-20 flex flex-col items-start gap-2 border-t border-white/[0.06] pt-8 sm:pl-10"
      >
        <p className="text-sm leading-relaxed text-white/55">
          Morph is in private beta.{" "}
          <a
            href="/#waitlist"
            className="text-white/80 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/40"
          >
            Join the waitlist
          </a>{" "}
          to shape the releases ahead.
        </p>
      </Reveal>
    </PageShell>
  );
}
