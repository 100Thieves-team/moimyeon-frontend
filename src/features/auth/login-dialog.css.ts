import { style } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";

export const backdrop = style({
  position: "fixed",
  inset: 0,
  minHeight: "100dvh",
  backgroundColor: "rgba(2, 2, 4, 0.42)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  opacity: 1,
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-starting-style]": { opacity: 0 },
    "&[data-ending-style]": { opacity: 0 },
  },
  "@supports": {
    "(-webkit-touch-callout: none)": {
      position: "absolute",
    },
  },
  "@media": {
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});

export const popup = style({
  position: "fixed",
  top: "50%",
  left: "50%",
  display: "flex",
  width: "42rem",
  maxWidth: "calc(100vw - 3.2rem)",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "2rem",
  padding: "3.6rem",
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  boxShadow: vars.shadow.cardSoft,
  opacity: 1,
  transform: "translate(-50%, -50%)",
  transition: `opacity ${vars.motion.duration.base} ${vars.motion.ease.site}, transform ${vars.motion.duration.base} ${vars.motion.ease.site}`,
  selectors: {
    "&[data-starting-style]": {
      opacity: 0,
      transform: "translate(-50%, -50%) scale(0.98)",
    },
    "&[data-ending-style]": {
      opacity: 0,
      transform: "translate(-50%, -50%) scale(0.98)",
    },
  },
  "@media": {
    "screen and (max-width: 599px)": {
      padding: "2.4rem",
    },
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});

export const title = style({
  fontFamily: vars.font.sans,
  fontSize: "2.6rem",
  fontWeight: 300,
  lineHeight: "3.2rem",
  letterSpacing: "-0.02em",
});

export const titleLine = style({
  display: "block",
});

export const googleAction = style({
  position: "relative",
  display: "flex",
  width: "100%",
  minHeight: "4.8rem",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  padding: "1.3rem 2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  boxShadow: vars.shadow.glassHighlight,
  fontFamily: vars.font.sans,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: "2rem",
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
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
        backgroundColor: vars.color.fillTertiary,
      },
    },
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});

export const googleMark = style({
  display: "block",
  width: "2rem",
  height: "2rem",
  flex: "0 0 2rem",
});

export const terms = style({
  width: "100%",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.25rem",
  fontWeight: 400,
  lineHeight: "1.8rem",
  textAlign: "center",
});

export const termsLink = style({
  textDecoration: "underline",
  textUnderlineOffset: "0.15em",
  selectors: {
    "&:focus-visible": {
      borderRadius: "0.2rem",
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const error = style({
  marginTop: "-0.8rem",
  color: vars.color.red,
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
  textAlign: "center",
});

export const close = style({
  alignSelf: "center",
  border: 0,
  background: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.35rem",
  fontWeight: 400,
  lineHeight: "1.8rem",
  textDecoration: "underline",
  textUnderlineOffset: "0.15em",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      borderRadius: "0.2rem",
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
  },
});
