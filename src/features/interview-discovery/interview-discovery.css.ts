import { style } from "@vanilla-extract/css";
import { media, vars, textMetrics } from "@/styles";

const desktopFilterMedia = "screen and (min-width: 1000px)";

const focusRing = {
  outline: `2px solid ${vars.color.primary}`,
  outlineOffset: "2px",
} as const;

export const shell = style({
  width: "100%",
  maxWidth: `calc(${vars.layout.maxWidth} + 2 * ${vars.layout.sidePadding})`,
  marginInline: "auto",
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
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
      top: `calc(${vars.size.header} + ${vars.spacing.xl})`,
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
  ...textMetrics.sectionTitle,
  fontWeight: 700,
});

export const resetButton = style({
  display: "inline-flex",
  minHeight: vars.size.controlSm,
  alignItems: "center",
  gap: vars.spacing.xs,
  paddingInline: vars.spacing.sm,
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  ...textMetrics.metadata,
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
  gap: vars.spacing.lg,
});

export const filterSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const filterLabel = style({
  color: vars.color.secondary,
  ...textMetrics.bodySm,
  fontWeight: 600,
});

export const searchInputGroup = style({
  position: "relative",
  display: "flex",
  minHeight: "4.4rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: `0 ${vars.spacing.md}`,
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
  ...textMetrics.body,

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
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const comboboxList = style({
  display: "flex",
  maxHeight: "27rem",
  flexDirection: "column",
  gap: vars.spacing.xs,
  overflowY: "auto",
});

export const comboboxItem = style({
  display: "flex",
  minHeight: "4.8rem",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: vars.spacing.sm,
  borderRadius: vars.radius.control,
  cursor: "pointer",
  selectors: {
    "&[data-highlighted]": { backgroundColor: vars.color.fillSecondary },
    "&[data-selected]": { fontWeight: 500 },
  },
});

export const comboboxIndicator = style({
  display: "inline-flex",
  width: vars.size.iconSm,
  height: vars.size.iconSm,
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
});

export const resultKind = style({
  flex: "0 0 4.2rem",
  color: vars.color.tertiary,
  ...textMetrics.metadata,
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
  ...textMetrics.bodySm,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
export const resultCompany = style({ color: vars.color.tertiary, ...textMetrics.metadata });

export const filterDialogTrigger = style({
  display: "flex",
  width: "100%",
  minHeight: vars.size.controlSm,
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: `0 ${vars.spacing.md}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  ...textMetrics.bodySm,
  textAlign: "left",
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
});

export const toggleGroup = style({ display: "flex", flexWrap: "wrap", gap: vars.spacing.sm });

export const filterToggle = style({
  minHeight: vars.size.controlSm,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.background,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  ...textMetrics.metadata,
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
  minHeight: vars.size.controlSm,
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: `0 ${vars.spacing.md}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.secondary,
  fontFamily: vars.font.sans,
  ...textMetrics.bodySm,
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
export const selectList = style({
  maxHeight: "32rem",
  padding: vars.spacing.sm,
  overflowY: "auto",
});
export const selectItem = style({
  display: "flex",
  minHeight: "4.2rem",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  borderRadius: vars.radius.control,
  ...textMetrics.bodySm,
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
  minHeight: vars.size.controlSm,
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: `0 ${vars.spacing.base}`,
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  ...textMetrics.bodySm,
  fontWeight: 600,
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
  "@media": { [desktopFilterMedia]: { display: "none" } },
});

export const filterCount = style({
  display: "grid",
  minWidth: "2rem",
  height: "2rem",
  paddingInline: vars.spacing.xs,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.primary,
  color: vars.color.background,
  ...textMetrics.metadata,
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
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  paddingRight: "6.4rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const mobileFilterTitle = style({ ...textMetrics.sectionTitle, fontWeight: 700 });

export const mobileFilterBody = style({
  padding: `${vars.spacing.xl} ${vars.spacing.base}`,
  overflowY: "auto",
});
export const mobileFilterFooter = style({
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: vars.spacing.md,
  padding: "1.2rem 1.6rem max(1.2rem, env(safe-area-inset-bottom))",
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
  ...textMetrics.pageTitle,
  fontWeight: 700,

  letterSpacing: "-0.03em",
});
export const totalCount = style({ color: vars.color.blue, ...textMetrics.body, fontWeight: 700 });

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
  gap: vars.spacing.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.primary10,
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  ...textMetrics.metadata,
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
  padding: vars.layout.cardPadding,
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
export const cardBadges = style({ display: "flex", flex: "0 0 auto", gap: vars.spacing.sm });
export const cardMetaBadge = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing.xs,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
  whiteSpace: "nowrap",
});
const statusBadgeBase = style({
  display: "inline-flex",
  minHeight: "2.6rem",
  alignItems: "center",
  padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
  borderRadius: vars.radius.pill,
  ...textMetrics.metadata,
  fontWeight: 500,
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
  minHeight: "2lh",
  display: "-webkit-box",
  overflow: "hidden",
  ...textMetrics.cardTitle,
  fontWeight: 700,

  letterSpacing: "-0.02em",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
});
export const cardDescription = style({
  marginTop: vars.spacing.sm,
  overflow: "hidden",
  color: vars.color.secondary,
  ...textMetrics.bodySm,

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
  gap: vars.spacing.xs,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
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
export const emptyTitle = style({ ...textMetrics.cardTitle, fontWeight: 700 });
export const emptyDescription = style({
  marginTop: vars.spacing.sm,
  color: vars.color.tertiary,
  ...textMetrics.bodySm,
});
export const loadMoreSentinel = style({ height: "1px" });
export const paginationStatus = style({
  padding: vars.spacing.xl,
  color: vars.color.tertiary,
  ...textMetrics.bodySm,
  textAlign: "center",
});
export const paginationError = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.md,
  padding: vars.spacing.xl,
  color: vars.color.secondary,
  ...textMetrics.bodySm,
});
