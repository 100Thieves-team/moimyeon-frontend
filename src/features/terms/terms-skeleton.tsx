import { Skeleton } from "@/components/skeleton";
import * as styles from "./terms-page.css";
import * as skeletonStyles from "./terms-skeleton.css";

export function TermsSkeleton() {
  return (
    <div className={styles.page}>
      <main className={styles.article} aria-label="약관 불러오는 중" aria-busy="true">
        <Skeleton width="55%" height="4.6rem" />
        <Skeleton className={styles.meta} width="12rem" height="2rem" />
        <div className={styles.content}>
          <div className={skeletonStyles.paragraphs}>
            {[0, 1, 2, 3].map((paragraph) => (
              <div className={skeletonStyles.paragraph} key={paragraph}>
                <Skeleton width="30%" height="2rem" />
                <Skeleton width="100%" height="1.6rem" />
                <Skeleton width="100%" height="1.6rem" />
                <Skeleton width="70%" height="1.6rem" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
