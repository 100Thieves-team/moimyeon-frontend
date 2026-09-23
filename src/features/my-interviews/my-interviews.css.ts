import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { media } from "@/styles/tokens";

const mobile = "screen and (max-width: 599px)";
const surface = `light-dark(${vars.color.trueWhite}, ${vars.color.background})`;

export const page = style({
  padding: "3.6rem 3.2rem 7.2rem",
  width: "100%",
  "@media": { [mobile]: { padding: "2.4rem 1.6rem 4.8rem" } },
});
export const column = style({
  maxWidth: "88rem",
  width: "100%",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});
export const tabs = style({
  position: "relative",
  display: "flex",
  gap: "2.8rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const tab = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "1.2rem 0.2rem",
  background: "transparent",
  border: 0,
  borderBottom: "2px solid transparent",
  color: vars.color.tertiary,
  fontSize: "1.45rem",
  lineHeight: "1.8rem",
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
  gap: "1.2rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
});
export const card = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "1.6rem",
  padding: "2.2rem 2.4rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: "2rem",
  backgroundColor: surface,
  "@media": { [mobile]: { flexDirection: "column", alignItems: "stretch", padding: "2rem" } },
});
export const info = style({
  flex: "1 1 28rem",
  minWidth: 0,
  "@media": { [mobile]: { flexBasis: "auto" } },
});
export const title = style({
  fontSize: "1.65rem",
  fontWeight: 500,
  lineHeight: "2.2rem",
  letterSpacing: "-0.01em",
  color: vars.color.primary,
  overflowWrap: "anywhere",
});
export const meta = style({
  marginTop: "0.3rem",
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
  color: vars.color.tertiary,
  overflowWrap: "anywhere",
});
export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.9rem",
  alignItems: "center",
});
const chip = style({
  borderRadius: vars.radius.pill,
  padding: "0.6rem 1.3rem",
  fontSize: "1.25rem",
  fontWeight: 500,
  lineHeight: "1.7rem",
  whiteSpace: "nowrap",
});
export const pendingChip = style([
  chip,
  {
    backgroundColor: vars.color.yellow10,
    color: `light-dark(${vars.color.brown}, ${vars.color.yellow})`,
  },
]);
export const upcomingChip = style([
  chip,
  {
    backgroundColor: vars.color.blue10,
    color: `light-dark(${vars.color.blue}, ${vars.color.primary})`,
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
  gap: "1.6rem",
  padding: "6.4rem 2rem",
  textAlign: "center",
  color: vars.color.secondary,
  fontSize: "1.4rem",
});
export const error = style({
  flexBasis: "100%",
  color: vars.color.red,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});
