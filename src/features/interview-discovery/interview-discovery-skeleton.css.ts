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
  height: "2rem",
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
