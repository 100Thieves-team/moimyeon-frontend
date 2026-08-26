"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import {
  getReviewTargetsOptions,
  roomDetailOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import * as styles from "./review-content.css";

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
  const room = roomResponse.data;
  const reviewTargets = targetsResponse.data;

  if (room === undefined) {
    throw new Error("Failed to load room detail");
  }

  if (reviewTargets === undefined) {
    throw new Error("Failed to load review targets");
  }

  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <h1 className={styles.title}>함께한 분들의 후기를 남겨요</h1>
        <section aria-label="면접 정보" className={styles.sessionCard}>
          <p className={styles.sessionTitle}>{room.title}</p>
          <p className={styles.sessionProgress}>
            {reviewTargets.submittedCount} / {reviewTargets.totalCount} 작성함
          </p>
        </section>
        <section aria-label="후기 작성 대상" className={styles.targetList}>
          {reviewTargets.targets.map((target) => (
            <div className={styles.targetRow} key={target.memberId}>
              <p className={styles.targetNickname}>{target.nickname}</p>
              <p className={styles.targetStatus}>
                {target.status === "SUBMITTED" ? "제출함" : "작성 가능"}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
