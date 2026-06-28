"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Eyebrow } from "@/components/ui/Section";

type FooterLink = { label: string; href: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "The Engine", href: "/#engine" },
      { label: "Showcase", href: "/#showcase" },
      { label: "Capabilities", href: "/#features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Team", href: "/team" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
];

const SOCIAL: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/aimorph" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] px-6 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 md:col-span-2">
            <Link href="/" aria-label="Morph home" className="w-fit">
              <Logo size={26} interval={4200} />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/65">
              The Internet. Redesigned by you. Reshape any website with a single
              sentence.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Early-stage disclaimer */}
        <p className="mt-12 max-w-2xl text-xs leading-relaxed text-white/40">
          Morph is an early-stage startup. This site is a preview of what we&apos;re
          building — it&apos;s here to explain what the app does. Full Terms, Privacy,
          and Security policies are on the way.
        </p>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center">
          <Eyebrow>© {2026} Morph Labs — Made for everyone</Eyebrow>
          <div className="flex items-center gap-5 text-sm text-white/55">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
