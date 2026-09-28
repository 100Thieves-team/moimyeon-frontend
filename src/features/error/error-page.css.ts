import { style } from "@vanilla-extract/css";
import { vars, textMetrics } from "@/styles";

const mobile = "screen and (max-width: 599px)";

export const page = style({
  display: "grid",
  minHeight: "100dvh",
  gridTemplateRows: "auto minmax(0, 1fr)",
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
});

export const header = style({
  display: "flex",
  justifyContent: "center",
});

export const brand = style({
  borderRadius: "0.2rem",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "2rem",
  fontWeight: 500,
  lineHeight: "2.4rem",
  letterSpacing: "-0.02em",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
  },
});

export const main = style({
  display: "grid",
  minHeight: 0,
  placeItems: "center",
  paddingBottom: "6.4rem",
  "@media": {
    [mobile]: {
      paddingBottom: vars.spacing["2xl"],
    },
  },
});

export const content = style({
  display: "flex",
  width: "100%",
  maxWidth: "56rem",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
});

export const title = style({
  fontFamily: vars.font.sans,
  ...textMetrics.pageTitle,
  fontWeight: 300,

  letterSpacing: "-0.04em",
  textWrap: "balance",
});

export const description = style({
  marginTop: vars.spacing.base,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  ...textMetrics.body,
  fontWeight: 400,

  letterSpacing: "-0.02em",
  textWrap: "balance",
  "@media": {
    [mobile]: {
      marginTop: vars.spacing.md,
    },
  },
});

export const actions = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.md,
  marginTop: "5.6rem",
  "@media": {
    [mobile]: {
      width: "100%",
      maxWidth: "24rem",
      flexDirection: "column",
      marginTop: vars.spacing["3xl"],
    },
  },
});

export const actionLayout = style({
  minWidth: "18rem",
  "@media": {
    [mobile]: {
      width: "100%",
      minWidth: 0,
    },
  },
});
