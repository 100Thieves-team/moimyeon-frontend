import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { media, textStyle, vars } from "@/styles";

export const buttonRecipe = recipe({
  base: {
    display: "inline-flex",
    flex: "0 0 auto",
    alignItems: "center",
    justifyContent: "center",
    gap: vars.spacing.sm,
    border: "1px solid transparent",
    borderRadius: vars.radius.cta,
    textAlign: "center",
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: `background-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, border-color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, color ${vars.motion.duration.fast} ${vars.motion.ease.fade}, opacity ${vars.motion.duration.fast} ${vars.motion.ease.fade}, transform ${vars.motion.duration.fast} ${vars.motion.ease.fade}`,
    selectors: {
      "&:focus-visible": {
        outline: `2px solid ${vars.color.primary}`,
        outlineOffset: "3px",
      },
      "&:active:not([data-disabled])": {
        transform: "scale(0.98)",
      },
      "&[data-disabled]": {
        opacity: 0.45,
        cursor: "not-allowed",
      },
    },
    "@media": {
      [media.reducedMotion]: {
        transition: "none",
        selectors: {
          "&:active:not([data-disabled])": {
            transform: "none",
          },
        },
      },
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: vars.color.fillPrimary,
        color: vars.color.background,
        "@media": {
          [media.hover]: {
            selectors: {
              "&:hover:not([data-disabled])": {
                opacity: 0.82,
              },
            },
          },
        },
      },
      secondary: {
        borderColor: vars.color.strokeMedium,
        backgroundColor: "transparent",
        color: vars.color.primary,
        "@media": {
          [media.hover]: {
            selectors: {
              "&:hover:not([data-disabled])": {
                backgroundColor: vars.color.fillTertiary,
              },
            },
          },
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: vars.color.secondary,
        "@media": {
          [media.hover]: {
            selectors: {
              "&:hover:not([data-disabled])": {
                backgroundColor: vars.color.fillTertiary,
                color: vars.color.primary,
              },
            },
          },
        },
      },
    },
    size: {
      sm: [
        textStyle.buttonSm,
        {
          minHeight: "4.4rem",
          paddingInline: "1.6rem",
        },
      ],
      md: [
        textStyle.buttonMd,
        {
          minHeight: "4.8rem",
          paddingInline: "2.4rem",
        },
      ],
      lg: [
        textStyle.buttonLg,
        {
          minHeight: "5.6rem",
          paddingInline: "2.8rem",
        },
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonStyleProps = NonNullable<RecipeVariants<typeof buttonRecipe>>;
