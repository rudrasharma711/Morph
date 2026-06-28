"use client";

import { motion } from "framer-motion";
import { useMagnetic } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { SPRING_SNAPPY } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** Native button type — use "submit" inside a form. Ignored when `href` is set. */
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
  strength?: number;
  icon?: React.ReactNode;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-tight will-change-transform select-none";

const variants: Record<Variant, string> = {
  primary: "bg-white text-black",
  secondary:
    "bg-white/[0.04] text-white hairline backdrop-blur-md",
  ghost: "text-white/80 hover:text-white",
};

/**
 * Magnetic, physics-based button. The shell is pulled toward the cursor while
 * the inner label trails with a softer spring for a layered, premium feel.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  strength = 0.45,
  icon,
  ariaLabel,
}: Props) {
  const { ref, x, y } = useMagnetic<HTMLElement>(strength);

  const inner = (
    <>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        </span>
      )}
      {variant === "secondary" && (
        <span className="pointer-events-none absolute inset-0 rounded-full bg-white/0 transition-colors duration-300 group-hover:bg-white/[0.08]" />
      )}
      <motion.span
        className="relative z-10 inline-flex items-center gap-2"
        style={{ x, y }}
        transition={SPRING_SNAPPY}
      >
        {children}
        {icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
      </motion.span>
    </>
  );

  const shared = {
    style: { x, y },
    transition: SPRING_SNAPPY,
    className: cn(base, variants[variant], className),
    "aria-label": ariaLabel,
  } as const;

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        {...shared}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      {...shared}
    >
      {inner}
    </motion.button>
  );
}
