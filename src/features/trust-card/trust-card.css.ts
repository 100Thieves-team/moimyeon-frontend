import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const trigger = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.md,
  padding: 0,
  border: "none",
  background: "none",
  textAlign: "left",
  cursor: "pointer",
  borderRadius: vars.radius.control,
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const popup = style({
  width: "30rem",
  padding: vars.spacing.lg,
  borderRadius: vars.radius.media,
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});

export const loading = style({
  fontSize: "1.3rem",
  color: vars.color.tertiary,
});

export const queryState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  fontSize: "1.3rem",
  color: vars.color.secondary,
});

export const card = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const identity = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
});

export const avatar = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "4.4rem",
  height: "4.4rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  fontSize: "1.6rem",
  fontWeight: 500,
  color: vars.color.secondary,
});

export const identityCopy = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  minWidth: "0.1rem",
});

export const nickname = style({
  fontSize: "1.55rem",
  fontWeight: 600,
  color: vars.color.primary,
});

export const jobTitle = style({
  fontSize: "1.25rem",
  color: vars.color.tertiary,
});

export const stats = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.7rem",
  paddingTop: vars.spacing.sm,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const statRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
});

export const statIcon = style({
  color: vars.color.blue,
});

export const statLabel = style({
  fontSize: "1.25rem",
  color: vars.color.tertiary,
});

export const statValue = style({
  fontSize: "1.3rem",
  fontWeight: 500,
  color: vars.color.primary,
});

export const tags = style({
  listStyle: "none",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.6rem",
});

export const tag = style({
  display: "inline-flex",
  alignItems: "baseline",
  gap: "0.5rem",
  padding: "0.4rem 1rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillTertiary,
  fontSize: "1.2rem",
  fontWeight: 500,
  color: vars.color.secondary,
});

export const tagCount = style({
  fontSize: "1.1rem",
  color: vars.color.tertiary,
});

export const empty = style({
  fontSize: "1.3rem",
  color: vars.color.tertiary,
});
