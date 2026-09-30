import { textMetrics } from "@/styles/typography.css";
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { media } from "@/styles/tokens";

const mobile = "screen and (max-width: 599px)";
const surface = vars.color.trueWhite;

export const page = style({
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
  width: "100%",
});
export const column = style({
  maxWidth: vars.layout.maxWidth,
  width: "100%",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
});
export const tabs = style({
  position: "relative",
  display: "flex",
  gap: vars.spacing["2xl"],
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const tab = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.xs,
  padding: `${vars.spacing.md} 0.2rem`,
  background: "transparent",
  border: 0,
  borderBottom: "2px solid transparent",
  color: vars.color.tertiary,
  ...textMetrics.bodySm,

  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&[data-active]": {
      color: vars.color.primary,
      fontWeight: 700,
    },
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
});
export const tabIndicator = style({
  position: "absolute",
  left: 0,
  bottom: 0,
  // 1px 선을 늘려 위치와 너비를 모두 transform으로 전환한다.
  width: "1px",
  height: "2px",
  backgroundColor: vars.color.primary,
  transformOrigin: "left center",
  pointerEvents: "none",
  transition: `transform ${vars.motion.duration.base} ${vars.motion.ease.underline}`,
  selectors: {
    [`${tab}:focus-visible ~ &`]: { transition: "none" },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});
export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.base,
  listStyle: "none",
  margin: 0,
  padding: 0,
});
export const card = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.base,
  padding: vars.layout.cardPadding,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: "2rem",
  backgroundColor: surface,
  "@media": { [mobile]: { flexDirection: "column", alignItems: "stretch" } },
});
export const info = style({
  flex: "1 1 28rem",
  minWidth: 0,
  "@media": { [mobile]: { flexBasis: "auto" } },
});
export const title = style({
  ...textMetrics.cardTitle,
  fontWeight: 500,

  letterSpacing: "-0.01em",
  color: vars.color.primary,
  overflowWrap: "anywhere",
});
export const meta = style({
  marginTop: "0.3rem",
  ...textMetrics.metadata,

  color: vars.color.tertiary,
  overflowWrap: "anywhere",
});
export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
  alignItems: "center",
});
const chip = style({
  borderRadius: vars.radius.pill,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  ...textMetrics.metadata,
  fontWeight: 500,

  whiteSpace: "nowrap",
});
export const pendingChip = style([
  chip,
  {
    backgroundColor: vars.color.yellow10,
    color: vars.color.brown,
  },
]);
export const upcomingChip = style([
  chip,
  {
    backgroundColor: vars.color.blue10,
    color: vars.color.blue,
  },
]);
export const completedChip = style([
  chip,
  { backgroundColor: vars.color.fillSecondary, color: vars.color.secondary },
]);
export const empty = style({
  maxWidth: "88rem",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.spacing.base,
  padding: `6.4rem ${vars.spacing.lg}`,
  textAlign: "center",
  color: vars.color.secondary,
  ...textMetrics.bodySm,
});
export const error = style({
  flexBasis: "100%",
  color: vars.color.red,
  ...textMetrics.body,
});
