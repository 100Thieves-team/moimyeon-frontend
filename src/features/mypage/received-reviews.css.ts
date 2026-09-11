import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const header = style({
  display: "flex",
  alignItems: "baseline",
  gap: vars.spacing.sm,
});

export const count = style({
  fontSize: "1.25rem",
  color: vars.color.tertiary,
});

export const empty = style({
  padding: `${vars.spacing.lg} 0`,
  fontSize: "1.4rem",
  color: vars.color.tertiary,
});

export const list = style({
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
});

export const item = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
  padding: `${vars.spacing.md} 0`,
  selectors: {
    "&:first-child": { paddingTop: 0 },
    "&:last-child": { paddingBottom: 0 },
    "&:not(:first-child)": {
      borderTop: `1px solid ${vars.color.strokeLight}`,
    },
  },
});

export const tagRow = style({
  listStyle: "none",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.6rem",
});

export const content = style({
  fontSize: "1.5rem",
  lineHeight: "2rem",
  color: vars.color.primary,
});

export const author = style({
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
  color: vars.color.tertiary,
});

const skeletonBase = {
  display: "block",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillTertiary,
} as const;

export const skeletonTagRow = style({
  display: "flex",
  gap: "0.6rem",
});

export const skeletonChip = style({
  ...skeletonBase,
  width: "8.4rem",
  height: "2.8rem",
});

export const skeletonLine = style({
  ...skeletonBase,
  width: "70%",
  height: "1.4rem",
  borderRadius: "0.4rem",
});

export const skeletonLineShort = style({
  ...skeletonBase,
  width: "24%",
  height: "1.2rem",
  borderRadius: "0.4rem",
});
