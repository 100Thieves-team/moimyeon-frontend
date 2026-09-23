import { Skeleton } from "@/components/skeleton";
import * as styles from "./interview-create-wizard.css";

export function InterviewCreateSkeleton() {
  return (
    <main className={styles.page} aria-label="면접 만들기 불러오는 중" aria-busy="true">
      <div className={styles.layout}>
        <div className={styles.stepNavigation} aria-hidden="true">
          <div className={styles.stepList}>
            {[0, 1, 2, 3].map((step) => (
              <div className={styles.stepButton} key={step}>
                <Skeleton width="2rem" height="2rem" circle />
                <Skeleton width="80%" height="2rem" />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.wizardMain}>
          <div className={styles.mobileProgress}>
            <Skeleton width="16rem" height="1.8rem" />
          </div>
          <div className={styles.form}>
            <Skeleton className={styles.title} width="85%" height="1lh" />
            <div className={styles.formCard}>
              {[0, 1, 2, 3].map((field) => (
                <div className={styles.field} key={field}>
                  <Skeleton width="7rem" height="2rem" />
                  {field < 2 ? (
                    <Skeleton width="100%" height="4.8rem" />
                  ) : (
                    <div className={styles.choiceGroup}>
                      {[0, 1, 2, 3].map((choice) => (
                        <Skeleton
                          key={choice}
                          width={field === 2 ? "6.4rem" : "10rem"}
                          height="3.8rem"
                          circle
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.footer}>
              <Skeleton width="8rem" height="4rem" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
