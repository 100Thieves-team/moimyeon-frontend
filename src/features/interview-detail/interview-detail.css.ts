import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const mobile = "screen and (max-width: 799px)";

export const page = style({
  display: "flex",
  width: "100%",
  minHeight: "calc(100dvh - 6.4rem)",
  flex: "1 1 auto",
  flexDirection: "column",
  padding: "0 3.2rem 2.4rem",
  backgroundColor: vars.color.background,
  "@media": {
    [mobile]: {
      padding: "0 1.6rem 1.2rem",
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
  backgroundColor: vars.color.blue10,
  color: vars.color.blue,
  fontWeight: 700,
});

export const hostBadge = style({
  ...statusBadgeBase,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontWeight: 700,
  "@media": { [media.dark]: { color: vars.color.yellow } },
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
  marginTop: "1.8rem",
  paddingBlock: "1.8rem",
  borderBlock: `1px solid ${vars.color.strokeLight}`,
  "@media": {
    [mobile]: {
      gridTemplateColumns: "1fr",
      marginTop: "1.8rem",
      paddingBlock: 0,
    },
  },
});

export const panelInfoStrip = style([
  infoStrip,
  {
    marginTop: 0,
    borderBlockStart: 0,
    "@media": { [mobile]: { marginTop: 0 } },
  },
]);

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
  minHeight: "2lh",
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

export const actionCard = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.lg,
  padding: vars.spacing.xl,
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.trueWhite,
  "@media": { [media.dark]: { backgroundColor: vars.color.background } },
  boxShadow: vars.shadow.cardRaise,
});

export const quotaStats = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexDirection: "column",
  alignItems: "stretch",
  gap: vars.spacing.sm,
});

export const progressMeta = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
  marginTop: vars.spacing.sm,
});

export const quotaStatusRow = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.8rem",
});

export const quotaNumber = style({
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  fontWeight: 400,
  lineHeight: "1.8rem",
  whiteSpace: "nowrap",
  marginInlineStart: "auto",
  textAlign: "right",
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

export const participantAvatarList = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  alignSelf: "flex-start",
  padding: 0,
  listStyle: "none",
});

export const participantAvatarItem = style({
  position: "relative",
  display: "grid",
  width: "4rem",
  height: "4rem",
  flex: "0 0 4rem",
  placeItems: "center",
  selectors: {
    "&:not(:first-child)": {
      marginInlineStart: "-1.2rem",
    },
  },
});

export const participantAvatarTrigger = style({
  width: "4rem",
  height: "4rem",
  borderRadius: vars.radius.pill,
});

const participantAvatarBase = style({
  display: "grid",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  border: `0.2rem solid ${vars.color.background}`,
  borderRadius: vars.radius.pill,
  placeItems: "center",
  fontSize: "1.3rem",
  fontWeight: 600,
  lineHeight: 1,
});

export const participantAvatar = style([
  participantAvatarBase,
  {
    backgroundColor: vars.color.fillSecondary,
    color: vars.color.secondary,
  },
]);

export const hostParticipantAvatar = style([
  participantAvatarBase,
  {
    backgroundColor: vars.color.yellow10,
    color: vars.color.brown,
    "@media": { [media.dark]: { color: vars.color.yellow } },
  },
]);

export const participantAvatarImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const participantAvatarFallback = style({
  display: "grid",
  width: "100%",
  height: "100%",
  placeItems: "center",
});

export const participantAvatarOverflow = style({
  zIndex: 1,
  border: `0.2rem solid ${vars.color.background}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontFamily: vars.font.mono,
  fontSize: "1.1rem",
  fontWeight: 600,
  lineHeight: 1,
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
