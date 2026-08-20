import { globalStyle, style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const focusRing = {
  outline: `2px solid ${vars.color.primary}`,
  outlineOffset: "2px",
} as const;

const control = {
  minHeight: "4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  lineHeight: "2rem",
} as const;

export const page = style({
  width: "100%",
  flex: "1 1 auto",
  padding: "3.6rem 1.6rem 8rem",
  "@media": {
    [media.md]: { paddingInline: "3.2rem" },
    [media.lg]: { paddingInline: "6.4rem" },
  },
});

export const exploreLayout = style({
  display: "grid",
  width: "100%",
  maxWidth: "132rem",
  marginInline: "auto",
  alignItems: "start",
  gap: "3.6rem",
  "@media": {
    [media.lg]: { gridTemplateColumns: "24.8rem minmax(0, 1fr)" },
  },
});

export const sidebar = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "2.4rem",
  padding: "2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
  "@media": {
    [media.lg]: { position: "sticky", top: "8.4rem" },
  },
});

export const filterSection = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "1rem",
  border: 0,
});

export const filterLabel = style({
  color: vars.color.primary,
  fontSize: "1.3rem",
  fontWeight: 700,
  lineHeight: "1.7rem",
});

export const companyForm = style({ display: "flex", gap: "0.8rem" });

export const searchInput = style({
  ...control,
  width: "100%",
  minWidth: 0,
  paddingInline: "1.2rem",
  selectors: {
    "&::placeholder": { color: vars.color.tertiary, opacity: 1 },
    "&:focus-visible": focusRing,
  },
});

export const searchButton = style({
  ...control,
  display: "grid",
  width: "4rem",
  flex: "0 0 4rem",
  padding: 0,
  cursor: "pointer",
  placeItems: "center",
  selectors: { "&:focus-visible": focusRing },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { backgroundColor: vars.color.fillTertiary } } },
  },
});

export const choiceGroup = style({ display: "flex", flexWrap: "wrap", gap: "0.6rem" });

export const choicePill = style({
  display: "inline-flex",
  minHeight: "3.4rem",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.7rem 1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  fontWeight: 500,
  lineHeight: "1.8rem",
  cursor: "pointer",
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, color ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-pressed]": {
      borderColor: vars.color.fillPrimary,
      backgroundColor: vars.color.fillPrimary,
      color: vars.color.background,
    },
    "&:focus-visible": focusRing,
  },
  "@media": {
    [media.hover]: {
      selectors: { "&:hover:not([data-pressed])": { backgroundColor: vars.color.fillTertiary } },
    },
    [media.reducedMotion]: { transition: "none" },
  },
});

export const methodGroup = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  padding: "0.3rem",
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.fillSecondary,
});

export const methodChoice = style({
  minHeight: "3.4rem",
  paddingInline: "0.6rem",
  border: 0,
  borderRadius: "0.6rem",
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.2rem",
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&[data-pressed]": {
      backgroundColor: vars.color.background,
      color: vars.color.primary,
      boxShadow: vars.shadow.cardRaise,
    },
    "&:focus-visible": focusRing,
  },
});

export const selectTrigger = style({
  ...control,
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  paddingInline: "1.2rem",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});

export const selectValue = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
export const selectIcon = style({ display: "inline-flex", color: vars.color.tertiary });
export const selectPositioner = style({ zIndex: 40, width: "var(--anchor-width)" });
export const selectPopup = style({
  padding: "0.6rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.tooltip,
});
export const selectList = style({ display: "flex", flexDirection: "column", gap: "0.2rem" });
export const selectItem = style({
  display: "flex",
  minHeight: "3.8rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  paddingInline: "1rem",
  borderRadius: "0.6rem",
  color: vars.color.secondary,
  fontSize: "1.3rem",
  cursor: "pointer",
  selectors: {
    "&[data-highlighted]": { backgroundColor: vars.color.fillSecondary },
    "&[data-selected]": { color: vars.color.primary, fontWeight: 600 },
  },
});

export const resetFilters = style({
  display: "inline-flex",
  minHeight: "3.6rem",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.6rem",
  padding: 0,
  border: 0,
  borderTop: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});

export const results = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "2rem",
});
export const resultsHead = style({
  display: "flex",
  minHeight: "4rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.6rem",
});
export const resultsTitle = style({
  color: vars.color.primary,
  fontSize: "2.4rem",
  fontWeight: 300,
  lineHeight: "3rem",
  letterSpacing: "-0.02em",
});
export const resultCount = style({ fontWeight: 600 });
export const sortSelect = style({ width: "16rem", flex: "0 0 auto" });

export const appliedFilters = style({ display: "flex", flexWrap: "wrap", gap: "0.8rem" });
export const appliedFilter = style({
  display: "inline-flex",
  minHeight: "3.2rem",
  alignItems: "center",
  gap: "0.5rem",
  paddingInline: "1.1rem",
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.25rem",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});

export const cardGrid = style({
  display: "grid",
  width: "100%",
  minWidth: 0,
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 28rem), 1fr))",
  gap: "1.6rem",
});

export const card = style({
  display: "flex",
  minWidth: 0,
  minHeight: "17.4rem",
  flexDirection: "column",
  gap: "1.2rem",
  padding: "1.8rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
  transition: `border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, box-shadow ${vars.motion.duration.fast} ${vars.motion.ease.fade}, transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: { "&:focus-visible": focusRing },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover": {
          borderColor: vars.color.strokeMedium,
          boxShadow: vars.shadow.cardRaise,
          transform: "translateY(-2px)",
        },
      },
    },
    [media.reducedMotion]: { transition: "none" },
  },
});

export const cardMeta = style({ display: "flex", alignItems: "center", gap: "0.6rem" });
export const cardMetaText = style({
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});
export const statusBadge = style({
  display: "inline-flex",
  minHeight: "2.4rem",
  alignItems: "center",
  marginInlineStart: "auto",
  paddingInline: "0.9rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillPrimary,
  color: vars.color.background,
  fontSize: "1.1rem",
  fontWeight: 700,
  lineHeight: "1.4rem",
});
export const closingBadge = style({
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
});
export const leadingStatusBadge = style({ alignSelf: "flex-start", marginInlineStart: 0 });
export const relationBadge = style({
  display: "inline-flex",
  alignItems: "center",
  alignSelf: "flex-start",
  padding: "0.3rem 0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: "1.4rem",
});
export const cardTitle = style({
  display: "-webkit-box",
  overflow: "clip",
  color: vars.color.primary,
  fontSize: "1.7rem",
  fontWeight: 600,
  lineHeight: "2.3rem",
  letterSpacing: "-0.02em",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
});
export const cardCompany = style({
  color: vars.color.secondary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});
export const cardFoot = style({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: "1rem",
  marginBlockStart: "auto",
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  lineHeight: "1.7rem",
});
export const cardSchedule = style({ display: "flex", minWidth: 0, flexDirection: "column" });
export const participantCount = style({
  flex: "0 0 auto",
  color: vars.color.secondary,
  fontWeight: 600,
});

export const emptyState = style({
  display: "flex",
  minHeight: "30rem",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  padding: "4rem 2rem",
  border: `1px dashed ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.floating,
  textAlign: "center",
});
export const emptyTitle = style({ fontSize: "2rem", fontWeight: 500, lineHeight: "2.6rem" });
export const emptyDescription = style({
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "2rem",
});
export const emptyActions = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "0.8rem",
  marginTop: "1rem",
});
export const recommendation = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.4rem",
  marginTop: "1.2rem",
});
export const sectionTitle = style({ fontSize: "1.8rem", fontWeight: 600, lineHeight: "2.4rem" });

export const detailPage = style([page, { paddingBottom: "13rem" }]);
export const detail = style({
  display: "flex",
  width: "100%",
  maxWidth: "104rem",
  marginInline: "auto",
  flexDirection: "column",
  gap: "2.4rem",
});
export const backLink = style({
  display: "inline-flex",
  alignSelf: "flex-start",
  alignItems: "center",
  gap: "0.6rem",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  selectors: { "&:focus-visible": focusRing },
});
export const detailHero = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  paddingBlock: "1.2rem",
});
export const detailTitle = style({
  maxWidth: "76rem",
  fontSize: "3.2rem",
  fontWeight: 300,
  lineHeight: "4rem",
  letterSpacing: "-0.03em",
  "@media": { [media.md]: { fontSize: "4rem", lineHeight: "4.8rem" } },
});
export const detailSubcopy = style({
  color: vars.color.secondary,
  fontSize: "1.5rem",
  lineHeight: "2.2rem",
});
export const avatarStack = style({ display: "flex", alignItems: "center", marginTop: "0.6rem" });
export const smallAvatar = style({
  display: "grid",
  width: "3.4rem",
  height: "3.4rem",
  marginInlineStart: "-0.6rem",
  border: `2px solid ${vars.color.background}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.blue10,
  color: vars.color.blue,
  fontSize: "1.2rem",
  fontWeight: 700,
  placeItems: "center",
  selectors: { "&:first-child": { marginInlineStart: 0 } },
});
export const informationGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
  borderBlock: `1px solid ${vars.color.strokeLight}`,
});
export const informationItem = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  padding: "2rem",
});
export const informationLabel = style({
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});
export const informationValue = style({
  fontSize: "1.5rem",
  fontWeight: 600,
  lineHeight: "2.1rem",
});
export const progressTrack = style({
  width: "100%",
  height: "0.4rem",
  marginTop: "0.6rem",
  overflow: "clip",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
});
export const progressValue = style({
  height: "100%",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillPrimary,
});
export const detailColumns = style({
  display: "grid",
  gap: "2.4rem",
  "@media": { [media.lg]: { gridTemplateColumns: "minmax(0, 1fr) 32rem" } },
});
export const detailBody = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "2.8rem",
});
export const detailSection = style({ display: "flex", flexDirection: "column", gap: "1rem" });
export const detailCopy = style({
  color: vars.color.secondary,
  fontSize: "1.5rem",
  lineHeight: "2.4rem",
  whiteSpace: "pre-line",
});
export const noteList = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
  paddingInlineStart: "2rem",
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: "2.1rem",
});
export const hostCard = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.4rem",
  padding: "2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
});
export const hostHead = style({ display: "flex", alignItems: "center", gap: "1rem" });
export const hostAvatar = style({
  display: "grid",
  width: "4rem",
  height: "4rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontWeight: 700,
  placeItems: "center",
});
export const hostName = style({
  display: "flex",
  flexDirection: "column",
  fontSize: "1.4rem",
  fontWeight: 600,
});
export const hostStat = style({ color: vars.color.tertiary, fontSize: "1.2rem", fontWeight: 400 });
export const reviewTags = style({ display: "flex", flexWrap: "wrap", gap: "0.6rem" });
export const reviewTag = style({
  padding: "0.5rem 0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.1rem",
});

export const actionBar = style({
  position: "fixed",
  right: "1.6rem",
  bottom: "max(1.6rem, env(safe-area-inset-bottom))",
  left: "1.6rem",
  zIndex: 20,
  display: "flex",
  maxWidth: "88rem",
  minHeight: "7.2rem",
  marginInline: "auto",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.6rem",
  padding: "1.2rem 1.4rem 1.2rem 2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardSoft,
  "@media": {
    "screen and (max-width: 599px)": {
      alignItems: "stretch",
      flexDirection: "column",
      padding: "1.4rem",
    },
  },
});
export const actionCopy = style({ display: "flex", minWidth: 0, flexDirection: "column" });
export const actionTitle = style({ fontSize: "1.4rem", fontWeight: 600, lineHeight: "2rem" });
export const actionDescription = style({
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  lineHeight: "1.7rem",
});

export const narrowPage = style([page, { paddingTop: "4.4rem" }]);
export const formColumn = style({
  display: "flex",
  width: "100%",
  maxWidth: "68rem",
  marginInline: "auto",
  flexDirection: "column",
  gap: "2rem",
});
export const pageHeading = style({ display: "flex", flexDirection: "column", gap: "0.6rem" });
export const pageTitle = style({
  fontSize: "3rem",
  fontWeight: 300,
  lineHeight: "3.8rem",
  letterSpacing: "-0.03em",
});
export const pageDescription = style({
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "2rem",
});
export const summaryCard = style({
  display: "flex",
  alignItems: "center",
  gap: "1.4rem",
  padding: "1.4rem 1.8rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
});
export const summaryIcon = style({
  display: "grid",
  width: "3.8rem",
  height: "3.8rem",
  flex: "0 0 3.8rem",
  borderRadius: "1.1rem",
  backgroundColor: vars.color.blue10,
  color: vars.color.blue,
  fontWeight: 700,
  placeItems: "center",
});
export const summaryCopy = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
});
export const summaryTitle = style({
  overflow: "hidden",
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: "1.9rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
export const summaryMeta = style({
  color: vars.color.tertiary,
  fontSize: "1.15rem",
  lineHeight: "1.6rem",
});
export const textLink = style({
  color: vars.color.secondary,
  fontSize: "1.2rem",
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
  selectors: { "&:focus-visible": focusRing },
});
export const formCard = style({
  display: "flex",
  flexDirection: "column",
  gap: "2.4rem",
  padding: "2.4rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: "2rem",
  backgroundColor: vars.color.background,
});
export const field = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "0.8rem",
});
export const fieldLabel = style({
  display: "flex",
  alignItems: "baseline",
  gap: "0.8rem",
  fontSize: "1.3rem",
  fontWeight: 700,
  lineHeight: "1.7rem",
});
export const optional = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1.05rem",
  fontWeight: 400,
});
export const fieldError = style({
  color: vars.color.red,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});
export const resumeRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.2rem",
  padding: "1.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
});
export const resumeFile = style({ display: "flex", minWidth: 0, flexDirection: "column" });
export const resumeName = style({
  overflow: "hidden",
  fontSize: "1.4rem",
  fontWeight: 600,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
export const resumeStatus = style({ color: vars.color.tertiary, fontSize: "1.15rem" });
export const summaryBox = style({
  padding: "1.4rem",
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.fillTertiary,
  color: vars.color.secondary,
  fontSize: "1.35rem",
  lineHeight: "2rem",
});
export const textarea = style({
  ...control,
  width: "100%",
  minHeight: "10rem",
  padding: "1.2rem 1.4rem",
  resize: "vertical",
  selectors: {
    "&::placeholder": { color: vars.color.tertiary, opacity: 1 },
    "&:focus-visible": focusRing,
  },
});
export const formActions = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.8rem",
  paddingTop: "0.4rem",
});
export const formActionsSplit = style({ justifyContent: "space-between" });

export const dialogBackdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 50,
  backgroundColor: "rgba(2, 2, 4, 0.42)",
});
export const dialogPopup = style({
  position: "fixed",
  top: "50%",
  left: "50%",
  zIndex: 51,
  display: "flex",
  width: "48rem",
  maxWidth: "calc(100% - 3.2rem)",
  maxHeight: "calc(100dvh - 3.2rem)",
  flexDirection: "column",
  gap: "1.6rem",
  padding: "2.4rem",
  overflowY: "auto",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardSoft,
  transform: "translate(-50%, -50%)",
});
export const dialogTitle = style({ fontSize: "2rem", fontWeight: 500, lineHeight: "2.6rem" });
export const resumeOptions = style({ display: "flex", flexDirection: "column", gap: "0.8rem" });
export const resumeOption = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "1rem",
  padding: "1.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  cursor: "pointer",
  selectors: {
    "&[data-checked]": {
      borderColor: vars.color.primary,
      backgroundColor: vars.color.fillTertiary,
    },
    "&:focus-visible": focusRing,
  },
});
export const radioIndicator = style({
  display: "grid",
  width: "1.8rem",
  height: "1.8rem",
  flex: "0 0 1.8rem",
  marginTop: "0.1rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  placeItems: "center",
  selectors: { [`${resumeOption}[data-checked] &`]: { borderColor: vars.color.primary } },
});
export const radioDot = style({
  width: "0.8rem",
  height: "0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillPrimary,
});

export const myInterviewColumn = style({
  display: "flex",
  width: "100%",
  maxWidth: "88rem",
  marginInline: "auto",
  flexDirection: "column",
  gap: "2rem",
});
export const tabsList = style({
  display: "flex",
  gap: "2.4rem",
  overflowX: "auto",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const tab = style({
  position: "relative",
  minHeight: "4.6rem",
  paddingInline: "0.2rem",
  border: 0,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  cursor: "pointer",
  whiteSpace: "nowrap",
  selectors: {
    "&[data-selected]": { color: vars.color.primary, fontWeight: 600 },
    "&[data-selected]::after": {
      position: "absolute",
      right: 0,
      bottom: 0,
      left: 0,
      height: "0.2rem",
      backgroundColor: vars.color.primary,
      content: "",
    },
    "&:focus-visible": focusRing,
  },
});
export const tabPanel = style({ display: "flex", flexDirection: "column", gap: "2.8rem" });
export const interviewGroup = style({ display: "flex", flexDirection: "column", gap: "1rem" });
export const groupTitle = style({
  color: vars.color.secondary,
  fontSize: "1.3rem",
  fontWeight: 600,
  lineHeight: "1.8rem",
});
export const myInterviewCard = style({
  display: "flex",
  alignItems: "center",
  gap: "1.4rem",
  padding: "1.8rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
  "@media": { "screen and (max-width: 699px)": { alignItems: "stretch", flexDirection: "column" } },
});
export const myInterviewMain = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: "0.3rem",
});
export const myInterviewActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.8rem",
  justifyContent: "flex-end",
});
export const stateBadge = style({
  display: "inline-flex",
  alignSelf: "flex-start",
  padding: "0.4rem 0.9rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontSize: "1.05rem",
  fontWeight: 700,
});
export const confirmedBadge = style({ backgroundColor: vars.color.blue10, color: vars.color.blue });
export const completedBadge = style({
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
});
export const inlineMeta = style({
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  lineHeight: "1.7rem",
});
export const emptyGroup = style({
  padding: "3.2rem",
  border: `1px dashed ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.floating,
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  textAlign: "center",
});

export const sessionHeader = style({
  display: "flex",
  width: "100%",
  maxWidth: "104rem",
  marginInline: "auto",
  flexDirection: "column",
  gap: "1rem",
  paddingBottom: "2rem",
});
export const sessionMeta = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  color: vars.color.tertiary,
  fontSize: "1.2rem",
});
export const sessionTitle = style({ fontSize: "2.4rem", fontWeight: 300, lineHeight: "3rem" });
export const sessionTabs = style({
  display: "flex",
  gap: "2.8rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const sessionTab = style({
  minHeight: "4.6rem",
  padding: "1.2rem 0.2rem",
  color: vars.color.tertiary,
  fontSize: "1.3rem",
});
export const sessionTabActive = style({
  borderBottom: `2px solid ${vars.color.primary}`,
  color: vars.color.primary,
  fontWeight: 600,
});
export const commentsColumn = style({
  display: "flex",
  width: "100%",
  maxWidth: "89.6rem",
  marginInline: "auto",
  flexDirection: "column",
  gap: "0.8rem",
});
export const composer = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.4rem",
  padding: "1.8rem 2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.floating,
});
export const composerTextarea = style({
  width: "100%",
  minHeight: "5rem",
  padding: 0,
  border: 0,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  lineHeight: "2rem",
  resize: "vertical",
  selectors: { "&::placeholder": { color: vars.color.tertiary, opacity: 1 } },
});
export const composerFoot = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.2rem",
});
export const helper = style({
  color: vars.color.tertiary,
  fontSize: "1.1rem",
  lineHeight: "1.6rem",
});
export const commentList = style({ display: "flex", flexDirection: "column" });
export const commentRow = style({
  display: "flex",
  gap: "1.4rem",
  padding: "2rem 0.4rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const commentAvatar = style({
  display: "grid",
  width: "3.6rem",
  height: "3.6rem",
  flex: "0 0 3.6rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  fontSize: "1.2rem",
  placeItems: "center",
});
export const commentContent = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: "0.5rem",
});
export const commentHead = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: "0.8rem",
});
export const commentAuthor = style({ fontSize: "1.35rem", fontWeight: 600, lineHeight: "1.7rem" });
export const commentBadge = style({
  padding: "0.2rem 0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontSize: "1rem",
  fontWeight: 700,
});
export const mineBadge = style({ backgroundColor: vars.color.blue10, color: vars.color.blue });
export const commentTime = style({ color: vars.color.tertiary, fontSize: "1.1rem" });
export const deleteComment = style({
  marginInlineStart: "auto",
  padding: 0,
  border: 0,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.1rem",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});
export const commentCopy = style({
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: "2.2rem",
});
export const readonlyNotice = style({
  padding: "1.6rem",
  border: `1px dashed ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.floating,
  color: vars.color.tertiary,
  fontSize: "1.35rem",
  textAlign: "center",
});
export const systemNotice = style({
  alignSelf: "center",
  padding: "0.6rem 1.4rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.tertiary,
  fontSize: "1.1rem",
});

export const reviewList = style({
  display: "flex",
  flexDirection: "column",
  padding: "0.6rem 2.4rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: "2rem",
});
export const reviewRow = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.6rem",
  paddingBlock: "1.6rem",
  borderTop: `1px solid ${vars.color.strokeLight}`,
  selectors: { "&:first-child": { borderTop: 0 } },
});
export const reviewPerson = style({ display: "flex", alignItems: "center", gap: "1.4rem" });
export const reviewPersonCopy = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
});
export const reviewForm = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.8rem",
  paddingInlineStart: "5.4rem",
  "@media": { "screen and (max-width: 599px)": { paddingInlineStart: 0 } },
});
export const reviewChoice = style({
  selectors: {
    "&[data-pressed]": {
      borderColor: vars.color.primary,
      backgroundColor: vars.color.blue10,
      color: vars.color.primary,
    },
  },
});
export const reviewSubmitted = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  color: vars.color.secondary,
  fontSize: "1.2rem",
});
export const reviewSummary = style({
  color: vars.color.tertiary,
  fontSize: "1.15rem",
  lineHeight: "1.6rem",
});

globalStyle(`${card} strong`, { fontWeight: 600 });
