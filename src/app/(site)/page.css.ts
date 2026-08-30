import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const page = style({
  width: "100%",
  flex: "1 1 auto",
});

export const loading = style({
  padding: "8rem 3.2rem",
  color: vars.color.secondary,
  fontSize: "1.6rem",
  textAlign: "center",
});
