import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";
const surface = {
  backgroundColor: vars.color.trueWhite,
  "@media": { [media.dark]: { backgroundColor: vars.color.background } },
};

export const backdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 50,
  backgroundColor: vars.color.black50,
});
export const popup = style({
  ...surface,
  position: "fixed",
  zIndex: 51,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(46rem, calc(100vw - 3.2rem))",
  maxHeight: "calc(100dvh - 3.2rem)",
  overflowY: "auto",
  borderRadius: vars.radius.media,
  boxShadow: vars.shadow.cardSoft,
  color: vars.color.primary,
});
export const body = style({
  padding: "2.8rem 2.8rem 0",
  paddingRight: "6.4rem",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});
export const title = style({ fontSize: "2.2rem", fontWeight: 600, lineHeight: "3rem" });
export const description = style({
  fontSize: "1.6rem",
  lineHeight: "2.4rem",
  color: vars.color.secondary,
});
export const error = style({ fontSize: "1.4rem", lineHeight: "2rem", color: vars.color.red });
export const footer = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  padding: "1.6rem 2.8rem 1.4rem",
});
