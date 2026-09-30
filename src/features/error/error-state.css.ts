import { style } from "@vanilla-extract/css";
import { textMetrics, vars } from "@/styles";

export const heading = style({
  ...textMetrics.sectionTitle,
  fontWeight: 600,
  color: vars.color.primary,
});

export const compactHeading = style({
  ...textMetrics.cardTitle,
  fontWeight: 600,
  color: vars.color.primary,
});

export const description = style({
  ...textMetrics.body,
  color: vars.color.secondary,
});
