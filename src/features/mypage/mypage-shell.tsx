import type { ReactNode } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { CalendarCheck, Sprout } from "lucide-react";
import type { MyPageData, ProfileTrust } from "./mypage-model";
import { LogoutButton } from "./logout-button";
import * as styles from "./mypage-shell.css";

type MyPageShellProps = {
  children: ReactNode;
  publicProfile: MyPageData["publicProfile"];
};

type TrustStatsProps = {
  trust: ProfileTrust;
};

function TrustStats({ trust }: TrustStatsProps) {
  const hasStats = trust.activityTopPercent !== null || trust.recentAttendances.length > 0;

  if (!hasStats && trust.representativeTags.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.divider} />
      {hasStats && (
        <dl className={styles.stats}>
          {trust.activityTopPercent !== null && (
            <div className={styles.statRow}>
              <div className={styles.activityIcon}>
                <Sprout aria-hidden="true" size={15} strokeWidth={2} />
              </div>
              <div className={styles.statCopy}>
                <dt className={styles.statLabel}>활동률</dt>
                <dd className={styles.statValue}>상위 {trust.activityTopPercent}%</dd>
              </div>
            </div>
          )}
          {trust.recentAttendances.length > 0 && (
            <div className={styles.statRow}>
              <div className={styles.attendanceIcon}>
                <CalendarCheck aria-hidden="true" size={15} strokeWidth={2} />
              </div>
              <div className={styles.statCopy}>
                <dt className={styles.statLabel}>최근 출석</dt>
                <dd>
                  <ul aria-label="최근 출석 기록" className={styles.attendanceChecks}>
                    {trust.recentAttendances.map((attendance, index) => (
                      <li
                        aria-label={attendance === "ATTENDED" ? "출석" : "불참"}
                        className={styles.attendanceCheck[attendance]}
                        key={`${attendance}-${index}`}
                      >
                        {attendance === "ATTENDED" && <span aria-hidden="true">✓</span>}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </div>
          )}
        </dl>
      )}
      {trust.representativeTags.length > 0 && (
        <ul aria-label="대표 평가" className={styles.tags}>
          {trust.representativeTags.map((tag) => (
            <li className={styles.tag} key={tag.label}>
              <span>{tag.label}</span>
              <span className={styles.tagCount}>{tag.count}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function MyPageShell({ children, publicProfile }: MyPageShellProps) {
  const jobTitle = publicProfile.interestJobRoles.map((jobRole) => jobRole.displayName).join(" · ");
  const avatarLabel = Array.from(publicProfile.nickname.trim())[0] ?? "?";

  return (
    <main className={styles.content}>
      <div className={styles.columns}>
        <aside className={styles.leftColumn}>
          <section aria-label="내 공개 프로필" className={styles.trustCard}>
            <div className={styles.identity}>
              <div aria-hidden="true" className={styles.profileAvatar}>
                {avatarLabel}
              </div>
              <div className={styles.identityCopy}>
                <h1 className={styles.nickname}>{publicProfile.nickname}</h1>
                {jobTitle && <p className={styles.jobTitle}>{jobTitle}</p>}
              </div>
            </div>

            {publicProfile.bio && <p className={styles.bio}>{publicProfile.bio}</p>}
            <TrustStats trust={publicProfile.trust} />
          </section>

          <div className={styles.accountActions}>
            <LogoutButton />
          </div>
        </aside>

        <Tabs.Root className={styles.editorColumn} defaultValue="profile">
          <Tabs.List aria-label="마이페이지 메뉴" className={styles.tabList}>
            <Tabs.Tab className={styles.tab} value="profile">
              프로필 수정
            </Tabs.Tab>
            <Tabs.Tab className={styles.tab} disabled value="resume">
              이력서 관리
            </Tabs.Tab>
            <Tabs.Tab className={styles.tab} disabled value="activity">
              활동과 후기
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel className={styles.editorCard} value="profile">
            <h2 className={styles.editorTitle}>프로필 수정</h2>
            {children}
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </main>
  );
}
