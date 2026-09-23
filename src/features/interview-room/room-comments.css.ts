import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";
import { hostBadge as baseHostBadge } from "./interview-room.css";

export const panel = style({ width: "100%", maxWidth: "89.6rem", minWidth: 0 });
export const composer = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: "1.6rem",
  padding: "1.8rem 2rem",
  backgroundColor: vars.color.trueWhite,
  "@media": { [media.dark]: { backgroundColor: vars.color.background } },
});
export const field = style({ display: "flex", flexDirection: "column", gap: "1.4rem" });
export const label = style({
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clipPath: "inset(50%)",
});
export const textarea = style({
  width: "100%",
  minHeight: "2.2rem",
  resize: "vertical",
  border: 0,
  padding: 0,
  background: "transparent",
  color: vars.color.primary,
  fontFamily: "inherit",
  fontSize: "1.6rem",
  lineHeight: "2.2rem",
  selectors: { "&::placeholder": { color: vars.color.tertiary } },
});
export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "1.2rem",
  flexWrap: "wrap",
});
export const list = style({ listStyle: "none", margin: "0.8rem 0 0", padding: 0 });
export const row = style({
  display: "flex",
  gap: "1.4rem",
  padding: "2rem 0.4rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const avatar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "3.6rem",
  height: "3.6rem",
  borderRadius: "50%",
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
  gap: "0.5rem",
});
export const head = style({
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  flexWrap: "wrap",
});
export const nickname = style({ fontSize: "1.35rem", fontWeight: 500, overflowWrap: "anywhere" });
export const date = style({ color: vars.color.tertiary, fontSize: "1.15rem" });
export const content = style({
  color: vars.color.primary,
  fontSize: "1.45rem",
  lineHeight: "2.2rem",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
});
export const deleted = style({
  color: vars.color.tertiary,
  fontSize: "1.45rem",
  lineHeight: "2.2rem",
});
export const deleteButton = style({
  marginInlineStart: "auto",
  fontSize: "1.2rem",
  minHeight: "3rem",
  padding: "0 0.6rem",
});
export const notice = style({
  border: `1px dashed ${vars.color.strokeMedium}`,
  borderRadius: "1.6rem",
  padding: "1.6rem",
  textAlign: "center",
  color: vars.color.secondary,
  fontSize: "1.35rem",
  lineHeight: "2rem",
});
export const preview = style({
  marginBottom: "1.4rem",
  padding: "0.8rem 1.4rem",
  borderRadius: "1.4rem",
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.2rem",
  lineHeight: "1.8rem",
});
export const error = style({
  color: vars.color.red,
  fontSize: "1.3rem",
  lineHeight: "1.9rem",
  marginBlock: "0.8rem",
});
export const status = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.2rem",
  padding: "2.4rem 0",
  fontSize: "1.4rem",
  color: vars.color.secondary,
});
