import * as styles from "./my-interviews.css";

export function MyInterviewsSkeleton() {
  return (
    <main aria-label="내 면접 불러오는 중" aria-busy="true" className={styles.page}>
      <div className={styles.column} aria-hidden="true">
        <div className={styles.skeletonTabs} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>
    </main>
  );
}
