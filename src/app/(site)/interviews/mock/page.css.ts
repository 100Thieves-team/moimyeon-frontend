import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const page = style({
  width: "100%",
  maxWidth: vars.layout.maxWidth,
  marginInline: "auto",
  paddingInline: vars.layout.sidePadding,
  paddingBlock: vars.spacing.section,
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  maxWidth: "72rem",
  marginBottom: vars.spacing.section,
});

export const eyebrow = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1.2rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

export const title = style({
  color: vars.color.primary,
  fontSize: "3.2rem",
  fontWeight: 700,
  lineHeight: 1.25,
});

export const description = style({
  color: vars.color.secondary,
  fontSize: "1.6rem",
  lineHeight: 1.65,
});

export const sections = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xl,
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const sectionTitle = style({
  color: vars.color.primary,
  fontSize: "2rem",
  fontWeight: 700,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 28rem), 1fr))",
  gap: vars.spacing.md,
  listStyle: "none",
});

export const card = style({
  display: "flex",
  minHeight: "18rem",
  height: "100%",
  flexDirection: "column",
  gap: vars.spacing.sm,
  padding: vars.spacing.lg,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.trueWhite,
  color: "inherit",
  textDecoration: "none",
  transition: `border-color ${vars.motion.duration.fast} ${vars.motion.ease.site}`,
  ":hover": {
    borderColor: vars.color.strokeMedium,
  },
  ":focus-visible": {
    outline: `2px solid ${vars.color.primary}`,
    outlineOffset: "3px",
  },
});

export const cardTitle = style({
  color: vars.color.primary,
  fontSize: "1.7rem",
  lineHeight: 1.45,
});

export const cardDescription = style({
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: 1.6,
});

export const cardAction = style({
  marginTop: "auto",
  color: vars.color.primary,
  fontSize: "1.4rem",
  fontWeight: 600,
});
