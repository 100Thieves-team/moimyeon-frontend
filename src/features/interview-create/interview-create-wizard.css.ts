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
export const inlineLink = style({
  padding: 0,
  border: 0,
  background: "transparent",
  color: vars.color.secondary,
  textDecoration: "underline",
  cursor: "pointer",
});
export const dialogBackdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 20,
  background: vars.color.black50,
});
export const dialogPopup = style({
  position: "fixed",
  top: "50%",
  left: "50%",
  zIndex: 21,
  width: "min(52rem, calc(100vw - 3.2rem))",
  maxHeight: "calc(100dvh - 3.2rem)",
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  borderRadius: vars.radius.floating,
  background: vars.color.background,
  boxShadow: vars.shadow.cardSoft,
});
export const dialogHeader = style({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: "2rem",
  padding: "2.4rem",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});
export const dialogTitle = style([textStyle.h4, { margin: 0 }]);
export const dialogDescription = style({ margin: "0.8rem 0 0", color: vars.color.tertiary });
export const dialogBody = style({ display: "grid", gap: "1.2rem", padding: "2.4rem" });
export const dialogRow = style({ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.8rem" });
export const iconButton = style({
  display: "grid",
  placeItems: "center",
  width: "3.6rem",
  height: "3.6rem",
  border: 0,
  borderRadius: vars.radius.pill,
  background: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
});
export const backLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  justifySelf: "start",
  padding: 0,
  border: 0,
  background: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
});
export const previewLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  color: vars.color.secondary,
});
export const segmented = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "0.8rem",
});
export const segment = style({
  display: "grid",
  placeItems: "center",
  minHeight: "4.4rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  cursor: "pointer",
  selectors: {
    '&[data-selected="true"]': {
      borderColor: vars.color.primary,
      boxShadow: `inset 0 0 0 1px ${vars.color.primary}`,
    },
  },
});
export const labelRow = style({
  display: "flex",
  justifyContent: "space-between",
  color: vars.color.secondary,
});
export const sliderControl = style({
  display: "flex",
  alignItems: "center",
  height: "3.2rem",
  touchAction: "none",
});
export const sliderTrack = style({
  position: "relative",
  width: "100%",
  height: "0.4rem",
  borderRadius: vars.radius.pill,
  background: vars.color.fillSecondary,
});
export const sliderIndicator = style({
  borderRadius: vars.radius.pill,
  background: vars.color.fillPrimary,
});
export const sliderThumb = style({
  width: "2rem",
  height: "2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.pill,
  background: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});
export const scheduleList = style({ display: "grid", gap: "0.8rem" });
export const scheduleRow = style({
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr 1fr auto",
  gap: "0.8rem",
  alignItems: "start",
  "@media": { "screen and (max-width: 599px)": { gridTemplateColumns: "1fr" } },
});
export const textarea = style({
  minHeight: "10rem",
  resize: "vertical",
  padding: "1.2rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  background: "transparent",
  color: vars.color.primary,
  font: "inherit",
});
export const resumeCard = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: "1.2rem",
  padding: "1.2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.control,
  selectors: { "& p": { margin: "0.4rem 0 0", color: vars.color.tertiary } },
});
export const aiSummary = style({
  padding: "1.6rem",
  borderRadius: vars.radius.control,
  background: vars.color.blue10,
  color: vars.color.primary,
  selectors: { "& strong": { color: vars.color.blue }, "& p": { margin: "0.8rem 0 0" } },
});
export const resumeList = style({ display: "grid", gap: "0.8rem" });
export const resumeOption = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  alignItems: "center",
  gap: "1rem",
  width: "100%",
  padding: "1.2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.control,
  background: "transparent",
  color: vars.color.primary,
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    '&[data-selected="true"]': { borderColor: vars.color.primary },
    "& small": { display: "block", marginTop: "0.4rem", color: vars.color.tertiary },
  },
});
export const switchRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "2rem",
  padding: "1.2rem",
  borderRadius: vars.radius.control,
  background: vars.color.fillTertiary,
  selectors: { "& small": { display: "block", marginTop: "0.4rem", color: vars.color.tertiary } },
});
export const switchRoot = style({
  width: "4rem",
  height: "2.4rem",
  padding: "0.2rem",
  border: 0,
  borderRadius: vars.radius.pill,
  background: vars.color.fillSecondary,
  transition: "background 150ms",
  selectors: { "&[data-checked]": { background: vars.color.fillPrimary } },
});
export const switchThumb = style({
  display: "block",
  width: "2rem",
  height: "2rem",
  borderRadius: vars.radius.pill,
  background: vars.color.background,
  transition: "transform 150ms",
  selectors: { "[data-checked] &": { transform: "translateX(1.6rem)" } },
});
