import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const placeholder = {
  display: "block",
  borderRadius: "0.6rem",
} as const;

export const filterHeading = style({
  ...placeholder,
  width: "4.8rem",
  height: "2.4rem",
});

export const filterLabel = style({
  ...placeholder,
  width: "5.6rem",
  height: "1.4rem",
});

export const filterControl = style({
  ...placeholder,
  width: "100%",
  height: "4.4rem",
  borderRadius: vars.radius.control,
});

export const filterToggleRow = style({
  display: "flex",
  gap: vars.spacing.sm,
});

export const filterToggle = style({
  ...placeholder,
  width: "6.4rem",
  height: "3.8rem",
  borderRadius: vars.radius.pill,
});

export const mobileFilter = style({
  ...placeholder,
  width: "8rem",
  height: "4.4rem",
  borderRadius: vars.radius.control,
  "@media": {
    [media.lg]: { display: "none" },
  },
});

export const count = style({
  ...placeholder,
  width: "2.8rem",
  height: "1.5rem",
});

export const sort = style({
  ...placeholder,
  width: "15.6rem",
  height: "4.4rem",
  flex: "0 0 15.6rem",
  borderRadius: vars.radius.control,
});

export const card = style({
  display: "flex",
  minWidth: 0,
  minHeight: "19rem",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: vars.spacing.base,
  padding: "2.2rem",
  border: `1px solid ${vars.color.strokeLight}`,
  borderRadius: "2rem",
  backgroundColor: vars.color.background,
  boxShadow: vars.shadow.cardRaise,
});

export const cardHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
});

export const cardMeta = style({
  ...placeholder,
  width: "8.8rem",
  height: "1.4rem",
});

export const cardBadge = style({
  ...placeholder,
  width: "5.2rem",
  height: "2.6rem",
  borderRadius: vars.radius.pill,
});

export const cardMain = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
});

export const cardTitle = style({
  ...placeholder,
  width: "82%",
  height: "1.8rem",
});

export const cardTitleShort = style({
  ...placeholder,
  width: "58%",
  height: "1.8rem",
});

export const cardDescription = style({
  ...placeholder,
  width: "44%",
  height: "1.4rem",
});

export const cardFooter = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  paddingTop: vars.spacing.md,
  borderTop: `1px solid ${vars.color.strokeLight}`,
});

export const cardSchedule = style({
  ...placeholder,
  width: "12rem",
  height: "1.4rem",
});

export const cardParticipants = style({
  ...placeholder,
  width: "5.6rem",
  height: "1.4rem",
});
