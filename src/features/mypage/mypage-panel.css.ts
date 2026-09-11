import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const title = style({
  color: vars.color.primary,
  fontSize: "1.7rem",
  fontWeight: 500,
  lineHeight: "2.2rem",
  letterSpacing: "-0.01em",
});

export const footer = style({
  display: "flex",
  minHeight: "6.9rem",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  paddingTop: vars.spacing.lg,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const action = style({
  minWidth: "10.4rem",
  marginLeft: "auto",
});
