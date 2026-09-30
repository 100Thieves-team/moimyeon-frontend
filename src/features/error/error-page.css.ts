import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

const mobile = "screen and (max-width: 599px)";

export const page = style({
  display: "grid",
  minHeight: "100dvh",
  gridTemplateRows: "minmax(0, 1fr)",
  padding: `0 ${vars.layout.sidePadding} env(safe-area-inset-bottom)`,
  backgroundColor: "#fbfaf6",
  color: vars.color.primary,
});

export const main = style({
  display: "grid",
  minHeight: 0,
  placeItems: "center",
  paddingBlock: vars.spacing["2xl"],
});

export const siteMain = style([
  main,
  {
    minHeight: `calc(100dvh - ${vars.size.header})`,
    paddingInline: vars.layout.sidePadding,
    paddingTop: vars.spacing.sectionSm,
    backgroundColor: "#fbfaf6",
  },
]);

export const content = style({
  display: "flex",
  width: "100%",
  maxWidth: "96rem",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
});

export const title = style({
  fontFamily: vars.font.sans,
  fontSize: "4.8rem",
  lineHeight: 1.25,
  fontWeight: 300,
  "@media": {
    [mobile]: { fontSize: "3.6rem" },
  },

  letterSpacing: "-0.04em",
  textWrap: "balance",
});

export const shortTitle = style({
  fontSize: "7.2rem",
  lineHeight: "8.4rem",
  "@media": {
    [mobile]: { fontSize: "4.8rem", lineHeight: "5.6rem" },
  },
});

export const description = style({
  marginTop: "2.8rem",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "2.2rem",
  lineHeight: "2.6rem",
  fontWeight: 400,

  letterSpacing: "-0.02em",
  textWrap: "balance",
  "@media": {
    [mobile]: {
      marginTop: vars.spacing.xl,
      fontSize: "1.8rem",
      lineHeight: "2.6rem",
    },
  },
});

export const actions = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.md,
  marginTop: vars.spacing.sectionSm,
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
  minWidth: "17rem",
  minHeight: "5.6rem",
  paddingInline: "2.8rem",
  borderRadius: "1.4rem",
  fontSize: "2rem",
  lineHeight: "2.4rem",
  fontWeight: 500,
  "@media": {
    [mobile]: {
      width: "100%",
      minWidth: 0,
      fontSize: "1.8rem",
    },
  },
});
