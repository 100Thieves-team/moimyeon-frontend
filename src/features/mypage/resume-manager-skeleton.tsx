import { Skeleton } from "@/components/skeleton";
import * as styles from "./resume-manager.css";
import * as panelStyles from "./mypage-panel.css";

export function ResumeManagerSkeleton() {
  return (
    <section className={panelStyles.card} aria-label="이력서 불러오는 중" aria-busy="true">
      <Skeleton width="10rem" height="2.2rem" />
      <div className={styles.manager}>
        <div className={styles.list}>
          {[0, 1, 2].map((resume) => (
            <div className={styles.row} key={resume}>
              <div className={styles.fileCell}>
                <Skeleton width="4rem" height="2.4rem" />
                <div className={styles.fileInfo}>
                  <Skeleton width="16rem" height="2rem" />
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
        <div className={panelStyles.centeredFooter}>
          <Skeleton width="16rem" height="4.4rem" />
        </div>
      </div>
    </section>
  );
}
