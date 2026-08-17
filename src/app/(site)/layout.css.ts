import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const site = style({
  display: "flex",
  minHeight: "100dvh",
  flex: "1 1 auto",
  flexDirection: "column",
  backgroundColor: vars.color.background,
  color: vars.color.primary,
});
