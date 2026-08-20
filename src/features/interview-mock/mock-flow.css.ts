import { globalStyle, style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const focusRing = {
  outline: `2px solid ${vars.color.blue}`,
  outlineOffset: "2px",
} as const;

export const page = style({
  display: "flex",
  width: "100%",
  minHeight: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  backgroundColor: vars.color.background,
});

export const roomHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
  padding: "3.2rem 2rem 1.8rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  "@media": { [media.md]: { paddingInline: "4.6rem" } },
});

export const statusLine = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.8rem",
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  lineHeight: "1.7rem",
});

export const badge = style({
  display: "inline-flex",
  minHeight: "2.4rem",
  alignItems: "center",
  paddingInline: "1rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillPrimary,
  color: vars.color.background,
  fontSize: "1.1rem",
  fontWeight: 700,
});

export const accentBadge = style({ backgroundColor: vars.color.blue10, color: vars.color.blue });
export const hostBadge = style({ backgroundColor: vars.color.yellow10, color: vars.color.brown });
export const dangerBadge = style({ backgroundColor: vars.color.red10, color: vars.color.red });

export const roomTitle = style({
  color: vars.color.primary,
  fontSize: "clamp(2.4rem, 3vw, 3rem)",
  fontWeight: 300,
  lineHeight: 1.2,
  letterSpacing: "-0.025em",
});

export const roomTabs = style({
  display: "flex",
  gap: "2.4rem",
  overflowX: "auto",
  paddingInline: "2rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  "@media": { [media.md]: { paddingInline: "4.6rem" } },
});

export const roomTab = style({
  display: "inline-flex",
  minHeight: "4.6rem",
  flex: "0 0 auto",
  alignItems: "center",
  borderBottom: "2px solid transparent",
  color: vars.color.tertiary,
  fontSize: "1.35rem",
  fontWeight: 500,
  selectors: { "&:focus-visible": focusRing },
});

export const roomTabActive = style({
  borderBottomColor: vars.color.primary,
  color: vars.color.primary,
  fontWeight: 700,
});

export const content = style({
  width: "100%",
  maxWidth: "118rem",
  marginInline: "auto",
  padding: "2.8rem 2rem 10rem",
  "@media": { [media.md]: { paddingInline: "4.6rem" } },
});

export const contentNarrow = style([content, { maxWidth: "96rem" }]);
export const stack = style({ display: "flex", flexDirection: "column", gap: "1.2rem" });
export const split = style({
  display: "grid",
  alignItems: "start",
  gap: "2.4rem",
  "@media": { [media.lg]: { gridTemplateColumns: "minmax(0, 1fr) 30rem" } },
});

export const card = style({
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardSoft,
});

export const cardPadding = style([card, { padding: "2rem" }]);
export const blueCard = style([cardPadding, { backgroundColor: vars.color.blue10 }]);
export const mutedCard = style([cardPadding, { backgroundColor: vars.color.fillTertiary }]);

export const sectionTitle = style({
  color: vars.color.primary,
  fontSize: "1.6rem",
  fontWeight: 700,
  lineHeight: "2.2rem",
});

export const sectionCopy = style({
  color: vars.color.secondary,
  fontSize: "1.3rem",
  lineHeight: "1.9rem",
});

export const inline = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.8rem",
});
export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: "0.8rem",
});
export const separator = style({ height: 1, backgroundColor: vars.color.strokeLight });

export const personRow = style({
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: "1.2rem",
  alignItems: "start",
  padding: "1.6rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  selectors: { "&:last-child": { borderBottom: 0 } },
  "@media": { [media.md]: { gridTemplateColumns: "auto minmax(0, 1fr) auto" } },
});

export const personAvatar = style({
  display: "grid",
  width: "3.6rem",
  height: "3.6rem",
  flex: "0 0 auto",
  borderRadius: "50%",
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.3rem",
  fontWeight: 700,
  placeItems: "center",
});

export const personAvatarMe = style({ backgroundColor: vars.color.blue10, color: vars.color.blue });
export const personMain = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.4rem",
});
export const personNameButton = style({
  width: "fit-content",
  padding: 0,
  border: 0,
  background: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  fontWeight: 700,
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});
export const personMeta = style({
  color: vars.color.tertiary,
  fontSize: "1.15rem",
  lineHeight: "1.6rem",
});
export const personSummary = style({
  color: vars.color.secondary,
  fontSize: "1.25rem",
  lineHeight: "1.8rem",
});
export const rowActions = style({
  display: "flex",
  gridColumn: "1 / -1",
  gap: "0.8rem",
  "@media": { [media.md]: { gridColumn: "auto" } },
});

export const disclosurePanel = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
  gridColumn: "1 / -1",
  padding: "1.4rem",
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.blue10,
});

export const textLabel = style({
  color: vars.color.tertiary,
  fontSize: "1.15rem",
  fontWeight: 600,
});

export const dialogBackdrop = style({
  position: "fixed",
  zIndex: 100,
  inset: 0,
  backgroundColor: "rgba(2, 2, 4, 0.52)",
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.out}`,
});

export const dialogPositioner = style({
  position: "fixed",
  zIndex: 101,
  display: "grid",
  overflowY: "auto",
  padding: "2rem",
  inset: 0,
  placeItems: "center",
});

export const dialogPopup = style({
  display: "flex",
  width: "min(100%, 52rem)",
  maxHeight: "min(90vh, 72rem)",
  flexDirection: "column",
  overflow: "auto",
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardSoft,
});

export const dialogHead = style({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "1.6rem",
  padding: "2.4rem 2.4rem 1rem",
});
export const dialogTitle = style({
  color: vars.color.primary,
  fontSize: "1.9rem",
  fontWeight: 600,
  lineHeight: "2.5rem",
});
export const dialogDescription = style({
  marginTop: "0.5rem",
  color: vars.color.secondary,
  fontSize: "1.3rem",
  lineHeight: "1.9rem",
});
export const iconButton = style({
  display: "grid",
  width: "3.2rem",
  height: "3.2rem",
  flex: "0 0 auto",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  cursor: "pointer",
  placeItems: "center",
  selectors: { "&:focus-visible": focusRing },
});

export const dialogBody = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1.4rem 2.4rem 2rem",
});
export const dialogFoot = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.8rem",
  padding: "1.4rem 2.4rem",
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const radioRow = style({
  display: "flex",
  minHeight: "4.8rem",
  alignItems: "center",
  gap: "1rem",
  paddingInline: "1.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  color: vars.color.primary,
  fontSize: "1.35rem",
  cursor: "pointer",
  selectors: {
    "&[data-checked]": { borderColor: vars.color.primary, backgroundColor: vars.color.blue10 },
  },
});
export const radioIndicator = style({
  display: "grid",
  width: "1.8rem",
  height: "1.8rem",
  border: `1.5px solid ${vars.color.strokeMedium}`,
  borderRadius: "50%",
  placeItems: "center",
});
export const radioDot = style({
  width: "0.8rem",
  height: "0.8rem",
  borderRadius: "50%",
  backgroundColor: vars.color.primary,
});

export const summaryGrid = style({
  display: "grid",
  gap: "1px",
  backgroundColor: vars.color.strokeLight,
  "@media": { [media.md]: { gridTemplateColumns: "repeat(3, 1fr)" } },
});
export const summaryItem = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.6rem",
  padding: "1.8rem",
  backgroundColor: vars.color.background,
});

export const fixedActionBar = style({
  position: "sticky",
  zIndex: 20,
  bottom: "1.6rem",
  display: "flex",
  width: "calc(100% - 3.2rem)",
  maxWidth: "calc(118rem - 3.2rem)",
  minHeight: "7rem",
  margin: "auto 1.6rem 1.6rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.6rem",
  padding: "1.2rem 1.6rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
  "@media": { [media.lg]: { marginInline: "auto" } },
});

export const actionCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.3rem",
});
export const actionTitle = style({
  color: vars.color.primary,
  fontSize: "1.35rem",
  fontWeight: 700,
  lineHeight: "1.9rem",
});
export const actionDescription = style({
  color: vars.color.tertiary,
  fontSize: "1.15rem",
  lineHeight: "1.6rem",
});

export const targetList = style([
  cardPadding,
  { display: "flex", flexDirection: "column", gap: "0.4rem" },
]);
export const targetButton = style({
  display: "flex",
  width: "100%",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  textAlign: "start",
  cursor: "pointer",
  selectors: {
    "&[data-active='true']": { backgroundColor: vars.color.blue10 },
    "&:focus-visible": focusRing,
  },
});

export const targetCopy = style({
  display: "flex",
  minWidth: 0,
  flex: 1,
  flexDirection: "column",
  gap: "0.2rem",
});
export const targetStatus = style({ color: vars.color.tertiary, fontSize: "1.1rem" });

export const questionCard = style([
  cardPadding,
  { display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "none" },
]);
export const questionHead = style({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "1.2rem",
});
export const questionTitle = style({
  color: vars.color.primary,
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: "1.9rem",
});
export const questionMeta = style({ color: vars.color.tertiary, fontSize: "1.1rem" });
export const tailList = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  paddingInlineStart: "1.4rem",
  color: vars.color.secondary,
  fontSize: "1.2rem",
});

export const compactForm = style({ display: "flex", width: "100%", gap: "0.8rem" });
export const input = style({
  width: "100%",
  minWidth: 0,
  minHeight: "4.2rem",
  paddingInline: "1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.35rem",
  selectors: {
    "&::placeholder": { color: vars.color.tertiary, opacity: 1 },
    "&:focus-visible": focusRing,
  },
});
export const textarea = style([
  input,
  { minHeight: "9.2rem", paddingBlock: "1.2rem", resize: "vertical" },
]);

export const aiPanel = style([
  cardPadding,
  { display: "flex", flexDirection: "column", gap: "1.2rem", borderColor: vars.color.blue50 },
]);
export const aiSuggestion = style({
  display: "grid",
  gap: "0.8rem",
  paddingBlock: "1rem",
  borderTop: `1px solid ${vars.color.strokeLight}`,
  "@media": { [media.md]: { gridTemplateColumns: "minmax(0, 1fr) auto" } },
});
export const skeleton = style({
  height: "1.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
});

export const locked = style([
  cardPadding,
  {
    display: "grid",
    minHeight: "20rem",
    textAlign: "center",
    placeContent: "center",
    gap: "0.8rem",
  },
]);

export const sessionPage = style([page, { minHeight: "calc(100vh - 6.4rem)" }]);
export const progressRail = style({
  display: "flex",
  gap: "2.4rem",
  overflowX: "auto",
  padding: "1.4rem 4.6rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const progressButton = style({
  padding: "0.8rem 0",
  border: 0,
  borderBottom: "2px solid transparent",
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.25rem",
  cursor: "pointer",
  selectors: {
    "&[data-active='true']": {
      borderBottomColor: vars.color.primary,
      color: vars.color.primary,
      fontWeight: 700,
    },
    "&:focus-visible": focusRing,
  },
});
export const sessionContent = style([
  content,
  {
    display: "grid",
    gap: "2.4rem",
    paddingTop: "2.4rem",
    "@media": { [media.lg]: { gridTemplateColumns: "minmax(0, 1fr) 34rem" } },
  },
]);
export const sessionMain = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "1rem",
});
export const recordPanel = style([
  cardPadding,
  { position: "sticky", top: "8rem", display: "flex", flexDirection: "column", gap: "1.2rem" },
]);
export const noteRow = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  padding: "1rem 0",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const noteActions = style({ display: "flex", alignItems: "center", gap: "0.5rem" });
export const textButton = style({
  padding: "0.4rem",
  border: 0,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.15rem",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});

export const centeredState = style({
  display: "grid",
  minHeight: "36rem",
  padding: "4rem",
  textAlign: "center",
  placeContent: "center",
  gap: "1rem",
});
export const centeredTitle = style({
  color: vars.color.primary,
  fontSize: "2.8rem",
  fontWeight: 300,
  lineHeight: 1.3,
});

export const coachBackdrop = style({
  position: "fixed",
  zIndex: 80,
  inset: 0,
  backgroundColor: "transparent",
});
export const coachSpotlight = style({
  position: "fixed",
  zIndex: 81,
  width: "min(53.5rem, calc(100vw - 4rem))",
  height: "4.6rem",
  top: "21.8rem",
  left: "2rem",
  border: `2px solid ${vars.color.white}`,
  borderRadius: vars.radius.control,
  boxShadow: "0 0 0 9999px rgba(2, 2, 4, 0.45)",
  "@media": { [media.md]: { left: "9.5rem" } },
});
export const coachCard = style({
  position: "fixed",
  zIndex: 82,
  width: "min(30rem, calc(100vw - 4rem))",
  top: "28rem",
  left: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1.8rem",
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.black,
  color: vars.color.white,
  boxShadow: vars.shadow.cardSoft,
  "@media": { [media.md]: { left: "4.6rem" } },
});
export const coachTitle = style([sectionTitle, { color: vars.color.white }]);
export const coachCopy = style([sectionCopy, { color: "rgba(255, 255, 255, 0.72)" }]);
export const coachSkipButton = style([textButton, { color: vars.color.white }]);
export const coachNextButton = style({
  borderColor: vars.color.white,
  backgroundColor: vars.color.white,
  color: vars.color.black,
});

export const feedbackGrid = style({
  display: "grid",
  alignItems: "start",
  gap: "2.4rem",
  "@media": { [media.lg]: { gridTemplateColumns: "minmax(0, 1fr) 34rem" } },
});
export const feedbackQuestion = style([
  cardPadding,
  { display: "flex", flexDirection: "column", gap: "0.8rem", boxShadow: "none" },
]);
export const blurred = style({ filter: "blur(5px)", userSelect: "none" });
export const revealCard = style([
  cardPadding,
  {
    position: "relative",
    display: "flex",
    minHeight: "9rem",
    alignItems: "center",
    justifyContent: "center",
  },
]);

export const ratingButton = style({
  display: "grid",
  width: "3.2rem",
  height: "3.2rem",
  padding: 0,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: "50%",
  backgroundColor: vars.color.background,
  cursor: "pointer",
  placeItems: "center",
  selectors: {
    "&[data-pressed]": { borderColor: vars.color.blue, backgroundColor: vars.color.blue10 },
    "&:focus-visible": focusRing,
  },
});

export const profileLayout = style({
  display: "grid",
  width: "100%",
  maxWidth: "118rem",
  marginInline: "auto",
  gap: "1.8rem",
  padding: "3.2rem 2rem 8rem",
  "@media": { [media.lg]: { gridTemplateColumns: "24rem minmax(0,1fr)", paddingInline: "4.6rem" } },
});
export const profileCard = style([
  cardPadding,
  { display: "flex", flexDirection: "column", gap: "1.6rem" },
]);
export const profileTabs = style({
  display: "flex",
  width: "fit-content",
  padding: "0.3rem",
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.fillSecondary,
});
export const profileTab = style({
  display: "inline-flex",
  minHeight: "3.8rem",
  alignItems: "center",
  paddingInline: "1.6rem",
  borderRadius: "0.6rem",
  color: vars.color.tertiary,
  fontSize: "1.25rem",
  selectors: {
    "&[aria-current='page']": {
      backgroundColor: vars.color.background,
      color: vars.color.primary,
      fontWeight: 700,
      boxShadow: vars.shadow.cardRaise,
    },
    "&:focus-visible": focusRing,
  },
});
export const resumeTable = style([card, { overflow: "hidden" }]);
export const resumeMockRow = style({
  display: "grid",
  alignItems: "center",
  gap: "1.2rem",
  padding: "1.5rem 1.8rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  selectors: { "&:last-child": { borderBottom: 0 } },
  "@media": {
    [media.lg]: { gridTemplateColumns: "minmax(18rem, 0.8fr) minmax(24rem, 1.2fr) auto" },
  },
});
export const processingRow = style({ backgroundColor: vars.color.blue10 });
export const resumeCopy = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.3rem",
});
export const resumeSummary = style({
  color: vars.color.secondary,
  fontSize: "1.2rem",
  lineHeight: "1.7rem",
});
export const uploadInput = style({
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clipPath: "inset(50%)",
});
export const uploadLabel = style({
  display: "inline-flex",
  minHeight: "4rem",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "1.6rem",
  borderRadius: vars.radius.cta,
  backgroundColor: vars.color.fillPrimary,
  color: vars.color.background,
  fontSize: "1.3rem",
  fontWeight: 600,
  cursor: "pointer",
  selectors: { "&:focus-within": focusRing },
});
export const reviewMockRow = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
  padding: "1.8rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  selectors: { "&:last-child": { borderBottom: 0 } },
});

export const trustPopup = style([dialogPopup, { width: "min(100%, 48rem)" }]);
export const trustStats = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1rem",
  paddingBlock: "1.6rem",
  borderBlock: `1px solid ${vars.color.strokeLight}`,
});
export const trustStat = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  color: vars.color.tertiary,
  fontSize: "1.2rem",
});
export const trustValue = style({ color: vars.color.primary, fontSize: "1.8rem", fontWeight: 700 });

globalStyle(`${roomTabs} a`, { textDecoration: "none" });
globalStyle(`${tailList} li::marker`, { content: "'└  '" });
