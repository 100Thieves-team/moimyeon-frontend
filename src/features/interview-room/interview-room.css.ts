import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const mobile = "screen and (max-width: 799px)";
const surface = {
  backgroundColor: vars.color.trueWhite,
  "@media": { [media.dark]: { backgroundColor: vars.color.background } },
};

export const page = style({
  width: "100%",
  flex: "1 1 auto",
  minHeight: "calc(100dvh - 6.4rem)",
  padding: "3.6rem 6.4rem 5.6rem",
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  "@media": { [mobile]: { padding: "2.4rem 1.6rem 4rem" } },
});
export const content = style({
  width: "100%",
  maxWidth: "144rem",
  marginInline: "auto",
  minWidth: 0,
});
export const heading = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
  paddingBottom: "2rem",
});
export const roomMeta = style({
  minHeight: "1.8rem",
  "@media": { [mobile]: { minHeight: "3.6rem" } },
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "1rem",
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});
export const title = style({
  fontSize: "3rem",
  fontWeight: 300,
  lineHeight: 1.3,
  overflowWrap: "anywhere",
  "@media": { [mobile]: { fontSize: "2.4rem", minHeight: "2lh" } },
});
export const navigation = style({
  display: "flex",
  alignItems: "stretch",
  gap: "2.8rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  overflowX: "auto",
  "@media": { [mobile]: { gap: "1.6rem" } },
});
export const tabs = style({
  display: "flex",
  gap: "2.8rem",
  "@media": { [mobile]: { gap: "1.6rem" } },
});
export const tab = style({
  border: 0,
  borderBottom: "2px solid transparent",
  padding: "1.2rem 0.2rem",
  background: "transparent",
  color: vars.color.tertiary,
  whiteSpace: "nowrap",
  fontSize: "1.45rem",
  lineHeight: "1.8rem",
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
export const panel = style({ paddingTop: "2.8rem" });
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
  gap: "1.4rem",
  alignItems: "center",
  padding: "1.8rem 2.6rem",
  minWidth: 0,
  "@media": {
    "screen and (max-width: 1100px)": { flexWrap: "wrap" },
    [mobile]: { gap: "1rem", padding: "1.6rem" },
  },
});
export const profile = style({
  display: "flex",
  alignItems: "center",
  gap: "1.4rem",
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
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.5rem",
});
export const identity = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  width: "27rem",
  flexShrink: 0,
  minWidth: 0,
  "@media": { [mobile]: { flex: "1 1 20rem", width: "auto" } },
});
export const nickname = style({
  color: vars.color.primary,
  fontSize: "1.45rem",
  fontWeight: 500,
  lineHeight: "1.9rem",
  overflowWrap: "anywhere",
});
export const meta = style({
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  fontWeight: 400,
  lineHeight: "1.7rem",
  overflowWrap: "anywhere",
});
export const excerpt = style({
  flex: "1 1 12rem",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: vars.color.secondary,
  fontSize: "1.35rem",
  lineHeight: "1.8rem",
  "@media": { "screen and (max-width: 1100px)": { order: 1, flexBasis: "100%" } },
});
export const appliedAt = style({
  color: vars.color.tertiary,
  fontSize: "1.25rem",
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
  fontSize: "1.3rem",
  padding: "0.6rem 1rem",
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
  gap: "1.2rem",
  padding: "0 2.6rem 2rem 8rem",
  selectors: { "&[hidden]": { display: "none" } },
  "@media": { [mobile]: { paddingInline: "1.6rem" } },
});
export const note = style({
  color: vars.color.primary,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  fontSize: "1.4rem",
  lineHeight: 1.6,
});
export const empty = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.base,
  padding: "6rem 1.6rem",
  color: vars.color.secondary,
  fontSize: "1.5rem",
  lineHeight: 1.6,
  textAlign: "center",
});
export const feedback = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  padding: "1.2rem 2.6rem",
  fontSize: "1.3rem",
  lineHeight: 1.6,
});
export const error = style({ color: vars.color.red, fontSize: "1.3rem", lineHeight: 1.6 });
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
  gap: "1rem",
  justifyContent: "space-between",
  padding: "2.8rem 2.8rem 0",
  paddingRight: "6.4rem",
});
export const dialogTitle = style({ fontSize: "1.9rem", fontWeight: 500, lineHeight: "2.5rem" });
export const description = style({
  color: vars.color.secondary,
  marginTop: "0.6rem",
  fontSize: "1.35rem",
  lineHeight: "1.9rem",
});
export const dialogBody = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  padding: "2rem 2.8rem",
});
export const reasons = style({ display: "flex", flexDirection: "column", gap: vars.spacing.sm });
export const reason = style({
  display: "flex",
  alignItems: "center",
  textAlign: "left",
  gap: vars.spacing.md,
  padding: "1.4rem 1.6rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: "1.2rem",
  background: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  fontSize: "1.45rem",
  lineHeight: "1.9rem",
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
  width: "1.8rem",
  height: "1.8rem",
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
  padding: "1.4rem 2.8rem",
  borderTop: `1px solid ${vars.color.strokeLight}`,
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
  gap: "1.4rem",
  padding: "1.8rem 2.6rem",
  selectors: {
    "& + &": { borderTop: `1px solid ${vars.color.strokeLight}` },
  },
  "@media": { [mobile]: { flexWrap: "wrap", padding: "1.6rem" } },
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
  gap: "0.2rem",
  minWidth: 0,
});
export const participantName = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "0.7rem",
});
export const hostBadge = style({
  borderRadius: vars.radius.pill,
  padding: "0.2rem 0.8rem",
  fontSize: "1.05rem",
  lineHeight: "1.4rem",
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
export const participantSummary = style({
  flex: "1 1 0",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textWrap: "nowrap",
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: "1.9rem",
  "@media": { [mobile]: { flexBasis: "100%" } },
});
export const participantsFooter = style({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  gap: "2rem",
  paddingTop: "2rem",
  "@media": { [mobile]: { flexDirection: "column" } },
});
export const leaveAction = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  flexShrink: 0,
  gap: "0.8rem",
  maxWidth: "32rem",
  "@media": { [mobile]: { alignItems: "flex-start", maxWidth: "100%" } },
});
export const leaveReason = style({
  color: vars.color.secondary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const cardLeaveAction = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
  width: "100%",
});

export const cardLeaveButton = style({
  width: "100%",
  minHeight: "5rem",
});
