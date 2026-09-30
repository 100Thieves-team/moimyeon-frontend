import { style } from "@vanilla-extract/css";
import { media, vars, textStyle, textMetrics } from "@/styles";

export const page = style({
  display: "flex",
  width: "100%",
  minHeight: `calc(100dvh - ${vars.size.header})`,
  flex: "1 1 auto",
  justifyContent: "center",
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
  backgroundColor: vars.color.background,
});

export const content = style({
  display: "flex",
  width: "100%",
  maxWidth: vars.layout.formMaxWidth,
  minWidth: 0,
  flexDirection: "column",
  alignItems: "stretch",
  gap: vars.layout.sectionGap,
});

export const heading = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const title = style({
  color: vars.color.primary,
  ...textMetrics.pageTitle,
  fontWeight: 300,

  letterSpacing: "-0.02em",
  textWrap: "balance",
});

export const roomSummary = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.base,
  padding: `${vars.spacing.base} ${vars.spacing.lg}`,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
});

export const roomCopy = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const roomTitle = style({
  overflow: "hidden",
  color: vars.color.primary,
  ...textMetrics.cardTitle,
  fontWeight: 500,

  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const roomMeta = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  ...textMetrics.metadata,

  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const detailLink = style({
  flex: "0 0 auto",
  paddingBlock: vars.spacing.sm,
  color: vars.color.tertiary,
  ...textMetrics.bodySm,

  textDecoration: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { color: vars.color.primary } } },
  },
});

export const formCard = style({
  display: "flex",
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

export const note = style({
  width: "100%",
  minHeight: "7.2rem",
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  ...textMetrics.body,
  fontWeight: 400,

  resize: "vertical",
  transition: `border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, box-shadow ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&::placeholder": { color: vars.color.tertiary, opacity: 1 },
    "&:focus-visible": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
    "&[data-invalid]": { borderColor: vars.color.red },
  },
  "@media": { [media.reducedMotion]: { transition: "none" } },
});

export const fieldError = style({
  color: vars.color.red,
  ...textMetrics.body,
});

export const rootError = style({
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.red10,
  color: vars.color.red,
  ...textMetrics.body,
});

export const submitButton = style({ width: "100%", minHeight: vars.size.controlMd });
