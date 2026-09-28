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
  hover: "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

export const grid = { columns: 12 } as const;

// Lucide SVG의 size prop과 CSS 치수가 같은 값을 공유한다.
export const iconSizes = { sm: 16, md: 20, lg: 24 } as const;

export const typeValues = {
  pageTitle: { fontSize: "3rem", lineHeight: "3.8rem" },
  sectionTitle: { fontSize: "2rem", lineHeight: "2.6rem" },
  cardTitle: { fontSize: "1.8rem", lineHeight: "2.6rem" },
  body: { fontSize: "1.6rem", lineHeight: "2.4rem" },
  bodySm: { fontSize: "1.4rem", lineHeight: "2rem" },
  metadata: { fontSize: "1.3rem", lineHeight: "1.7rem" },
} as const;

export const desktopTypeValues = {
  pageTitle: { fontSize: "3.6rem", lineHeight: "4.4rem" },
  sectionTitle: { fontSize: "2.6rem", lineHeight: "3.2rem" },
} as const;

export const sizeValues = {
  controlSm: "4.4rem",
  controlMd: "4.8rem",
  controlLg: "5.6rem",
  iconSm: `${iconSizes.sm / 10}rem`,
  iconMd: `${iconSizes.md / 10}rem`,
  iconLg: `${iconSizes.lg / 10}rem`,
  header: "6.4rem",
} as const;
