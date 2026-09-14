"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as styles from "./top-bar.css";

type TopBarNavLinkProps = {
  children: ReactNode;
  href: string;
};

export function TopBarNavLink({ children, href }: TopBarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={`${styles.navItem} ${isActive ? styles.activeNavItem : ""}`}
      href={href}
    >
      {children}
    </Link>
  );
}
