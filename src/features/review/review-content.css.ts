import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const page = style({
  display: "flex",
  justifyContent: "center",
  padding: `${vars.spacing.xl} ${vars.spacing.lg}`,
});

export const column = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  width: "100%",
  maxWidth: "68rem",
});

export const title = style({
  fontSize: "3rem",
  fontWeight: 300,
  lineHeight: 1.2,
  color: vars.color.primary,
});

export const sessionCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.md,
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  borderRadius: vars.radius.media,
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.white,
});

export const sessionTitle = style({
  fontSize: "1.45rem",
  fontWeight: 500,
  color: vars.color.primary,
});

export const sessionProgress = style({
  fontSize: "1.25rem",
  fontWeight: 500,
  color: vars.color.secondary,
});

export const targetList = style({
  display: "flex",
  flexDirection: "column",
  padding: `0 ${vars.spacing.lg}`,
  borderRadius: vars.radius.media,
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.white,
});

export const targetRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.md,
  padding: `${vars.spacing.md} 0`,
  selectors: {
    "&:not(:first-child)": {
      borderTop: `1px solid ${vars.color.strokeLight}`,
    },
  },
});

export const targetNickname = style({
  fontSize: "1.45rem",
  fontWeight: 500,
  color: vars.color.primary,
});

export const targetStatus = style({
  fontSize: "1.25rem",
  color: vars.color.tertiary,
});
