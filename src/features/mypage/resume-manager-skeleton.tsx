import { Skeleton } from "@/components/skeleton";
import * as styles from "./resume-manager.css";
import * as panelStyles from "./mypage-panel.css";

export function ResumeManagerSkeleton() {
  return (
    <section className={panelStyles.card} aria-label="이력서 불러오는 중" aria-busy="true">
      <h2 className={panelStyles.title}>이력서 관리</h2>
      <div className={styles.list}>
        {[0, 1, 2].map((resume) => (
          <div className={styles.row} key={resume}>
            <div className={styles.fileCell}>
              <Skeleton width="4rem" height="2.4rem" />
              <div className={styles.fileInfo}>
                <Skeleton className={styles.fileName} width="16rem" height="1lh" />
                <Skeleton width="10rem" height="1.7rem" />
              </div>
            </div>
            <div className={styles.summaryCell}>
              <Skeleton width="85%" height="2.4rem" />
            </div>
            <div className={styles.rowActions}>
              <Skeleton width="8rem" height="3.4rem" />
            </div>
          </div>
        ))}
      </div>
      <div className={panelStyles.footer}>
        <Skeleton width="16rem" height="4.8rem" />
      </div>
    </section>
  );
}
