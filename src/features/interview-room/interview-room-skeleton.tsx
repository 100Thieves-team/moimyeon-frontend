import { Skeleton } from "@/components/skeleton";
import * as styles from "./interview-room.css";

export function InterviewRoomSkeleton() {
  return (
    <main className={styles.page} aria-label="면접 관리 불러오는 중" aria-busy="true">
      <div className={styles.content}>
        <div className={styles.heading}>
          <Skeleton width="16rem" height="2.6rem" />
          <Skeleton width="65%" height="3.9rem" />
        </div>
        <div className={styles.navigation}>
          {[0, 1, 2].map((tab) => (
            <div className={styles.infoLink} key={tab}>
              <Skeleton width="7rem" height="2rem" />
            </div>
          ))}
        </div>
        <div className={styles.panel}>
          <ParticipantsSkeleton />
        </div>
      </div>
    </main>
  );
}

export function ApplicationsSkeleton() {
  return (
    <section aria-label="참여 신청 불러오는 중" aria-busy="true">
      <div className={styles.list}>
        {[0, 1, 2].map((application) => (
          <div className={styles.application} key={application}>
            <div className={styles.row}>
              <div className={styles.profile}>
                <Skeleton circle width="4rem" height="4rem" />
                <div className={styles.identity}>
                  <Skeleton width="8rem" height="1.9rem" />
                  <Skeleton width="12rem" height="1.7rem" />
                </div>
              </div>
              <div className={styles.excerpt}>
                <Skeleton width="80%" height="1.8rem" />
              </div>
              <div className={styles.appliedAt}>
                <Skeleton width="7rem" height="1.8rem" />
              </div>
              <div className={styles.actions}>
                <Skeleton width="5rem" height="3.4rem" />
                <Skeleton width="5rem" height="3.4rem" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ParticipantsSkeleton() {
  return (
    <section aria-label="참여자 목록 불러오는 중" aria-busy="true">
      <div className={styles.roster}>
        {[0, 1, 2].map((participant) => (
          <div className={styles.participantRow} key={participant}>
            <div className={styles.participantProfile}>
              <div className={styles.profile}>
                <Skeleton circle width="4.2rem" height="4.2rem" />
                <div className={styles.participantIdentity}>
                  <Skeleton width="8rem" height="1.9rem" />
                  <Skeleton width="12rem" height="1.7rem" />
                </div>
              </div>
            </div>
            <div className={styles.participantSummary}>
              <Skeleton width="75%" height="1.9rem" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RejectReasonsSkeleton() {
  return (
    <section className={styles.reasons} aria-label="반려 사유 불러오는 중" aria-busy="true">
      {[0, 1, 2, 3].map((reason) => (
        <Skeleton key={reason} width="100%" height="4.9rem" />
      ))}
    </section>
  );
}
