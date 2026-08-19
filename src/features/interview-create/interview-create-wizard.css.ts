import { style } from "@vanilla-extract/css";
import { textStyle, vars } from "@/styles";

export const page = style({ flex: "1 1 auto", padding: "5.2rem 2.4rem 8.8rem" });
export const layout = style({
  display: "grid",
  gridTemplateColumns: "23rem minmax(0, 64rem)",
  gap: "11rem",
  justifyContent: "center",
  alignItems: "start",
  "@media": {
    "screen and (max-width: 999px)": {
      gridTemplateColumns: "minmax(0, 64rem)",
      gap: "3.2rem",
    },
  },
});
export const steps = style({ paddingTop: "0.8rem" });
export const eyebrow = style([
  textStyle.caption,
  { color: vars.color.tertiary, letterSpacing: "0.1em" },
]);
export const stepList = style({
  display: "grid",
  gap: "2.2rem",
  margin: "2.6rem 0 0",
  padding: 0,
  listStyle: "none",
});
export const stepItem = style({
  color: vars.color.tertiary,
  selectors: {
    '&[data-active="true"]': { color: vars.color.primary, fontWeight: 700 },
    '&[data-complete="true"]': { color: vars.color.secondary },
  },
});
export const stepButton = style({
  display: "flex",
  gap: "1.2rem",
  padding: 0,
  border: 0,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  cursor: "pointer",
  selectors: { "&:disabled": { cursor: "default" } },
});
export const main = style({ minWidth: 0 });
export const title = style([textStyle.h2, { margin: "0 0 2.4rem", fontWeight: 300 }]);
export const card = style({
  display: "grid",
  gap: "2.4rem",
  padding: "3.2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  background: vars.color.trueWhite,
  boxShadow: vars.shadow.cardRaise,
});
export const field = style({ display: "grid", gap: "0.8rem" });
export const fieldset = style({ display: "grid", gap: "1rem", margin: 0, padding: 0, border: 0 });
export const label = style([textStyle.caption, { color: vars.color.primary, fontWeight: 700 }]);
export const required = style({
  marginLeft: "0.6rem",
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1.05rem",
  fontWeight: 400,
});
export const input = style({
  width: "100%",
  minWidth: 0,
  border: 0,
  outline: 0,
  background: "transparent",
  color: vars.color.primary,
  font: "inherit",
});
export const inputStandalone = style({
  width: "100%",
  height: "4.4rem",
  padding: "0 1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  background: "transparent",
  color: vars.color.primary,
  font: "inherit",
});
export const searchInputWrap = style({
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  height: "4.4rem",
  padding: "0 1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
});
export const searchResults = style({
  display: "grid",
  maxHeight: "20rem",
  overflowY: "auto",
  borderRadius: vars.radius.control,
  background: vars.color.fillTertiary,
});
export const searchResult = style({
  display: "flex",
  gap: "0.8rem",
  padding: "1.2rem",
  border: 0,
  borderBottom: `1px solid ${vars.color.strokeLight}`,
  background: "transparent",
  color: vars.color.primary,
  textAlign: "left",
  cursor: "pointer",
});
export const searchMessage = style({ margin: 0, padding: "1.2rem", color: vars.color.tertiary });
export const selectedValue = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  minHeight: "4.4rem",
  padding: "0 1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  background: "transparent",
  color: vars.color.primary,
  textAlign: "left",
  cursor: "pointer",
});
export const help = style({ margin: 0, color: vars.color.tertiary, fontSize: "1.2rem" });
export const error = style({ margin: 0, color: vars.color.red, fontSize: "1.2rem" });
export const choiceList = style({ display: "flex", flexWrap: "wrap", gap: "0.8rem" });
export const choice = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  minHeight: "3.6rem",
  padding: "0 1.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  cursor: "pointer",
  selectors: {
    '&[data-selected="true"]': {
      borderColor: vars.color.fillPrimary,
      background: vars.color.fillPrimary,
      color: vars.color.background,
    },
  },
});
export const visuallyHidden = style({
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
});
export const actions = style({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "1.6rem",
});
