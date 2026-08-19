import { style } from "@vanilla-extract/css";
import { media } from "@/styles/tokens";
import { vars } from "@/styles/theme.css";

export const frame = style({
  width: "100%",
  minHeight: "4.6rem",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.primary,
  transition: `border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, box-shadow ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&:focus-within": {
      borderColor: vars.color.primary50,
      boxShadow: `0 0 0 2px ${vars.color.primary10}`,
    },
  },
  "@media": {
    [media.reducedMotion]: { transition: "none" },
  },
});

export const pills = style({
  display: "flex",
  width: "100%",
  minWidth: 0,
  flexWrap: "wrap",
  alignItems: "center",
  gap: vars.spacing.sm,
});

export const pill = style({
  display: "inline-flex",
  minHeight: "3rem",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.5rem 0.6rem 0.5rem 1.2rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  color: vars.color.primary,
  fontSize: "1.3rem",
  fontWeight: 500,
  lineHeight: "1.7rem",
});

export const pillRemove = style({
  display: "grid",
  width: "2rem",
  height: "2rem",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.tertiary,
  cursor: "pointer",
  placeItems: "center",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "1px",
    },
  },
  "@media": {
    [media.hover]: {
      selectors: {
        "&:hover": {
          backgroundColor: vars.color.fillSecondaryHover,
          color: vars.color.primary,
        },
      },
    },
  },
});

export const placeholder = style({
  color: vars.color.tertiary,
  fontSize: "1.5rem",
  lineHeight: "2rem",
});
