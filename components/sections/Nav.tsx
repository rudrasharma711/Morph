"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Logo from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { label: "Problem", href: "/#problem" },
  { label: "Engine", href: "/#engine" },
  { label: "Functionality", href: "/#how" },
  { label: "Showcase", href: "/#showcase" },
  { label: "Capabilities", href: "/#features" },
  { label: "Future", href: "/#future" },
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ease-out-expo sm:px-5",
          scrolled || open
            ? "glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]"
            : "border border-transparent bg-transparent",
        )}
      >
        <Link href="/" aria-label="Morph home" className="pl-1">
          <Logo size={24} interval={3400} />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm text-white/55 transition-colors duration-300 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <MagneticButton
            href="/#waitlist"
            variant="primary"
            className="hidden px-5 py-2.5 text-[13px] sm:inline-flex"
            strength={0.3}
          >
            Join the Waitlist
          </MagneticButton>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white lg:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="mt-2 w-full max-w-6xl overflow-hidden lg:hidden"
          >
            <div className="glass-strong flex flex-col gap-1 rounded-3xl p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-[15px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/#waitlist"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-2xl bg-white px-4 py-3 text-center text-[15px] font-medium text-black"
              >
                Join the Waitlist
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5">
      <motion.span
        className="absolute left-0 block h-[1.5px] w-5 rounded-full bg-current"
        animate={open ? { top: 7, rotate: 45 } : { top: 2, rotate: 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      />
      <motion.span
        className="absolute left-0 top-[7px] block h-[1.5px] w-5 rounded-full bg-current"
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute left-0 block h-[1.5px] w-5 rounded-full bg-current"
        animate={open ? { top: 7, rotate: -45 } : { top: 12, rotate: 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      />
    </span>
  );
}
