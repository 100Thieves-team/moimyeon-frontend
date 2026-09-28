import { style } from "@vanilla-extract/css";
import { media, vars, textMetrics } from "@/styles";
import { hostBadge as baseHostBadge } from "./interview-room.css";

const commentText = style({
  fontFamily: vars.font.sans,
  ...textMetrics.body,
  fontWeight: 400,
});

export const panel = style({ width: "100%", maxWidth: "89.6rem", minWidth: 0 });
export const composer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.base,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.floating,
  padding: vars.spacing.sm,
  backgroundColor: vars.color.trueWhite,
  "@media": { [media.dark]: { backgroundColor: vars.color.background } },
});
export const field = style({ display: "flex", flexDirection: "column", gap: vars.spacing.sm });
export const label = style({
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clipPath: "inset(50%)",
});
export const textarea = style([
  commentText,
  {
    width: "100%",
    minHeight: "2.2rem",
    resize: "vertical",
    border: 0,
    borderRadius: vars.radius.control,
    padding: vars.spacing.sm,
    outlineOffset: 0,
    background: "transparent",
    color: vars.color.primary,
    selectors: { "&::placeholder": { color: vars.color.tertiary } },
  },
]);
export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.spacing.md,
  flexWrap: "wrap",
});
export const list = style({ listStyle: "none", margin: `${vars.spacing.sm} 0 0`, padding: 0 });
export const row = style({
  display: "flex",
  gap: vars.spacing.base,
  padding: `${vars.spacing.lg} ${vars.spacing.xs}`,
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const avatar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "3.6rem",
  height: "3.6rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.4rem",
  selectors: {
    '&[data-kind="host"]': { backgroundColor: vars.color.yellow10, color: vars.color.brown },
    '&[data-kind="mine"]': { backgroundColor: vars.color.blue10, color: vars.color.blue },
  },
  "@media": {
    [media.dark]: { selectors: { '&[data-kind="host"]': { color: vars.color.yellow } } },
  },
});
export const hostBadge = style([
  baseHostBadge,
  {
    backgroundColor: vars.color.yellow10,
    color: vars.color.brown,
    "@media": { [media.dark]: { color: vars.color.yellow } },
  },
]);
export const body = style({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
});
export const head = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  flexWrap: "wrap",
});
export const nickname = style({ ...textMetrics.bodySm, fontWeight: 500, overflowWrap: "anywhere" });
export const date = style({ color: vars.color.tertiary, ...textMetrics.metadata });
export const content = style([
  commentText,
  {
    color: vars.color.primary,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },
]);
export const deleted = style([
  commentText,
  {
    color: vars.color.tertiary,
  },
]);
export const deleteButton = style({
  marginInlineStart: "auto",
  ...textMetrics.metadata,
  minHeight: vars.size.controlSm,
  padding: `0 ${vars.spacing.sm}`,
});
export const notice = style({
  border: `1px dashed ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.floating,
  padding: vars.spacing.base,
  textAlign: "center",
  color: vars.color.secondary,
  ...textMetrics.bodySm,
});
export const preview = style({
  marginBottom: vars.spacing.base,
  padding: `${vars.spacing.sm} ${vars.spacing.base}`,
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  ...textMetrics.metadata,
});
export const error = style({
  color: vars.color.red,
  ...textMetrics.bodySm,

  marginBlock: vars.spacing.sm,
});
export const status = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.spacing.md,
  padding: `${vars.spacing.xl} 0`,
  ...textMetrics.bodySm,
  color: vars.color.secondary,
});
