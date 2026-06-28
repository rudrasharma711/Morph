/**
 * Generates the social / cover image (Open Graph + Twitter) — 1200×630.
 * The Morph mark sits to the LEFT of the "Morph" wordmark, over a subtle
 * black starfield. Run: node scripts/gen-cover.mjs   (requires `sharp`)
 *
 * Outputs:
 *   app/opengraph-image.png   (auto-used for og:image)
 *   app/twitter-image.png     (auto-used for twitter:image)
 *   public/cover.png          (general use)
 */
import sharp from "sharp";

const W = 1200,
  H = 630;
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'SF Mono', ui-monospace, Menlo, monospace";

// Deterministic starfield ---------------------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(73);
let stars = "";
for (let i = 0; i < 46; i++) {
  const x = (rand() * W).toFixed(1);
  const y = (rand() * H).toFixed(1);
  const r = (0.7 + rand() * 1.7).toFixed(2);
  const o = (0.12 + rand() * 0.5).toFixed(2);
  stars += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${o}"/>`;
}

// The Morph mark (thin, faded lines + solid dots) ---------------------------
const MARK = `
  <g stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.4">
    <path d="M12.7 50.4 18.2 14.5 32 36.6 45.8 14.5 51.3 50.4"/>
    <path d="M18.2 14.5 24.6 32 39.4 32 45.8 14.5"/>
  </g>
  <g fill="#ffffff">
    <circle cx="12.7" cy="50.4" r="2.6"/><circle cx="18.2" cy="14.5" r="2.6"/>
    <circle cx="32" cy="36.6" r="3.5"/><circle cx="45.8" cy="14.5" r="2.6"/>
    <circle cx="51.3" cy="50.4" r="2.6"/><circle cx="24.6" cy="32" r="2.3"/>
    <circle cx="39.4" cy="32" r="2.3"/>
  </g>`;

// Lockup: mark on the left, "Morph" to its right, vertically centred.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="spot" cx="50%" cy="32%" r="58%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="62%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="50%" r="72%">
      <stop offset="52%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#000000"/>
  <rect width="${W}" height="${H}" fill="url(#spot)"/>
  <g>${stars}</g>

  <!-- Lockup centred at (600, 272) -->
  <g transform="translate(360 195) scale(2.4)">${MARK}</g>
  <text x="517" y="272" font-family="${FONT}" font-size="106" font-weight="600"
        letter-spacing="-4" fill="#ffffff" dominant-baseline="middle">Morph</text>

  <!-- Tagline -->
  <text x="600" y="388" text-anchor="middle" font-family="${FONT}" font-size="34"
        font-weight="400" letter-spacing="-0.4" fill="#ffffff" fill-opacity="0.62">The Internet. Redesigned by You.</text>

  <!-- Footer label -->
  <text x="600" y="566" text-anchor="middle" font-family="${MONO}" font-size="17"
        letter-spacing="4" fill="#ffffff" fill-opacity="0.34">JOIN THE WAITLIST · MORPH.NEW</text>

  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;

const targets = [
  "app/opengraph-image.png",
  "app/twitter-image.png",
  "public/cover.png",
];
const buf = await sharp(Buffer.from(SVG), { density: 96 })
  .resize(W, H, { fit: "fill" })
  .png()
  .toBuffer();
const { writeFile } = await import("node:fs/promises");
await Promise.all(targets.map((t) => writeFile(t, buf).then(() => console.log("✓", t))));
console.log("Done.");
