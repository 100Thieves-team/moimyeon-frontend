import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

export const page = style({
  display: "flex",
  width: "100%",
  minHeight: "calc(100dvh - 6.4rem)",
  flex: "1 1 auto",
  justifyContent: "center",
  padding: "4.8rem 1.6rem 6.4rem",
  backgroundColor: vars.color.background,
  "@media": { [media.md]: { paddingInline: "3.2rem" } },
});

export const content = style({
  display: "flex",
  width: "100%",
  maxWidth: "68rem",
  minWidth: 0,
  flexDirection: "column",
  alignItems: "stretch",
  gap: vars.spacing.lg,
});

export const heading = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
});

export const title = style({
  color: vars.color.primary,
  fontSize: "3rem",
  fontWeight: 300,
  lineHeight: "3.6rem",
  letterSpacing: "-0.02em",
  textWrap: "balance",
  "@media": { [media.sm]: { fontSize: "3.2rem", lineHeight: "3.8rem" } },
});

export const roomSummary = style({
  display: "flex",
  minWidth: 0,
  alignItems: "center",
  gap: "1.4rem",
  padding: "1.4rem 1.8rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});

export const roomCopy = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: "0.2rem",
});

export const roomTitle = style({
  overflow: "hidden",
  color: vars.color.primary,
  fontSize: "1.6rem",
  fontWeight: 500,
  lineHeight: "2.1rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const roomMeta = style({
  overflow: "hidden",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "1.9rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const detailLink = style({
  flex: "0 0 auto",
  paddingBlock: "0.8rem",
  color: vars.color.tertiary,
  fontSize: "1.4rem",
  lineHeight: "1.9rem",
  textDecoration: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
  "@media": {
    [media.hover]: { selectors: { "&:hover": { color: vars.color.primary } } },
  },
});

export const formCard = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: "2.2rem",
  padding: "2.8rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
  "@media": { "screen and (max-width: 599px)": { padding: "2rem" } },
});

export const field = style({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const fieldLabel = style({
  display: "flex",
  alignItems: "baseline",
  gap: vars.spacing.sm,
  color: vars.color.primary,
  fontSize: "1.4rem",
  fontWeight: 700,
  lineHeight: "2rem",
});

export const fieldRequirement = style({
  color: vars.color.tertiary,
  fontFamily: vars.font.mono,
  fontSize: "1.2rem",
  fontWeight: 400,
  lineHeight: "1.6rem",
  letterSpacing: "0.06em",
});

export const note = style({
  width: "100%",
  minHeight: "7.2rem",
  padding: "1.3rem 1.6rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  outline: 0,
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: "1.6rem",
  fontWeight: 400,
  lineHeight: "2.2rem",
  resize: "vertical",
  transition: `border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, box-shadow ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&::placeholder": { color: vars.color.tertiary, opacity: 1 },
    "&:focus-visible": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
    "&[data-invalid]": { borderColor: vars.color.red },
  },
  "@media": { [media.reducedMotion]: { transition: "none" } },
});

export const fieldError = style({
  color: vars.color.red,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
});

export const rootError = style({
  padding: "1.2rem 1.4rem",
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.red10,
  color: vars.color.red,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const submitButton = style({ width: "100%", minHeight: "5rem" });

export const loading = style({
  margin: "auto",
  color: vars.color.secondary,
  fontSize: "1.4rem",
});

export const errorPage = style({
  display: "grid",
  minHeight: "calc(100dvh - 6.4rem)",
  placeItems: "center",
  padding: "3.2rem 1.6rem",
});

export const errorCard = style({
  display: "flex",
  maxWidth: "48rem",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.base,
  padding: "3.2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: vars.radius.media,
  boxShadow: vars.shadow.cardRaise,
});

export const errorTitle = style({
  color: vars.color.primary,
  fontSize: "2.4rem",
  fontWeight: 500,
  lineHeight: "3rem",
});

export const errorDescription = style({
  color: vars.color.secondary,
  fontSize: "1.5rem",
  lineHeight: "2.2rem",
});

export const errorActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
});
