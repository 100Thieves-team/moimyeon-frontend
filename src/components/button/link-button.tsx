import { mergeProps } from "@base-ui/react/merge-props";
import Link from "next/link";
import type { ComponentPropsWithRef } from "react";
import { buttonRecipe, type ButtonStyleProps } from "./button.css";

type NextLinkProps = ComponentPropsWithRef<typeof Link>;

export interface LinkButtonProps extends NextLinkProps, ButtonStyleProps {}

export function LinkButton({
  className,
  href,
  ref,
  size = "md",
  variant = "primary",
  ...props
}: LinkButtonProps) {
  const mergedClassNameProps = mergeProps<"a">(
    { className: buttonRecipe({ size, variant }) },
    { className },
  );

  return <Link {...props} href={href} {...mergedClassNameProps} ref={ref} />;
}
