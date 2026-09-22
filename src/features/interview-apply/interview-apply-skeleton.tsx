import { Skeleton } from "@/components/skeleton";
import * as styles from "./interview-apply.css";

export function InterviewApplySkeleton() {
  return (
    <main className={styles.page} aria-label="참가 신청 불러오는 중" aria-busy="true">
      <div className={styles.content}>
        <Skeleton width="16rem" height="3.8rem" />
        <div className={styles.roomSummary}>
          <div className={styles.roomCopy}>
            <Skeleton width="75%" height="2.1rem" />
            <Skeleton width="50%" height="1.9rem" />
          </div>
          <Skeleton width="5.6rem" height="1.9rem" />
        </div>
        <div className={styles.formCard}>
          <div className={styles.field}>
            <Skeleton width="6rem" height="2rem" />
            <Skeleton width="100%" height="7.2rem" />
          </div>
          <div className={styles.field}>
            <Skeleton width="6rem" height="2rem" />
            <Skeleton width="100%" height="12rem" />
          </div>
          <Skeleton width="100%" height="5rem" />
        </div>
      </div>
    </main>
  );
}
