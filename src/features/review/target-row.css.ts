import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const row = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  selectors: {
    "&:not(:first-child)": {
      borderTop: `1px solid ${vars.color.strokeLight}`,
    },
  },
});

const rowHeadBase = {
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  width: "100%",
  padding: `${vars.spacing.md} 0`,
} as const;

export const rowHead = style(rowHeadBase);

export const rowTrigger = style({
  ...rowHeadBase,
  border: "none",
  background: "none",
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
      borderRadius: vars.radius.control,
    },
  },
});

export const avatar = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "4rem",
  height: "4rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillSecondary,
  fontSize: "1.5rem",
  fontWeight: 500,
  color: vars.color.secondary,
});

export const nameColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.1rem",
  flex: "1 0 0",
  minWidth: "0.1rem",
});

export const nameRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
});

export const nickname = style({
  fontSize: "1.45rem",
  fontWeight: 500,
  color: vars.color.primary,
});

export const hostBadge = style({
  display: "inline-flex",
  padding: "0.2rem 0.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.yellow10,
  fontSize: "1.05rem",
  fontWeight: 700,
  color: vars.color.brown,
});

export const submitted = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  fontSize: "1.25rem",
  fontWeight: 500,
  color: vars.color.secondary,
});

export const submittedCheck = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.8rem",
  height: "1.8rem",
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.fillPrimary,
  color: vars.color.background,
});

export const chevron = style({
  flexShrink: 0,
  color: vars.color.tertiary,
  transition: `transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
});

export const chevronOpen = style([
  chevron,
  {
    transform: "rotate(180deg)",
  },
]);

export const panel = style({
  width: "100%",
});

export const panelContent = style({
  paddingBottom: vars.spacing.md,
  paddingLeft: "5.4rem",
});
