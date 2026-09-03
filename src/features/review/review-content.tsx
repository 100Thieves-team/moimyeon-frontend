"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";
import {
  getReviewTargetsOptions,
  roomDetailOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { formatCompletedDate, isSubmittedTarget } from "./review-model";
import * as styles from "./review-content.css";
import { TargetRow } from "./target-row";
import { SubmittedTargetRow } from "./target-row";

type ReviewContentProps = {
  roomId: string;
};

export function ReviewContent({ roomId }: ReviewContentProps) {
  const [{ data: roomResponse }, { data: targetsResponse }] = useSuspenseQueries({
    queries: [
      roomDetailOptions({ path: { roomId } }),
      getReviewTargetsOptions({ path: { roomId } }),
    ],
  });
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const room = roomResponse.data;
  const reviewTargets = targetsResponse.data;

  if (room === undefined || room === null) {
    throw new Error("Failed to load room detail");
  }

  if (reviewTargets === undefined || reviewTargets === null) {
    throw new Error("Failed to load review targets");
  }

  const completedDate = formatCompletedDate(room.schedule?.startAt);
  const { targets } = reviewTargets;

  /* 제출·건너뛰기를 마치면 리스트 순서상 다음 WRITABLE 대상을 이어서 연다 (끝이면 앞에서부터) */
  const openNextWritable = (memberId: string) => {
    const currentIndex = targets.findIndex((target) => target.memberId === memberId);
    const nextTarget = [...targets.slice(currentIndex + 1), ...targets.slice(0, currentIndex)].find(
      (target) => !isSubmittedTarget(target),
    );

    setExpandedMemberId(nextTarget?.memberId ?? null);
  };

  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <h1 className={styles.title}>함께한 분들의 후기를 남겨요</h1>
        <section aria-label="면접 정보" className={styles.sessionCard}>
          <span aria-hidden="true" className={styles.sessionAvatar}>
            {room.title.charAt(0)}
          </span>
          <div className={styles.sessionInfo}>
            <p className={styles.sessionTitle}>{room.title}</p>
            {completedDate !== null && <p className={styles.sessionDate}>{completedDate}</p>}
          </div>
          <p className={styles.sessionProgress}>
            {reviewTargets.submittedCount} / {reviewTargets.totalCount} 작성함
          </p>
        </section>
        <section aria-label="후기 작성 대상" className={styles.targetList}>
          {targets.map((target) => {
            const commonProps = {
              expanded: expandedMemberId === target.memberId,
              isHost: target.memberId === room.hostMemberId,
              onExpandedChange: (expanded: boolean) => {
                setExpandedMemberId(expanded ? target.memberId : null);
              },
              roomId,
              target,
            };

            return isSubmittedTarget(target) ? (
              <SubmittedTargetRow
                {...commonProps}
                key={target.memberId}
                onCompleted={() => setExpandedMemberId(null)}
              />
            ) : (
              <TargetRow
                {...commonProps}
                key={target.memberId}
                onCompleted={() => openNextWritable(target.memberId)}
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}
