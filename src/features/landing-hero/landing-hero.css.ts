import { style } from "@vanilla-extract/css";
import { media, textStyle, vars } from "@/styles";

// 첫 화면 아래에 카탈로그 상단이 보이도록 남겨 두는 높이
const catalogPeek = "16rem";

export const hero = style({
  display: "flex",
  width: "100%",
  minHeight: `max(48rem, calc(100svh - ${vars.size.header} - ${catalogPeek}))`,
  flexDirection: "column",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});

export const inner = style({
  display: "flex",
  width: "100%",
  maxWidth: `calc(${vars.layout.maxWidth} + 2 * ${vars.layout.sidePadding})`,
  flex: "1 1 auto",
  flexDirection: "column",
  justifyContent: "center",
  marginInline: "auto",
  padding: `${vars.spacing["3xl"]} ${vars.layout.sidePadding}`,
});

export const textBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.base,
});

export const eyebrow = style([
  textStyle.metadata,
  {
    color: vars.color.tertiary,
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
]);

export const title = style([
  textStyle.display,
  { color: vars.color.primary, wordBreak: "keep-all" },
]);

export const lead = style([
  textStyle.featureCopy,
  {
    display: "none",
    maxWidth: "56rem",
    color: vars.color.secondary,
    wordBreak: "keep-all",
    "@media": {
      [media.md]: { display: "block" },
    },
  },
]);

export const browseButton = style({
  alignSelf: "flex-start",
  gap: vars.spacing.sm,
});
