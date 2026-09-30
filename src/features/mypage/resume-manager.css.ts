import { textMetrics } from "@/styles/typography.css";
import { textStyle } from "@/styles/typography.css";
import { style } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";

export const manager = style({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
});

export const row = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  paddingBlock: vars.spacing.lg,
  selectors: {
    "&:not(:first-child)": {
      borderTop: `1px solid ${vars.color.strokeLight}`,
    },
    "&:first-child": {
      paddingTop: 0,
    },
  },
  "@media": {
    [media.md]: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.spacing.base,
    },
  },
});

export const fileCell = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.base,
  "@media": {
    [media.md]: {
      flex: "0 1 30rem",
    },
  },
});

export const pdfBadge = style({
  flex: "0 0 auto",
  padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
  borderRadius: "0.5rem",
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontFamily: vars.font.mono,
  ...textMetrics.metadata,
  fontWeight: 700,

  letterSpacing: "0.06em",
});

export const fileInfo = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const fileHeading = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const fileName = style([
  textStyle.p2,
  {
    fontWeight: 500,
    overflow: "hidden",
    color: vars.color.primary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
]);

export const defaultBadge = style({
  flex: "0 0 auto",
  padding: `0.2rem ${vars.spacing.sm}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.blue10,
  color: vars.color.blue,
  ...textMetrics.metadata,
  fontWeight: 500,
});

export const fileMeta = style([
  textStyle.metadata,
  {
    overflow: "hidden",
    color: vars.color.tertiary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
]);

export const summaryCell = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  alignItems: "baseline",
  gap: vars.spacing.sm,
});

export const summaryText = style([
  textStyle.p2Body,
  {
    color: vars.color.secondary,
  },
]);

export const summaryPending = style({
  color: vars.color.tertiary,
});

export const rowActions = style({
  display: "flex",
  flex: "0 0 auto",
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const makeDefaultButton = style({
  display: "inline-flex",
  minHeight: vars.size.controlSm,
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: vars.spacing.base,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: "1rem",
  backgroundColor: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  fontFamily: vars.font.sans,
  ...textMetrics.metadata,
  fontWeight: 500,
  selectors: {
    "&:disabled": {
      color: vars.color.tertiary,
      cursor: "not-allowed",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover:not(:disabled)": { backgroundColor: vars.color.fillTertiary },
      },
    },
  },
});

export const rowError = style({
  color: vars.color.red,
  ...textMetrics.body,

  "@media": {
    [media.md]: {
      flexBasis: "100%",
      textAlign: "right",
    },
  },
});

export const deleteButton = style({
  display: "inline-flex",
  minHeight: vars.size.controlSm,
  alignItems: "center",
  paddingInline: vars.spacing.sm,
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  cursor: "pointer",
  fontFamily: vars.font.sans,
  ...textMetrics.metadata,
  fontWeight: 500,
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover": { color: vars.color.red },
      },
    },
  },
});

export const retryButton = style({
  flex: "0 0 auto",
  border: 0,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  fontFamily: vars.font.sans,
  ...textMetrics.metadata,
  fontWeight: 500,

  textDecoration: "underline",
  textUnderlineOffset: "0.3em",
  selectors: {
    "&:disabled": {
      color: vars.color.tertiary,
      cursor: "default",
      textDecoration: "none",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const empty = style({
  display: "flex",
  minHeight: "16rem",
  alignItems: "center",
  justifyContent: "center",
  border: `1px dashed ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.cta,
  color: vars.color.tertiary,
  ...textMetrics.bodySm,

  textAlign: "center",
});

export const footerMessage = style({
  color: vars.color.tertiary,
  ...textMetrics.bodySm,
});

export const uploadError = style({
  color: vars.color.red,
  ...textMetrics.body,
});

export const visuallyHidden = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  overflow: "hidden",
  border: 0,
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

export const dialogBackdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 50,
  backgroundColor: "rgba(0,0,0,0.38)",
  opacity: 1,
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-starting-style], &[data-ending-style]": { opacity: 0 },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const dialogPopup = style({
  position: "fixed",
  top: "50%",
  left: "50%",
  zIndex: 51,
  display: "flex",
  width: "min(38.4rem, calc(100vw - 3.2rem))",
  flexDirection: "column",
  gap: vars.spacing.sm,
  padding: vars.spacing.xl,
  borderRadius: "2rem",
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardSoft,
  opacity: 1,
  transform: "translate(-50%, -50%) scale(1)",
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}, transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-starting-style], &[data-ending-style]": {
      opacity: 0,
      transform: "translate(-50%, -50%) scale(0.98)",
    },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const dialogTitle = style({
  paddingRight: vars.spacing["3xl"],
  color: vars.color.primary,
  ...textMetrics.sectionTitle,
  fontWeight: 600,

  letterSpacing: "-0.01em",
});

export const dialogDescription = style({
  color: vars.color.secondary,
  ...textMetrics.body,

  overflowWrap: "anywhere",
});

export const dialogError = style({
  color: vars.color.red,
  ...textMetrics.body,
});

export const dialogFooter = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  marginTop: vars.spacing.sm,
});
