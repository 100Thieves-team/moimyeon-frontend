import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

const mobile = "screen and (max-width: 599px)";

export const page = style({
  minHeight: "100dvh",
  padding: "3.2rem 2.4rem 8rem",
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  "@media": {
    [mobile]: {
      padding: "2rem 1.6rem 5.6rem",
    },
  },
});

export const header = style({
  width: "100%",
  maxWidth: "76rem",
  margin: "0 auto 5.6rem",
  "@media": {
    [mobile]: {
      marginBottom: "4rem",
    },
  },
});

export const back = style({
  display: "inline-flex",
  minHeight: "4rem",
  alignItems: "center",
  borderRadius: vars.radius.control,
  color: vars.color.secondary,
  fontSize: "1.4rem",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const article = style({
  width: "100%",
  maxWidth: "76rem",
  margin: "0 auto",
});

export const title = style({
  fontSize: "3.6rem",
  fontWeight: 400,
  lineHeight: "4.6rem",
  letterSpacing: "-0.035em",
  "@media": {
    [mobile]: {
      fontSize: "2.8rem",
      lineHeight: "3.6rem",
    },
  },
});

export const meta = style({
  marginTop: "1.2rem",
  color: vars.color.tertiary,
  fontSize: "1.35rem",
  lineHeight: "2rem",
});

export const content = style({
  marginTop: "4.8rem",
  color: vars.color.secondary,
  fontSize: "1.55rem",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
  wordBreak: "keep-all",
  "@media": {
    [mobile]: {
      marginTop: "3.2rem",
      fontSize: "1.5rem",
    },
  },
});

export const status = style({
  padding: "6.4rem 0",
  color: vars.color.secondary,
  textAlign: "center",
});
