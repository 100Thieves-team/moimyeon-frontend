"use client";

import { useQuery } from "@tanstack/react-query";
import { publicProfileOptions } from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import * as styles from "./interview-detail.css";

function ProfileState({ children }: { children: React.ReactNode }) {
  return (
    <aside aria-label="방장 공개 프로필" className={styles.hostCard}>
      <div className={styles.profileState}>{children}</div>
    </aside>
  );
}

export function HostProfileCard({ memberId }: { memberId: string }) {
  const profileQuery = useQuery(publicProfileOptions({ path: { memberId } }));
  const profile = profileQuery.data?.data;

  if (profileQuery.isPending) {
    return <ProfileState>방장 프로필을 불러오는 중이에요.</ProfileState>;
  }

  if (profileQuery.isError || !profile) {
    return (
      <ProfileState>
        <p role="alert">방장 프로필을 불러오지 못했어요.</p>
        <Button
          disabled={profileQuery.isFetching}
          onClick={() => profileQuery.refetch()}
          size="sm"
          variant="secondary"
        >
          {profileQuery.isFetching ? "다시 불러오는 중..." : "다시 불러오기"}
        </Button>
      </ProfileState>
    );
  }

  const avatarLabel = Array.from(profile.nickname.trim())[0] ?? "?";
  const jobRoleLabel = profile.interestJobRoles.map((jobRole) => jobRole.displayName).join(" · ");
  const attendedCount = profile.trust.recentAttendances.filter(
    (attendance) => attendance === "ATTENDED",
  ).length;
  const trustLabels = [
    profile.trust.activityTopPercent === null
      ? null
      : `활동률 상위 ${profile.trust.activityTopPercent}%`,
    profile.trust.recentAttendances.length > 0
      ? `최근 출석 ${attendedCount}/${profile.trust.recentAttendances.length}회`
      : null,
    `누적 불참 ${profile.trust.noShowCount}회`,
  ].filter((label): label is string => Boolean(label));

  return (
    <aside aria-label="방장 공개 프로필" className={styles.hostCard}>
      <div className={styles.hostIdentity}>
        <div aria-hidden="true" className={styles.hostAvatar}>
          {avatarLabel}
        </div>
        <div className={styles.hostIdentityCopy}>
          <div className={styles.hostNameRow}>
            <h2 className={styles.hostName}>{profile.nickname}</h2>
            <span className={styles.hostBadge}>방장</span>
          </div>
          {jobRoleLabel && <p className={styles.hostJobRoles}>{jobRoleLabel}</p>}
        </div>
      </div>

      <p className={styles.hostTrustSummary}>{trustLabels.join(" · ")}</p>

      {profile.bio && (
        <div className={styles.hostBio}>
          <span className={styles.hostBioLabel}>소개</span>
          <p>{profile.bio}</p>
        </div>
      )}

      {profile.trust.representativeTags.length > 0 && (
        <div className={styles.hostTagsBlock}>
          <p className={styles.hostTagsLabel}>자주 받은 평가</p>
          <ul aria-label="방장이 자주 받은 평가" className={styles.hostTags}>
            {profile.trust.representativeTags.map((tag) => (
              <li className={styles.hostTag} key={tag.label}>
                <span>{tag.label}</span>
                <span className={styles.hostTagCount}>{tag.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
