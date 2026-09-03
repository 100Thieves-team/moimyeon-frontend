"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarCheck, Sprout } from "lucide-react";
import { publicProfileOptions } from "@/api/generated/@tanstack/react-query.gen";
import * as styles from "./trust-card.css";

type TrustCardProps = {
  memberId: string;
};

export function TrustCard({ memberId }: TrustCardProps) {
  const { data: profileResponse } = useSuspenseQuery(publicProfileOptions({ path: { memberId } }));
  const profile = profileResponse.data;

  if (profile === undefined || profile === null) {
    throw new Error("Failed to load public profile");
  }

  const jobTitle = profile.interestJobRoles.map((jobRole) => jobRole.displayName).join(" · ");
  const avatarLabel = Array.from(profile.nickname.trim())[0] ?? "?";
  const { trust } = profile;
  const hasStats = trust.activityTopPercent !== null || trust.recentAttendances.length > 0;

  return (
    <article aria-label={`${profile.nickname} 공개 신뢰 카드`} className={styles.card}>
      <div className={styles.identity}>
        <span aria-hidden="true" className={styles.avatar}>
          {avatarLabel}
        </span>
        <div className={styles.identityCopy}>
          <p className={styles.nickname}>{profile.nickname}</p>
          {jobTitle !== "" && <p className={styles.jobTitle}>{jobTitle}</p>}
        </div>
      </div>
      {hasStats && (
        <dl className={styles.stats}>
          {trust.activityTopPercent !== null && (
            <div className={styles.statRow}>
              <Sprout aria-hidden="true" className={styles.statIcon} size={14} strokeWidth={2} />
              <dt className={styles.statLabel}>활동률</dt>
              <dd className={styles.statValue}>상위 {trust.activityTopPercent}%</dd>
            </div>
          )}
          {trust.recentAttendances.length > 0 && (
            <div className={styles.statRow}>
              <CalendarCheck
                aria-hidden="true"
                className={styles.statIcon}
                size={14}
                strokeWidth={2}
              />
              <dt className={styles.statLabel}>최근 출석</dt>
              <dd className={styles.statValue}>
                {trust.recentAttendances.filter((status) => status === "ATTENDED").length} /{" "}
                {trust.recentAttendances.length}회 출석
              </dd>
            </div>
          )}
          {trust.noShowCount > 0 && (
            <div className={styles.statRow}>
              <dt className={styles.statLabel}>노쇼</dt>
              <dd className={styles.statValue}>{trust.noShowCount}회</dd>
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
      {!hasStats && trust.representativeTags.length === 0 && (
        <p className={styles.empty}>아직 완료한 면접 활동이 없어요.</p>
      )}
    </article>
  );
}
