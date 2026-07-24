import {
  assignVars,
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
} from "@vanilla-extract/css";
import { media } from "./tokens";

// fillSecondaryHover -> fill-secondary-hover, primary50 -> primary-50, section2xl -> section-2xl
const kebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
    .toLowerCase();

const toVarName = (_value: string | null, path: string[]) => path.map(kebab).join("-");

// 다크 모드에서 통째로 교체되는 시맨틱 컬러 슬롯 (DESIGN.md `dark:` 블록의 키와 1:1로 일치).
// 별도 컨트랙트로 분리해 assignVars가 "다크 블록 통째 적용" 규칙을 빌드 타임에 강제하게 한다.
const themeContract = createGlobalThemeContract(
  {
    color: {
      background: null,
      primary: null,
      secondary: null,
      tertiary: null,
      quaternary: null,
      primary50: null,
      primary10: null,
      fillPrimary: null,
      fillSecondary: null,
      fillSecondaryHover: null,
      fillTertiary: null,
      strokeLight: null,
      strokeMedium: null,
    },
  },
  toVarName,
);

// 라이트/다크 공통 고정 토큰 (프리미티브 컬러, 스페이싱, 폰트, 레이아웃, radius, 그림자, 모션)
const staticContract = createGlobalThemeContract(
  {
    color: {
      black: null,
      black50: null,
      black10: null,
      black8: null,
      white: null,
      white50: null,
      white10: null,
      trueWhite: null,
      red: null,
      red50: null,
      red10: null,
      blue: null,
      blue50: null,
      blue10: null,
      pink: null,
      pink50: null,
      pink10: null,
      yellow: null,
      yellow50: null,
      yellow10: null,
      brown: null,
      brown50: null,
      brown10: null,
      grey: null,
      lightGrey: null,
      toolTip: null,
      linkHover: null,
      headerBackground: null,
    },
    spacing: {
      xs: null,
      sm: null,
      md: null,
      base: null,
      lg: null,
      xl: null,
      "2xl": null,
      "3xl": null,
      sectionSm: null,
      section: null,
      sectionLg: null,
      sectionXl: null,
      section2xl: null,
    },
    font: {
      sans: null,
      mono: null,
    },
    layout: {
      maxWidth: null,
      columnGap: null,
      sidePadding: null,
    },
    radius: {
      control: null,
      cta: null,
      floating: null,
      link: null,
      media: null,
      ctaRound: null,
      pill: null,
    },
    shadow: {
      cardSoft: null,
      cardRaise: null,
      cardRaiseHover: null,
      tooltip: null,
      glassHighlight: null,
      hardOffset: null,
    },
    motion: {
      ease: {
        site: null,
        underline: null,
        fade: null,
      },
      duration: {
        fast: null,
        base: null,
        slow: null,
      },
    },
  },
  toVarName,
);

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
      site: "cubic-bezier(0.87, 0, 0.13, 1)",
      underline: "cubic-bezier(0.77, 0, 0.175, 1)",
      fade: "cubic-bezier(0.5, 1, 0.9, 1)",
    },
    duration: {
      fast: "150ms",
      base: "200ms",
      slow: "400ms",
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

// 다크 모드: 시맨틱 슬롯만 통째로 재할당. 액센트/프리미티브는 양쪽 모드에서 동일.
// createGlobalTheme(":root") 호출들과 특이성이 같으므로 반드시 그 뒤(소스 순서)에 위치해야 한다.
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
