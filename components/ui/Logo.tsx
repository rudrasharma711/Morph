"use client";

import { motion } from "framer-motion";
import Constellation from "./Constellation";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";

type Props = {
  className?: string;
  /** Show the "Morph" wordmark next to the mark. */
  wordmark?: boolean;
  size?: number;
  morph?: boolean;
  interval?: number;
};

/** Brand lockup: animated constellation mark + wordmark. */
export default function Logo({
  className,
  wordmark = true,
  size = 28,
  morph = true,
  interval = 3000,
}: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-white", className)}>
      <Constellation size={size} morph={morph} interval={interval} />
      {wordmark && (
        <span className="overflow-hidden">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.1 }}
            className="block text-[1.15rem] font-medium tracking-tighter"
          >
            Morph
          </motion.span>
        </span>
      )}
    </span>
  );
}
