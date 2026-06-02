/**
 * Design tokens — the single source of truth for motion, layout, and elevation.
 *
 * Tailwind (`tailwind.config.ts`) consumes the motion scale so utility classes
 * and Framer Motion variants stay in sync. Keep values here, not scattered in
 * components.
 */

type CubicBezier = [number, number, number, number];

export const motion = {
  /** Durations in milliseconds. */
  duration: {
    fast: 150,
    base: 250,
    slow: 400,
    slower: 600,
  },
  /** Cubic-bezier easings (Framer Motion accepts the tuple form directly). */
  easing: {
    standard: [0.4, 0, 0.2, 1] as CubicBezier,
    emphasized: [0.2, 0, 0, 1] as CubicBezier,
    exit: [0.4, 0, 1, 1] as CubicBezier,
  },
};

export const layout = {
  contentMaxWidth: '72rem',
  headerHeight: '4rem',
};

export const zIndex = {
  base: 0,
  header: 50,
  overlay: 100,
  modal: 200,
};

/** Framer Motion expresses durations in seconds; Tailwind/CSS use milliseconds. */
export const toSeconds = (ms: number): number => ms / 1000;

export const easingToCss = (easing: CubicBezier): string =>
  `cubic-bezier(${easing.join(', ')})`;

export const tokens = { motion, layout, zIndex };
export type Tokens = typeof tokens;
