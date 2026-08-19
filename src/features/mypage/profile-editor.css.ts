import { style } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";

export const form = style({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  gap: vars.spacing.xl,
});

export const firstRow = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: vars.spacing.lg,
  "@media": {
    [media.md]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
});

export const field = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const label = style({
  color: vars.color.secondary,
  fontSize: "1.3rem",
  fontWeight: 700,
  lineHeight: "1.7rem",
});

const inputFrame = {
  width: "100%",
  minHeight: "4.6rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.5rem",
  lineHeight: "2rem",
  transition: `border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, box-shadow ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&:focus-within": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
  },
  "@media": {
    [media.reducedMotion]: {
      transition: "none",
    },
  },
} as const;

export const nicknameInputGroup = style({
  ...inputFrame,
  display: "flex",
  height: "4.6rem",
  boxSizing: "border-box",
  alignItems: "center",
  gap: vars.spacing.xs,
  paddingLeft: vars.spacing.base,
  paddingRight: vars.spacing.xs,
});

export const nicknameInput = style({
  minWidth: 0,
  minHeight: "4.4rem",
  flex: 1,
  border: 0,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.5rem",
  lineHeight: "2rem",
});

export const suggestionButton = style({
  minHeight: "4rem",
  paddingInline: "1.2rem",
  gap: "0.6rem",
  color: vars.color.tertiary,
  fontSize: "1.25rem",
  lineHeight: "1.6rem",
});

export const bioInput = style({
  ...inputFrame,
  minHeight: "7.2rem",
  resize: "vertical",
  padding: "1.3rem 1.6rem",
  outline: 0,
  selectors: {
    ...inputFrame.selectors,
    "&:focus": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
  },
});

export const readonlyInput = style({
  ...inputFrame,
  height: "4.6rem",
  boxSizing: "border-box",
  paddingInline: "1.6rem",
  outline: 0,
  selectors: {
    ...inputFrame.selectors,
    "&::placeholder": {
      color: vars.color.tertiary,
      opacity: 1,
    },
  },
});

export const comboboxInputGroup = style({
  ...inputFrame,
  padding: "0.9rem 1.2rem",
});

export const chips = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const chip = style({
  display: "inline-flex",
  minHeight: "3rem",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.6rem 1rem 0.6rem 1.2rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.primary,
  fontSize: "1.3rem",
  fontWeight: 500,
  lineHeight: "1.7rem",
});

export const chipRemove = style({
  display: "inline-flex",
  width: "2rem",
  height: "2rem",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover": {
          backgroundColor: vars.color.fillSecondaryHover,
        },
      },
    },
  },
});

export const companyInput = style({
  width: "16rem",
  minWidth: "12rem",
  minHeight: "3rem",
  flex: 1,
  border: 0,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  lineHeight: "1.8rem",
  selectors: {
    "&::placeholder": {
      color: vars.color.tertiary,
      opacity: 1,
    },
  },
});

export const positioner = style({
  zIndex: 20,
  width: "var(--anchor-width)",
  minWidth: "24rem",
});

export const popup = style({
  maxHeight: "28rem",
  overflowY: "auto",
  padding: vars.spacing.sm,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.tooltip,
  opacity: 1,
  transform: "scale(1)",
  transformOrigin: "var(--transform-origin)",
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}, transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-starting-style]": {
      opacity: 0,
      transform: "scale(0.98)",
    },
    "&[data-ending-style]": {
      opacity: 0,
      transform: "scale(0.98)",
    },
  },
  "@media": {
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
});

export const item = style({
  display: "flex",
  minHeight: "4rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: "0.8rem 1rem",
  borderRadius: vars.radius.control,
  color: vars.color.primary,
  fontSize: "1.4rem",
  lineHeight: "1.8rem",
  cursor: "pointer",
  selectors: {
    "&[data-highlighted]": {
      backgroundColor: vars.color.fillSecondary,
    },
    "&[data-selected]": {
      fontWeight: 500,
    },
  },
});

export const itemIndicator = style({
  display: "inline-flex",
  width: "1.6rem",
  height: "1.6rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.primary,
});

export const empty = style({
  padding: vars.spacing.md,
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const searchStatus = style({
  padding: "0.8rem 1rem",
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const fieldMessage = style({
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const errorMessage = style({
  color: vars.color.red,
});

export const footer = style({
  display: "flex",
  minHeight: "6.9rem",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  paddingTop: vars.spacing.lg,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const submitError = style({
  color: vars.color.red,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const submitButton = style({
  minWidth: "10.4rem",
  marginLeft: "auto",
});
