import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import { vars } from "./theme.css";
import { media } from "./tokens";

const space = { none: "0", ...vars.spacing };

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    sm: { "@media": media.sm },
    md: { "@media": media.md },
    lg: { "@media": media.lg },
    xl: { "@media": media.xl },
    "2xl": { "@media": media["2xl"] },
  },
  defaultCondition: "mobile",
  properties: {
    display: ["none", "block", "flex", "grid", "inline-flex"],
    flexDirection: ["row", "column"],
    flexWrap: ["wrap", "nowrap"],
    alignItems: ["stretch", "flex-start", "center", "flex-end", "baseline"],
    justifyContent: ["flex-start", "center", "flex-end", "space-between"],
    gap: space,
    columnGap: space,
    rowGap: space,
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    marginTop: { ...space, auto: "auto" },
    marginBottom: { ...space, auto: "auto" },
    marginLeft: { ...space, auto: "auto" },
    marginRight: { ...space, auto: "auto" },
    textAlign: ["left", "center", "right"],
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    margin: ["marginTop", "marginBottom", "marginLeft", "marginRight"],
    marginX: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"],
  },
});

// 컬러는 CSS 변수라 다크 모드에서 자동 전환된다 — 브레이크포인트 조건 불필요.
const unconditionalProperties = defineProperties({
  properties: {
    color: vars.color,
    backgroundColor: vars.color,
    borderColor: vars.color,
    borderRadius: vars.radius,
    boxShadow: vars.shadow,
  },
});

export const sprinkles = createSprinkles(responsiveProperties, unconditionalProperties);

export type Sprinkles = Parameters<typeof sprinkles>[0];
