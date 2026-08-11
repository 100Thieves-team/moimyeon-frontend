import Link from "next/link";
import { LoginTrigger } from "@/features/auth/login-dialog";
import * as styles from "./top-bar.css";

export function TopBar() {
  return (
    <header className={styles.header}>
      <nav aria-label="주요 메뉴" className={styles.nav}>
        <div className={styles.navLeft}>
          <Link className={styles.brand} href="/">
            모이면
          </Link>
          <ul className={styles.navList}>
            <li className={styles.activeNavItem}>면접 탐색</li>
            <li>내 면접</li>
          </ul>
        </div>

        <div className={styles.navActions}>
          <LoginTrigger className={styles.loginButton} returnTo="/">
            로그인
          </LoginTrigger>
          <LoginTrigger className={styles.createButton} returnTo="/interviews/new">
            면접 만들기
          </LoginTrigger>
        </div>
      </nav>
    </header>
  );
}
