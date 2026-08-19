import { style, styleVariants } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";

const card = {
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
} as const;

export const content = style({
  width: "100%",
  padding: "3.2rem 1.6rem 6.4rem",
  "@media": {
    [media.sm]: {
      paddingInline: "3.2rem",
      paddingTop: "4.4rem",
    },
    [media.xl]: {
      paddingInline: "6.4rem",
    },
  },
});

export const columns = style({
  display: "grid",
  width: "100%",
  maxWidth: "131.2rem",
  marginInline: "auto",
  alignItems: "start",
  gap: vars.spacing.xl,
  "@media": {
    [media.lg]: {
      gridTemplateColumns: "34rem minmax(0, 1fr)",
    },
  },
});

export const leftColumn = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const trustCard = style({
  ...card,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  padding: "2.8rem",
});

export const identity = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.base,
});

export const profileAvatar = style({
  display: "flex",
  width: "6.4rem",
  height: "6.4rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontSize: "2.4rem",
  fontWeight: 500,
  lineHeight: "2.4rem",
});

export const identityCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const nickname = style({
  overflow: "hidden",
  color: vars.color.primary,
  fontSize: "2rem",
  fontWeight: 500,
  lineHeight: "2.5rem",
  letterSpacing: "-0.01em",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const jobTitle = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: "1.7rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const bio = style({
  color: vars.color.secondary,
  fontSize: "1.35rem",
  lineHeight: "2rem",
  overflowWrap: "anywhere",
});

export const divider = style({
  width: "100%",
  height: "1px",
  backgroundColor: vars.color.strokeLight,
});

export const stats = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const statRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
});

const statIcon = {
  display: "flex",
  width: "3.2rem",
  height: "3.2rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.pill,
} as const;

export const activityIcon = style({
  ...statIcon,
  backgroundColor: vars.color.blue10,
  color: vars.color.blue,
});

export const attendanceIcon = style({
  ...statIcon,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
});

export const statCopy = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
});

export const statLabel = style({
  color: vars.color.tertiary,
  fontSize: "1.15rem",
  lineHeight: "1.5rem",
});

export const statValue = style({
  color: vars.color.primary,
  fontSize: "1.4rem",
  fontWeight: 500,
  lineHeight: "1.9rem",
});

export const attendanceChecks = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.xs,
  listStyle: "none",
});

const attendanceCheckBase = {
  display: "flex",
  width: "1.6rem",
  height: "1.6rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0.4rem",
  fontSize: "0.9rem",
  fontWeight: 700,
  lineHeight: "0.9rem",
} as const;

export const attendanceCheck = styleVariants({
  ATTENDED: {
    ...attendanceCheckBase,
    backgroundColor: vars.color.fillPrimary,
    color: vars.color.background,
  },
  ABSENT: {
    ...attendanceCheckBase,
    border: `1.5px solid ${vars.color.strokeMedium}`,
  },
});

export const tags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
  listStyle: "none",
});

export const tag = style({
  display: "flex",
  alignItems: "baseline",
  gap: "0.6rem",
  padding: "0.6rem 1.2rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.25rem",
  fontWeight: 500,
  lineHeight: "1.6rem",
});

export const tagCount = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1.05rem",
  lineHeight: "1.4rem",
});

export const accountActions = style({
  display: "flex",
  minHeight: "1.7rem",
  alignItems: "flex-start",
  paddingInline: vars.spacing.sm,
});

export const logoutAction = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.xs,
});

export const logoutError = style({
  color: vars.color.red,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const editorColumn = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.base,
});

export const tabList = style({
  display: "flex",
  maxWidth: "100%",
  padding: "0.3rem",
  overflowX: "auto",
  borderRadius: "1.2rem",
  backgroundColor: vars.color.fillSecondary,
});

export const tab = style({
  minHeight: "3.9rem",
  padding: "1rem 2rem",
  border: 0,
  borderRadius: "0.9rem",
  backgroundColor: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  lineHeight: "1.9rem",
  whiteSpace: "nowrap",
  selectors: {
    "&[data-active]": {
      backgroundColor: vars.color.background,
      color: vars.color.primary,
      boxShadow: `0 1px 6px ${vars.color.strokeLight}`,
      fontWeight: 700,
      cursor: "default",
    },
    "&[data-disabled]": {
      color: vars.color.tertiary,
      cursor: "not-allowed",
      opacity: 1,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const editorCard = style({
  ...card,
  display: "flex",
  width: "100%",
  minWidth: 0,
  minHeight: "47.1rem",
  flexDirection: "column",
  gap: vars.spacing.xl,
  padding: vars.spacing["2xl"],
  "@media": {
    "screen and (max-width: 599px)": {
      padding: vars.spacing.lg,
    },
  },
});

export const editorTitle = style({
  color: vars.color.primary,
  fontSize: "1.7rem",
  fontWeight: 500,
  lineHeight: "2.2rem",
  letterSpacing: "-0.01em",
});

export const errorPage = style({
  display: "grid",
  minHeight: "calc(100dvh - 6.4rem)",
  padding: vars.spacing.xl,
  backgroundColor: vars.color.background,
  placeItems: "center",
});

export const errorCard = style({
  ...card,
  display: "flex",
  width: "min(100%, 42rem)",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.md,
  padding: vars.spacing["2xl"],
});

export const errorTitle = style({
  fontSize: "2rem",
  fontWeight: 500,
  lineHeight: "2.5rem",
});

export const errorDescription = style({
  color: vars.color.secondary,
  fontSize: "1.5rem",
  lineHeight: "2.2rem",
});

export const retryButtonLayout = style({
  marginTop: vars.spacing.sm,
});
