import { keyframes, style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const enterStep = keyframes({
  from: { opacity: 0, transform: "scale(0.97) translateY(0.8rem)" },
  to: { opacity: 1, transform: "scale(1) translateY(0)" },
});

const controlFrame = {
  width: "100%",
  minHeight: "4.8rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: "2rem",
  transition: `border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, box-shadow ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&:focus-within": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
} as const;

export const page = style({
  display: "flex",
  width: "100%",
  flex: "1 1 auto",
  padding: "2.4rem 1.6rem 0",
  "@media": {
    [media.md]: { padding: "4rem 3.2rem 0" },
    [media.lg]: { paddingInline: "6.4rem" },
  },
});

export const layout = style({
  display: "grid",
  width: "100%",
  maxWidth: "98rem",
  flex: "1 1 auto",
  marginInline: "auto",
  alignItems: "start",
  gap: vars.spacing.xl,
  "@media": {
    [media.lg]: {
      gridTemplateColumns: "minmax(18rem, 23rem) minmax(0, 64rem)",
      gap: "clamp(3.2rem, 8vw, 11rem)",
    },
  },
});

export const stepNavigation = style({
  display: "none",
  paddingTop: vars.spacing.sm,
  "@media": {
    [media.lg]: {
      display: "flex",
      flexDirection: "column",
    },
  },
});

export const stepList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  listStyle: "none",
});

export const stepItem = style({ width: "100%" });

export const stepButton = style({
  position: "relative",
  display: "grid",
  width: "100%",
  gridTemplateColumns: "2rem minmax(0, 1fr)",
  alignItems: "start",
  gap: vars.spacing.md,
  padding: "1rem 1.2rem",
  overflow: "hidden",
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  textAlign: "left",
  transition: `background-color ${vars.motion.duration.base} ${vars.motion.ease.fade}, color ${vars.motion.duration.base} ${vars.motion.ease.fade}`,
  selectors: {
    "&::before": {
      position: "absolute",
      top: "0.8rem",
      bottom: "0.8rem",
      left: 0,
      width: "0.3rem",
      borderRadius: vars.radius.pill,
      backgroundColor: "transparent",
      content: "",
      transition: `background-color ${vars.motion.duration.base} ${vars.motion.ease.fade}`,
    },
    '&[aria-current="step"]': {
      backgroundColor: vars.color.fillTertiary,
      color: vars.color.primary,
      cursor: "default",
    },
    '&[aria-current="step"]::before': { backgroundColor: vars.color.fillPrimary },
    "&:disabled:not([aria-current])": { cursor: "default" },
    "&:not(:disabled)": { cursor: "pointer" },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
    "&:has([data-focused])": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:not(:disabled):hover": { backgroundColor: vars.color.fillTertiary },
      },
    },
    [media.reducedMotion]: { transition: "none" },
  },
});

export const stepNumber = style({
  paddingTop: "0.1rem",
  fontFamily: vars.font.mono,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const stepLabel = style({
  fontSize: "1.5rem",
  fontWeight: 400,
  lineHeight: "2rem",
  selectors: {
    [`${stepButton}[aria-current="step"] &`]: { fontWeight: 700 },
  },
});

export const wizardMain = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  alignSelf: "stretch",
});

export const mobileProgress = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  marginBottom: vars.spacing.md,
  color: vars.color.secondary,
  fontSize: "1.3rem",
  fontWeight: 600,
  lineHeight: "1.8rem",
  "@media": {
    [media.lg]: { display: "none" },
  },
});

export const mobileStepNumber = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontWeight: 400,
  letterSpacing: "0.04em",
});

export const title = style({
  marginBottom: vars.spacing.xl,
  outline: 0,
  color: vars.color.primary,
  fontSize: "2.6rem",
  fontWeight: 300,
  lineHeight: "3.2rem",
  letterSpacing: "-0.02em",
  "@media": {
    [media.md]: { fontSize: "3rem", lineHeight: "3.6rem" },
  },
});

export const form = style({
  display: "flex",
  width: "100%",
  flex: "1 1 auto",
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const stepContent = style({
  transformOrigin: "50% 0",
  animation: `${enterStep} ${vars.motion.duration.slow} ${vars.motion.ease.fade} both`,
  "@media": {
    [media.reducedMotion]: { animation: "none" },
  },
});

export const formCard = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.xl,
  padding: "2.4rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  "@media": {
    [media.md]: { padding: "3.2rem" },
  },
});

export const field = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const fieldLabel = style({
  display: "flex",
  alignItems: "baseline",
  gap: vars.spacing.sm,
  color: vars.color.primary,
  fontSize: "1.3rem",
  fontWeight: 700,
  lineHeight: "1.7rem",
});

export const fieldRequirement = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1.05rem",
  fontWeight: 400,
  lineHeight: "1.4rem",
  letterSpacing: "0.06em",
});

export const fieldError = style({
  color: vars.color.red,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const comboboxInputGroup = style({
  ...controlFrame,
  position: "relative",
  display: "flex",
  alignItems: "center",
});

export const comboboxInput = style({
  width: "100%",
  minWidth: 0,
  minHeight: "4.6rem",
  padding: "1.3rem 1.6rem",
  border: 0,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: "2rem",
  textOverflow: "ellipsis",
  selectors: {
    "&::placeholder": { color: vars.color.tertiary, fontWeight: 400, opacity: 1 },
  },
});

export const comboboxPositioner = style({
  zIndex: 30,
  width: "var(--anchor-width)",
  minWidth: "28rem",
});

export const comboboxPopup = style({
  maxHeight: "30rem",
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
    "&[data-starting-style]": { opacity: 0, transform: "scale(0.98)" },
    "&[data-ending-style]": { opacity: 0, transform: "scale(0.98)" },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const comboboxStatus = style({
  padding: "0.8rem 1rem",
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const comboboxEmpty = style({
  padding: vars.spacing.md,
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const comboboxList = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
});

export const comboboxItem = style({
  display: "flex",
  minHeight: "5.2rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: "0.8rem 1rem",
  borderRadius: vars.radius.control,
  color: vars.color.primary,
  cursor: "pointer",
  selectors: {
    "&[data-highlighted]": { backgroundColor: vars.color.fillSecondary },
    "&[data-selected]": { fontWeight: 500 },
  },
});

export const comboboxIndicator = style({
  display: "inline-flex",
  width: "1.6rem",
  height: "1.6rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
});

export const postingCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.2rem",
});

export const postingName = style({
  overflow: "hidden",
  fontSize: "1.4rem",
  lineHeight: "1.8rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const companyName = style({
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const jobRoleFrame = style({ minHeight: "4.8rem" });

export const selectedJobRole = style({
  color: vars.color.primary,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: "2rem",
});

export const choiceGroup = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
});

export const choicePill = style({
  display: "inline-flex",
  minHeight: "3.8rem",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.8rem 2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.45rem",
  fontWeight: 500,
  lineHeight: "1.9rem",
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, color ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-checked], &[data-pressed]": {
      borderColor: vars.color.fillPrimary,
      backgroundColor: vars.color.fillPrimary,
      color: vars.color.background,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover:not([data-checked]):not([data-pressed])": {
          backgroundColor: vars.color.fillTertiary,
        },
      },
    },
    [media.reducedMotion]: { transition: "none" },
  },
});

export const pendingCard = style({
  minHeight: "28rem",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
});

export const pendingLabel = style({
  color: vars.color.primary,
  fontSize: "1.8rem",
  fontWeight: 600,
  lineHeight: "2.4rem",
});

export const pendingDescription = style({
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "2rem",
});

export const footer = style({
  display: "flex",
  minHeight: "5.6rem",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.spacing.base,
  marginTop: "auto",
  padding: `${vars.spacing.sm} 0 max(${vars.spacing["2xl"]}, env(safe-area-inset-bottom))`,
});

export const navigationActions = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  marginLeft: "auto",
});
