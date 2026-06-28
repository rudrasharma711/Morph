/**
 * Constellation system for Morph.
 *
 * The mark is a 7-node constellation that morphs between several silhouettes
 * (an "M", a star, an arrow, a scatter). All shapes share the same node count
 * so they can be linearly interpolated for smooth morphing.
 *
 * Coordinates are normalized 0..1 in an SVG-style space (y increases downward).
 */

export type Point = { x: number; y: number };
export type Edge = [number, number];

/** Connectivity shared across all mark shapes (stable node indices). */
export const MARK_EDGES: Edge[] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [1, 5],
  [3, 6],
  [5, 6],
];

/** Named 7-node silhouettes the mark morphs between. */
export const MARK_SHAPES: Record<string, Point[]> = {
  // The "M" — primary brand silhouette
  m: [
    { x: 0.08, y: 0.9 },
    { x: 0.2, y: 0.12 },
    { x: 0.5, y: 0.6 },
    { x: 0.8, y: 0.12 },
    { x: 0.92, y: 0.9 },
    { x: 0.34, y: 0.5 },
    { x: 0.66, y: 0.5 },
  ],
  // A star / asterism
  star: [
    { x: 0.5, y: 0.05 },
    { x: 0.16, y: 0.38 },
    { x: 0.5, y: 0.62 },
    { x: 0.84, y: 0.38 },
    { x: 0.7, y: 0.95 },
    { x: 0.3, y: 0.95 },
    { x: 0.5, y: 0.42 },
  ],
  // An upward arrow — transformation / ascent
  arrow: [
    { x: 0.5, y: 0.06 },
    { x: 0.18, y: 0.42 },
    { x: 0.5, y: 0.34 },
    { x: 0.82, y: 0.42 },
    { x: 0.64, y: 0.94 },
    { x: 0.36, y: 0.94 },
    { x: 0.5, y: 0.64 },
  ],
  // A dispersed network / scatter
  scatter: [
    { x: 0.12, y: 0.2 },
    { x: 0.84, y: 0.14 },
    { x: 0.5, y: 0.48 },
    { x: 0.2, y: 0.82 },
    { x: 0.9, y: 0.78 },
    { x: 0.62, y: 0.26 },
    { x: 0.34, y: 0.62 },
  ],
};

export const MARK_SHAPE_ORDER = ["m", "star", "arrow", "scatter"] as const;

/** Interpolate between two shapes (used for tween-driven morphing). */
export function lerpShape(a: Point[], b: Point[], t: number): Point[] {
  return a.map((p, i) => ({
    x: p.x + (b[i].x - p.x) * t,
    y: p.y + (b[i].y - p.y) * t,
  }));
}

/** Deterministic PRNG (mulberry32) — keeps SSR & CSR fields identical. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type FieldStar = {
  x: number; // 0..100 (vw %)
  y: number; // 0..100 (vh %)
  r: number; // radius px
  o: number; // base opacity
  d: number; // animation delay (s)
  dur: number; // twinkle duration (s)
};

/** Generate a deterministic field of stars for background constellations. */
export function generateField(count: number, seed = 1): FieldStar[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    r: 0.4 + rand() * 1.4,
    o: 0.15 + rand() * 0.6,
    d: rand() * 6,
    dur: 3 + rand() * 5,
  }));
}

/** Build edges between nearby field stars (for network visuals). */
export function buildProximityEdges(
  stars: FieldStar[],
  maxDist = 14,
): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      if (Math.hypot(dx, dy) < maxDist) edges.push([i, j]);
    }
  }
  return edges;
}
