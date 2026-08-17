import { vars } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";

const mobile = "screen and (max-width: 599px)";

export const header = style({
  width: "100%",
  height: "6.4rem",
  flex: "0 0 auto",
  padding: "0 3.2rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
  "@media": {
    [mobile]: {
      padding: "0 1.6rem",
    },
  },
});

export const nav = style({
  display: "flex",
  height: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.6rem",
});

export const navLeft = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: "3.6rem",
});

export const brand = style({
  flex: "0 0 auto",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "2rem",
  fontWeight: 500,
  lineHeight: "2.4rem",
  letterSpacing: "-0.02em",
  selectors: {
    "&:focus-visible": {
      borderRadius: "0.2rem",
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
  },
});

export const navList = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "2.4rem",
  overflow: "hidden",
  listStyle: "none",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.6rem",
  fontWeight: 400,
  lineHeight: "2rem",
  whiteSpace: "nowrap",
  "@media": {
    [mobile]: {
      display: "none",
    },
  },
});

export const navItem = style({
  display: "inline-flex",
  minHeight: "4.4rem",
  alignItems: "center",
  borderRadius: vars.radius.control,
  color: vars.color.tertiary,
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const activeNavItem = style({
  color: vars.color.primary,
  fontWeight: 500,
});

export const navActions = style({
  display: "flex",
  flex: "0 0 auto",
  alignItems: "center",
  gap: "1.6rem",
  "@media": {
    [mobile]: {
      gap: "0.8rem",
    },
  },
});

export const avatarLink = style({
  display: "inline-flex",
  flex: "0 0 auto",
  borderRadius: vars.radius.pill,
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
  },
});

export const avatarRoot = style({
  display: "inline-flex",
  width: "3.4rem",
  height: "3.4rem",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  fontWeight: 700,
  lineHeight: "1.4rem",
});

export const avatarFallback = style({
  display: "inline-flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
});
