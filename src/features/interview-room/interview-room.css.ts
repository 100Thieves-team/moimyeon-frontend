import { globalStyle, style } from "@vanilla-extract/css";
import { vars, textMetrics } from "@/styles";

const mobile = "screen and (max-width: 799px)";
const surface = {
  backgroundColor: vars.color.trueWhite,
};

export const page = style({
  width: "100%",
  flex: "1 1 auto",
  minHeight: `calc(100dvh - ${vars.size.header})`,
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
});
export const content = style({
  width: "100%",
  maxWidth: vars.layout.maxWidth,
  marginInline: "auto",
  minWidth: 0,
});
export const heading = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  paddingBottom: vars.layout.sectionGap,
});
export const roomMeta = style({
  minHeight: "1.8rem",
  "@media": { [mobile]: { minHeight: "3.6rem" } },
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.md,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});
export const title = style({
  ...textMetrics.pageTitle,
  fontWeight: 300,

  overflowWrap: "anywhere",
  "@media": { [mobile]: { minHeight: "2lh" } },
});
export const navigation = style({
  display: "flex",
  alignItems: "stretch",
  gap: vars.spacing["2xl"],
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  overflowX: "auto",
  "@media": { [mobile]: { gap: vars.spacing.base } },
});
export const tabs = style({
  display: "flex",
  gap: vars.spacing["2xl"],
  "@media": { [mobile]: { gap: vars.spacing.base } },
});
export const tab = style({
  border: 0,
  borderBottom: "2px solid transparent",
  padding: `${vars.spacing.md} 0.2rem`,
  background: "transparent",
  color: vars.color.tertiary,
  whiteSpace: "nowrap",
  ...textMetrics.bodySm,

  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&[data-active]": {
      borderBottomColor: vars.color.primary,
      color: vars.color.primary,
      fontWeight: 700,
    },
    "&[data-disabled]": { cursor: "not-allowed", color: vars.color.quaternary },
  },
});
export const panel = style({ paddingTop: vars.layout.sectionGap });
export const list = style({
  ...surface,
  listStyle: "none",
  margin: 0,
  padding: 0,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.link,
  overflow: "hidden",
});
export const application = style({
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  selectors: {
    "&[data-open]": { backgroundColor: `color-mix(in srgb, ${vars.color.blue} 3%, transparent)` },
  },
});
export const row = style({
  display: "flex",
  gap: vars.spacing.base,
  alignItems: "center",
  padding: `${vars.spacing.lg} ${vars.spacing.xl}`,
  minWidth: 0,
  "@media": {
    "screen and (max-width: 1100px)": { flexWrap: "wrap" },
    [mobile]: { gap: vars.spacing.md, padding: vars.spacing.base },
  },
});
export const profile = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.base,
  flexShrink: 0,
  minWidth: 0,
  "@media": { [mobile]: { flex: "1 1 24rem" } },
});
export const avatar = style({
  display: "grid",
  flexShrink: 0,
  placeItems: "center",
  width: "4rem",
  height: "4rem",
  borderRadius: "50%",
  aspectRatio: "1",
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.5rem",
});
export const identity = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  width: "27rem",
  flexShrink: 0,
  minWidth: 0,
  "@media": { [mobile]: { flex: "1 1 20rem", width: "auto" } },
});
export const nickname = style({
  color: vars.color.primary,
  ...textMetrics.body,
  fontWeight: 500,

  overflowWrap: "anywhere",
});
export const meta = style({
  color: vars.color.tertiary,
  ...textMetrics.metadata,
  fontWeight: 400,

  overflowWrap: "anywhere",
});
export const excerpt = style({
  flex: "1 1 12rem",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: vars.color.secondary,
  ...textMetrics.bodySm,

  "@media": { "screen and (max-width: 1100px)": { order: 1, flexBasis: "100%" } },
});
export const appliedAt = style({
  color: vars.color.tertiary,
  ...textMetrics.metadata,
  whiteSpace: "nowrap",
  marginLeft: "auto",
});
export const actions = style({
  display: "flex",
  gap: vars.spacing.sm,
  alignItems: "center",
  flexWrap: "wrap",
});
export const status = style({
  color: vars.color.secondary,
  ...textMetrics.metadata,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  backgroundColor: vars.color.fillTertiary,
  borderRadius: vars.radius.pill,
});
export const iconButton = style({
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  width: "2.8rem",
  height: "2.8rem",
  padding: 0,
  border: 0,
  background: "transparent",
  color: vars.color.tertiary,
  cursor: "pointer",
  borderRadius: vars.radius.control,
});
export const expand = style([
  iconButton,
  { selectors: { "&[data-panel-open]": { transform: "rotate(180deg)" } } },
]);
export const details = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  padding: `0 ${vars.spacing.xl} ${vars.spacing.lg} ${vars.spacing.section}`,
  selectors: { "&[hidden]": { display: "none" } },
  "@media": { [mobile]: { paddingInline: vars.spacing.base } },
});
export const note = style({
  color: vars.color.primary,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  ...textMetrics.body,
});
export const empty = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.base,
  padding: `${vars.spacing.sectionSm} ${vars.spacing.base}`,
  color: vars.color.secondary,
  ...textMetrics.body,

  textAlign: "center",
});
export const feedback = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.md} ${vars.spacing.xl}`,
  ...textMetrics.metadata,
});
export const error = style({ color: vars.color.red, ...textMetrics.body });
export const backdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 50,
  backgroundColor: vars.color.black50,
});
export const dialog = style({
  ...surface,
  position: "fixed",
  zIndex: 51,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(46rem, calc(100vw - 3.2rem))",
  maxHeight: "calc(100dvh - 3.2rem)",
  overflowY: "auto",
  borderRadius: vars.radius.media,
  boxShadow: vars.shadow.cardSoft,
  color: vars.color.primary,
});
export const dialogHeader = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.spacing.md,
  justifyContent: "space-between",
  padding: `${vars.spacing["2xl"]} ${vars.spacing["2xl"]} 0`,
  paddingRight: "6.4rem",
});
export const dialogTitle = style({ ...textMetrics.sectionTitle, fontWeight: 600 });
export const attendanceDialogTitle = style([
  dialogTitle,
  { wordBreak: "keep-all", textWrap: "balance" },
]);
export const description = style({
  color: vars.color.secondary,
  ...textMetrics.body,
});
export const dialogBody = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  padding: `${vars.spacing.base} ${vars.spacing["2xl"]} 0`,
});
export const reasons = style({ display: "flex", flexDirection: "column", gap: vars.spacing.sm });
export const reason = style({
  display: "flex",
  alignItems: "center",
  textAlign: "left",
  gap: vars.spacing.md,
  padding: `${vars.spacing.base} ${vars.spacing.base}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: "1.2rem",
  background: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  ...textMetrics.body,

  selectors: {
    "&[data-checked]": {
      backgroundColor: `color-mix(in srgb, ${vars.color.blue} 6%, transparent)`,
      borderColor: vars.color.primary,
      fontWeight: 500,
    },
    "&[data-disabled]": { cursor: "not-allowed", opacity: 0.6 },
  },
});
export const radioCircle = style({
  display: "grid",
  placeItems: "center",
  width: vars.size.iconMd,
  height: vars.size.iconMd,
  flexShrink: 0,
  border: `1.5px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  selectors: { [`${reason}[data-checked] &`]: { borderColor: vars.color.primary } },
});
export const radioDot = style({
  width: "0.9rem",
  height: "0.9rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.primary,
});
export const dialogFooter = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.base} ${vars.spacing["2xl"]} ${vars.spacing.base}`,
});
export const visuallyHidden = style({
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
});

export const roster = style({
  ...surface,
  listStyle: "none",
  padding: 0,
  margin: 0,
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
});
export const participantRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.base,
  padding: `${vars.spacing.lg} ${vars.spacing.xl}`,
  selectors: {
    "& + &": { borderTop: `1px solid ${vars.color.strokeLight}` },
  },
  "@media": { [mobile]: { flexWrap: "wrap", padding: vars.spacing.base } },
});
export const participantProfile = style({
  flexShrink: 0,
  width: "29.6rem",
  minWidth: 0,
  "@media": { [mobile]: { width: "100%" } },
});
export const participantAvatar = style([
  avatar,
  {
    width: "4.2rem",
    height: "4.2rem",
    selectors: {
      [`${participantRow}[data-me] &`]: {
        color: vars.color.blue,
        backgroundColor: `color-mix(in srgb, ${vars.color.blue} 10%, transparent)`,
      },
    },
  },
]);
export const participantIdentity = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  minWidth: 0,
});
export const participantName = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
});
export const hostBadge = style({
  borderRadius: vars.radius.pill,
  padding: `0.2rem ${vars.spacing.sm}`,
  ...textMetrics.metadata,

  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
});
export const meBadge = style([
  hostBadge,
  {
    color: vars.color.blue,
    backgroundColor: `color-mix(in srgb, ${vars.color.blue} 10%, transparent)`,
  },
]);
export const attendanceStatus = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.xs,
  verticalAlign: "middle",
  color: vars.color.secondary,
  ...textMetrics.metadata,
  fontWeight: 500,
  whiteSpace: "nowrap",
});
export const attendanceAttended = style({
  color: vars.color.blue,
});
export const attendanceFeedback = style({
  color: vars.color.secondary,
  ...textMetrics.metadata,
});
export const attendanceError = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
});
export const attendanceLabel = style({
  textBox: "trim-both cap alphabetic",
});
export const participantSummary = style({
  flex: "1 1 0",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textWrap: "nowrap",
  color: vars.color.secondary,
  ...textMetrics.bodySm,

  "@media": { [mobile]: { flexBasis: "100%" } },
});

export const participantsFooter = style({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  gap: vars.spacing.lg,
  paddingTop: vars.spacing.lg,
  "@media": { [mobile]: { flexDirection: "column" } },
});
export const leaveAction = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  flexShrink: 0,
  gap: vars.spacing.sm,
  maxWidth: "32rem",
  "@media": { [mobile]: { alignItems: "flex-start", maxWidth: "100%" } },
});
export const cardLeaveAction = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  width: "100%",
});

export const cardLeaveButton = style({
  width: "100%",
  minHeight: vars.size.controlMd,
});

export const confirmationSummary = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.base,
  color: vars.color.secondary,
  ...textMetrics.bodySm,
});

globalStyle(`${confirmationSummary} > div`, {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
});
globalStyle(`${confirmationSummary} dd`, { margin: 0 });

export const confirmationEffects = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  paddingLeft: vars.spacing.lg,
  color: vars.color.secondary,
  ...textMetrics.bodySm,
});

export const attendanceRoster = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
});

export const attendanceRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.md,
  padding: vars.spacing.base,
  ...textMetrics.bodySm,
  "@media": {
    [mobile]: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: vars.spacing.sm,
      padding: vars.spacing.md,
    },
  },
});

export const attendanceParticipantName = style([
  participantName,
  { minWidth: 0, flex: "1 1 0", overflowWrap: "anywhere" },
]);

globalStyle(`${attendanceRoster} > li + li`, {
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const attendanceChoices = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  flexShrink: 0,
  width: "18rem",
  gap: vars.spacing.xs,
  padding: vars.spacing.xs,
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.fillTertiary,
  "@media": { [mobile]: { width: "100%" } },
});

export const attendanceChoice = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.xs,
  minHeight: vars.size.controlSm,
  padding: `0 ${vars.spacing.sm}`,
  border: "1px solid transparent",
  borderRadius: vars.radius.control,
  color: vars.color.secondary,
  whiteSpace: "nowrap",
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&[data-checked]": {
      color: vars.color.primary,
      borderColor: vars.color.strokeMedium,
      backgroundColor: vars.color.trueWhite,
      fontWeight: 600,
    },
    '&[data-checked][data-attendance="ATTENDED"]': {
      color: vars.color.blue,
    },
    "&:focus-visible": { outline: `2px solid ${vars.color.blue}`, outlineOffset: "2px" },
    "&[data-disabled]": { cursor: "default", opacity: 0.5 },
  },
});

export const resumeAction = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: vars.spacing.sm,
  flexShrink: 0,
  maxWidth: "100%",
  "@media": { [mobile]: { width: "100%", alignItems: "stretch" } },
});
