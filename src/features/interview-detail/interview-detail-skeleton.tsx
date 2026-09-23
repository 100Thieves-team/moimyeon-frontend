import { Skeleton } from "@/components/skeleton";
import * as styles from "./interview-detail.css";

export function InterviewDetailSkeleton({
  presentation = "page",
}: {
  presentation?: "page" | "panel";
}) {
  const isPanel = presentation === "panel";
  const Container = isPanel ? "section" : "main";
  return (
    <Container
      className={isPanel ? undefined : styles.page}
      aria-label="면접 상세 불러오는 중"
      aria-busy="true"
    >
      <div className={isPanel ? undefined : styles.content}>
        <div className={isPanel ? undefined : styles.hero}>
          {!isPanel && (
            <>
              <Skeleton className={styles.title} width="80%" height="4.6rem" />
              <Skeleton className={styles.meta} width="45%" height="2.4rem" />
            </>
          )}
          <div className={isPanel ? styles.panelInfoStrip : styles.infoStrip}>
            {[0, 1, 2].map((item) => (
              <div className={styles.infoColumn} key={item}>
                <Skeleton className={styles.infoLabel} width="6rem" height="1lh" />
                <Skeleton className={styles.infoValue} width="70%" height="1lh" />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.detailLayout}>
          <div className={styles.detailCopy}>
            <div className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>면접 소개</h2>
              <div className={styles.description}>
                <Skeleton width="95%" height="1lh" />
                <Skeleton width="65%" height="1lh" />
              </div>
            </div>
            <div className={styles.policySection}>
              <h2 className={styles.sectionTitle}>참여 전에 알아두세요</h2>
              <div className={styles.policyList}>
                <Skeleton width="85%" height="1lh" />
                <Skeleton width="95%" height="1lh" />
                <Skeleton width="75%" height="1lh" />
              </div>
            </div>
          </div>
          <div className={styles.rightRail}>
            <div className={styles.actionCard}>
              <div className={styles.quotaStatusRow}>
                <Skeleton width="6rem" height="2.6rem" />
                <Skeleton width="5rem" height="1.8rem" />
              </div>
              <div className={styles.badges}>
                {[0, 1, 2].map((item) => (
                  <Skeleton key={item} circle width="4rem" height="4rem" />
                ))}
              </div>
              <Skeleton className={styles.remainingQuota} width="6rem" height="1lh" />
              <Skeleton width="100%" height="0.6rem" />
              <Skeleton width="100%" height="5rem" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
