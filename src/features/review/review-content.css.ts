import { style } from "@vanilla-extract/css";
import { media, vars, textMetrics } from "@/styles";

export const page = style({
  display: "flex",
  justifyContent: "center",
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
});

export const column = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.layout.sectionGap,
  width: "100%",
  maxWidth: vars.layout.formMaxWidth,
});

export const title = style({
  ...textMetrics.pageTitle,
  fontWeight: 300,

  color: vars.color.primary,
});

export const sessionCard = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.base,
  padding: vars.layout.cardPadding,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
});

export const sessionInfo = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const sessionTitle = style({
  overflow: "hidden",
  color: vars.color.primary,
  ...textMetrics.cardTitle,
  fontWeight: 500,

  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const sessionDate = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  ...textMetrics.metadata,

  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const detailLink = style({
  flex: "0 0 auto",
  paddingBlock: vars.spacing.sm,
  color: vars.color.tertiary,
  ...textMetrics.bodySm,

  textDecoration: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { color: vars.color.primary } } },
  },
});

export const targetList = style({
  display: "flex",
  flexDirection: "column",
  padding: `0 ${vars.spacing.lg}`,
  borderRadius: "2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
});

export const errorPage = style({
  display: "flex",
  justifyContent: "center",
  padding: `${vars.spacing.xl} ${vars.spacing.lg}`,
});

export const errorCard = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.md,
  width: "100%",
  maxWidth: "52rem",
  padding: vars.spacing.xl,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
});

export const errorTitle = style({
  ...textMetrics.bodySm,
  fontWeight: 700,
  color: vars.color.primary,
});

export const errorDescription = style({
  ...textMetrics.body,

  color: vars.color.secondary,
});

export const errorActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
  paddingTop: vars.spacing.sm,
});
