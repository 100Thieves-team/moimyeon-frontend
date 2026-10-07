import { textMetrics } from "@/styles/typography.css";
import { vars } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";

const mobile = "screen and (max-width: 599px)";
const introductionMobile = "screen and (max-width: 700px)";

export const header = style({
  width: "100%",
  height: vars.size.header,
  flex: "0 0 auto",
  padding: `0 ${vars.layout.sidePadding}`,
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  backgroundColor: vars.color.background,
  selectors: {
    '&[data-variant="introduction"]': {
      height: "auto",
      padding: 0,
      borderBottomColor: vars.color.black8,
    },
  },
});

const introduction = `${header}[data-variant="introduction"]`;

export const nav = style({
  width: "100%",
  maxWidth: vars.layout.maxWidth,
  marginInline: "auto",
  display: "flex",
  height: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  selectors: {
    [`${introduction} &`]: {
      width: `min(112rem, calc(100% - ${vars.spacing["2xl"]} * 2))`,
      minHeight: "7.2rem",
      gap: vars.spacing.lg,
    },
  },
  "@media": {
    [introductionMobile]: {
      selectors: {
        [`${introduction} &`]: {
          width: `calc(100% - ${vars.spacing.lg} * 2)`,
          minHeight: "6.8rem",
          gap: "1rem",
        },
      },
    },
    "screen and (max-width: 370px)": {
      selectors: {
        [`${introduction} &`]: { width: `calc(100% - ${vars.spacing.base} * 2)` },
      },
    },
  },
});

export const navLeft = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: vars.spacing["3xl"],
  selectors: { [`${introduction} &`]: { gap: "3.6rem" } },
  "@media": {
    [mobile]: { gap: vars.spacing.md },
    [introductionMobile]: { selectors: { [`${introduction} &`]: { gap: "2.2rem" } } },
    "screen and (max-width: 370px)": {
      selectors: { [`${introduction} &`]: { gap: vars.spacing.base } },
    },
  },
});

export const brand = style({
  flex: "0 0 auto",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "2rem",
  fontWeight: 500,
  lineHeight: "2.4rem",
  letterSpacing: "-0.02em",
  selectors: {
    [`${introduction} &`]: {
      fontSize: "2.1rem",
      fontWeight: 550,
      lineHeight: 1.6,
      letterSpacing: "-0.035em",
    },
    "&:focus-visible": {
      borderRadius: "0.2rem",
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
  },
  "@media": {
    [introductionMobile]: {
      selectors: { [`${introduction} &`]: { fontSize: "2rem" } },
    },
  },
});

export const navList = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.spacing.xl,
  listStyle: "none",
  color: vars.color.tertiary,
  fontFamily: vars.font.sans,
  ...textMetrics.body,
  fontWeight: 400,

  whiteSpace: "nowrap",
  selectors: {
    [`${introduction} &`]: {
      alignItems: "center",
      gap: "2.8rem",
      fontSize: textMetrics.bodySm.fontSize,
      lineHeight: 1.6,
    },
  },
  "@media": {
    [mobile]: { gap: 0, fontSize: "1.3rem" },
    [introductionMobile]: { selectors: { [`${introduction} &`]: { gap: "1.8rem" } } },
  },
});

export const desktopNavItem = style({
  "@media": {
    [mobile]: {
      display: "none",
    },
    [introductionMobile]: { selectors: { [`${introduction} &`]: { display: "none" } } },
  },
});

export const navItem = style({
  display: "inline-flex",
  minHeight: vars.size.controlSm,
  alignItems: "center",
  borderRadius: vars.radius.control,
  color: vars.color.tertiary,
  selectors: {
    [`${introduction} &`]: {
      minHeight: 0,
      paddingBlock: vars.spacing.md,
      color: vars.color.secondary,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const activeNavItem = style({
  color: vars.color.primary,
  fontWeight: 500,
  selectors: { [`${introduction} &`]: { color: vars.color.primary, fontWeight: 650 } },
});

export const navActions = style({
  display: "flex",
  flex: "0 0 auto",
  alignItems: "center",
  gap: vars.spacing.base,
  "@media": {
    [mobile]: {
      gap: vars.spacing.xs,
    },
  },
});

export const loginAction = style({
  "@media": {
    "screen and (max-width: 374px)": { paddingInline: vars.spacing.sm },
  },
});

export const avatarLink = style({
  display: "inline-flex",
  flex: "0 0 auto",
  borderRadius: vars.radius.pill,
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "3px",
    },
  },
});

export const avatarRoot = style({
  display: "inline-flex",
  flexShrink: 0,
  width: "3.4rem",
  height: "3.4rem",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: "50%",
  aspectRatio: "1",
  backgroundColor: vars.color.yellow10,
  color: vars.color.brown,
  fontFamily: vars.font.sans,
  fontSize: "1.4rem",
  fontWeight: 700,
  lineHeight: "1.4rem",
});

export const avatarFallback = style({
  display: "inline-flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
});
