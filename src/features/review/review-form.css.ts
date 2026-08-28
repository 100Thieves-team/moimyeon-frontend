import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  width: "100%",
});

export const editNotice = style({
  padding: "0.9rem 1.2rem",
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.fillTertiary,
  fontSize: "1.25rem",
  lineHeight: 1.5,
  color: vars.color.secondary,
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

export const fieldLabel = style({
  fontSize: "1.3rem",
  fontWeight: 700,
  color: vars.color.primary,
});

export const fieldOptional = style({
  fontFamily: vars.font.mono,
  fontSize: "1.05rem",
  letterSpacing: "0.06em",
  color: vars.color.tertiary,
});

export const tagChips = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.6rem",
});

export const tagChip = style({
  padding: "0.8rem 1.3rem",
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.strokeMedium}`,
  backgroundColor: "transparent",
  fontSize: "1.3rem",
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
});

export const textarea = style({
  width: "100%",
  padding: "1.3rem 1.6rem",
  borderRadius: vars.radius.control,
  border: `1px solid ${vars.color.strokeMedium}`,
  backgroundColor: vars.color.background,
  fontFamily: vars.font.sans,
  fontSize: "1.5rem",
  lineHeight: 1.5,
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

export const anonymousRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  cursor: "pointer",
  width: "fit-content",
});

export const checkbox = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "1.8rem",
  height: "1.8rem",
  padding: 0,
  borderRadius: "0.5rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  backgroundColor: "transparent",
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-checked]": {
      borderColor: vars.color.fillPrimary,
      backgroundColor: vars.color.fillPrimary,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const checkboxIndicator = style({
  display: "inline-flex",
  color: vars.color.background,
});

export const anonymousLabel = style({
  fontSize: "1.3rem",
  fontWeight: 500,
  color: vars.color.primary,
});

export const anonymousHint = style({
  fontSize: "1.2rem",
  color: vars.color.tertiary,
});

export const fieldError = style({
  fontSize: "1.25rem",
  color: vars.color.red,
});

export const rootError = style({
  fontSize: "1.25rem",
  color: vars.color.red,
});

export const deleteButton = style({
  color: vars.color.red,
});

export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: vars.spacing.md,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});
