import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

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
  padding: "2.6rem",
  borderRadius: vars.radius.media,
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.trueWhite,
  "@media": { [media.dark]: { backgroundColor: vars.color.background } },
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

export const arrow = style({
  position: "absolute",
  width: "1.4rem",
  height: "1.4rem",
  backgroundColor: vars.color.trueWhite,
  "@media": { [media.dark]: { backgroundColor: vars.color.background } },
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
  gap: "1.4rem",
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
  "@media": { [media.dark]: { color: vars.color.yellow } },
  fontSize: "1.7rem",
  fontWeight: 500,
  lineHeight: "1.7rem",
});

export const identityCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.2rem",
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
  fontSize: "1.5rem",
  fontWeight: 500,
  lineHeight: 1.4,
  overflowWrap: "anywhere",
});

export const hostBadge = style({
  flex: "0 0 auto",
  padding: "0.3rem 0.9rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  "@media": { [media.dark]: { color: vars.color.yellow } },
  fontSize: "1.1rem",
  fontWeight: 700,
  lineHeight: "1.5rem",
});

export const jobRoles = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: 1.4,
  overflowWrap: "anywhere",
});

export const trustSummary = style({
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
});

export const bio = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  padding: "1.2rem 1.4rem",
  borderRadius: "1.2rem",
  backgroundColor: vars.color.blue10,
  color: vars.color.primary,
  fontSize: "1.4rem",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
});

export const bioLabel = style({
  color: vars.color.blue,
  fontFamily: vars.font.mono,
  fontSize: "1.05rem",
  lineHeight: "1.4rem",
  letterSpacing: "0.1em",
});

export const tagsBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.7rem",
});

export const tagsLabel = style({
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: 1.4,
});

export const tags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.6rem",
  listStyle: "none",
});

export const tag = style({
  display: "inline-flex",
  alignItems: "baseline",
  gap: "0.5rem",
  padding: "0.5rem 1rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.3rem",
  fontWeight: 500,
  lineHeight: 1.4,
});

export const tagCount = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1rem",
});

export const avatar = style([
  hostAvatar,
  {
    backgroundColor: vars.color.fillSecondary,
    color: vars.color.secondary,
    "@media": { [media.dark]: { color: vars.color.secondary } },
  },
]);
