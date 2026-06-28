"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Constellation from "@/components/ui/Constellation";
import MagneticButton from "@/components/ui/MagneticButton";
import StarField from "@/components/ui/StarField";
import {
  useMounted,
  useMousePosition,
  usePrefersReducedMotion,
} from "@/lib/hooks";
import { EASE_OUT_EXPO, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const HEADLINE = ["Start Morphing", "The Web."] as const;

const TRUST = [
  "One email at launch",
  "No spam, ever",
  "Unsubscribe anytime",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CTA() {
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();

  // Mouse parallax for the ambient layers behind the headline.
  const { x: mx, y: my } = useMousePosition({
    stiffness: 60,
    damping: 18,
    mass: 0.6,
  });
  const markX = useTransform(mx, (v) => v * -22);
  const markY = useTransform(my, (v) => v * -16);
  const gridX = useTransform(mx, (v) => v * 14);
  const gridY = useTransform(my, (v) => v * 10);

  // Scroll-linked drift so the field breathes as the section enters.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const vignetteScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.15, 1, 1.1],
  );

  // Form state — posts to /api/waitlist (Brevo).
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("Enter a valid email to continue");

  const submitted = status === "success";
  const isError = status === "error";
  const isLoading = status === "loading";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setErrorMsg("Enter a valid email to continue");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
        );
      }
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <section
      id="waitlist"
      ref={ref}
      className="grain relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 py-20 sm:px-8 md:py-24 lg:py-28"
    >
      {/* Ambient backdrop --------------------------------------------------- */}
      <div className="spotlight pointer-events-none absolute inset-0" />
      <StarField count={120} seed={9} edges parallax={50} opacity={0.8} />

      <motion.div
        aria-hidden
        style={{ x: gridX, y: gridY }}
        className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_55%_at_50%_45%,black,transparent)]"
      />

      {/* Slow-drifting brand mark behind the headline.
          Centering lives on a plain wrapper so Framer Motion's transform
          (parallax x/y, then rotation) never clobbers the -translate centering. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform">
        <motion.div aria-hidden style={{ x: markX, y: markY }}>
          <motion.div
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="text-white/[0.04]"
          >
            <Constellation
              size={520}
              morph={!reduced}
              interval={5200}
              edges
              glow
              strokeWidth={1.4}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Radial vignette so the centered copy pops */}
      <motion.div
        aria-hidden
        style={{ scale: vignetteScale }}
        className="pointer-events-none absolute inset-0 [background:radial-gradient(closest-side,transparent_45%,rgba(0,0,0,0.7)_100%)]"
      />

      {/* Content ------------------------------------------------------------ */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: EASE_OUT_EXPO },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/55 backdrop-blur-md"
        >
          <span className="h-1 w-1 rounded-full bg-white/70" />
          The Last Step
        </motion.div>

        {/* Headline — line-reveal entrance */}
        <h2 className="text-balance font-semibold tracking-tightest">
          {HEADLINE.map((line, i) => (
            <motion.span
              key={line}
              className="block overflow-hidden py-[0.05em]"
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
                      duration: 1.1,
                      ease: EASE_OUT_EXPO,
                      delay: 0.1 + i * 0.12,
                    },
                  },
                }}
                className={cn(
                  "block text-[2.9rem] leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl",
                  i === 1 ? "text-gradient-muted" : "text-gradient",
                )}
              >
                {line}
              </motion.span>
            </motion.span>
          ))}
        </h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1, ease: EASE_OUT_EXPO, delay: 0.45 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-7 max-w-xl text-pretty text-lg text-white/65 md:text-xl"
        >
          Drop your email and we&apos;ll tell you the moment Morph goes live —
          one heads-up the day it launches, nothing else.
        </motion.p>

        {/* Waitlist form / success swap */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, ease: EASE_OUT_EXPO, delay: 0.6 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-10 flex min-h-[58px] w-full max-w-md items-center justify-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <SuccessState key="success" reduced={reduced} />
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center"
              >
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <div
                  className={cn(
                    "glass relative flex flex-1 items-center rounded-full px-5 py-3 transition-colors",
                    isError
                      ? "border-white/30"
                      : "border-white/10 focus-within:border-white/25",
                  )}
                >
                  <input
                    id="cta-email"
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@domain.com"
                    disabled={isLoading}
                    aria-invalid={isError}
                    aria-describedby={isError ? "cta-email-error" : undefined}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="w-full bg-transparent font-mono text-[13px] text-white placeholder:text-white/40 focus:outline-none disabled:opacity-60"
                  />
                </div>
                <MagneticButton
                  type="submit"
                  variant="primary"
                  icon={isLoading ? undefined : <ArrowIcon />}
                  ariaLabel="Join the waitlist"
                  className={cn("shrink-0", isLoading && "pointer-events-none")}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/25 border-t-black" />
                      Joining…
                    </span>
                  ) : (
                    "Join The Waitlist"
                  )}
                </MagneticButton>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Inline validation hint */}
        <div className="mt-3 h-4">
          <AnimatePresence>
            {isError && (
              <motion.p
                id="cta-email-error"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/55"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Trust microcopy with constellation marks */}
        <motion.ul
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.8 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {TRUST.map((item) => (
            <motion.li
              key={item}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: EASE_OUT_EXPO },
                },
              }}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55"
            >
              <Constellation
                size={12}
                morph={false}
                edges={false}
                strokeWidth={2.4}
                className="text-white/50"
              />
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Traveling pulse along the bottom hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/[0.06]"
      >
        {mounted && !reduced && (
          <motion.span
            className="absolute top-1/2 h-px w-24 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            initial={{ left: "-10%" }}
            animate={{ left: "110%" }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
          />
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Success state — replaces the form once a valid email is submitted.
 * ------------------------------------------------------------------------ */

function SuccessState({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className="glass flex items-center gap-3 rounded-full border-white/15 px-6 py-3"
    >
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-white/40"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={reduced ? undefined : { scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
        />
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M2.5 6.5l2.5 2.5 5-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.15 }}
          />
        </svg>
      </span>
      <span className="text-sm font-medium tracking-tight text-white">
        You&apos;re on the list — watch your inbox
      </span>
      <Constellation
        size={16}
        morph={!reduced}
        interval={1600}
        edges={false}
        className="text-white/60"
      />
    </motion.div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h9m0 0L8 4m4 4l-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
