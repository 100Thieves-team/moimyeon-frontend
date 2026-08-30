import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const mobile = "screen and (max-width: 799px)";

const focusRing = {
  outline: `2px solid ${vars.color.primary}`,
  outlineOffset: "2px",
} as const;

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
  "@media": { [media.reducedMotion]: { transition: "none" } },
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
  transition: `opacity ${vars.motion.duration.base} ${vars.motion.ease.out}, transform ${vars.motion.duration.base} ${vars.motion.ease.out}`,
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
  gridTemplateColumns: "4.4rem minmax(0, 1fr)",
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
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  placeItems: "center",
  selectors: {
    "&:active": { backgroundColor: vars.color.fillSecondary },
    "&:focus-visible": focusRing,
  },
  "@media": {
    [media.hover]: {
      selectors: { "&:hover": { backgroundColor: vars.color.fillTertiary } },
    },
  },
});

export const title = style({
  fontSize: "2.4rem",
  fontWeight: 700,
  lineHeight: "3.2rem",
  "@media": { [mobile]: { fontSize: "2rem", lineHeight: "2.8rem" } },
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

export const sidoList = style({
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

export const sidoTab = style({
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
    "&:focus-visible": focusRing,
  },
  "@media": {
    [mobile]: {
      width: "auto",
      minHeight: "4.2rem",
      padding: "1rem 1.2rem",
      whiteSpace: "nowrap",
    },
    [media.hover]: {
      selectors: { "&:hover:not([data-active])": { backgroundColor: vars.color.fillTertiary } },
    },
  },
});

export const selectedCount = style({
  minWidth: "2rem",
  color: vars.color.primary,
  fontVariantNumeric: "tabular-nums",
  textAlign: "right",
});

export const sigunguSection = style({ minWidth: 0, minHeight: 0, overflowY: "auto" });

export const sigunguPanel = style({
  minHeight: "100%",
  padding: "3.2rem",
  "@media": { [mobile]: { padding: "2.4rem 1.6rem" } },
});

export const sidoTitle = style({
  marginBottom: vars.spacing.xl,
  fontSize: "2rem",
  fontWeight: 700,
  lineHeight: "2.8rem",
});

export const sigunguList = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  gap: vars.spacing.md,
});

export const sigunguToggle = style({
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
    "&:focus-visible": focusRing,
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

export const selectedRegion = style({ minWidth: 0, minHeight: "3.2rem" });

export const regionPill = style({
  display: "inline-flex",
  minHeight: "3.2rem",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.6rem 0.8rem 0.6rem 1.2rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.primary,
  fontSize: "1.3rem",
  fontWeight: 600,
});

export const removeRegionButton = style({
  display: "grid",
  width: "2rem",
  height: "2rem",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  placeItems: "center",
  selectors: { "&:focus-visible": focusRing },
});

export const footerActions = style({
  display: "grid",
  gridTemplateColumns: "auto minmax(16rem, 24rem)",
  gap: vars.spacing.md,
  "@media": {
    [mobile]: { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr)" },
  },
});
