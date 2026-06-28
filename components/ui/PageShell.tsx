"use client";

import { motion } from "framer-motion";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import StarField from "@/components/ui/StarField";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  /** Small mono label above the title (e.g. "Legal"). */
  eyebrow?: string;
  title: React.ReactNode;
  /** Supporting line(s) under the title. */
  intro?: React.ReactNode;
  /** Optional node rendered under the intro (e.g. a billing toggle). */
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  /** Inner content max width. */
  width?: "default" | "narrow" | "wide";
  /** Center the header text. */
  centered?: boolean;
};

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

export default function PageShell({
  eyebrow,
  title,
  intro,
  headerExtra,
  children,
  width = "default",
  centered = false,
}: Props) {
  return (
    <>
      <Nav />
      <main
        id="main"
        className="relative min-h-screen overflow-hidden px-6 pb-28 pt-32 sm:px-8 sm:pt-36"
      >
        {/* Ambient backdrop */}
        <div className="spotlight pointer-events-none absolute inset-0" />
        <StarField count={42} seed={88} parallax={36} opacity={0.4} />
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_45%_at_50%_0%,black,transparent)]"
        />

        <div className={cn("relative z-10 mx-auto w-full", widths[width])}>
          {/* Header */}
          <header
            className={cn(
              "flex flex-col",
              centered && "items-center text-center",
            )}
          >
            {eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                className={cn(
                  "inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60",
                  centered && "justify-center",
                )}
              >
                <span className="h-1 w-1 rounded-full bg-white/70" />
                {eyebrow}
              </motion.div>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.05 }}
              className="text-gradient mt-4 text-balance text-4xl font-semibold leading-[1.02] tracking-tighter sm:text-5xl md:text-6xl"
            >
              {title}
            </motion.h1>
            {intro && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.15 }}
                className={cn(
                  "mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg",
                  centered && "mx-auto",
                )}
              >
                {intro}
              </motion.p>
            )}
            {headerExtra && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.25 }}
                className="mt-8"
              >
                {headerExtra}
              </motion.div>
            )}
          </header>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.2 }}
            className="mt-14"
          >
            {children}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* Shared building blocks for content pages -------------------------------- */

/** A prose container with consistent typography for legal / doc pages. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-10 text-[15px] leading-relaxed text-white/70">
      {children}
    </div>
  );
}

/** A titled section within Prose. */
export function ProseSection({
  heading,
  id,
  children,
}: {
  heading: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="mb-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {heading}
      </h2>
      <div className="flex flex-col gap-3 text-white/65">{children}</div>
    </section>
  );
}
