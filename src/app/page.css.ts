import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const page = style({
  minHeight: "100dvh",
  backgroundColor: vars.color.background,
  color: vars.color.primary,
});
