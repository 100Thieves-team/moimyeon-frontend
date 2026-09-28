import { style } from "@vanilla-extract/css";
import { vars, textMetrics } from "@/styles";

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
  width: "32rem",
  maxWidth: "calc(100vw - 3.2rem)",
  maxHeight: "var(--available-height)",
  overflowY: "auto",
  padding: vars.spacing.xl,
  borderRadius: vars.radius.media,
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.trueWhite,
  boxShadow: vars.shadow.cardRaise,
});

export const queryState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  ...textMetrics.metadata,
  color: vars.color.secondary,
});

export const arrow = style({
  position: "absolute",
  width: "1.4rem",
  height: "1.4rem",
  backgroundColor: vars.color.trueWhite,
  borderTop: `1px solid ${vars.color.strokeLight}`,
  borderLeft: `1px solid ${vars.color.strokeLight}`,
  transform: "rotate(45deg)",
  selectors: {
    '&[data-side="bottom"]': { top: "-0.7rem" },
    '&[data-side="top"]': { bottom: "-0.7rem", transform: "rotate(225deg)" },
  },
});

export const card = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const identity = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
});

export const hostAvatar = style({
  display: "flex",
  width: "4.4rem",
  height: "4.4rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontSize: "1.7rem",
  fontWeight: 500,
  lineHeight: "1.7rem",
});

export const identityCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const nameRow = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const nickname = style({
  overflow: "hidden",
  color: vars.color.primary,
  ...textMetrics.body,
  fontWeight: 500,

  overflowWrap: "anywhere",
});

export const hostBadge = style({
  flex: "0 0 auto",
  padding: `0.3rem ${vars.spacing.sm}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  ...textMetrics.metadata,
  fontWeight: 700,
});

export const jobRoles = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  ...textMetrics.bodySm,

  overflowWrap: "anywhere",
});

export const trustSummary = style({
  color: vars.color.secondary,
  ...textMetrics.bodySm,

  overflowWrap: "anywhere",
});

export const bio = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  borderRadius: "1.2rem",
  backgroundColor: vars.color.blue10,
  color: vars.color.primary,
  ...textMetrics.body,

  overflowWrap: "anywhere",
});

export const bioLabel = style({
  color: vars.color.blue,
  fontFamily: vars.font.mono,
  ...textMetrics.bodySm,

  letterSpacing: "0.1em",
});

export const tagsBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const tagsLabel = style({
  color: vars.color.tertiary,
  ...textMetrics.bodySm,
});

export const tags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
  listStyle: "none",
});

export const tag = style({
  display: "inline-flex",
  alignItems: "baseline",
  gap: vars.spacing.xs,
  padding: `${vars.spacing.xs} ${vars.spacing.md}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  ...textMetrics.metadata,
  fontWeight: 500,
});

export const tagCount = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  ...textMetrics.metadata,
});

export const avatar = style([
  hostAvatar,
  {
    backgroundColor: vars.color.fillSecondary,
    color: vars.color.secondary,
  },
]);
