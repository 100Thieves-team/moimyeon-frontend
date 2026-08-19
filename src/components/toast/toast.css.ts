import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

export const viewport = style({
  position: "fixed",
  zIndex: 50,
  top: "8rem",
  left: "50%",
  width: "calc(100vw - 3.2rem)",
  maxWidth: "40rem",
  margin: 0,
  transform: "translateX(-50%)",
});

export const root = style({
  vars: {
    "--gap": vars.spacing.md,
    "--peek": vars.spacing.sm,
    "--scale": "calc(max(0, 1 - (var(--toast-index) * 0.06)))",
    "--shrink": "calc(1 - var(--scale))",
    "--height": "var(--toast-frontmost-height, var(--toast-height))",
    "--offset-y":
      "calc(var(--toast-offset-y) + (var(--toast-index) * var(--gap)) + var(--toast-swipe-movement-y))",
  },
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: "calc(1000 - var(--toast-index))",
  width: "100%",
  height: "var(--height)",
  overflow: "hidden",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.floating,
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.tooltip,
  color: vars.color.primary,
  cursor: "default",
  opacity: 1,
  transform:
    "translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) + (var(--toast-index) * var(--peek)) + (var(--shrink) * var(--height)))) scale(var(--scale))",
  transformOrigin: "top center",
  transition: `transform ${vars.motion.duration.slow} ${vars.motion.ease.site}, opacity ${vars.motion.duration.base} ${vars.motion.ease.fade}, height ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  userSelect: "none",
  selectors: {
    "&[data-expanded]": {
      height: "var(--toast-height)",
      transform: "translateX(var(--toast-swipe-movement-x)) translateY(var(--offset-y)) scale(1)",
    },
    "&[data-starting-style]": {
      opacity: 0,
      transform: "translateY(-150%)",
    },
    "&[data-limited]": {
      opacity: 0,
    },
    "&[data-ending-style]:not([data-limited]):not([data-swipe-direction])": {
      opacity: 0,
      transform: "translateY(-150%)",
    },
    "&[data-ending-style][data-swipe-direction='up']": {
      opacity: 0,
      transform: "translateY(calc(var(--toast-swipe-movement-y) - 150%))",
    },
    "&[data-ending-style][data-swipe-direction='right']": {
      opacity: 0,
      transform:
        "translateX(calc(var(--toast-swipe-movement-x) + 150%)) translateY(var(--offset-y))",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
    "&::after": {
      position: "absolute",
      top: "100%",
      left: 0,
      width: "100%",
      height: "calc(var(--gap) + 1px)",
      content: "",
    },
  },
  "@media": {
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});

export const content = style({
  display: "flex",
  minHeight: "5.6rem",
  alignItems: "center",
  gap: vars.spacing.md,
  padding: vars.spacing.md,
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
  selectors: {
    "&[data-behind]": {
      opacity: 0,
    },
    "&[data-expanded]": {
      opacity: 1,
    },
  },
  "@media": {
    [media.reducedMotion]: {
      transition: "none",
    },
  },
});

export const icon = style({
  flex: "0 0 auto",
  color: vars.color.blue,
});

export const text = style({
  display: "flex",
  minWidth: 0,
  flex: "1 1 auto",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const title = style({
  margin: 0,
  fontSize: "1.4rem",
  fontWeight: 600,
  lineHeight: "2rem",
});

export const description = style({
  margin: 0,
  color: vars.color.secondary,
  fontSize: "1.3rem",
  lineHeight: "1.8rem",
});

export const close = style({
  display: "inline-flex",
  width: "3.2rem",
  height: "3.2rem",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.control,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.fillSecondary,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});
