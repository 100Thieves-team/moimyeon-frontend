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
            <Skeleton className={styles.bio} width="85%" height="1lh" />
          </div>
          <div className={styles.accountActions}>
            <Skeleton width="8rem" height="4.4rem" />
          </div>
        </div>
        <div className={styles.editorColumn}>
          <div className={styles.tabList} aria-hidden="true">
            {["프로필 수정", "이력서 관리", "받은 후기"].map((label) => (
              <span className={styles.tab} key={label}>
                {label}
              </span>
            ))}
          </div>
          <div className={panelStyles.card}>
            <h2 className={panelStyles.title}>프로필 수정</h2>
            <div className={formStyles.firstRow}>
              <ProfileFieldSkeleton />
              <ProfileFieldSkeleton />
            </div>
            <div className={formStyles.field}>
              <Skeleton width="6rem" height="2rem" />
              <Skeleton width="100%" height="7.2rem" />
            </div>
            <div className={formStyles.field}>
              <Skeleton width="6rem" height="2rem" />
              <Skeleton className={formStyles.companyPillFrame} width="100%" />
            </div>
            <div className={panelStyles.footer}>
              <Skeleton width="10.4rem" height="4.8rem" />
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
      <Skeleton width="100%" height="4.6rem" />
    </div>
  );
}
