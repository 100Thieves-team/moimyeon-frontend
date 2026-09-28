import { style } from "@vanilla-extract/css";
import { vars, textMetrics } from "@/styles";

export const page = style({
  minHeight: "100dvh",
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
});

export const article = style({
  width: "100%",
  maxWidth: vars.layout.documentMaxWidth,
  margin: "0 auto",
});

export const title = style({
  ...textMetrics.pageTitle,
  fontWeight: 400,

  letterSpacing: "-0.035em",
});

export const meta = style({
  marginTop: vars.spacing.md,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const content = style({
  marginTop: vars.layout.sectionGap,
  color: vars.color.secondary,
  ...textMetrics.body,

  whiteSpace: "pre-wrap",
  wordBreak: "keep-all",
});

export const status = style({
  padding: "6.4rem 0",
  color: vars.color.secondary,
  textAlign: "center",
});
