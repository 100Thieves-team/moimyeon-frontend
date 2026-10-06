import { textMetrics } from "@/styles/typography.css";
import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";

const card = {
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
} as const;

export const content = style({
  width: "100%",
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
});

// Avoid a body scroll container so the sidebar sticks to the viewport.
globalStyle(`body:has(${content})`, {
  overflowX: "clip",
});

export const columns = style({
  display: "grid",
  width: "100%",
  maxWidth: vars.layout.maxWidth,
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
  "@media": {
    [media.lg]: {
      position: "sticky",
      top: vars.spacing.xl,
    },
  },
});

export const trustCard = style({
  minHeight: "16.2rem",
  ...card,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  padding: vars.layout.cardPadding,
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
  borderRadius: "50%",
  aspectRatio: "1",
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
  ...textMetrics.cardTitle,
  fontWeight: 500,

  letterSpacing: "-0.01em",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const jobTitle = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  ...textMetrics.cardTitle,

  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const bio = style({
  color: vars.color.secondary,
  ...textMetrics.body,

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
  gap: vars.spacing.xs,
});

export const statLabel = style({
  color: vars.color.tertiary,
  ...textMetrics.bodySm,
});

export const statValue = style({
  color: vars.color.primary,
  ...textMetrics.bodySm,
  fontWeight: 500,
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
  gap: vars.spacing.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
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
  ...textMetrics.body,
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
  minHeight: vars.size.controlMd,
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  border: 0,
  borderRadius: "0.9rem",
  backgroundColor: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  fontFamily: vars.font.sans,
  ...textMetrics.bodySm,

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
