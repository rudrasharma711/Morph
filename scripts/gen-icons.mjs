/**
 * Generates the raster app-icons from the Morph constellation mark.
 * Run with: node scripts/gen-icons.mjs   (requires `sharp`)
 *
 * Outputs:
 *   app/apple-icon.png      180×180  (iOS home screen)
 *   public/icon-192.png     192×192  (PWA)
 *   public/icon-512.png     512×512  (PWA / maskable)
 *   public/logo-mark-512.png 512×512 (transparent white mark)
 */
import sharp from "sharp";

const NODES = `
  <circle cx="12.7" cy="50.4" r="2.9"/><circle cx="18.2" cy="14.5" r="2.9"/>
  <circle cx="32" cy="36.6" r="3.8"/><circle cx="45.8" cy="14.5" r="2.9"/>
  <circle cx="51.3" cy="50.4" r="2.9"/><circle cx="24.6" cy="32" r="2.5"/>
  <circle cx="39.4" cy="32" r="2.5"/>`;

const LINES = (color, width, opacity) => `
  <g stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="${opacity}">
    <path d="M12.7 50.4 18.2 14.5 32 36.6 45.8 14.5 51.3 50.4"/>
    <path d="M18.2 14.5 24.6 32 39.4 32 45.8 14.5"/>
  </g>`;

// Black tile + white mark (thin, faded lines) for app icons.
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#000000"/>
  ${LINES("#ffffff", 1.9, 0.6)}
  <g fill="#ffffff">${NODES}</g>
</svg>`;

// Transparent white mark (even thinner, more faded lines).
const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  ${LINES("#ffffff", 1.5, 0.38)}
  <g fill="#ffffff">${NODES}</g>
</svg>`;

const render = (svg, size, out) =>
  sharp(Buffer.from(svg), { density: 768 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out)
    .then(() => console.log("✓", out));

await Promise.all([
  render(ICON_SVG, 180, "app/apple-icon.png"),
  render(ICON_SVG, 192, "public/icon-192.png"),
  render(ICON_SVG, 512, "public/icon-512.png"),
  render(MARK_SVG, 512, "public/logo-mark-512.png"),
]);
console.log("Done.");
