import { style } from "@vanilla-extract/css";
import { media, vars, textStyle, textMetrics } from "@/styles";

export const resumeFileRow = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.base,
  padding: `${vars.spacing.base} ${vars.spacing.lg}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.background,
});

export const resumePdfBadge = style({
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

export const resumeFileInfo = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const resumeFileName = style([
  textStyle.p2,
  {
    fontWeight: 500,
    overflow: "hidden",
    color: vars.color.primary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
]);

export const resumeFileMeta = style([
  textStyle.metadata,
  {
    overflow: "hidden",
    color: vars.color.tertiary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
]);

export const resumeChangeButton = style({
  display: "inline-flex",
  minHeight: vars.size.controlSm,
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: vars.spacing.base,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  ...textMetrics.bodySm,
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { backgroundColor: vars.color.fillTertiary } } },
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
  ...textMetrics.bodySm,
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { backgroundColor: vars.color.fillTertiary } } },
  },
});

export const resumeSummary = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.lg} ${vars.spacing.lg}`,
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.blue10,
});

export const resumeSummaryLabel = style({
  color: vars.color.blue,
  fontFamily: vars.font.mono,
  ...textMetrics.bodySm,

  letterSpacing: "0.1em",
});

export const resumeSummaryText = style([
  textStyle.p2Body,
  {
    // 요약 생성 중에도 본문 영역을 확보하고, 긴 요약은 잘라내지 않는다.
    minHeight: "3lh",
    "@media": { "screen and (max-width: 599px)": { minHeight: "7lh" } },
    color: vars.color.primary,
  },
]);

export const resumeDialogBackdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 50,
  backgroundColor: "rgba(0,0,0,0.38)",
  opacity: 1,
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: { "&[data-starting-style], &[data-ending-style]": { opacity: 0 } },
  "@media": { [media.reducedMotion]: { transition: "none" } },
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
  "@media": { [media.reducedMotion]: { transition: "none" } },
});

export const resumeDialogHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  padding: `${vars.spacing.xl} ${vars.spacing.xl} 0`,
  paddingRight: "6.4rem",
});

export const resumeDialogTitle = style({
  color: vars.color.primary,
  ...textMetrics.sectionTitle,
  fontWeight: 500,

  letterSpacing: "-0.01em",
});

export const resumeDialogBody = style({
  display: "flex",
  minHeight: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
  overflowY: "auto",
  padding: `${vars.spacing.base} ${vars.spacing.xl} ${vars.spacing.lg}`,
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
  padding: `${vars.spacing.base} ${vars.spacing.base}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: "1.2rem",
  color: vars.color.primary,
  cursor: "pointer",
  selectors: {
    "&[data-checked]": { borderColor: vars.color.primary, borderWidth: "1.5px" },
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
  "@media": {
    [media.hover]: {
      selectors: { "&:hover:not([data-checked])": { backgroundColor: vars.color.fillTertiary } },
    },
  },
});

export const resumeOptionCopy = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const resumeOptionHeading = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const resumeOptionName = style([
  textStyle.p2,
  {
    fontWeight: 500,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
]);

export const resumeRecentBadge = style({
  flex: "0 0 auto",
  padding: `0.2rem ${vars.spacing.sm}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.lightGrey,
  color: vars.color.secondary,
  ...textMetrics.metadata,
  fontWeight: 500,
});

export const resumeOptionMeta = style([
  textStyle.metadata,
  {
    overflow: "hidden",
    color: vars.color.tertiary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
]);

export const resumeOptionCheck = style({
  flex: "0 0 auto",
  opacity: 0,
  selectors: { [`${resumeOption}[data-checked] &`]: { opacity: 1 } },
});

export const resumeDialogEmpty = style({
  padding: vars.spacing.lg,
  color: vars.color.tertiary,
  ...textMetrics.bodySm,

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

export const resumeUploadButton = style({ width: "100%", borderStyle: "dashed" });

export const resumeUploadError = style({
  color: vars.color.red,
  ...textMetrics.bodySm,
});

export const resumeDialogFooter = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.base} ${vars.spacing.xl}`,
});
