import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles";

const mobile = "screen and (max-width: 799px)";

export const page = style({
  display: "flex",
  width: "100%",
  minHeight: "calc(100dvh - 6.4rem)",
  flex: "1 1 auto",
  flexDirection: "column",
  padding: "1.6rem 3.2rem 1.9rem",
  backgroundColor: vars.color.background,
  "@media": {
    [mobile]: {
      padding: "1.6rem 1.6rem 1.2rem",
    },
  },
});

export const content = style({
  width: "100%",
  maxWidth: "124.8rem",
  marginInline: "auto",
  paddingBottom: "3.2rem",
});

export const hero = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  paddingTop: "2.4rem",
});

export const badges = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.sm,
});

const statusBadgeBase = {
  display: "inline-flex",
  minHeight: "2.6rem",
  alignItems: "center",
  paddingInline: "1.2rem",
  borderRadius: vars.radius.pill,
  fontSize: "1.2rem",
  fontWeight: 500,
  lineHeight: "1.6rem",
} as const;

export const statusBadge = styleVariants({
  closed: {
    ...statusBadgeBase,
    backgroundColor: vars.color.fillSecondary,
    color: vars.color.secondary,
  },
  recruiting: {
    ...statusBadgeBase,
    backgroundColor: vars.color.blue,
    color: vars.color.trueWhite,
  },
});

export const relationBadge = style({
  ...statusBadgeBase,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontWeight: 700,
});

export const title = style({
  maxWidth: "90rem",
  marginTop: "1.2rem",
  color: vars.color.primary,
  fontSize: "clamp(3rem, 2.2rem + 1.25vw, 4rem)",
  fontWeight: 300,
  lineHeight: 1.15,
  letterSpacing: "-0.035em",
  overflowWrap: "anywhere",
  textWrap: "balance",
});

export const meta = style({
  marginTop: "1.2rem",
  color: vars.color.secondary,
  fontSize: "1.6rem",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
});

export const infoStrip = style({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  marginTop: "4.4rem",
  paddingBlock: "1.8rem",
  borderBlock: `1px solid ${vars.color.strokeMedium}`,
  "@media": {
    [mobile]: {
      gridTemplateColumns: "1fr",
      marginTop: "3.2rem",
      paddingBlock: 0,
    },
  },
});

export const infoColumn = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.xs,
  selectors: {
    "&:not(:first-child)": {
      paddingInlineStart: "2.8rem",
      borderInlineStart: `1px solid ${vars.color.strokeLight}`,
    },
  },
  "@media": {
    [mobile]: {
      paddingBlock: "1.6rem",
      selectors: {
        "&:not(:first-child)": {
          paddingInlineStart: 0,
          borderInlineStart: 0,
          borderTop: `1px solid ${vars.color.strokeLight}`,
        },
      },
    },
  },
});

export const infoLabel = style({
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: 1.4,
});

export const infoValue = style({
  color: vars.color.primary,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: 1.4,
});

const progressBase = {
  height: "0.6rem",
  overflow: "hidden",
  border: 0,
  borderRadius: vars.radius.pill,
  appearance: "none",
  backgroundColor: vars.color.fillSecondary,
} as const;

export const detailLayout = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 40rem",
  alignItems: "start",
  gap: "4.8rem",
  paddingTop: "1rem",
  "@media": {
    [mobile]: {
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: "2.4rem",
      paddingTop: "2.4rem",
    },
  },
});

export const rightRail = style({
  position: "sticky",
  top: "8rem",
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  alignItems: "stretch",
  gap: "1.6rem",
  "@media": {
    [mobile]: {
      position: "static",
    },
    "screen and (min-width: 800px) and (max-height: 760px)": {
      position: "static",
    },
  },
});

export const detailCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "2.2rem",
});

export const detailSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const policySection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  paddingTop: "1.8rem",
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const sectionTitle = style({
  color: vars.color.primary,
  fontSize: "1.6rem",
  fontWeight: 700,
  lineHeight: 1.4,
});

export const description = style({
  maxWidth: "64rem",
  color: vars.color.secondary,
  fontSize: "1.6rem",
  lineHeight: 1.6,
  overflowWrap: "anywhere",
  textWrap: "pretty",
});

export const policyList = style({
  listStyle: "none",
  color: vars.color.secondary,
  fontSize: "1.5rem",
  lineHeight: 1.6,
});

export const hostCard = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  gap: "1.4rem",
  padding: "2.6rem",
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});

export const profileState = style({
  display: "flex",
  minHeight: "12rem",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: vars.spacing.base,
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: 1.5,
});

export const hostIdentity = style({
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

export const hostIdentityCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.2rem",
});

export const hostNameRow = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const hostName = style({
  overflow: "hidden",
  color: vars.color.primary,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: 1.4,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const hostBadge = style({
  flex: "0 0 auto",
  padding: "0.3rem 0.9rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontSize: "1.1rem",
  fontWeight: 700,
  lineHeight: "1.5rem",
});

export const hostJobRoles = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: 1.4,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const hostTrustSummary = style({
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: 1.5,
  overflowWrap: "anywhere",
});

export const hostBio = style({
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

export const hostBioLabel = style({
  color: vars.color.blue,
  fontFamily: vars.font.mono,
  fontSize: "1.05rem",
  lineHeight: "1.4rem",
  letterSpacing: "0.1em",
});

export const hostTagsBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.7rem",
});

export const hostTagsLabel = style({
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: 1.4,
});

export const hostTags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.6rem",
  listStyle: "none",
});

export const hostTag = style({
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

export const hostTagCount = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1rem",
});

export const actionCard = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  gap: "1.6rem",
  padding: "2.6rem",
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});

export const quotaStats = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  alignItems: "stretch",
  gap: "1rem",
});

export const quotaLabels = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: 1.4,
});

export const quotaValue = style({
  display: "flex",
  minWidth: 0,
  alignItems: "baseline",
  gap: vars.spacing.sm,
});

export const quotaNumber = style({
  color: vars.color.primary,
  fontSize: "2.8rem",
  fontWeight: 300,
  lineHeight: "3.2rem",
  letterSpacing: "-0.02em",
  whiteSpace: "nowrap",
});

export const remainingQuota = style({
  color: vars.color.blue,
  fontSize: "1.4rem",
  fontWeight: 500,
  lineHeight: 1.4,
});

export const actionProgress = style({
  ...progressBase,
  width: "100%",
});

export const actionMessage = style({
  color: vars.color.secondary,
  fontSize: "1.4rem",
  fontWeight: 500,
  lineHeight: 1.4,
  overflowWrap: "anywhere",
  textAlign: "center",
});

export const actionControls = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  alignItems: "stretch",
  gap: vars.spacing.sm,
});

export const actionError = style({
  padding: "0.8rem 1rem",
  border: `1px solid ${vars.color.red50}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.red,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const loading = style({
  display: "grid",
  minHeight: "calc(100dvh - 6.4rem)",
  placeItems: "center",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
});

export const errorPage = style({
  display: "grid",
  minHeight: "calc(100dvh - 6.4rem)",
  padding: "3.2rem",
  placeItems: "center",
  "@media": {
    [mobile]: { padding: "1.6rem" },
  },
});

export const errorCard = style({
  display: "flex",
  width: "100%",
  maxWidth: "52rem",
  flexDirection: "column",
  alignItems: "center",
  padding: "4rem 3.2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
  textAlign: "center",
});

export const errorTitle = style({
  fontSize: "2.6rem",
  fontWeight: 500,
  lineHeight: "3.2rem",
});

export const errorDescription = style({
  marginTop: vars.spacing.sm,
  color: vars.color.secondary,
  fontSize: "1.5rem",
  lineHeight: "2.2rem",
});

export const errorActions = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: vars.spacing.md,
  marginTop: vars.spacing.xl,
});

globalStyle(`${actionProgress}::-webkit-progress-bar`, {
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
});

globalStyle(`${actionProgress}::-webkit-progress-value`, {
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.blue,
});

globalStyle(`${actionProgress}::-moz-progress-bar`, {
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.blue,
});

globalStyle(`${actionControls} > :is(button, a)`, {
  width: "100%",
  minHeight: "5rem",
});
