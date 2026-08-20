"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactElement } from "react";
import type { MockParticipant } from "./mock-data";
import * as styles from "./mock-flow.css";

export function PublicTrustDialog({
  person,
  trigger,
}: {
  person: MockParticipant;
  trigger: ReactElement;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={trigger} />
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.dialogBackdrop} />
        <Dialog.Viewport className={styles.dialogPositioner}>
          <Dialog.Popup className={styles.trustPopup}>
            <div className={styles.dialogHead}>
              <div className={styles.inline}>
                <span aria-hidden="true" className={styles.personAvatar}>
                  {person.initial}
                </span>
                <div>
                  <Dialog.Title className={styles.dialogTitle}>{person.nickname}</Dialog.Title>
                  <Dialog.Description className={styles.dialogDescription}>
                    {person.jobRole}
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close aria-label="공개 신뢰 카드 닫기" className={styles.iconButton}>
                <X aria-hidden="true" size={18} />
              </Dialog.Close>
            </div>
            <div className={styles.dialogBody}>
              <div className={styles.trustStats}>
                <span className={styles.trustStat}>
                  완료한 면접
                  <strong className={styles.trustValue}>{person.completedInterviews}회</strong>
                </span>
                <span className={styles.trustStat}>
                  출석률
                  <strong className={styles.trustValue}>100%</strong>
                </span>
              </div>
              <div className={styles.inline}>
                <span className={`${styles.badge} ${styles.accentBadge}`}>시간을 잘 지켜요 6</span>
                <span className={`${styles.badge} ${styles.accentBadge}`}>질문이 날카로워요 5</span>
                <span className={`${styles.badge} ${styles.accentBadge}`}>소통이 원활해요 3</span>
              </div>
              <p className={styles.sectionCopy}>
                후기 작성자와 개별 세션 평가는 공개하지 않고, 완료 횟수와 대표 평가만 보여줘요.
              </p>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
