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
  gap: vars.spacing.md,
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  borderRadius: vars.radius.media,
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
});

export const sessionAvatar = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "3.8rem",
  height: "3.8rem",
  borderRadius: "1.1rem",
  backgroundColor: vars.color.blue10,
  fontSize: "1.3rem",
  fontWeight: 700,
  color: vars.color.blue,
});

export const sessionInfo = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  flex: "1 0 0",
  minWidth: "0.1rem",
});

export const sessionTitle = style({
  fontSize: "1.45rem",
  fontWeight: 500,
  color: vars.color.primary,
});

export const sessionDate = style({
  fontSize: "1.25rem",
  color: vars.color.tertiary,
});

export const sessionProgress = style({
  flexShrink: 0,
  fontSize: "1.25rem",
  fontWeight: 500,
  color: vars.color.secondary,
});

export const targetList = style({
  display: "flex",
  flexDirection: "column",
  padding: `0 ${vars.spacing.lg}`,
  borderRadius: "2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
});
