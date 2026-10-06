import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { media, textMetrics, textStyle, vars } from "@/styles";
import { SCENE_DURATION_MS } from "./hero-demo-timing";

const focusRing = {
  outline: `2px solid ${vars.color.primary}`,
  outlineOffset: "2px",
} as const;

const fadeUp = keyframes({
  from: { opacity: 0, transform: "translateY(0.8rem)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const fillHorizontal = keyframes({
  from: { transform: "scaleX(0)" },
  to: { transform: "scaleX(1)" },
});

const fillVertical = keyframes({
  from: { transform: "scaleY(0)" },
  to: { transform: "scaleY(1)" },
});

const transition = (...properties: string[]) =>
  properties
    .map((property) => `${property} ${vars.motion.duration.slow} ${vars.motion.ease.out}`)
    .join(", ");

export const layout = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  alignItems: "center",
  gap: vars.spacing.xl,
  "@media": {
    [media.lg]: {
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
      gap: vars.spacing["3xl"],
    },
  },
});

export const side = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xl,
});

export const stepList = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: vars.spacing.sm,
  margin: 0,
  padding: 0,
  listStyle: "none",
  "@media": {
    [media.lg]: { gridTemplateColumns: "minmax(0, 1fr)", gap: vars.spacing.xs },
  },
});

export const stepButton = style({
  position: "relative",
  display: "flex",
  width: "100%",
  flexDirection: "column",
  gap: vars.spacing.xs,
  padding: 0,
  border: 0,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    '&[aria-current="step"]': { color: vars.color.primary },
    "&:focus-visible": focusRing,
  },
  "@media": {
    [media.lg]: {
      display: "grid",
      gridTemplateColumns: "0.3rem minmax(0, 1fr)",
      gridTemplateRows: "auto auto",
      columnGap: vars.spacing.base,
      rowGap: 0,
      padding: `${vars.spacing.xs} 0`,
    },
  },
});

export const stepTrack = style({
  position: "relative",
  display: "block",
  height: "0.3rem",
  overflow: "hidden",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  selectors: {
    [`${stepButton}[data-done] &`]: { backgroundColor: vars.color.quaternary },
  },
  "@media": {
    [media.lg]: { gridRow: "1 / span 2", height: "auto" },
  },
});

export const stepFill = style({
  position: "absolute",
  inset: 0,
  backgroundColor: vars.color.primary,
  transformOrigin: "left center",
  animation: `${fillHorizontal} ${SCENE_DURATION_MS}ms linear forwards`,
  selectors: {
    "&[data-paused]": { animationPlayState: "paused" },
  },
  "@media": {
    [media.lg]: {
      transformOrigin: "center top",
      animationName: fillVertical,
    },
    [media.reducedMotion]: { animation: "none" },
  },
});

export const stepLabel = style([
  textStyle.bodySm,
  {
    display: "inline-flex",
    alignItems: "baseline",
    gap: vars.spacing.xs,
    fontWeight: 600,
    whiteSpace: "nowrap",
    "@media": {
      [media.lg]: { fontSize: "1.8rem", lineHeight: "2.7rem" },
    },
  },
]);

export const stepNumber = style({
  display: "none",
  fontFamily: vars.font.mono,
  ...textMetrics.metadata,
  fontWeight: 400,
  color: vars.color.tertiary,
  "@media": {
    [media.lg]: { display: "inline" },
  },
});

// 화면에는 현재 단계 설명만 보이지만 화면 낭독기는 모든 단계 설명을 읽는다.
export const stepDescription = style([
  textStyle.bodySm,
  {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    color: vars.color.secondary,
    wordBreak: "keep-all",
    "@media": {
      [media.lg]: {
        selectors: {
          [`${stepButton}[aria-current="step"] &`]: {
            position: "static",
            width: "auto",
            height: "auto",
            overflow: "visible",
            clipPath: "none",
            whiteSpace: "normal",
            paddingBottom: vars.spacing.sm,
          },
        },
      },
    },
  },
]);

export const demoWindow = style({
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.trueWhite,
  boxShadow: `${vars.shadow.cardSoft}, 0 0 0 1px ${vars.color.strokeLight}`,
});

export const windowBar = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});

export const windowDots = style({
  display: "flex",
  gap: "0.6rem",
});

export const windowDot = style({
  width: "0.8rem",
  height: "0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
});

export const windowTitle = style([
  textStyle.metadata,
  { flex: "1 1 auto", color: vars.color.secondary, fontWeight: 500 },
]);

export const windowBadge = style([
  textStyle.metadata,
  {
    padding: `0.2rem ${vars.spacing.sm}`,
    borderRadius: vars.radius.pill,
    backgroundColor: vars.color.fillTertiary,
    color: vars.color.tertiary,
  },
]);

export const windowBody = style({
  height: "25rem",
  overflow: "hidden",
  padding: vars.spacing.base,
  animation: `${fadeUp} ${vars.motion.duration.slow} ${vars.motion.ease.out}`,
  "@media": {
    [media.lg]: { height: "38rem", padding: vars.spacing.xl },
    [media.reducedMotion]: { animation: "none" },
  },
});

export const scene = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const appear = style({
  animation: `${fadeUp} ${vars.motion.duration.slow} ${vars.motion.ease.out}`,
  "@media": {
    [media.reducedMotion]: { animation: "none" },
  },
});

export const sceneTitle = style([textStyle.cardTitle, { color: vars.color.primary }]);

export const notice = style([textStyle.bodySm, { margin: 0, color: vars.color.secondary }]);

export const wideOnly = style({
  display: "none",
  "@media": {
    [media.lg]: { display: "block" },
  },
});

export const miniMeta = style([
  textStyle.metadata,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: vars.spacing.xs,
    color: vars.color.tertiary,
  },
]);

export const chipRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.xs,
});

export const chip = style([
  textStyle.metadata,
  {
    padding: `0.6rem ${vars.spacing.md}`,
    border: `1px solid ${vars.color.strokeMedium}`,
    borderRadius: vars.radius.pill,
    color: vars.color.secondary,
    transition: transition("background-color", "border-color", "color"),
    selectors: {
      "&[data-selected]": {
        borderColor: vars.color.fillPrimary,
        backgroundColor: vars.color.fillPrimary,
        color: vars.color.background,
      },
    },
  },
]);

export const searchBar = style([
  textStyle.bodySm,
  {
    display: "flex",
    alignItems: "center",
    gap: vars.spacing.sm,
    padding: `${vars.spacing.sm} ${vars.spacing.md}`,
    border: `1px solid ${vars.color.strokeMedium}`,
    borderRadius: vars.radius.control,
    color: vars.color.tertiary,
  },
]);

export const resultCount = style([
  textStyle.bodySm,
  { color: vars.color.primary, fontWeight: 700 },
]);

export const cardStack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const miniCard = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  padding: vars.spacing.md,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.trueWhite,
  transition: transition("box-shadow", "border-color", "transform"),
  selectors: {
    "&[data-focused]": {
      borderColor: vars.color.blue,
      boxShadow: `0 0 0 3px ${vars.color.blue10}`,
      transform: "translateY(-2px)",
    },
  },
});

export const miniTitle = style([textStyle.bodySm, { color: vars.color.primary, fontWeight: 600 }]);

export const hint = style([
  textStyle.metadata,
  { alignSelf: "flex-end", color: vars.color.blue, fontWeight: 600 },
]);

export const fileRow = style([
  textStyle.bodySm,
  {
    display: "flex",
    alignItems: "center",
    gap: vars.spacing.sm,
    padding: `${vars.spacing.sm} ${vars.spacing.md}`,
    borderRadius: vars.radius.control,
    backgroundColor: vars.color.fillTertiary,
    color: vars.color.secondary,
  },
]);

export const fileName = style({ flex: "1 1 auto" });

export const fileDone = style([
  textStyle.metadata,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.2rem",
    color: vars.color.blue,
    fontWeight: 600,
  },
]);

export const applyButton = style([
  textStyle.buttonMd,
  {
    display: "inline-flex",
    minHeight: vars.size.controlSm,
    alignItems: "center",
    justifyContent: "center",
    gap: vars.spacing.xs,
    borderRadius: vars.radius.cta,
    backgroundColor: vars.color.fillPrimary,
    color: vars.color.background,
    transition: transition("background-color", "color"),
    selectors: {
      "&[data-status='pending']": {
        backgroundColor: vars.color.fillSecondary,
        color: vars.color.secondary,
      },
      "&[data-status='confirmed']": {
        backgroundColor: vars.color.blue10,
        color: vars.color.blue,
      },
    },
  },
]);

export const toast = style([
  textStyle.metadata,
  {
    alignSelf: "center",
    padding: `${vars.spacing.sm} ${vars.spacing.base}`,
    borderRadius: vars.radius.pill,
    backgroundColor: vars.color.toolTip,
    color: vars.color.trueWhite,
  },
]);

export const roomHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
});

export const avatarStack = style({
  display: "flex",
});

globalStyle(`${avatarStack} > * + *`, { marginLeft: "-0.8rem" });

export const avatar = style([
  textStyle.metadata,
  {
    display: "inline-flex",
    width: "3.2rem",
    height: "3.2rem",
    flex: "0 0 auto",
    alignItems: "center",
    justifyContent: "center",
    border: `2px solid ${vars.color.trueWhite}`,
    borderRadius: vars.radius.pill,
    backgroundColor: vars.color.yellow10,
    color: vars.color.brown,
    fontWeight: 600,
  },
]);

export const personRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: vars.spacing.md,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.control,
});

export const personText = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
});

export const personName = style([
  textStyle.metadata,
  { color: vars.color.primary, fontWeight: 600 },
]);

export const personSummary = style([textStyle.metadata, { color: vars.color.secondary }]);

export const comment = style([
  textStyle.bodySm,
  {
    display: "flex",
    alignSelf: "flex-start",
    gap: vars.spacing.sm,
    padding: `${vars.spacing.sm} ${vars.spacing.md}`,
    borderRadius: vars.radius.control,
    backgroundColor: vars.color.fillTertiary,
    color: vars.color.secondary,
  },
]);

export const myComment = style([
  textStyle.bodySm,
  {
    alignSelf: "flex-end",
    padding: `${vars.spacing.sm} ${vars.spacing.md}`,
    borderRadius: vars.radius.control,
    backgroundColor: vars.color.fillPrimary,
    color: vars.color.background,
  },
]);

export const trustCard = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  padding: vars.spacing.md,
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.control,
  boxShadow: vars.shadow.cardRaise,
});

export const trustChip = style([
  textStyle.metadata,
  {
    padding: `0.2rem ${vars.spacing.sm}`,
    borderRadius: vars.radius.pill,
    backgroundColor: vars.color.blue10,
    color: vars.color.blue,
    fontWeight: 500,
  },
]);

export const playButton = style({
  display: "inline-flex",
  width: vars.size.iconLg,
  height: vars.size.iconLg,
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  cursor: "pointer",
  selectors: { "&:focus-visible": focusRing },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover": { backgroundColor: vars.color.fillTertiary, color: vars.color.primary },
      },
    },
  },
});
