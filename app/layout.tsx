import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const TITLE = "Morph — The Internet. Redesigned by You.";
const DESCRIPTION =
  "Morph is an AI-powered browser extension that lets you redesign any website with a single sentence. Add tools, remove distractions, and rebuild interfaces — instantly, safely, and on every site.";

export const metadata: Metadata = {
  metadataBase: new URL("https://morph-pearl.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Morph",
  keywords: [
    "AI browser extension",
    "redesign websites",
    "natural language web customization",
    "website transformation",
    "Morph",
  ],
  authors: [{ name: "Morph" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "Morph",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  // Favicon + app icons are provided by file conventions:
  //   app/icon.svg, app/apple-icon.png, app/manifest.ts
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black text-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
