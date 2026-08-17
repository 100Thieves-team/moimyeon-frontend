"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import * as styles from "./top-bar.css";

type TopBarNavLinkProps = {
  children: ReactNode;
  href: string;
  segment: string | null;
};

export function TopBarNavLink({ children, href, segment }: TopBarNavLinkProps) {
  const selectedSegment = useSelectedLayoutSegment();
  const isActive = selectedSegment === segment;

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
