import { vars } from "@/styles/theme.css";
import { media } from "@/styles/tokens";
import { style } from "@vanilla-extract/css";

const mobile = "screen and (max-width: 599px)";

export const header = style({
  width: "100%",
  height: "6.4rem",
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

export const activeNavItem = style({
  color: vars.color.primary,
});

export const navActions = style({
  display: "flex",
  flex: "0 0 auto",
  alignItems: "center",
  gap: "2rem",
  "@media": {
    [mobile]: {
      gap: "0.8rem",
    },
  },
});

export const loginButton = style({
  minWidth: 0,
  minHeight: "4.4rem",
  padding: "0 1.2rem",
  border: 0,
  borderRadius: vars.radius.control,
  background: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.6rem",
  fontWeight: 400,
  lineHeight: "2rem",
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },
  "@media": {
    [media.hover]: {
      ":hover": {
        backgroundColor: vars.color.fillTertiary,
        color: vars.color.primary,
      },
    },
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});

export const createButton = style({
  minHeight: "4.4rem",
  padding: "1.2rem 2rem",
  border: 0,
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.fillPrimary,
  color: vars.color.background,
  fontFamily: vars.font.sans,
  fontSize: "1.5rem",
  fontWeight: 500,
  lineHeight: "2rem",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}, transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },
  "@media": {
    [media.hover]: {
      ":hover": {
        opacity: 0.82,
      },
    },
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});
