import "server-only";

import Link from "next/link";
import { Avatar } from "@base-ui/react/avatar";
import { LinkButton } from "@/components/button";
import { getCurrentMemberState } from "@/features/auth/current-member-server";
import { LoginTrigger } from "@/features/auth/login-dialog";
import { TopBarNavLink } from "./top-bar-nav-link";
import * as styles from "./top-bar.css";

function getAvatarLabel(nickname: string) {
  return Array.from(nickname.trim())[0] ?? "?";
}

export async function TopBar() {
  const currentMemberState = await getCurrentMemberState();

  return (
    <header className={styles.header}>
      <nav aria-label="주요 메뉴" className={styles.nav}>
        <div className={styles.navLeft}>
          <Link className={styles.brand} href="/">
            모이면
          </Link>
          <ul className={styles.navList}>
            <li>
              <TopBarNavLink href="/" segment={null}>
                면접 탐색
              </TopBarNavLink>
            </li>
            <li className={styles.navItem}>내 면접</li>
            {currentMemberState.status === "authenticated" && (
              <li>
                <TopBarNavLink href="/mypage" segment="mypage">
                  마이페이지
                </TopBarNavLink>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.navActions}>
          {currentMemberState.status === "authenticated" ? (
            <>
              <LinkButton href="/interviews/new" size="sm">
                면접 만들기
              </LinkButton>
              <Link
                aria-label={`${currentMemberState.member.nickname} 마이페이지`}
                className={styles.avatarLink}
                href="/mypage"
              >
                <Avatar.Root aria-hidden className={styles.avatarRoot}>
                  <Avatar.Fallback className={styles.avatarFallback}>
                    {getAvatarLabel(currentMemberState.member.nickname)}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Link>
            </>
          ) : (
            <>
              <LoginTrigger returnTo="/" size="sm" variant="ghost">
                로그인
              </LoginTrigger>
              <LoginTrigger returnTo="/interviews/new" size="sm">
                면접 만들기
              </LoginTrigger>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
