export const breakpoints = {
  sm: 600,
  md: 800,
  lg: 1000,
  xl: 1200,
  "2xl": 1400,
} as const;

export type Breakpoint = keyof typeof breakpoints;

const minWidth = (px: number) => `screen and (min-width: ${px}px)`;

// 미디어쿼리는 CSS 변수를 읽을 수 없으므로 순수 TS 상수로 유지한다.
// 값은 .css.ts 파일의 '@media' 객체 키로 그대로 사용한다 ("@media " 접두어는 VE가 붙임).
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

// html { font-size: 62.5% } 기준 1rem = 10px (DESIGN.md의 모든 rem 값이 이 기준)
export const remBase = 10;
