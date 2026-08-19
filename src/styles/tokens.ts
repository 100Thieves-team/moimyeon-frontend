export const breakpoints = {
  sm: 600,
  md: 800,
  lg: 1000,
  xl: 1200,
  "2xl": 1400,
} as const;

export type Breakpoint = keyof typeof breakpoints;

type CubicBezier = [number, number, number, number];

export const motionValues = {
  duration: {
    fast: 0.15,
    base: 0.2,
    slow: 0.4,
  },
  ease: {
    out: [0.23, 1, 0.32, 1],
    site: [0.87, 0, 0.13, 1],
    underline: [0.77, 0, 0.175, 1],
    fade: [0.5, 1, 0.9, 1],
  },
} satisfies {
  duration: Record<"fast" | "base" | "slow", number>;
  ease: Record<"out" | "site" | "underline" | "fade", CubicBezier>;
};

const minWidth = (px: number) => `screen and (min-width: ${px}px)`;

export const media = {
  sm: minWidth(breakpoints.sm),
  md: minWidth(breakpoints.md),
  lg: minWidth(breakpoints.lg),
  xl: minWidth(breakpoints.xl),
  "2xl": minWidth(breakpoints["2xl"]),
  dark: "(prefers-color-scheme: dark)",
  hover: "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

export const grid = { columns: 12 } as const;
