import { Skeleton } from "@/components/skeleton";
import * as styles from "./trust-card.css";

export function TrustCardSkeleton() {
  return (
    <section className={styles.card} aria-label="프로필 불러오는 중" aria-busy="true">
      <div className={styles.identity}>
        <Skeleton circle width="4.4rem" height="4.4rem" />
        <div className={styles.identityCopy}>
          <Skeleton width="8rem" height="2.1rem" />
          <Skeleton className={styles.jobRoles} width="12rem" height="1lh" />
        </div>
      </div>
      <Skeleton width="85%" height="2.1rem" />
      <div className={styles.bio}>
        <span className={styles.bioLabel}>소개</span>
        <Skeleton width="100%" height="1lh" />
        <Skeleton width="70%" height="1lh" />
      </div>
      <div className={styles.tagsBlock}>
        <p className={styles.tagsLabel}>자주 받은 평가</p>
        <div className={styles.tags}>
          <Skeleton width="9rem" height="2.8rem" circle />
          <Skeleton width="9rem" height="2.8rem" circle />
        </div>
      </div>
    </section>
  );
}
