import {
  assignVars,
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
} from "@vanilla-extract/css";
import { media, motionValues } from "./tokens";

const toCubicBezier = ([x1, y1, x2, y2]: [number, number, number, number]) =>
  `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

const toMilliseconds = (seconds: number) => `${seconds * 1000}ms`;

// 다크 모드에서 교체되는 시맨틱 컬러
const themeContract = createGlobalThemeContract({
  color: {
    background: "color-background",
    primary: "color-primary",
    secondary: "color-secondary",
    tertiary: "color-tertiary",
    quaternary: "color-quaternary",
    primary50: "color-primary-50",
    primary10: "color-primary-10",
    fillPrimary: "color-fill-primary",
    fillSecondary: "color-fill-secondary",
    fillSecondaryHover: "color-fill-secondary-hover",
    fillTertiary: "color-fill-tertiary",
    strokeLight: "color-stroke-light",
    strokeMedium: "color-stroke-medium",
  },
});

// 라이트/다크 공통 고정 토큰 (프리미티브 컬러, 스페이싱, 폰트, 레이아웃, radius, 그림자, 모션)
const staticContract = createGlobalThemeContract({
  color: {
    black: "color-black",
    black50: "color-black-50",
    black10: "color-black-10",
    black8: "color-black-8",
    white: "color-white",
    white50: "color-white-50",
    white10: "color-white-10",
    trueWhite: "color-true-white",
    red: "color-red",
    red50: "color-red-50",
    red10: "color-red-10",
    blue: "color-blue",
    blue50: "color-blue-50",
    blue10: "color-blue-10",
    pink: "color-pink",
    pink50: "color-pink-50",
    pink10: "color-pink-10",
    yellow: "color-yellow",
    yellow50: "color-yellow-50",
    yellow10: "color-yellow-10",
    brown: "color-brown",
    brown50: "color-brown-50",
    brown10: "color-brown-10",
    grey: "color-grey",
    lightGrey: "color-light-grey",
    toolTip: "color-tool-tip",
    linkHover: "color-link-hover",
    headerBackground: "color-header-background",
  },
  spacing: {
    xs: "spacing-xs",
    sm: "spacing-sm",
    md: "spacing-md",
    base: "spacing-base",
    lg: "spacing-lg",
    xl: "spacing-xl",
    "2xl": "spacing-2xl",
    "3xl": "spacing-3xl",
    sectionSm: "spacing-section-sm",
    section: "spacing-section",
    sectionLg: "spacing-section-lg",
    sectionXl: "spacing-section-xl",
    section2xl: "spacing-section-2xl",
  },
  font: {
    sans: "font-sans",
    mono: "font-mono",
  },
  layout: {
    maxWidth: "layout-max-width",
    columnGap: "layout-column-gap",
    sidePadding: "layout-side-padding",
  },
  radius: {
    control: "radius-control",
    cta: "radius-cta",
    floating: "radius-floating",
    link: "radius-link",
    media: "radius-media",
    ctaRound: "radius-cta-round",
    pill: "radius-pill",
  },
  shadow: {
    cardSoft: "shadow-card-soft",
    cardRaise: "shadow-card-raise",
    cardRaiseHover: "shadow-card-raise-hover",
    tooltip: "shadow-tooltip",
    glassHighlight: "shadow-glass-highlight",
    hardOffset: "shadow-hard-offset",
  },
  motion: {
    ease: {
      out: "motion-ease-out",
      site: "motion-ease-site",
      underline: "motion-ease-underline",
      fade: "motion-ease-fade",
    },
    duration: {
      fast: "motion-duration-fast",
      base: "motion-duration-base",
      slow: "motion-duration-slow",
    },
  },
});

createGlobalTheme(":root", staticContract, {
  color: {
    black: "#000000",
    black50: "#00000080",
    black10: "#0000001A",
    black8: "rgba(0,0,0,0.08)",
    white: "#F8F8F8",
    white50: "#F8F8F880",
    white10: "#F8F8F81A",
    trueWhite: "#FFFFFF",
    red: "#FA3D1D",
    red50: "#FA3D1D80",
    red10: "#FA3D1D1A",
    blue: "#0358F7",
    blue50: "#0358F780",
    blue10: "#0358F71A",
    pink: "#FD02F5",
    pink50: "#FD02F580",
    pink10: "#FD02F51A",
    yellow: "#FFB005",
    yellow50: "#FFB00580",
    yellow10: "#FFB0051A",
    brown: "#340B05",
    brown50: "#340B0580",
    brown10: "#340B051A",
    grey: "#D9D9D9",
    lightGrey: "#EFEFEF",
    toolTip: "#262626",
    linkHover: "rgba(88,99,234,1)",
    headerBackground: "#EBEBEBB3",
  },
  spacing: {
    xs: "0.4rem",
    sm: "0.8rem",
    md: "1.2rem",
    base: "1.6rem",
    lg: "2rem",
    xl: "2.4rem",
    "2xl": "3.2rem",
    "3xl": "4rem",
    sectionSm: "6rem",
    section: "8rem",
    sectionLg: "10rem",
    sectionXl: "12rem",
    section2xl: "15rem",
  },
  font: {
    sans: "var(--font-pretendard), Helvetica, Arial, sans-serif",
    mono: 'var(--font-noto-sans-mono-cjk-kr), "SF Mono", Menlo, Consolas, monospace',
  },
  layout: {
    maxWidth: "200rem",
    columnGap: "2rem",
    sidePadding: "1rem",
  },
  radius: {
    control: "0.8rem",
    cta: "1.4rem",
    floating: "1.6rem",
    link: "2rem",
    media: "2.4rem",
    ctaRound: "4rem",
    pill: "9999px",
  },
  shadow: {
    cardSoft: "0 4px 32px 0 rgba(0,0,0,0.06)",
    cardRaise: "0 4px 12px 0 rgba(0,0,0,0.06)",
    cardRaiseHover: "0 12px 20px 0 rgba(10,18,36,0.10)",
    tooltip: "0 0 2px 0 rgba(0,0,0,0.12), 0 2px 10px 0 rgba(0,0,0,0.10)",
    glassHighlight: "0 6px 20px 0 rgba(0,0,0,0.08), inset 0 1px 0 0 rgba(255,255,255,0.6)",
    hardOffset: "-3px 3px 0 0 #000",
  },
  motion: {
    ease: {
      out: toCubicBezier(motionValues.ease.out),
      site: toCubicBezier(motionValues.ease.site),
      underline: toCubicBezier(motionValues.ease.underline),
      fade: toCubicBezier(motionValues.ease.fade),
    },
    duration: {
      fast: toMilliseconds(motionValues.duration.fast),
      base: toMilliseconds(motionValues.duration.base),
      slow: toMilliseconds(motionValues.duration.slow),
    },
  },
});

createGlobalTheme(":root", themeContract, {
  color: {
    background: "#F8F8F8",
    primary: "rgba(0,0,0,0.85)",
    secondary: "rgba(0,0,0,0.60)",
    tertiary: "rgba(0,0,0,0.45)",
    quaternary: "rgba(0,0,0,0.20)",
    primary50: "rgba(0,0,0,0.425)",
    primary10: "rgba(0,0,0,0.085)",
    fillPrimary: "rgba(0,0,0,0.9)",
    fillSecondary: "rgba(0,0,0,0.08)",
    fillSecondaryHover: "rgba(0,0,0,0.12)",
    fillTertiary: "rgba(0,0,0,0.04)",
    strokeLight: "rgba(0,0,0,0.06)",
    strokeMedium: "rgba(0,0,0,0.12)",
  },
});

// 다크 모드: 시맨틱 컬러 재할당
// createGlobalTheme(":root") 호출들과 우선순위가 같으므로 반드시 그 뒤에 위치해야 함
globalStyle(":root", {
  "@media": {
    [media.dark]: {
      vars: assignVars(themeContract.color, {
        background: "#1B1B1B",
        primary: "#FFFFFF",
        secondary: "rgba(255,255,255,0.80)",
        tertiary: "rgba(255,255,255,0.60)",
        quaternary: "rgba(255,255,255,0.40)",
        primary50: "rgba(255,255,255,0.50)",
        primary10: "rgba(255,255,255,0.10)",
        fillPrimary: "#FFFFFF",
        fillSecondary: "rgba(255,255,255,0.20)",
        fillSecondaryHover: "rgba(255,255,255,0.25)",
        fillTertiary: "rgba(255,255,255,0.10)",
        strokeLight: "rgba(255,255,255,0.10)",
        strokeMedium: "rgba(255,255,255,0.20)",
      }),
    },
  },
});

export const vars = {
  ...staticContract,
  color: { ...staticContract.color, ...themeContract.color },
};
