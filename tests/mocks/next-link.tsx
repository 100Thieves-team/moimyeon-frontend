import type { ComponentPropsWithoutRef } from "react";

type TestLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
};

export default function TestLink({ children, href, ...props }: TestLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
