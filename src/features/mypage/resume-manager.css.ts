import { style } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";

export const manager = style({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  gap: vars.spacing.lg,
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
  paddingBlock: "1.8rem",
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
  gap: "1.4rem",
  "@media": {
    [media.md]: {
      flex: "0 1 30rem",
    },
  },
});

export const pdfBadge = style({
  flex: "0 0 auto",
  padding: "0.4rem 0.8rem",
  borderRadius: "0.5rem",
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontFamily: vars.font.mono,
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: "1.4rem",
  letterSpacing: "0.06em",
});

export const fileInfo = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.2rem",
});

export const fileHeading = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const fileName = style({
  overflow: "hidden",
  color: vars.color.primary,
  fontSize: "1.45rem",
  fontWeight: 500,
  lineHeight: "1.9rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const defaultBadge = style({
  flex: "0 0 auto",
  padding: "0.2rem 0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.blue10,
  color: vars.color.blue,
  fontSize: "1.1rem",
  fontWeight: 500,
  lineHeight: "1.5rem",
});

export const fileMeta = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.25rem",
  lineHeight: "1.6rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const summaryCell = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  alignItems: "baseline",
  gap: vars.spacing.sm,
});

export const summaryText = style({
  color: vars.color.secondary,
  fontSize: "1.35rem",
  lineHeight: "2rem",
});

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
  minHeight: "3.4rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "1.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: "1rem",
  backgroundColor: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
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
  fontSize: "1.25rem",
  lineHeight: "1.7rem",
  "@media": {
    [media.md]: {
      flexBasis: "100%",
      textAlign: "right",
    },
  },
});

export const deleteButton = style({
  display: "inline-flex",
  minHeight: "3.4rem",
  alignItems: "center",
  paddingInline: "0.8rem",
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  cursor: "pointer",
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
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
  color: vars.color.blue,
  cursor: "pointer",
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  fontWeight: 500,
  lineHeight: "2rem",
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
  fontSize: "1.35rem",
  lineHeight: "1.9rem",
  textAlign: "center",
});

export const footer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: vars.spacing.sm,
  marginTop: "auto",
});

export const footerMessage = style({
  color: vars.color.tertiary,
  fontSize: "1.25rem",
  lineHeight: "1.7rem",
});

export const uploadError = style({
  color: vars.color.red,
  fontSize: "1.25rem",
  lineHeight: "1.7rem",
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
  gap: vars.spacing.md,
  padding: "2.4rem",
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
  color: vars.color.primary,
  fontSize: "1.7rem",
  fontWeight: 500,
  lineHeight: "2.3rem",
  letterSpacing: "-0.01em",
});

export const dialogDescription = style({
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: "2rem",
  overflowWrap: "anywhere",
});

export const dialogError = style({
  color: vars.color.red,
  fontSize: "1.25rem",
  lineHeight: "1.7rem",
});

export const dialogFooter = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  marginTop: vars.spacing.sm,
});
