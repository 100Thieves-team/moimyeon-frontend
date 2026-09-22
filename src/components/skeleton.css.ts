import { keyframes, style } from "@vanilla-extract/css";
import { media, vars } from "@/styles";

const shimmer = keyframes({
  from: { transform: "translateX(-100%)" },
  to: { transform: "translateX(100%)" },
});

export const skeleton = style({
  position: "relative",
  display: "block",
  maxWidth: "100%",
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: "0.6rem",
  backgroundColor: vars.color.fillSecondary,
  selectors: {
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: `linear-gradient(90deg, transparent, ${vars.color.white50}, transparent)`,
      animation: `${shimmer} 1.6s linear infinite`,
    },
  },
  "@media": {
    [media.dark]: {
      selectors: {
        "&::after": {
          backgroundImage: `linear-gradient(90deg, transparent, ${vars.color.white10}, transparent)`,
        },
      },
    },
    [media.reducedMotion]: {
      selectors: { "&::after": { display: "none", animation: "none" } },
    },
  },
});

export const circle = style({ borderRadius: vars.radius.pill });
