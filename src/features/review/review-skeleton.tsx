import { Skeleton } from "@/components/skeleton";
import * as styles from "./review-content.css";
import * as rowStyles from "./target-row.css";

export function ReviewSkeleton() {
  return (
    <main className={styles.page} aria-label="후기 작성 불러오는 중" aria-busy="true">
      <div className={styles.column}>
        <Skeleton width="80%" height="3.6rem" />
        <div className={styles.sessionCard}>
          <div className={styles.sessionInfo}>
            <Skeleton width="75%" height="2.1rem" />
            <Skeleton width="40%" height="1.9rem" />
          </div>
          <Skeleton width="5.6rem" height="1.9rem" />
        </div>
        <div className={styles.targetList}>
          {[0, 1, 2].map((target) => (
            <div className={rowStyles.row} key={target}>
              <div className={rowStyles.rowHead}>
                <Skeleton circle width="4rem" height="4rem" />
                <div className={rowStyles.nameColumn}>
                  <Skeleton width="8rem" height="2rem" />
                </div>
                <Skeleton width="2rem" height="2rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
