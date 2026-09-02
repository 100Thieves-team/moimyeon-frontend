"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { roomDetailOptions } from "@/api/generated/@tanstack/react-query.gen";
import { HostProfileCard } from "./host-profile-card";
import { InterviewActionCard } from "./interview-action-card";
import {
  formatInterviewSchedule,
  getInterviewMetaLabels,
  getInterviewRelationLabel,
} from "./interview-detail-model";
import * as styles from "./interview-detail.css";

export function InterviewDetailContent({ roomId }: { roomId: string }) {
  const { data: response } = useSuspenseQuery(roomDetailOptions({ path: { roomId } }));
  const room = response.data;

  if (!room) {
    throw new Error("Failed to load interview detail");
  }

  const metaLabels = getInterviewMetaLabels(room);
  const relationLabel = getInterviewRelationLabel(room);
  const methodAndRegion = [room.methodLabel, room.region?.label].filter(Boolean).join(" · ");
  const recruit = room.recruit;

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.badges}>
            {recruit && (
              <span
                className={
                  recruit.recruitStatus === "RECRUITING"
                    ? styles.statusBadge.recruiting
                    : styles.statusBadge.closed
                }
              >
                {recruit.recruitStatusLabel}
              </span>
            )}
            {relationLabel && <span className={styles.relationBadge}>{relationLabel}</span>}
          </div>

          <h1 className={styles.title}>{room.title}</h1>
          {metaLabels.length > 0 && <p className={styles.meta}>{metaLabels.join(" · ")}</p>}

          <dl className={styles.infoStrip}>
            <div className={styles.infoColumn}>
              <dt className={styles.infoLabel}>진행 일정</dt>
              <dd className={styles.infoValue}>{formatInterviewSchedule(room.schedule)}</dd>
            </div>
            <div className={styles.infoColumn}>
              <dt className={styles.infoLabel}>진행 방식</dt>
              <dd className={styles.infoValue}>{methodAndRegion}</dd>
            </div>
            <div className={styles.infoColumn}>
              <dt className={styles.infoLabel}>모집 인원</dt>
              <dd className={styles.infoValue}>
                {recruit ? `최소 ${recruit.min} · 최대 ${recruit.max}명` : "인원 정보 없음"}
              </dd>
            </div>
          </dl>
        </section>

        <div className={styles.detailLayout}>
          <div className={styles.detailCopy}>
            <section className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>면접 소개</h2>
              <p className={styles.description}>
                {room.description || "방장이 작성한 면접 소개가 아직 없어요."}
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionTitle}>참여 전에 알아두세요</h2>
              <ul className={styles.policyList}>
                <li>신청할 땐 본인의 이력서를 첨부해야 해요.</li>
                <li>
                  {room.resumePublic
                    ? "이력서 원본은 참여가 확정된 사람끼리 공유해요."
                    : "이력서 원본은 다른 참여자에게 공개하지 않아요."}
                </li>
                <li>확정 후 취소·노쇼는 활동 이력에 남아요.</li>
              </ul>
            </section>
          </div>

          <div className={styles.rightRail}>
            <InterviewActionCard room={room} />
            <HostProfileCard memberId={room.hostMemberId} />
          </div>
        </div>
      </div>
    </main>
  );
}
