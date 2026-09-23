import { Skeleton } from "@/components/skeleton";
import * as styles from "./my-interviews.css";

export function MyInterviewsSkeleton() {
  return (
    <main aria-label="내 면접 불러오는 중" aria-busy="true" className={styles.page}>
      <div className={styles.column} aria-hidden="true">
        <div className={styles.tabs}>
          {["4rem", "5rem", "4rem"].map((width, index) => (
            <span className={styles.tab} key={index}>
              <Skeleton width={width} height="1.8rem" />
              <Skeleton width="0.8rem" height="1.8rem" />
            </span>
          ))}
        </div>
        <div className={styles.list}>
          {[0, 1, 2].map((card) => (
            <div className={styles.card} key={card}>
              <div className={styles.info}>
                <Skeleton className={styles.title} width="75%" height="1lh" />
                <Skeleton className={styles.meta} width="60%" height="1lh" />
              </div>
              <div className={styles.actions}>
                <Skeleton width="6rem" height="2.9rem" circle />
                <Skeleton width="8rem" height="4.4rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
