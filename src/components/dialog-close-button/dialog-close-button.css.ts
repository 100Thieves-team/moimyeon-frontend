import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

export const closeButton = style({
  position: "absolute",
  top: "1.6rem",
  right: "1.6rem",
  display: "grid",
  placeItems: "center",
  width: "4rem",
  height: "4rem",
  padding: 0,
  border: 0,
  borderRadius: vars.radius.pill,
  backgroundColor: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
  },
  "@media": {
    [media.hover]: {
      selectors: { "&:hover:not(:disabled)": { backgroundColor: vars.color.fillTertiary } },
    },
  },
});
