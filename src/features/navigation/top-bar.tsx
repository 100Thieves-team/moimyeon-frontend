import "server-only";

import Link from "next/link";
import { Avatar } from "@base-ui/react/avatar";
import { LinkButton } from "@/components/button";
import { getCurrentMemberState } from "@/features/auth/current-member-server";
import { LoginTrigger } from "@/features/auth/login-dialog";
import { SiteHeader } from "./site-header";
import * as styles from "./top-bar.css";

function getAvatarLabel(nickname: string) {
  return Array.from(nickname.trim())[0] ?? "?";
}

export async function TopBar() {
  const currentMemberState = await getCurrentMemberState();

  return (
    <SiteHeader showMyInterviews={currentMemberState.status === "authenticated"}>
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
          <LoginTrigger className={styles.loginAction} returnTo="/" size="sm" variant="ghost">
            로그인
          </LoginTrigger>
          <LoginTrigger className={styles.loginAction} returnTo="/interviews/new" size="sm">
            면접 만들기
          </LoginTrigger>
        </>
      )}
    </SiteHeader>
  );
}
