import { style } from "@vanilla-extract/css";
import { media, vars, textStyle, textMetrics } from "@/styles";

const controlFrame = {
  width: "100%",
  minHeight: vars.size.controlMd,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  ...textMetrics.body,
  fontWeight: 500,

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
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
});

export const layout = style({
  display: "grid",
  width: "100%",
  maxWidth: "98rem",
  marginInline: "auto",
  alignItems: "start",
  gap: vars.layout.sectionGap,
  "@media": {
    [media.lg]: {
      gridTemplateColumns: "minmax(18rem, 23rem) minmax(0, 64rem)",
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
  padding: `${vars.spacing.md} ${vars.spacing.md}`,
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
  ...textMetrics.metadata,
});

export const stepLabel = style({
  ...textMetrics.bodySm,
  fontWeight: 400,

  selectors: {
    [`${stepButton}[aria-current="step"] &`]: { fontWeight: 700 },
  },
});

export const wizardMain = style({
  maxWidth: vars.layout.formMaxWidth,
  justifySelf: "center",
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
  ...textMetrics.metadata,
  fontWeight: 600,

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
  ...textMetrics.pageTitle,
  fontWeight: 300,

  letterSpacing: "-0.02em",
});

export const form = style({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  gap: vars.layout.sectionGap,
});

export const stepContent = style({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  gap: vars.layout.sectionGap,
});

export const formCard = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.lg,
  padding: vars.layout.cardPadding,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
});

export const field = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const fieldLabel = style([
  textStyle.fieldLabel,
  {
    display: "flex",
    alignItems: "baseline",
    gap: vars.spacing.sm,
    color: vars.color.primary,
  },
]);

export const fieldRequirement = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  ...textMetrics.bodySm,
  fontWeight: 400,

  letterSpacing: "0.06em",
});

export const fieldError = style({
  color: vars.color.red,
  ...textMetrics.body,
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
  minHeight: `calc(${vars.size.controlMd} - 2px)`,
  padding: `${vars.spacing.sm} ${vars.spacing.base}`,
  border: 0,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  ...textMetrics.body,
  fontWeight: 500,

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
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const comboboxEmpty = style({
  padding: vars.spacing.md,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const comboboxList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const comboboxItem = style({
  display: "flex",
  minHeight: "5.2rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
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
  width: vars.size.iconSm,
  height: vars.size.iconSm,
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
});

export const postingCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const postingName = style({
  overflow: "hidden",
  ...textMetrics.bodySm,

  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const companyName = style({
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const jobRoleFrame = style({ minHeight: vars.size.controlMd });

export const selectedJobRole = style({
  color: vars.color.primary,
  ...textMetrics.body,
  fontWeight: 500,
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
  padding: `${vars.spacing.sm} ${vars.spacing.lg}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  ...textMetrics.bodySm,
  fontWeight: 500,

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
  padding: vars.spacing.base,
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
  ...textMetrics.bodySm,
  fontWeight: 700,
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
  gap: vars.spacing.xl,
});

export const participantHeading = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: vars.spacing.base,
});

export const participantValue = style({
  color: vars.color.secondary,
  ...textMetrics.metadata,
  fontWeight: 500,
});

export const sliderBody = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  paddingInline: vars.spacing.md,
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
  ...textMetrics.metadata,
});

export const selectTrigger = style({
  ...controlFrame,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.base}`,
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
  gap: vars.spacing.xs,
});

export const selectItem = style({
  display: "flex",
  minHeight: "4rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  borderRadius: vars.radius.control,
  color: vars.color.primary,
  ...textMetrics.bodySm,

  cursor: "pointer",
  selectors: {
    "&[data-highlighted]": { backgroundColor: vars.color.fillSecondary },
  },
});

export const selectIndicator = style({
  display: "inline-flex",
  width: vars.size.iconSm,
  height: vars.size.iconSm,
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
  ...textMetrics.metadata,
  fontWeight: 500,

  "@media": {
    [media.md]: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 208fr) minmax(0, 148fr) minmax(0, 148fr)",
      gap: vars.spacing.md,
    },
  },
});

export const limitNotice = style({
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.fillTertiary,
  color: vars.color.secondary,
  ...textMetrics.bodySm,
});

export const warningNotice = style({
  color: vars.color.secondary,
  ...textMetrics.bodySm,
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
      gap: vars.spacing.md,
    },
  },
});

export const scheduleField = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const scheduleFieldLabel = style([
  textStyle.fieldLabel,
  {
    color: vars.color.primary,
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
  },
]);

export const scheduleControl = style({
  minHeight: vars.size.controlMd,
});

export const nativeInput = style({
  ...controlFrame,
  minHeight: vars.size.controlMd,
  padding: `${vars.spacing.sm} ${vars.spacing.base}`,
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
  minHeight: vars.size.controlMd,
  padding: `${vars.spacing.sm} ${vars.spacing.base}`,
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
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  outline: 0,
  ...textMetrics.body,
  fontWeight: 400,

  resize: "vertical",
  selectors: {
    "&:focus-visible": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
    "&[data-invalid]": { borderColor: vars.color.red },
  },
});

export const resumeShareRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  padding: `${vars.spacing.base} ${vars.spacing.lg}`,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.cta,
  backgroundColor: "transparent",
});

export const resumeShareCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const resumeShareTitle = style({
  color: vars.color.primary,
  ...textMetrics.cardTitle,
  fontWeight: 500,
});

export const resumeShareDescription = style({
  color: vars.color.tertiary,
  ...textMetrics.bodySm,
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

export const pendingCard = style({
  minHeight: "28rem",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
});

export const pendingLabel = style({
  color: vars.color.primary,
  ...textMetrics.cardTitle,
  fontWeight: 600,
});

export const pendingDescription = style({
  color: vars.color.tertiary,
  ...textMetrics.bodySm,
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
  padding: `${vars.spacing.base} ${vars.spacing.lg}`,
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  "@media": {
    [media.md]: {
      gridTemplateColumns: "12rem minmax(0, 1fr) auto",
      gap: vars.spacing.lg,
      paddingInline: vars.spacing.xl,
    },
  },
});

export const reviewLabel = style({
  color: vars.color.tertiary,
  ...textMetrics.bodySm,

  "@media": {
    [media.md]: { gridColumn: "1" },
  },
});

export const reviewValue = style({
  minWidth: 0,
  gridColumn: "1 / -1",
  color: vars.color.primary,
  ...textMetrics.body,
  fontWeight: 500,

  overflowWrap: "anywhere",
  "@media": {
    [media.md]: { gridColumn: "2" },
  },
});

export const reviewEdit = style({
  gridColumn: "2",
  gridRow: "1",
  padding: vars.spacing.xs,
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  ...textMetrics.metadata,

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
  padding: `${vars.spacing.lg} ${vars.spacing.lg}`,
  backgroundColor: vars.color.blue10,
  "@media": {
    [media.md]: { paddingInline: vars.spacing.xl },
  },
});

export const reviewSummaryLabel = style({
  color: vars.color.blue,
  fontFamily: vars.font.mono,
  ...textMetrics.bodySm,

  letterSpacing: "0.08em",
});

export const reviewSummaryText = style([
  textStyle.p2Body,
  {
    color: vars.color.primary,
  },
]);

export const submitError = style({
  color: vars.color.red,
  ...textMetrics.body,
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
