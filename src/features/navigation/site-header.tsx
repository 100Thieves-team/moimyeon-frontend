import type { ReactNode } from "react";
import Link from "next/link";
import { TopBarNavLink } from "./top-bar-nav-link";
import * as styles from "./top-bar.css";

type SiteHeaderProps = {
  children: ReactNode;
  showMyInterviews?: boolean;
  variant?: "site" | "introduction";
};

export function SiteHeader({
  children,
  showMyInterviews = false,
  variant = "site",
}: SiteHeaderProps) {
  return (
    <header className={styles.header} data-variant={variant}>
      <nav aria-label="주요 메뉴" className={styles.nav}>
        <div className={styles.navLeft}>
          <Link aria-label="모이면 홈" className={styles.brand} href="/">
            모이면
          </Link>
          <ul className={styles.navList}>
            <li className={styles.desktopNavItem}>
              <TopBarNavLink href="/">면접</TopBarNavLink>
            </li>
            {showMyInterviews && (
              <li className={styles.desktopNavItem}>
                <TopBarNavLink href="/interviews/me">내 면접</TopBarNavLink>
              </li>
            )}
            <li>
              <TopBarNavLink href="/about">서비스 소개</TopBarNavLink>
            </li>
          </ul>
        </div>
        <div className={styles.navActions}>{children}</div>
      </nav>
    </header>
  );
}
