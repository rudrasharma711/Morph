"use client";

import { cn } from "@/lib/utils";

type Props = {
  url?: string;
  children: React.ReactNode;
  className?: string;
  /** Extra classes for the inner content viewport. */
  viewportClassName?: string;
  /** Optional content rendered on the right of the url bar. */
  toolbarRight?: React.ReactNode;
};

/** A monochrome macOS-style browser window used to host mock UIs. */
export default function BrowserFrame({
  url = "morph://new-tab",
  children,
  className,
  viewportClassName,
  toolbarRight,
}: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-ink-950 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-ink-900/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
        </div>
        <div className="mx-auto flex w-full max-w-sm items-center gap-2 rounded-md border border-white/[0.06] bg-black/40 px-3 py-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-white/30">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="truncate font-mono text-[11px] text-white/40">{url}</span>
        </div>
        <div className="flex min-w-[44px] justify-end">{toolbarRight}</div>
      </div>

      {/* Viewport */}
      <div className={cn("relative bg-ink-950", viewportClassName)}>{children}</div>
    </div>
  );
}
