import { textMetrics } from "@/styles/typography.css";
import { textStyle } from "@/styles/typography.css";
import { style } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";

export const form = style({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  gap: vars.spacing.lg,
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

export const label = style([
  textStyle.fieldLabel,
  {
    color: vars.color.secondary,
  },
]);

const inputFrame = {
  width: "100%",
  minHeight: vars.size.controlMd,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  ...textMetrics.body,

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
  height: vars.size.controlMd,
  boxSizing: "border-box",
  alignItems: "center",
  gap: vars.spacing.xs,
  paddingLeft: vars.spacing.base,
  paddingRight: vars.spacing.xs,
});

export const nicknameInput = style({
  minWidth: 0,
  minHeight: `calc(${vars.size.controlMd} - 2px)`,
  flex: 1,
  border: 0,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  ...textMetrics.body,
});

export const suggestionButton = style({
  minHeight: vars.size.controlSm,
  paddingInline: vars.spacing.md,
  gap: vars.spacing.sm,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const bioInput = style({
  ...inputFrame,
  minHeight: "7.2rem",
  resize: "vertical",
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  outline: 0,
  selectors: {
    ...inputFrame.selectors,
    "&:focus": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
  },
});

export const companyPillFrame = style({
  minHeight: "5rem",
  "@media": { "screen and (max-width: 799px)": { minHeight: "8.8rem" } },
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
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
  ...textMetrics.body,

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
  gap: vars.spacing.xs,
});

export const item = style({
  display: "flex",
  minHeight: "4rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  borderRadius: vars.radius.control,
  color: vars.color.primary,
  ...textMetrics.bodySm,

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
  width: vars.size.iconSm,
  height: vars.size.iconSm,
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.primary,
});

export const empty = style({
  padding: vars.spacing.md,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const searchStatus = style({
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const fieldMessage = style({
  ...textMetrics.bodySm,
});

export const errorMessage = style({
  ...textMetrics.body,
  color: vars.color.red,
});

export const submitError = style({
  color: vars.color.red,
  ...textMetrics.body,
});
