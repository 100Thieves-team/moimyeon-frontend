import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

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
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: "2.1rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const resumeFileMeta = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "1.9rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const resumeChangeButton = style({
  display: "inline-flex",
  minHeight: "3.6rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "1.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
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
  fontSize: "1.4rem",
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
  padding: "1.8rem 2rem",
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.blue10,
});

export const resumeSummaryLabel = style({
  color: vars.color.blue,
  fontFamily: vars.font.mono,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
  letterSpacing: "0.1em",
});

export const resumeSummaryText = style({
  color: vars.color.primary,
  fontSize: "1.6rem",
  lineHeight: "2.4rem",
});

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
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { backgroundColor: vars.color.fillTertiary } } },
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
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: "2.1rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const resumeRecentBadge = style({
  flex: "0 0 auto",
  padding: "0.2rem 0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.lightGrey,
  color: vars.color.secondary,
  fontSize: "1.2rem",
  fontWeight: 500,
  lineHeight: "1.6rem",
});

export const resumeOptionMeta = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "1.9rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const resumeOptionCheck = style({
  flex: "0 0 auto",
  opacity: 0,
  selectors: { [`${resumeOption}[data-checked] &`]: { opacity: 1 } },
});

export const resumeDialogEmpty = style({
  padding: "2rem",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "2rem",
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
