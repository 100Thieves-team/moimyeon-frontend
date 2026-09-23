import { Skeleton } from "@/components/skeleton";
import * as styles from "./interview-apply.css";
import * as resumeStyles from "@/features/resume/resume-picker.css";

export function InterviewApplySkeleton() {
  return (
    <main className={styles.page} aria-label="참가 신청 불러오는 중" aria-busy="true">
      <div className={styles.content}>
        <header className={styles.heading}>
          <h1 className={styles.title}>참가 신청</h1>
        </header>
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
            <Skeleton width="100%" height="7.3rem" />
            <div className={resumeStyles.resumeSummary}>
              <span className={resumeStyles.resumeSummaryLabel}>AI 요약</span>
              <Skeleton className={resumeStyles.resumeSummaryText} width="100%" />
            </div>
          </div>
          <div className={styles.field}>
            <Skeleton width="6rem" height="2rem" />
            <Skeleton width="100%" height="7.2rem" />
          </div>
          <Skeleton width="100%" height="5rem" />
        </div>
      </div>
    </main>
  );
}
