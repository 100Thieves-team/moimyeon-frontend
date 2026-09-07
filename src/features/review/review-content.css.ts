import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

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
  minWidth: 0,
  alignItems: "center",
  gap: "1.4rem",
  padding: "1.4rem 1.8rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
});

export const sessionInfo = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: "0.2rem",
});

export const sessionTitle = style({
  overflow: "hidden",
  color: vars.color.primary,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: "2.1rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const sessionDate = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "1.9rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const detailLink = style({
  flex: "0 0 auto",
  paddingBlock: "0.8rem",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "1.9rem",
  textDecoration: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { color: vars.color.primary } } },
  },
});

export const targetList = style({
  display: "flex",
  flexDirection: "column",
  padding: `0 ${vars.spacing.lg}`,
  borderRadius: "2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
});

export const errorPage = style({
  display: "flex",
  justifyContent: "center",
  padding: `${vars.spacing.xl} ${vars.spacing.lg}`,
});

export const errorCard = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.md,
  width: "100%",
  maxWidth: "52rem",
  padding: vars.spacing.xl,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
});

export const errorTitle = style({
  fontSize: "2rem",
  fontWeight: 700,
  color: vars.color.primary,
});

export const errorDescription = style({
  fontSize: "1.4rem",
  lineHeight: 1.6,
  color: vars.color.secondary,
});

export const errorActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
  paddingTop: vars.spacing.sm,
});
