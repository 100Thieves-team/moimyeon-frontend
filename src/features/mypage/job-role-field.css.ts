import { style } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";
import * as pillFieldStyles from "./profile-pill-field.css";

const mobile = "screen and (max-width: 799px)";

export const fieldFrame = style([
  pillFieldStyles.frame,
  {
    position: "relative",
  },
]);

export const fieldTrigger = style({
  position: "absolute",
  zIndex: 0,
  inset: 0,
  width: "100%",
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
  },
});

export const fieldContent = style([
  pillFieldStyles.pills,
  {
    position: "relative",
    zIndex: 1,
    minHeight: "4.4rem",
    padding: "0.7rem 3.6rem 0.7rem 1.2rem",
    pointerEvents: "none",
  },
]);

export const fieldPill = style([
  pillFieldStyles.pill,
  {
    pointerEvents: "none",
  },
]);

export const footerPill = style([
  pillFieldStyles.pill,
  {
    minHeight: "3.2rem",
    flex: "0 0 auto",
  },
]);

export const pillRemove = style([pillFieldStyles.pillRemove, { pointerEvents: "auto" }]);

export const fieldChevron = style({
  position: "absolute",
  top: "50%",
  right: "1.4rem",
  color: vars.color.tertiary,
  transform: "translateY(-50%)",
});

export const backdrop = style({
  position: "fixed",
  zIndex: 100,
  inset: 0,
  minHeight: "100dvh",
  backgroundColor: vars.color.black50,
  opacity: 1,
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-starting-style]": { opacity: 0 },
    "&[data-ending-style]": { opacity: 0 },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const popup = style({
  position: "fixed",
  zIndex: 101,
  top: "50%",
  left: "50%",
  display: "grid",
  width: "min(88rem, calc(100vw - 4.8rem))",
  height: "min(64rem, calc(100dvh - 4.8rem))",
  gridTemplateRows: "auto minmax(0, 1fr) auto",
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  boxShadow: vars.shadow.cardSoft,
  opacity: 1,
  transform: "translate(-50%, -50%)",
  transition: `opacity ${vars.motion.duration.base} ${vars.motion.ease.site}, transform ${vars.motion.duration.base} ${vars.motion.ease.site}`,
  selectors: {
    "&[data-starting-style]": {
      opacity: 0,
      transform: "translate(-50%, -50%) scale(0.98)",
    },
    "&[data-ending-style]": {
      opacity: 0,
      transform: "translate(-50%, -50%) scale(0.98)",
    },
  },
  "@media": {
    [mobile]: {
      top: 0,
      left: 0,
      width: "100vw",
      height: "100dvh",
      border: 0,
      borderRadius: 0,
      transform: "none",
      selectors: {
        "&[data-starting-style]": { transform: "translateY(1.2rem)" },
        "&[data-ending-style]": { transform: "translateY(1.2rem)" },
      },
    },
    [media.reducedMotion]: { transition: "none" },
  },
});

export const header = style({
  display: "grid",
  minHeight: "8rem",
  gridTemplateColumns: "4.4rem minmax(0, 1fr) auto",
  alignItems: "center",
  gap: vars.spacing.base,
  padding: "1.6rem 2.4rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  "@media": {
    [mobile]: {
      minHeight: "6.8rem",
      gridTemplateColumns: "4rem minmax(0, 1fr)",
      padding: "1.2rem 1.6rem",
    },
  },
});

export const backButton = style({
  display: "grid",
  width: "4.4rem",
  height: "4.4rem",
  padding: 0,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillTertiary,
  color: vars.color.primary,
  cursor: "pointer",
  placeItems: "center",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
  },
});

export const title = style({
  fontSize: "2.4rem",
  fontWeight: 700,
  lineHeight: "3.2rem",
  "@media": {
    [mobile]: { fontSize: "2rem", lineHeight: "2.8rem" },
  },
});

export const dialogBody = style({
  display: "grid",
  minHeight: 0,
  gridTemplateColumns: "28rem minmax(0, 1fr)",
  "@media": {
    [mobile]: {
      gridTemplateRows: "auto minmax(0, 1fr)",
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
});

export const groupList = style({
  display: "flex",
  minHeight: 0,
  flexDirection: "column",
  gap: "0.4rem",
  padding: vars.spacing.base,
  overflowY: "auto",
  borderRight: `1px solid ${vars.color.strokeLight}`,
  "@media": {
    [mobile]: {
      flexDirection: "row",
      padding: "1.2rem 1.6rem",
      overflowX: "auto",
      overflowY: "hidden",
      borderRight: 0,
      borderBottom: `1px solid ${vars.color.strokeLight}`,
    },
  },
});

export const groupTab = style({
  display: "flex",
  width: "100%",
  minHeight: "4.8rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: "1.2rem 1.6rem",
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.5rem",
  fontWeight: 500,
  lineHeight: "2rem",
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    "&[data-active]": {
      backgroundColor: vars.color.fillSecondary,
      color: vars.color.primary,
      fontWeight: 700,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    [mobile]: {
      width: "auto",
      minHeight: "4.2rem",
      padding: "1rem 1.2rem",
      whiteSpace: "nowrap",
    },
    [media.hover]: {
      selectors: {
        "&:hover:not([data-active])": { backgroundColor: vars.color.fillTertiary },
      },
    },
  },
});

export const groupCount = style({
  minWidth: "2rem",
  color: vars.color.primary,
  fontVariantNumeric: "tabular-nums",
  textAlign: "right",
});

export const roleSection = style({
  minWidth: 0,
  minHeight: 0,
  overflowY: "auto",
});

export const rolePanel = style({
  minHeight: "100%",
  padding: "3.2rem",
  "@media": {
    [mobile]: { padding: "2.4rem 1.6rem" },
  },
});

export const groupTitle = style({
  marginBottom: vars.spacing.xl,
  fontSize: "2rem",
  fontWeight: 700,
  lineHeight: "2.8rem",
});

export const roleList = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  gap: vars.spacing.md,
});

export const roleToggle = style({
  minHeight: "4.2rem",
  padding: "1rem 1.4rem",
  border: "1px solid transparent",
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.fillTertiary,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  fontWeight: 500,
  lineHeight: "2rem",
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, color ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-pressed]": {
      borderColor: vars.color.primary,
      backgroundColor: vars.color.primary10,
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
        "&:hover:not([data-pressed])": { backgroundColor: vars.color.fillSecondary },
      },
    },
    [media.reducedMotion]: { transition: "none" },
  },
});

export const emptyState = style({
  display: "grid",
  minHeight: "100%",
  color: vars.color.tertiary,
  fontSize: "1.5rem",
  lineHeight: "2rem",
  placeItems: "center",
});

export const footer = style({
  display: "grid",
  minHeight: "9.2rem",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  gap: vars.spacing.lg,
  padding: "1.6rem 2.4rem",
  borderTop: `1px solid ${vars.color.strokeLight}`,
  "@media": {
    [mobile]: {
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: vars.spacing.md,
      padding: "1.2rem 1.6rem 1.6rem",
    },
  },
});

export const selectedPills = style({
  display: "flex",
  minWidth: 0,
  maxHeight: "7.2rem",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.sm,
  overflowY: "auto",
  "@media": {
    [mobile]: {
      maxHeight: "4rem",
      flexWrap: "nowrap",
      overflowX: "auto",
      overflowY: "hidden",
    },
  },
});

export const footerActions = style({
  display: "grid",
  gridTemplateColumns: "auto minmax(16rem, 24rem)",
  gap: vars.spacing.md,
  "@media": {
    [mobile]: { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr)" },
  },
});
