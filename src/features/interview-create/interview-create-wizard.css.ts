import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

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
  width: "100%",
  flex: "1 1 auto",
  padding: `5.2rem 1.6rem max(8.8rem, env(safe-area-inset-bottom))`,
  "@media": {
    [media.md]: { paddingInline: "3.2rem" },
    [media.lg]: { paddingInline: "6.4rem" },
  },
});

export const layout = style({
  display: "grid",
  width: "100%",
  maxWidth: "98rem",
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
  display: "flex",
  height: "1.6rem",
  alignItems: "center",
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
  gap: vars.spacing.xl,
});

export const mobileProgress = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
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
  flexDirection: "column",
  gap: vars.spacing.xl,
});

export const stepContent = style({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  gap: vars.spacing.xl,
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

export const methodScheduleStack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const methodChoiceGroup = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: vars.spacing.sm,
  "@media": {
    [media.sm]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  },
});

export const methodChoice = style({
  display: "flex",
  minHeight: "5.2rem",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "1.6rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  textAlign: "left",
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, color ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-checked]": {
      borderColor: vars.color.primary,
      backgroundColor: vars.color.fillTertiary,
      color: vars.color.primary,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover:not([data-checked])": { backgroundColor: vars.color.fillTertiary },
      },
    },
    [media.reducedMotion]: { transition: "none" },
  },
});

export const methodChoiceLabel = style({
  fontSize: "1.5rem",
  fontWeight: 700,
  lineHeight: "2rem",
});

export const regionFields = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: vars.spacing.base,
  "@media": {
    [media.sm]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  },
});

export const participantSection = style({ minWidth: 0 });

export const participantSliderField = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const participantSlider = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  gap: "2.4rem",
});

export const participantHeading = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: vars.spacing.base,
});

export const participantValue = style({
  color: vars.color.secondary,
  fontSize: "1.3rem",
  fontWeight: 500,
  lineHeight: "1.7rem",
});

export const sliderBody = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
  paddingInline: "1.1rem",
});

export const sliderControl = style({
  position: "relative",
  display: "flex",
  width: "100%",
  height: "2.2rem",
  alignItems: "center",
  touchAction: "none",
  userSelect: "none",
});

export const sliderTrack = style({
  position: "relative",
  width: "100%",
  height: "0.6rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.primary10,
});

export const sliderIndicator = style({
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.primary,
});

export const sliderThumb = style({
  width: "2.2rem",
  height: "2.2rem",
  border: `0.2rem solid ${vars.color.background}`,
  borderRadius: "50%",
  backgroundColor: vars.color.primary,
  boxShadow: `0 0 0 1px ${vars.color.strokeLight}`,
  cursor: "grab",
  selectors: {
    "&[data-dragging]": { cursor: "grabbing" },
    "&:has(input:focus-visible)": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const sliderTicks = style({
  display: "flex",
  justifyContent: "space-between",
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const selectTrigger = style({
  ...controlFrame,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: "1.3rem 1.6rem",
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      borderColor: vars.color.primary50,
      outline: `2px solid ${vars.color.primary10}`,
      outlineOffset: 0,
    },
    "&[data-placeholder]": { color: vars.color.tertiary, fontWeight: 400 },
    "&[data-disabled]": { opacity: 0.45, cursor: "not-allowed" },
    "&[data-invalid]": { borderColor: vars.color.red },
  },
});

export const selectValue = style({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const selectIcon = style({
  display: "inline-flex",
  flex: "0 0 auto",
  color: vars.color.tertiary,
});

export const selectPositioner = style({
  zIndex: 30,
  width: "var(--anchor-width)",
});

export const selectPopup = style({
  maxHeight: "26rem",
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
    "&[data-starting-style], &[data-ending-style]": { opacity: 0, transform: "scale(0.98)" },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const selectList = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
});

export const selectItem = style({
  display: "flex",
  minHeight: "4rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: "0.8rem 1rem",
  borderRadius: vars.radius.control,
  color: vars.color.primary,
  fontSize: "1.4rem",
  lineHeight: "1.8rem",
  cursor: "pointer",
  selectors: {
    "&[data-highlighted]": { backgroundColor: vars.color.fillSecondary },
  },
});

export const selectIndicator = style({
  display: "inline-flex",
  width: "1.6rem",
  height: "1.6rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
});

export const scheduleSection = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const scheduleColumnHeader = style({
  display: "none",
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  fontWeight: 500,
  lineHeight: "1.7rem",
  "@media": {
    [media.md]: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 208fr) minmax(0, 148fr) minmax(0, 148fr)",
      gap: "1.2rem",
    },
  },
});

export const limitNotice = style({
  padding: "1.2rem 1.4rem",
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.fillTertiary,
  color: vars.color.secondary,
  fontSize: "1.25rem",
  lineHeight: "1.8rem",
});

export const warningNotice = style({
  color: vars.color.secondary,
  fontSize: "1.25rem",
  lineHeight: "1.8rem",
});

export const scheduleRow = style({
  display: "grid",
  minWidth: 0,
  gridTemplateColumns: "minmax(0, 1fr)",
  alignItems: "start",
  gap: vars.spacing.base,
  "@media": {
    [media.md]: {
      gridTemplateColumns: "minmax(0, 208fr) minmax(0, 148fr) minmax(0, 148fr)",
      gap: "1.2rem",
    },
  },
});

export const scheduleField = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const scheduleFieldLabel = style({
  color: vars.color.primary,
  fontSize: "1.3rem",
  fontWeight: 700,
  lineHeight: "1.7rem",
  "@media": {
    [media.md]: {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: 0,
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
    },
  },
});

export const scheduleControl = style({
  height: "4.6rem",
  minHeight: "4.6rem",
});

export const nativeInput = style({
  ...controlFrame,
  height: "4.6rem",
  minHeight: "4.6rem",
  padding: "1.3rem 1.6rem",
  outline: 0,
  selectors: {
    "&:focus-visible": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
    "&[data-invalid]": { borderColor: vars.color.red },
  },
});

export const introductionInput = style({
  ...controlFrame,
  minHeight: "4.6rem",
  padding: "1.3rem 1.6rem",
  outline: 0,
  selectors: {
    "&:focus-visible": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
    "&[data-invalid]": { borderColor: vars.color.red },
  },
});

export const introductionTextarea = style({
  ...controlFrame,
  minHeight: "8.8rem",
  padding: "1.3rem 1.6rem",
  outline: 0,
  fontSize: "1.5rem",
  fontWeight: 400,
  lineHeight: "2.3rem",
  resize: "vertical",
  selectors: {
    "&:focus-visible": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
    "&[data-invalid]": { borderColor: vars.color.red },
  },
});

export const resumeFileRow = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: "1.4rem",
  padding: "1.6rem 1.8rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.background,
});

export const resumePdfBadge = style({
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

export const resumeFileInfo = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: "0.2rem",
});

export const resumeFileName = style({
  overflow: "hidden",
  color: vars.color.primary,
  fontSize: "1.45rem",
  fontWeight: 500,
  lineHeight: "1.9rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const resumeFileMeta = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.25rem",
  lineHeight: "1.6rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const resumeChangeButton = style({
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
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover": { backgroundColor: vars.color.fillTertiary },
      },
    },
  },
});

export const resumeEmptyTrigger = style({
  display: "inline-flex",
  width: "100%",
  minHeight: "6.9rem",
  alignItems: "center",
  justifyContent: "center",
  border: `1px dashed ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.cta,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover": { backgroundColor: vars.color.fillTertiary },
      },
    },
  },
});

export const resumeSummary = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  padding: "1.8rem 2rem",
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.blue10,
});

export const resumeSummaryLabel = style({
  color: vars.color.blue,
  fontFamily: vars.font.mono,
  fontSize: "1.1rem",
  lineHeight: "1.5rem",
  letterSpacing: "0.1em",
});

export const resumeSummaryText = style({
  color: vars.color.primary,
  fontSize: "1.45rem",
  lineHeight: "2.1rem",
});

export const resumeShareRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  padding: "1.4rem 1.8rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.cta,
  backgroundColor: "transparent",
});

export const resumeShareCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.2rem",
});

export const resumeShareTitle = style({
  color: vars.color.primary,
  fontSize: "1.45rem",
  fontWeight: 500,
  lineHeight: "1.9rem",
});

export const resumeShareDescription = style({
  color: vars.color.tertiary,
  fontSize: "1.25rem",
  lineHeight: "1.7rem",
});

export const resumeShareSwitch = style({
  position: "relative",
  display: "inline-flex",
  width: "4rem",
  height: "2.4rem",
  flex: "0 0 auto",
  alignItems: "center",
  padding: "0.3rem",
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-checked]": { backgroundColor: vars.color.fillPrimary },
    "&[data-focused]": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const resumeShareThumb = style({
  display: "block",
  width: "1.8rem",
  height: "1.8rem",
  borderRadius: "50%",
  backgroundColor: vars.color.background,
  boxShadow: `0 0 0 1px ${vars.color.strokeLight}`,
  transform: "translateX(0)",
  transition: `transform ${vars.motion.duration.fast} ${vars.motion.ease.out}`,
  selectors: {
    [`${resumeShareSwitch}[data-checked] &`]: { transform: "translateX(1.6rem)" },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const resumeDialogBackdrop = style({
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

export const resumeDialogPopup = style({
  position: "fixed",
  top: "50%",
  left: "50%",
  zIndex: 51,
  display: "flex",
  width: "min(47.2rem, calc(100vw - 3.2rem))",
  maxHeight: "calc(100dvh - 3.2rem)",
  flexDirection: "column",
  overflow: "hidden",
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

export const resumeDialogHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  padding: "2.2rem 2.4rem 0",
});

export const resumeDialogTitle = style({
  color: vars.color.primary,
  fontSize: "1.7rem",
  fontWeight: 500,
  lineHeight: "2.3rem",
  letterSpacing: "-0.01em",
});

export const resumeDialogClose = style({
  display: "inline-flex",
  width: "2.8rem",
  height: "2.8rem",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: { "&:hover": { backgroundColor: vars.color.fillTertiary } },
    },
  },
});

export const resumeDialogBody = style({
  display: "flex",
  minHeight: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
  overflowY: "auto",
  padding: "1.6rem 2.4rem 2rem",
});

export const resumeOptionList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const resumeOption = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.md,
  padding: "1.4rem 1.6rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: "1.2rem",
  color: vars.color.primary,
  cursor: "pointer",
  selectors: {
    "&[data-checked]": { borderColor: vars.color.primary, borderWidth: "1.5px" },
    "&[data-focused]": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover:not([data-checked])": { backgroundColor: vars.color.fillTertiary },
      },
    },
  },
});

export const resumeOptionCopy = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: "0.3rem",
});

export const resumeOptionHeading = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const resumeOptionName = style({
  minWidth: 0,
  overflow: "hidden",
  fontSize: "1.45rem",
  fontWeight: 500,
  lineHeight: "1.9rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const resumeRecentBadge = style({
  flex: "0 0 auto",
  padding: "0.2rem 0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.lightGrey,
  color: vars.color.secondary,
  fontSize: "1.1rem",
  fontWeight: 500,
  lineHeight: "1.5rem",
});

export const resumeOptionMeta = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.25rem",
  lineHeight: "1.7rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const resumeOptionCheck = style({
  flex: "0 0 auto",
  opacity: 0,
  selectors: {
    [`${resumeOption}[data-checked] &`]: { opacity: 1 },
  },
});

export const resumeDialogEmpty = style({
  padding: "2rem",
  color: vars.color.tertiary,
  fontSize: "1.35rem",
  lineHeight: "1.9rem",
  textAlign: "center",
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

export const resumeUploadButton = style({
  width: "100%",
  borderStyle: "dashed",
});

export const resumeUploadError = style({
  color: vars.color.red,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const resumeDialogFooter = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  padding: "1.4rem 2.4rem",
  borderTop: `1px solid ${vars.color.strokeLight}`,
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

export const reviewStack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const reviewCard = style({
  width: "100%",
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardSoft,
});

export const reviewRow = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: "1.7rem 2rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  "@media": {
    [media.md]: {
      gridTemplateColumns: "12rem minmax(0, 1fr) auto",
      gap: "2rem",
      paddingInline: "2.6rem",
    },
  },
});

export const reviewLabel = style({
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
  "@media": {
    [media.md]: { gridColumn: "1" },
  },
});

export const reviewValue = style({
  minWidth: 0,
  gridColumn: "1 / -1",
  color: vars.color.primary,
  fontSize: "1.5rem",
  fontWeight: 500,
  lineHeight: "2.1rem",
  overflowWrap: "anywhere",
  "@media": {
    [media.md]: { gridColumn: "2" },
  },
});

export const reviewEdit = style({
  gridColumn: "2",
  gridRow: "1",
  padding: "0.4rem",
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  lineHeight: "1.7rem",
  textDecoration: "underline",
  textUnderlineOffset: "0.15em",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [media.md]: { gridColumn: "3", gridRow: "1" },
    [media.hover]: {
      selectors: { "&:hover": { color: vars.color.primary } },
    },
  },
});

export const reviewSummary = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  padding: "1.8rem 2rem",
  backgroundColor: vars.color.blue10,
  "@media": {
    [media.md]: { paddingInline: "2.6rem" },
  },
});

export const reviewSummaryLabel = style({
  color: vars.color.blue,
  fontFamily: vars.font.mono,
  fontSize: "1.1rem",
  lineHeight: "1.5rem",
  letterSpacing: "0.08em",
});

export const reviewSummaryText = style({
  color: vars.color.primary,
  fontSize: "1.45rem",
  lineHeight: "2.1rem",
});

export const submitError = style({
  color: vars.color.red,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const footer = style({
  display: "flex",
  minHeight: "5.6rem",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.spacing.base,
});

export const navigationActions = style({
  display: "flex",
  width: "100%",
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const nextButton = style({
  marginLeft: "auto",
});
