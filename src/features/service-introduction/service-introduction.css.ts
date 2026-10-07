import { globalStyle, style } from "@vanilla-extract/css";
import { media, textMetrics, vars } from "@/styles";

// 소개 시안의 배치 전환점과 전용 치수는 이 화면 안에서만 유지한다.
const tablet = "screen and (max-width: 900px)";
const mobile = "screen and (max-width: 700px)";
const narrow = "screen and (max-width: 370px)";
const line = `1px solid ${vars.color.black8}`;

const heading = style({ lineHeight: 1.3, letterSpacing: "-0.045em" });

export const page = style({
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: textMetrics.body.fontSize,
  lineHeight: 1.6,
  wordBreak: "keep-all",
  overflowWrap: "anywhere",
});

// 문서 스크롤에만 적용하며 소개 페이지를 벗어나면 해제된다.
globalStyle(`html:has(${page})`, {
  scrollBehavior: "smooth",
  "@media": { [media.reducedMotion]: { scrollBehavior: "auto" } },
});

export const main = style({ scrollMarginTop: "8.8rem" });
export const wrap = style({
  width: `min(112rem, calc(100% - ${vars.spacing["2xl"]} * 2))`,
  marginInline: "auto",
  "@media": {
    [mobile]: { width: `calc(100% - ${vars.spacing.lg} * 2)` },
    [narrow]: { width: `calc(100% - ${vars.spacing.base} * 2)` },
  },
});
export const skipLink = style({
  position: "absolute",
  top: "-9rem",
  left: vars.spacing.lg,
  padding: vars.spacing.md,
  backgroundColor: vars.color.trueWhite,
  zIndex: 20,
  selectors: {
    "&:focus": { top: "1rem" },
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "3px" },
  },
});

const action = style({
  gap: "1.8rem",
  color: vars.color.trueWhite,
  fontWeight: 550,
  lineHeight: 1.4,
});
export const cta = style([
  action,
  {
    minHeight: "5.2rem",
    padding: `1.5rem ${vars.spacing.xl}`,
    fontSize: textMetrics.body.fontSize,
    "@media": {
      [mobile]: { fontSize: "1.5rem", minHeight: "5rem", padding: `1.4rem ${vars.spacing.lg}` },
    },
  },
]);
export const headerButton = style([
  action,
  {
    minHeight: vars.size.controlSm,
    padding: "1.1rem 1.7rem",
    fontSize: textMetrics.bodySm.fontSize,
    "@media": {
      [mobile]: {
        fontSize: textMetrics.metadata.fontSize,
        padding: "1rem 1.3rem",
        minHeight: "4rem",
        borderRadius: "1.2rem",
      },
    },
  },
]);
export const textLink = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.9rem",
  minHeight: "4.6rem",
  fontSize: "1.5rem",
  color: vars.color.secondary,
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "3px" },
  },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { color: vars.color.primary } } },
    [mobile]: { fontSize: textMetrics.bodySm.fontSize },
  },
});
export const hero = style({
  padding: "10.2rem 0 6.2rem",
  textAlign: "center",
  "@media": { [mobile]: { padding: "6.4rem 0 3.4rem" } },
});
export const eyebrow = style({
  fontSize: textMetrics.metadata.fontSize,
  fontWeight: 650,
  color: vars.color.secondary,
  marginBottom: "1.8rem",
});
export const sectionEyebrow = style([eyebrow, { marginBottom: vars.spacing.base }]);
export const inlineEyebrow = style([eyebrow, { marginBottom: 0 }]);
export const heroEyebrow = style([
  eyebrow,
  {
    display: "inline-block",
    paddingBlock: "0.6rem",
    marginBottom: "2.8rem",
    fontSize: textMetrics.bodySm.fontSize,
    fontWeight: 500,
    letterSpacing: "-0.02em",
    "@media": { [mobile]: { marginBottom: "2.3rem", fontSize: textMetrics.metadata.fontSize } },
  },
]);
export const heroTitle = style([
  heading,
  {
    fontSize: "clamp(3.8rem, 5.3vw, 6.8rem)",
    fontWeight: 750,
    marginBottom: "2.8rem",
    letterSpacing: "-0.055em",
    "@media": {
      [mobile]: { fontSize: "clamp(3.2rem, 7.8vw, 4.8rem)", marginBottom: "2.2rem" },
      [narrow]: { fontSize: "3rem" },
    },
  },
]);
export const heroSubtitle = style({
  display: "block",
  fontSize: "0.7em",
  fontWeight: 500,
  letterSpacing: "-0.045em",
  lineHeight: 1.4,
  marginBottom: "1rem",
  "@media": { [mobile]: { fontSize: "0.68em", marginBottom: "1.4rem" } },
});
export const lead = style({
  color: vars.color.secondary,
  fontSize: textMetrics.cardTitle.fontSize,
  lineHeight: 1.8,
  marginInline: "auto",
  maxWidth: "62rem",
  "@media": { [mobile]: { fontSize: "1.5rem", maxWidth: "36rem" } },
});
export const leadBreak = style({ "@media": { [narrow]: { display: "none" } } });
export const actions = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "2.6rem",
  flexWrap: "wrap",
  marginTop: "3rem",
  "@media": { [mobile]: { gap: `${vars.spacing.md} ${vars.spacing.lg}`, marginTop: "2.6rem" } },
});
export const heroPoints = style({
  marginTop: "6.5rem",
  paddingTop: "2.6rem",
  listStyle: "none",
  display: "flex",
  justifyContent: "center",
  gap: "5.6rem",
  borderTop: line,
  color: vars.color.secondary,
  fontSize: textMetrics.bodySm.fontSize,
  "@media": {
    [tablet]: { gap: "2.8rem" },
    [mobile]: {
      gap: "1rem",
      justifyContent: "space-between",
      marginTop: "4.4rem",
      paddingTop: "2.2rem",
      fontSize: "1.1rem",
      flexWrap: "wrap",
    },
    [narrow]: { flexDirection: "column", alignItems: "center" },
  },
});
export const heroPoint = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  "@media": { [mobile]: { gap: "0.5rem" } },
});
export const check = style({
  width: "1.9rem",
  height: "1.9rem",
  display: "inline-grid",
  placeItems: "center",
  backgroundColor: "#0000000b",
  color: vars.color.primary,
  fontSize: "1.2rem",
  borderRadius: vars.radius.pill,
  "@media": { [mobile]: { width: "1.5rem", height: "1.5rem", fontSize: "1rem" } },
});
export const section = style({
  paddingBlock: vars.spacing.section,
  scrollMarginTop: "8.8rem",
  "@media": { [mobile]: { paddingBlock: "5.6rem" } },
});
export const sectionHead = style({
  maxWidth: "73rem",
  marginBottom: "3.6rem",
  "@media": { [mobile]: { marginBottom: "2.8rem" } },
});
export const centeredHead = style([
  sectionHead,
  {
    marginInline: "auto",
    textAlign: "center",
    "@media": { [mobile]: { textAlign: "left" } },
  },
]);
export const sectionTitle = style([
  heading,
  {
    fontSize: "clamp(2.8rem, 3.4vw, 4.2rem)",
    fontWeight: 700,
    marginBottom: vars.spacing.base,
    "@media": { [mobile]: { fontSize: "2.9rem" } },
  },
]);
export const sectionDescription = style({
  color: vars.color.secondary,
  fontSize: textMetrics.body.fontSize,
  "@media": { [mobile]: { fontSize: "1.5rem" } },
});
export const pains = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: vars.spacing.lg,
  "@media": {
    [tablet]: { gap: "1.4rem" },
    [mobile]: { gridTemplateColumns: "1fr", gap: vars.spacing.base },
  },
});
export const pain = style({
  padding: "3rem",
  borderRadius: vars.radius.media,
  border: line,
  boxShadow: "0 4px 12px rgba(0,0,0,.04)",
  backgroundColor: vars.color.background,
  "@media": {
    [tablet]: { padding: vars.spacing.xl },
    [mobile]: { padding: "2.6rem", borderRadius: "2rem" },
  },
});
export const painLabel = style({
  color: vars.color.secondary,
  fontSize: "1.2rem",
  marginBottom: "2.2rem",
  display: "block",
  "@media": { [mobile]: { marginBottom: "1.3rem" } },
});
export const painTitle = style([
  heading,
  {
    fontSize: "2.2rem",
    fontWeight: 650,
    lineHeight: 1.45,
    marginBottom: "2.2rem",
    "@media": { [mobile]: { fontSize: "2.1rem", marginBottom: "1.8rem" } },
  },
]);
export const painAnswer = style({
  fontSize: "1.5rem",
  color: vars.color.secondary,
  borderTop: line,
  paddingTop: vars.spacing.lg,
  "@media": { [mobile]: { paddingTop: "1.7rem" } },
});
export const whiteSection = style([
  section,
  { backgroundColor: vars.color.trueWhite, borderBlock: "1px solid rgba(0,0,0,.035)" },
]);
export const steps = style({
  listStyle: "none",
  marginTop: vars.spacing["3xl"],
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  "@media": {
    [mobile]: { gridTemplateColumns: "1fr", marginTop: vars.spacing["2xl"], gap: "2.8rem" },
  },
});
export const step = style({
  display: "flex",
  minWidth: 0,
  position: "relative",
  selectors: {
    "&:not(:last-child)::after": {
      content: "'→'",
      flex: "1 0 4.8rem",
      alignSelf: "center",
      textAlign: "center",
      color: "#a3a3a3",
      fontSize: "2.3rem",
    },
  },
  "@media": {
    [tablet]: { selectors: { "&:not(:last-child)::after": { flexBasis: "3.4rem" } } },
    [mobile]: {
      display: "block",
      paddingLeft: "5.4rem",
      selectors: { "&:not(:last-child)::after": { display: "none" } },
    },
  },
});
export const stepContent = style({ minWidth: 0 });
export const stepTitle = style([
  heading,
  {
    fontSize: "2.2rem",
    fontWeight: 650,
    marginBottom: vars.spacing.md,
    "@media": { [mobile]: { fontSize: "2rem", marginBottom: vars.spacing.sm } },
  },
]);
export const stepDescription = style({ fontSize: "1.5rem", color: vars.color.secondary });
export const stepNumber = style({
  display: "inline-grid",
  placeItems: "center",
  width: "3.6rem",
  height: "3.6rem",
  border: "1px solid rgba(0,0,0,.15)",
  borderRadius: vars.radius.pill,
  fontSize: textMetrics.metadata.fontSize,
  fontWeight: 600,
  marginBottom: "2.2rem",
  "@media": {
    [mobile]: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "3.2rem",
      height: "3.2rem",
      fontSize: "1.2rem",
    },
  },
});
export const practice = style([
  wrap,
  {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "5.6rem",
    "@media": { [tablet]: { gap: "3rem" }, [mobile]: { display: "block" } },
  },
]);
export const practiceTitle = style([sectionTitle, { maxWidth: "64rem" }]);
export const practiceDescription = style({ maxWidth: "60rem", color: vars.color.secondary });
export const practiceSteps = style({
  display: "grid",
  gap: vars.spacing.md,
  minWidth: "28rem",
  listStyle: "none",
  "@media": { [tablet]: { minWidth: "22rem" }, [mobile]: { marginTop: vars.spacing.xl } },
});
export const practiceStep = style({
  display: "flex",
  alignItems: "center",
  gap: "1.8rem",
  paddingBlock: "1.5rem",
  borderBottom: line,
  fontSize: textMetrics.body.fontSize,
  fontWeight: 550,
});
export const practiceNumber = style({
  fontSize: "1.2rem",
  color: vars.color.secondary,
  fontWeight: 400,
});
export const faq = style([wrap, { maxWidth: "78rem" }]);
export const faqTitle = style([
  sectionTitle,
  {
    textAlign: "center",
    marginBottom: "3.4rem",
    "@media": { [mobile]: { textAlign: "left", marginBottom: vars.spacing.lg } },
  },
]);
export const faqItem = style({ borderBottom: `1px solid ${vars.color.black10}` });
export const faqTrigger = style({
  display: "flex",
  alignItems: "baseline",
  gap: vars.spacing.sm,
  width: "100%",
  border: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: "inherit",
  cursor: "pointer",
  paddingBlock: "2.2rem",
  fontSize: textMetrics.body.fontSize,
  fontWeight: 550,
  textAlign: "left",
  lineHeight: 1.6,
  letterSpacing: "normal",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "3px" },
  },
  "@media": { [mobile]: { fontSize: "1.5rem", paddingBlock: vars.spacing.lg } },
});
export const faqMarker = style({
  flexShrink: 0,
  fontSize: "1.2rem",
  selectors: { [`${faqTrigger}[data-panel-open] &`]: { transform: "rotate(90deg)" } },
});
export const faqPanel = style({
  fontSize: "1.5rem",
  color: vars.color.secondary,
  paddingBottom: vars.spacing.base,
});
export const closing = style({
  textAlign: "center",
  padding: "8.4rem 0 8.8rem",
  "@media": { [mobile]: { paddingBlock: vars.spacing.sectionSm } },
});
export const closingTitle = style([
  heading,
  {
    fontSize: "clamp(2.8rem, 3.5vw, 4.4rem)",
    fontWeight: 700,
    marginBottom: "1.4rem",
    "@media": { [mobile]: { fontSize: "2.9rem" } },
  },
]);
export const closingActions = style([
  actions,
  { marginTop: "2.8rem", "@media": { [mobile]: { marginTop: "2.8rem" } } },
]);
export const footer = style({
  borderTop: line,
  paddingBlock: "2.5rem",
  fontSize: "1.2rem",
  color: vars.color.secondary,
});
export const footerRow = style([
  wrap,
  {
    display: "flex",
    justifyContent: "space-between",
    gap: vars.spacing.lg,
    flexWrap: "wrap",
    "@media": { [mobile]: { gap: vars.spacing.md } },
  },
]);
export const footerBrand = style({
  fontWeight: 600,
  color: vars.color.primary,
  marginRight: "1rem",
});
