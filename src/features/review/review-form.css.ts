import { style } from "@vanilla-extract/css";
import { media, vars, textStyle, textMetrics } from "@/styles";

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  width: "100%",
});

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  width: "100%",
});

export const fieldLabelRow = style({
  display: "flex",
  alignItems: "baseline",
  gap: vars.spacing.sm,
});

export const fieldLabel = style([
  textStyle.fieldLabel,
  {
    color: vars.color.primary,
  },
]);

export const fieldOptional = style({
  fontFamily: vars.font.mono,
  ...textMetrics.bodySm,
  letterSpacing: "0.06em",
  color: vars.color.tertiary,
});

export const tagChips = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
});

export const tagChip = style({
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.strokeMedium}`,
  backgroundColor: "transparent",
  ...textMetrics.metadata,
  fontWeight: 500,
  color: vars.color.secondary,
  cursor: "pointer",
  transition: `border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, color ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-pressed]": {
      borderColor: vars.color.primary,
      backgroundColor: vars.color.blue10,
      color: vars.color.primary,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const textarea = style({
  width: "100%",
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  borderRadius: vars.radius.control,
  border: `1px solid ${vars.color.strokeMedium}`,
  backgroundColor: vars.color.background,
  fontFamily: vars.font.sans,
  ...textMetrics.body,

  color: vars.color.primary,
  resize: "vertical",
  "::placeholder": {
    color: vars.color.tertiary,
  },
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "1px",
    },
  },
});

const anonymousRowBase = {
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  width: "fit-content",
} as const;

export const anonymousRow = style({
  ...anonymousRowBase,
  cursor: "pointer",
});

export const anonymousRowLocked = style({
  ...anonymousRowBase,
  cursor: "default",
  opacity: 0.75,
});

export const checkbox = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: vars.size.iconMd,
  height: vars.size.iconMd,
  padding: 0,
  borderRadius: "0.5rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  backgroundColor: "transparent",
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-disabled]": {
      cursor: "default",
    },
    "&[data-checked]": {
      borderColor: vars.color.fillPrimary,
      backgroundColor: vars.color.fillPrimary,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const checkboxIndicator = style({
  display: "inline-flex",
  color: vars.color.background,
});

export const anonymousLabel = style({
  ...textMetrics.bodySm,
  fontWeight: 500,
  color: vars.color.primary,
});

export const fieldError = style({
  ...textMetrics.bodySm,
  color: vars.color.red,
});

export const rootError = style({
  ...textMetrics.bodySm,
  color: vars.color.red,
});

export const queryState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  ...textMetrics.metadata,
  color: vars.color.secondary,
});

export const deleteButton = style({
  color: vars.color.red,
});

export const dialogBackdrop = style({
  position: "fixed",
  zIndex: 100,
  inset: 0,
  minHeight: "100dvh",
  backgroundColor: vars.color.black50,
});

export const dialogPopup = style({
  position: "fixed",
  zIndex: 101,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  width: "min(36rem, calc(100vw - 4.8rem))",
  padding: vars.spacing.xl,
  borderRadius: vars.radius.media,
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});

export const dialogTitle = style({
  paddingRight: vars.spacing["3xl"],
  ...textMetrics.sectionTitle,
  fontWeight: 600,
  color: vars.color.primary,
});

export const dialogDescription = style({
  ...textMetrics.body,

  color: vars.color.secondary,
});

export const dialogActions = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  paddingTop: vars.spacing.sm,
});

export const deleteConfirmButton = style({
  backgroundColor: vars.color.red,
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover:not([data-disabled])": {
          backgroundColor: vars.color.red,
          opacity: 0.9,
        },
      },
    },
  },
});

export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  paddingTop: vars.spacing.md,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});
