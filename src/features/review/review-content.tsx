"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import Link from "next/link";
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

  /* 제출을 마치면 리스트 순서상 다음 WRITABLE 대상을 이어서 연다 (끝이면 앞에서부터) */
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
        <h1 className={styles.title}>함께한 분들에게 후기를 남겨주세요</h1>
        <section aria-label="면접 정보" className={styles.sessionCard}>
          <div className={styles.sessionInfo}>
            <h2 className={styles.sessionTitle}>{room.title}</h2>
            {completedDate !== null && <p className={styles.sessionDate}>{completedDate}</p>}
          </div>
          <Link className={styles.detailLink} href={`/interviews/${roomId}`}>
            상세 보기
          </Link>
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
