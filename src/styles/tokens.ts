export const breakpoints = {
  sm: 600,
  md: 800,
  lg: 1000,
  xl: 1200,
  "2xl": 1400,
} as const;

export type Breakpoint = keyof typeof breakpoints;

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
