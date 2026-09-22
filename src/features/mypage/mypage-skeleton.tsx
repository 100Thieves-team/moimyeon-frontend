import { Skeleton } from "@/components/skeleton";
import * as styles from "./mypage-shell.css";
import * as panelStyles from "./mypage-panel.css";
import * as formStyles from "./profile-editor.css";

export function MyPageSkeleton() {
  return (
    <main className={styles.content} aria-label="마이페이지 불러오는 중" aria-busy="true">
      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <div className={styles.trustCard}>
            <div className={styles.identity}>
              <Skeleton circle width="6.4rem" height="6.4rem" />
              <div className={styles.identityCopy}>
                <Skeleton width="10rem" height="2.4rem" />
                <Skeleton width="8rem" height="1.8rem" />
              </div>
            </div>
            <Skeleton width="100%" height="6rem" />
            <div className={styles.stats}>
              <Skeleton width="85%" height="4.4rem" />
              <Skeleton width="70%" height="4.4rem" />
            </div>
            <Skeleton width="100%" height="2.8rem" />
          </div>
          <Skeleton width="8rem" height="2rem" />
        </div>
        <div className={styles.editorColumn}>
          <Skeleton width="30rem" height="4.7rem" />
          <div className={panelStyles.card}>
            <Skeleton width="10rem" height="2.2rem" />
            <div className={formStyles.form}>
              <div className={formStyles.firstRow}>
                {[0, 1].map((field) => (
                  <ProfileFieldSkeleton key={field} />
                ))}
              </div>
              <ProfileFieldSkeleton />
              <ProfileFieldSkeleton />
              <div className={formStyles.field}>
                <Skeleton width="6rem" height="2rem" />
                <Skeleton width="100%" height="10rem" />
              </div>
            </div>
            <div className={panelStyles.footer}>
              <Skeleton width="10.4rem" height="4.4rem" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileFieldSkeleton() {
  return (
    <div className={formStyles.field}>
      <Skeleton width="6rem" height="2rem" />
      <Skeleton width="100%" height="4.4rem" />
    </div>
  );
}
