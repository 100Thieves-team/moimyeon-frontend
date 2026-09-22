import { Skeleton } from "@/components/skeleton";
import * as styles from "./trust-card.css";

export function TrustCardSkeleton() {
  return (
    <section className={styles.card} aria-label="프로필 불러오는 중" aria-busy="true">
      <div className={styles.identity}>
        <Skeleton circle width="4.4rem" height="4.4rem" />
        <div className={styles.identityCopy}>
          <Skeleton width="8rem" height="2.1rem" />
          <Skeleton width="12rem" height="2rem" />
        </div>
      </div>
      <Skeleton width="85%" height="2.1rem" />
      <Skeleton width="100%" height="8rem" />
      <div className={styles.tagsBlock}>
        <Skeleton width="8rem" height="1.8rem" />
        <div className={styles.tags}>
          <Skeleton width="9rem" height="2.8rem" circle />
          <Skeleton width="9rem" height="2.8rem" circle />
        </div>
      </div>
    </section>
  );
}
