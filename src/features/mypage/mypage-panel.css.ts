import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const title = style({
  color: vars.color.primary,
  fontSize: "1.7rem",
  fontWeight: 500,
  lineHeight: "2.2rem",
  letterSpacing: "-0.01em",
});

export const panel = style({
  width: "100%",
  minWidth: 0,
});

export const card = style({
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.xl,
  padding: vars.spacing["2xl"],
  "@media": {
    "screen and (max-width: 599px)": {
      padding: vars.spacing.lg,
    },
  },
});

export const footer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: vars.spacing.sm,
  paddingTop: vars.spacing.lg,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const centeredFooter = style([footer, { alignItems: "center" }]);

export const action = style({
  minWidth: "10.4rem",
  marginLeft: "auto",
});
