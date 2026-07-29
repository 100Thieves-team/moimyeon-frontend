import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";
import { media } from "@/styles/tokens";

export const container = style({
  width: "100%",
  maxWidth: vars.layout.maxWidth,
  marginInline: "auto",
  paddingInline: vars.layout.sidePadding,
  paddingBlock: vars.spacing.section,
});

// recipe 패턴 레퍼런스: Base UI 컴포넌트에서 이 형태(base + variants + defaultVariants)로
// 컴포넌트별 .css.ts를 작성하고, 반환된 클래스를 Base UI `className`에 전달
export const swatchSurface = recipe({
  base: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: vars.spacing.sm,
    border: `1px solid ${vars.color.strokeLight}`,
  },
  variants: {
    tone: {
      base: { backgroundColor: vars.color.background },
      white: { backgroundColor: vars.color.trueWhite },
    },
  },
  defaultVariants: {
    tone: "base",
  },
});

export const swatchCard = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  minWidth: "16rem",
});

export const swatchChips = style({
  display: "flex",
  borderRadius: vars.radius.control,
  overflow: "hidden",
});

export const chip = style({
  width: "4rem",
  height: "4rem",
  borderRadius: vars.radius.control,
  border: `1px solid ${vars.color.strokeLight}`,
});

export const spacingBar = style({
  height: "1.2rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillPrimary,
});

export const specimenBox = style({
  width: "12rem",
  height: "8rem",
  backgroundColor: vars.color.trueWhite,
  border: `1px solid ${vars.color.strokeMedium}`,
});

export const shadowBox = style({
  width: "12rem",
  height: "8rem",
  backgroundColor: vars.color.trueWhite,
  borderRadius: vars.radius.media,
});

export const motionCard = style({
  width: "20rem",
  padding: vars.spacing.lg,
  backgroundColor: vars.color.trueWhite,
  borderRadius: vars.radius.media,
  boxShadow: vars.shadow.cardRaise,
  transition: `transform ${vars.motion.duration.base} ${vars.motion.ease.site}, box-shadow ${vars.motion.duration.base} ${vars.motion.ease.site}`,
  ":hover": {
    transform: "translateY(-0.6rem)",
    boxShadow: vars.shadow.cardRaiseHover,
  },
  "@media": {
    [media.reducedMotion]: {
      transition: "none",
      ":hover": { transform: "none" },
    },
  },
});

// 62.5% 검증용 눈금자: 1.6rem이 정확히 16px로 렌더되어야 한다.
export const ruler = style({
  width: "1.6rem",
  height: "1.6rem",
  backgroundColor: vars.color.red,
  borderRadius: "0.2rem",
});

export const typeRow = style({
  paddingBlock: vars.spacing.md,
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
