import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const desktopFilterMedia = "screen and (min-width: 1000px)";
const mobileFilters = "screen and (max-width: 999px)";

const focusRing = {
  outline: `2px solid ${vars.color.primary}`,
  outlineOffset: "2px",
} as const;

export const shell = style({
  width: "100%",
  maxWidth: "128rem",
  marginInline: "auto",
  padding: "4.8rem 3.2rem 10rem",
  "@media": {
    [mobileFilters]: { padding: "2.4rem 1.6rem 8rem" },
  },
});

export const discoveryLayout = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: vars.spacing.xl,
  "@media": {
    [desktopFilterMedia]: {
      gridTemplateColumns: "24.8rem minmax(0, 1fr)",
      gap: vars.spacing["2xl"],
    },
  },
});

export const desktopFilters = style({
  display: "none",
  "@media": {
    [desktopFilterMedia]: {
      position: "sticky",
      top: "8.8rem",
      display: "block",
      alignSelf: "start",
    },
  },
});

export const filterHeadingRow = style({
  display: "flex",
  minHeight: "4rem",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: vars.spacing.base,
});

export const filterHeading = style({
  fontSize: "2rem",
  fontWeight: 700,
  lineHeight: "2.8rem",
});

export const resetButton = style({
  display: "inline-flex",
  minHeight: "3.6rem",
  alignItems: "center",
  gap: "0.5rem",
  paddingInline: vars.spacing.sm,
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": focusRing,
  },
  "@media": {
    [media.hover]: {
      selectors: { "&:hover": { backgroundColor: vars.color.fillTertiary } },
    },
  },
});

export const filterFields = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xl,
});

export const filterSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const filterLabel = style({
  color: vars.color.secondary,
  fontSize: "1.4rem",
  fontWeight: 600,
  lineHeight: "2rem",
});

export const searchInputGroup = style({
  position: "relative",
  display: "flex",
  minHeight: "4.4rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: "0 1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  selectors: {
    "&:focus-within": {
      borderColor: vars.color.primary,
      outline: `1px solid ${vars.color.primary}`,
    },
  },
});

export const searchIcon = style({ flex: "0 0 auto", color: vars.color.tertiary });

export const searchInput = style({
  width: "100%",
  minWidth: 0,
  border: 0,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  lineHeight: "2rem",
  selectors: { "&::placeholder": { color: vars.color.tertiary } },
});

export const inputClearButton = style({
  display: "grid",
  width: "2.8rem",
  height: "2.8rem",
  flex: "0 0 auto",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.secondary,
  cursor: "pointer",
  placeItems: "center",
  selectors: { "&:focus-visible": focusRing },
});

export const comboboxPositioner = style({
  zIndex: 120,
  width: "var(--anchor-width)",
  minWidth: "min(28rem, calc(100vw - 3.2rem))",
});

export const comboboxPopup = style({
  maxHeight: "32rem",
  overflowY: "auto",
  padding: vars.spacing.sm,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});

export const comboboxStatus = style({
  padding: "0.8rem 1rem",
  color: vars.color.tertiary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const comboboxList = style({
  display: "flex",
  maxHeight: "27rem",
  flexDirection: "column",
  gap: "0.2rem",
  overflowY: "auto",
});

export const comboboxItem = style({
  display: "flex",
  minHeight: "4.8rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: "0.8rem",
  borderRadius: vars.radius.control,
  cursor: "pointer",
  selectors: {
    "&[data-highlighted]": { backgroundColor: vars.color.fillSecondary },
    "&[data-selected]": { fontWeight: 500 },
  },
});

export const comboboxIndicator = style({
  display: "inline-flex",
  width: "1.6rem",
  height: "1.6rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
});

export const resultKind = style({
  flex: "0 0 4.2rem",
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  textAlign: "center",
  whiteSpace: "nowrap",
});
export const resultCopy = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
});
export const resultName = style({
  overflow: "hidden",
  fontSize: "1.4rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
export const resultCompany = style({ color: vars.color.tertiary, fontSize: "1.2rem" });

export const filterDialogTrigger = style({
  display: "flex",
  width: "100%",
  minHeight: "4.4rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: "0 1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  textAlign: "left",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});

export const toggleGroup = style({ display: "flex", flexWrap: "wrap", gap: vars.spacing.sm });

export const filterToggle = style({
  minHeight: "3.8rem",
  padding: "0.8rem 1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.background,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  cursor: "pointer",
  selectors: {
    "&[data-pressed]": {
      borderColor: vars.color.primary,
      backgroundColor: vars.color.primary,
      color: vars.color.background,
    },
    "&:focus-visible": focusRing,
  },
});

export const selectTrigger = style({
  display: "inline-flex",
  width: "100%",
  minWidth: "13.6rem",
  minHeight: "4.4rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: "0 1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});

export const selectIcon = style({ display: "inline-flex", color: vars.color.tertiary });
export const selectPositioner = style({ zIndex: 130 });
export const selectPopup = style({
  minWidth: "var(--anchor-width)",
  maxHeight: "32rem",
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});
export const selectList = style({ maxHeight: "32rem", padding: "0.6rem", overflowY: "auto" });
export const selectItem = style({
  display: "flex",
  minHeight: "4.2rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  padding: "0.8rem 1rem",
  borderRadius: vars.radius.control,
  fontSize: "1.4rem",
  cursor: "pointer",
  selectors: { "&[data-highlighted]": { backgroundColor: vars.color.fillSecondary } },
});
export const selectIndicator = style({ display: "inline-flex", color: vars.color.primary });

export const sortSelect = style({
  width: "15.6rem",
  flex: "0 0 15.6rem",
});

export const mobileFilterButton = style({
  display: "inline-flex",
  width: "fit-content",
  minHeight: "4.4rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: "0 1.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  fontWeight: 600,
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
  "@media": { [desktopFilterMedia]: { display: "none" } },
});

export const filterCount = style({
  display: "grid",
  minWidth: "2rem",
  height: "2rem",
  paddingInline: "0.5rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.primary,
  color: vars.color.background,
  fontSize: "1.2rem",
  placeItems: "center",
});

export const mobileFilterBackdrop = style({
  position: "fixed",
  zIndex: 80,
  inset: 0,
  backgroundColor: vars.color.black50,
});

export const mobileFilterPopup = style({
  position: "fixed",
  zIndex: 81,
  inset: 0,
  display: "grid",
  width: "100%",
  height: "100dvh",
  gridTemplateRows: "auto minmax(0, 1fr) auto",
  backgroundColor: vars.color.background,
  color: vars.color.primary,
});

export const mobileFilterHeader = style({
  display: "flex",
  minHeight: "6.4rem",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.2rem 1.6rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const mobileFilterTitle = style({ fontSize: "2rem", fontWeight: 700 });
export const closeButton = style({
  display: "grid",
  width: "4rem",
  height: "4rem",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  placeItems: "center",
  selectors: { "&:focus-visible": focusRing },
});
export const mobileFilterBody = style({ padding: "2.4rem 1.6rem", overflowY: "auto" });
export const mobileFilterFooter = style({
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: vars.spacing.md,
  padding: "1.2rem 1.6rem max(1.2rem, env(safe-area-inset-bottom))",
  borderTop: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
});

export const results = style({ minWidth: 0 });
export const resultsHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  marginBottom: vars.spacing.base,
});
export const titleRow = style({ display: "flex", alignItems: "baseline", gap: vars.spacing.sm });
export const title = style({
  fontSize: "2.8rem",
  fontWeight: 700,
  lineHeight: "3.6rem",
  letterSpacing: "-0.03em",
});
export const totalCount = style({ color: vars.color.blue, fontSize: "1.5rem", fontWeight: 700 });

export const appliedFilters = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
  marginBottom: vars.spacing.xl,
});
export const appliedFilter = style({
  display: "inline-flex",
  minHeight: "3.4rem",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.6rem 1rem",
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.primary10,
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.3rem",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});

export const cardGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 28rem), 1fr))",
  gap: vars.spacing.base,
});

export const card = style({
  display: "flex",
  minWidth: 0,
  minHeight: "19rem",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  padding: "2.2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: "2rem",
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
  transition: `box-shadow ${vars.motion.duration.fast} ${vars.motion.ease.fade}, transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: { "&:focus-visible": focusRing },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover": { boxShadow: vars.shadow.cardRaiseHover, transform: "translateY(-2px)" },
      },
    },
    [media.reducedMotion]: { transition: "none" },
  },
});

export const cardBadgeRow = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
});
export const cardBadges = style({ display: "flex", flex: "0 0 auto", gap: "0.6rem" });
export const cardMetaBadge = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: "0.4rem",
  color: vars.color.tertiary,
  fontSize: "1.2rem",
  whiteSpace: "nowrap",
});
const statusBadgeBase = style({
  display: "inline-flex",
  minHeight: "2.6rem",
  alignItems: "center",
  padding: "0.4rem 0.8rem",
  borderRadius: vars.radius.pill,
  fontSize: "1.2rem",
  fontWeight: 700,
});
export const recruitingBadge = style([
  statusBadgeBase,
  { backgroundColor: vars.color.blue10, color: vars.color.blue },
]);
export const closedBadge = style([
  statusBadgeBase,
  { backgroundColor: vars.color.fillSecondary, color: vars.color.secondary },
]);
export const cardMain = style({ minWidth: 0 });
export const cardTitle = style({
  display: "-webkit-box",
  overflow: "hidden",
  fontSize: "1.9rem",
  fontWeight: 700,
  lineHeight: "2.6rem",
  letterSpacing: "-0.02em",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
});
export const cardDescription = style({
  marginTop: "0.6rem",
  overflow: "hidden",
  color: vars.color.secondary,
  fontSize: "1.4rem",
  lineHeight: "2rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
export const cardFooter = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  paddingTop: vars.spacing.md,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});
export const cardFooterItem = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  color: vars.color.tertiary,
  fontSize: "1.25rem",
  lineHeight: "1.8rem",
});

export const emptyState = style({
  display: "grid",
  minHeight: "32rem",
  padding: vars.spacing.xl,
  border: `1px dashed ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.media,
  placeContent: "center",
  textAlign: "center",
});
export const emptyTitle = style({ fontSize: "1.8rem", fontWeight: 700 });
export const emptyDescription = style({
  marginTop: vars.spacing.sm,
  color: vars.color.tertiary,
  fontSize: "1.4rem",
});
export const loadMoreSentinel = style({ height: "1px" });
export const paginationStatus = style({
  padding: "2.4rem",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  textAlign: "center",
});
export const paginationError = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.md,
  padding: "2.4rem",
  color: vars.color.secondary,
  fontSize: "1.4rem",
});
