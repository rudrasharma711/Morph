# Morph — logo & icon assets

The Morph mark is a 7-node constellation (an "M"). All assets are pure
black & white with **thin, faded connecting lines** and solid dots.

## Files

| File | Use |
| --- | --- |
| `public/logo-mark.svg` | White mark, transparent — for dark backgrounds |
| `public/logo-mark-black.svg` | Black mark, transparent — for light backgrounds |
| `public/logo-wordmark.svg` | Mark + "Morph" wordmark (white) |
| `public/logo-mark-512.png` | White mark, transparent PNG (512×512) for tools that need a raster |
| `app/icon.svg` | Browser-tab **favicon** (auto-used by Next.js) |
| `app/apple-icon.png` | **iOS** home-screen icon (180×180, auto-used) |
| `public/icon-192.png`, `public/icon-512.png` | **PWA / Android install** icons (referenced by the manifest) |
| `app/opengraph-image.png` | **Cover / social-share image** (1200×630) — mark left of "Morph". Auto-used for `og:image` |
| `app/twitter-image.png` | Same cover, used for `twitter:image` (large summary card) |
| `public/cover.png` | The cover image for general use (1200×630) |

## How it's installed on the site

These are wired up automatically via Next.js file conventions:

- `app/icon.svg` → favicon (`<link rel="icon">`)
- `app/apple-icon.png` → `<link rel="apple-touch-icon">`
- `app/manifest.ts` → web app manifest, so the site is **installable** (Add to
  Home Screen / Install App) with the Morph mark and a black theme.

Nothing else to do — they ship with the site. To install on a device: open the
site in a browser → **Install app** (desktop Chrome/Edge) or **Share → Add to
Home Screen** (iOS Safari).

## Regenerating the PNGs

The raster icons are generated from the SVG so they always match. After editing
the mark, run:

```bash
node scripts/gen-icons.mjs   # requires the `sharp` dev dependency
```

This rewrites `app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`,
and `public/logo-mark-512.png`.

To regenerate the cover / social image:

```bash
node scripts/gen-cover.mjs   # writes app/opengraph-image.png, app/twitter-image.png, public/cover.png
```
