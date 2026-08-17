"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { mergeProps } from "@base-ui/react/merge-props";
import { buttonRecipe, type ButtonStyleProps } from "./button.css";

export interface ButtonProps extends BaseButton.Props, ButtonStyleProps {
  className?: string;
}

export function Button({
  className,
  ref,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  const mergedProps = mergeProps<typeof BaseButton>(
    { className: buttonRecipe({ size, variant }) },
    { ...props, className },
  );

  return <BaseButton {...mergedProps} ref={ref} />;
}
