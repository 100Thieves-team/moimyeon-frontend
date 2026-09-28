import { style } from "@vanilla-extract/css";
import { vars, textMetrics } from "@/styles";

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
  ...textMetrics.metadata,
  color: vars.color.tertiary,
});

export const empty = style({
  padding: `${vars.spacing.lg} 0`,
  ...textMetrics.bodySm,
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
  gap: vars.spacing.sm,
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
  gap: vars.spacing.sm,
});

export const content = style({
  ...textMetrics.body,

  color: vars.color.primary,
});

export const author = style({
  ...textMetrics.metadata,

  color: vars.color.tertiary,
});

const skeletonBase = {
  display: "block",
  borderRadius: vars.radius.pill,
} as const;

export const skeletonTagRow = style({
  display: "flex",
  gap: vars.spacing.sm,
});

export const skeletonChip = style({
  ...skeletonBase,
  width: "8.4rem",
  height: "2.8rem",
});

export const skeletonLine = style({
  ...skeletonBase,
  width: "70%",
  height: "2rem",
  borderRadius: "0.4rem",
});

export const skeletonLineShort = style({
  ...skeletonBase,
  width: "24%",
  height: "1.6rem",
  borderRadius: "0.4rem",
});
