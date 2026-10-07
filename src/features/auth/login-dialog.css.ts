import { textMetrics } from "@/styles/typography.css";
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
  gap: vars.spacing.lg,
  padding: vars.spacing["3xl"],
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  boxShadow: vars.shadow.cardSoft,
  opacity: 1,
  transform: "translate(-50%, -50%)",
  transition: `opacity ${vars.motion.duration.base} ${vars.motion.ease.out}, transform ${vars.motion.duration.base} ${vars.motion.ease.out}`,
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
      padding: vars.spacing.xl,
    },
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});

export const title = style({
  paddingRight: vars.spacing["2xl"],
  fontFamily: vars.font.sans,
  ...textMetrics.sectionTitle,
  fontWeight: 300,

  letterSpacing: "-0.02em",
});

export const titleLine = style({
  display: "block",
});

export const googleAction = style({
  position: "relative",
  display: "flex",
  width: "100%",
  minHeight: vars.size.controlMd,
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.md,
  padding: `${vars.spacing.sm} ${vars.spacing.lg}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  boxShadow: vars.shadow.glassHighlight,
  fontFamily: vars.font.sans,
  ...textMetrics.body,
  fontWeight: 500,

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
  width: vars.size.iconMd,
  height: vars.size.iconMd,
  flex: "0 0 2rem",
});

export const terms = style({
  width: "100%",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  ...textMetrics.metadata,
  fontWeight: 400,

  textAlign: "center",
  whiteSpace: "nowrap",
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
  ...textMetrics.body,

  textAlign: "center",
});

export const devSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  paddingTop: vars.spacing.lg,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const devTitle = style({
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  ...textMetrics.cardTitle,
  fontWeight: 600,
});

export const devDescription = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  ...textMetrics.bodySm,
});

export const devForm = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const devField = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const devLabel = style({
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  ...textMetrics.bodySm,
  fontWeight: 500,
});

export const devInput = style({
  width: "100%",
  minHeight: vars.size.controlMd,
  paddingInline: vars.spacing.base,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  fontFamily: vars.font.mono,
  ...textMetrics.body,

  selectors: {
    "&::placeholder": {
      color: vars.color.quaternary,
    },
    "&:focus-visible": {
      borderColor: vars.color.primary,
      outline: `2px solid ${vars.color.primary10}`,
      outlineOffset: "2px",
    },
    "&[data-invalid]": {
      borderColor: vars.color.red,
    },
  },
});

export const devError = style({
  color: vars.color.red,
  fontFamily: vars.font.sans,
  ...textMetrics.body,
});

export const devSubmit = style({
  width: "100%",
  marginTop: vars.spacing.xs,
});
