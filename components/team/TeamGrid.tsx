"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Team data                                                                  */
/* -------------------------------------------------------------------------- */
/*
 * Photos are already wired to these paths:
 *   /public/team/rudra.jpg, /public/team/kevin.jpg, /public/team/kasinadh.jpg
 * Just drop those image files into /public/team/ and they appear automatically.
 * Until a file exists, the tile falls back to monochrome initials (onError).
 */

type Member = {
  name: string;
  role: string;
  initials: string;
  bio: string;
  /** e.g. "/team/rudra.jpg" — leave undefined to show initials. */
  photo?: string;
  /** LinkedIn URL (placeholder for now). */
  linkedin?: string;
};

// Rudra (Founder & CEO) is placed in the middle so he sits centre on the 3-col grid.
const TEAM: Member[] = [
  {
    name: "Kevin Davies",
    role: "CFO",
    initials: "KD",
    bio: "Runs finance and business operations, keeping Morph Labs disciplined and durable. Builds the financial foundation that lets the team move fast without breaking trust.",
    photo: "/team/kevin.jpg",
    linkedin: "https://www.linkedin.com/in/kevindavies28/",
  },
  {
    name: "Rudra Sharma",
    role: "Founder & CEO",
    initials: "RS",
    bio: "Sets the product vision for Morph and leads design and engineering toward a web that adapts to every person. Obsessed with making powerful tools feel effortless.",
    photo: "/team/rudra.jpg",
    linkedin: "https://www.linkedin.com/in/rudrasharma1/",
  },
  {
    name: "Kasinadh Sudeep",
    role: "COO",
    initials: "KS",
    bio: "Owns operations and scaling, turning ambitious plans into shipped reality. Designs the systems and processes that let Morph grow from waitlist to the world.",
    photo: "/team/kasinadh.jpg",
    linkedin: "https://www.linkedin.com/in/kasinadh-sudeep-67719b350/",
  },
];

/* -------------------------------------------------------------------------- */
/*  Avatar                                                                     */
/* -------------------------------------------------------------------------- */

function Avatar({ member }: { member: Member }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(member.photo) && !failed;

  return (
    <div className="relative aspect-square w-20 overflow-hidden rounded-2xl border border-white/10 sm:w-24">
      {/* Radial / glass backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-white/[0.03] [background-image:radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.14),transparent_60%)]"
      />
      {/* subtle inner highlight */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
      />

      {showPhoto ? (
        // Renders once the file exists at member.photo; falls back to initials.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.photo}
          alt={member.name}
          onError={() => setFailed(true)}
          className="relative h-full w-full object-cover"
        />
      ) : (
        <span className="relative flex h-full w-full items-center justify-center font-mono text-lg font-medium tracking-tight text-white/80 sm:text-xl">
          {member.initials}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  LinkedIn glyph                                                             */
/* -------------------------------------------------------------------------- */

function LinkedInLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="LinkedIn profile"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/45 transition-colors duration-300 hover:border-white/25 hover:text-white/85"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="h-3.5 w-3.5"
      >
        <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.76-1.95C20.4 8.69 22 10.6 22 14.1V21h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21H9V9Z" />
      </svg>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card                                                                       */
/* -------------------------------------------------------------------------- */

function MemberCard({ member }: { member: Member }) {
  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7",
        "transition-colors duration-500 hover:border-white/20 hover:bg-white/[0.035]",
      )}
    >
      {/* hover spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background-image:radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]"
      />

      <div className="relative flex items-start justify-between gap-4">
        <Avatar member={member} />
        {member.linkedin && <LinkedInLink href={member.linkedin} />}
      </div>

      <div className="relative mt-6">
        <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          {member.name}
        </h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
          {member.role}
        </p>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-white/55">
          {member.bio}
        </p>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grid                                                                       */
/* -------------------------------------------------------------------------- */

export default function TeamGrid() {
  return (
    <div className="flex flex-col gap-16">
      {/* Mission / about */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={staggerContainer(0.06)}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.p
          variants={staggerItem}
          className="text-pretty text-base leading-relaxed text-white/65 sm:text-lg"
        >
          Morph Labs believes the web should{" "}
          <strong className="font-medium text-white/90">
            bend to the person using it
          </strong>
          , not the other way around. Every site you visit was designed for an
          average that doesn&apos;t exist — so we&apos;re building the tools to
          let you reshape any page into something that fits you exactly, in
          plain language, right in your browser.
        </motion.p>
      </motion.div>

      {/* Member grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={staggerContainer(0.1)}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TEAM.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </motion.div>

      {/* Closing CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.8 }}
        className="hairline-t flex flex-col items-center gap-1 pt-10 text-center"
      >
        <p className="text-sm text-white/55">Building this with us?</p>
        <a
          href="/#waitlist"
          className="group inline-flex items-center gap-1.5 text-sm font-medium tracking-tight text-white transition-colors"
        >
          Join the waitlist
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </motion.div>
    </div>
  );
}
