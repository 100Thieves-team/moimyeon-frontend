import { styleVariants } from "@vanilla-extract/css";
import { vars } from "./theme.css";
import { media } from "./tokens";

const sans = vars.font.sans;
const mono = vars.font.mono;

// DESIGN.md `typography:` 네임드 텍스트 스타일. desktop* 값은 명시된 브레이크포인트부터 적용.
// @media 블록은 오름차순(md → lg)이어야 한다 — 동일 특이성이라 소스 순서가 결정한다.
export const textStyle = styleVariants({
  navLabel: {
    fontFamily: sans,
    fontSize: "1.6rem",
    fontWeight: 400,
    lineHeight: "2rem",
  },
  body: {
    fontFamily: sans,
    fontSize: "1.6rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  heroSubtitle: {
    fontFamily: sans,
    fontSize: "2.4rem",
    fontWeight: 400,
    lineHeight: "3.2rem",
  },
  featureCopy: {
    fontFamily: sans,
    fontSize: "1.8rem",
    fontWeight: 400,
    lineHeight: "2.7rem",
    letterSpacing: "-0.02em",
  },
  buttonLg: {
    fontFamily: sans,
    fontSize: "2rem",
    fontWeight: 500,
    lineHeight: "3rem",
  },
  watchButton: {
    fontFamily: sans,
    fontSize: "1.6rem",
    fontWeight: 500,
    lineHeight: "2.4rem",
  },
  privacyLink: {
    fontFamily: sans,
    fontSize: "1.6rem",
    fontWeight: 400,
    lineHeight: "3.5rem",
  },
  footerMono: {
    fontFamily: mono,
    fontSize: "1.3rem",
    fontWeight: 400,
    lineHeight: "1.7rem",
    letterSpacing: "0.1em",
  },
  h1: {
    fontFamily: sans,
    fontSize: "4.8rem",
    fontWeight: 300,
    lineHeight: "5.2rem",
    letterSpacing: "-0.04em",
    "@media": {
      [media.md]: { fontSize: "7.2rem", lineHeight: "8.4rem" },
    },
  },
  h2: {
    fontFamily: sans,
    fontSize: "3.6rem",
    fontWeight: 300,
    lineHeight: "4.1rem",
    letterSpacing: "-0.04em",
    "@media": {
      [media.md]: { fontSize: "5.4rem", lineHeight: "6rem" },
    },
  },
  h3: {
    fontFamily: sans,
    fontSize: "2.4rem",
    fontWeight: 300,
    lineHeight: "3rem",
    letterSpacing: "-0.02em",
    "@media": {
      [media.md]: { fontSize: "3.4rem", lineHeight: "3.7rem" },
    },
  },
  h4: {
    fontFamily: sans,
    fontSize: "2rem",
    fontWeight: 300,
    lineHeight: "2.5rem",
    letterSpacing: "-0.02em",
    "@media": {
      [media.lg]: { fontSize: "2.6rem", lineHeight: "3rem" },
    },
  },
  display: {
    fontFamily: sans,
    fontSize: "3.2rem",
    fontWeight: 700,
    lineHeight: "3.8rem",
    letterSpacing: "-0.05em",
    "@media": {
      // md의 중간 단계를 거쳐 lg에서 최종 크기에 도달한다 (DESIGN.md Typography 프로즈)
      [media.md]: { fontSize: "4rem", lineHeight: "4.8rem" },
      [media.lg]: { fontSize: "4.8rem", lineHeight: "5.6rem" },
    },
  },
  p1: {
    fontFamily: sans,
    fontSize: "1.8rem",
    fontWeight: 400,
    lineHeight: "2.2rem",
    letterSpacing: "-0.02em",
    "@media": {
      [media.lg]: { fontSize: "2.2rem", lineHeight: "2.6rem" },
    },
  },
  p1Body: {
    fontFamily: sans,
    fontSize: "1.8rem",
    fontWeight: 400,
    lineHeight: 1.5,
    "@media": {
      [media.lg]: { fontSize: "2.2rem" },
    },
  },
  p2: {
    fontFamily: sans,
    fontSize: "1.6rem",
    fontWeight: 400,
    lineHeight: "2rem",
  },
  p2Body: {
    fontFamily: sans,
    fontSize: "1.6rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  testimonial: {
    fontFamily: sans,
    fontSize: "2rem",
    fontWeight: 400,
    lineHeight: "2.4rem",
    letterSpacing: "-0.02em",
  },
  caption: {
    fontFamily: mono,
    fontSize: "1.3rem",
    fontWeight: 400,
    lineHeight: "1.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  monoBody: {
    fontFamily: mono,
    fontSize: "1.4rem",
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "-0.02em",
  },
});

export type TextStyle = keyof typeof textStyle;
