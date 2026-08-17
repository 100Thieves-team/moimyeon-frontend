import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

const mobile = "screen and (max-width: 599px)";

export const page = style({
  display: "grid",
  minHeight: "100dvh",
  gridTemplateRows: "auto minmax(0, 1fr)",
  padding: "4rem clamp(2rem, 5vw, 6rem) 6rem",
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  "@media": {
    [mobile]: {
      padding: "3.2rem 2rem 4rem",
    },
  },
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
      paddingBottom: "3.2rem",
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
  fontSize: "7.2rem",
  fontWeight: 300,
  lineHeight: "8.4rem",
  letterSpacing: "-0.04em",
  textWrap: "balance",
  "@media": {
    [mobile]: {
      fontSize: "5.2rem",
      lineHeight: "6rem",
    },
  },
});

export const description = style({
  marginTop: "1.6rem",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "2.2rem",
  fontWeight: 400,
  lineHeight: "3rem",
  letterSpacing: "-0.02em",
  textWrap: "balance",
  "@media": {
    [mobile]: {
      marginTop: "1.2rem",
      fontSize: "1.8rem",
      lineHeight: "2.6rem",
    },
  },
});

export const actions = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1.2rem",
  marginTop: "5.6rem",
  "@media": {
    [mobile]: {
      width: "100%",
      maxWidth: "24rem",
      flexDirection: "column",
      marginTop: "4rem",
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
