import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

// 1rem = 10px
globalStyle("html", {
  fontSize: "62.5%",
  height: "100%",
  colorScheme: "light dark",
});

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});

globalStyle("html, body", {
  maxWidth: "100vw",
  overflowX: "hidden",
});

globalStyle("body", {
  position: "relative",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: vars.color.background,
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  // 62.5% 루트 보정: 없으면 기본 텍스트가 10px로 렌더링됨
  fontSize: "1.6rem",
  lineHeight: 1.5,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});
