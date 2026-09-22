"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { publicProfileOptions } from "@/api/generated/@tanstack/react-query.gen";
import * as styles from "./trust-card.css";

type TrustCardProps = {
  memberId: string;
  isHost?: boolean;
};

export function TrustCard({ memberId, isHost = false }: TrustCardProps) {
  const { data: response } = useSuspenseQuery(publicProfileOptions({ path: { memberId } }));
  const profile = response.data;
  if (!profile) throw new Error("Failed to load public profile");

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
    <article aria-label={`${profile.nickname} 공개 신뢰 카드`} className={styles.card}>
      <div className={styles.identity}>
        <div aria-hidden="true" className={isHost ? styles.hostAvatar : styles.avatar}>
          {avatarLabel}
        </div>
        <div className={styles.identityCopy}>
          <div className={styles.nameRow}>
            <h2 className={styles.nickname}>{profile.nickname}</h2>
            {isHost && <span className={styles.hostBadge}>방장</span>}
          </div>
          {jobRoleLabel && <p className={styles.jobRoles}>{jobRoleLabel}</p>}
        </div>
      </div>

      <p className={styles.trustSummary}>{trustLabels.join(" · ")}</p>

      {profile.bio && (
        <div className={styles.bio}>
          <span className={styles.bioLabel}>소개</span>
          <p>{profile.bio}</p>
        </div>
      )}

      {profile.trust.representativeTags.length > 0 && (
        <div className={styles.tagsBlock}>
          <p className={styles.tagsLabel}>자주 받은 평가</p>
          <ul aria-label="대표 평가" className={styles.tags}>
            {profile.trust.representativeTags.map((tag) => (
              <li className={styles.tag} key={tag.label}>
                <span>{tag.label}</span>
                <span className={styles.tagCount}>{tag.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
