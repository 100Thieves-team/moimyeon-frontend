"use client";

import { Button, LinkButton } from "@/components/button";
import * as styles from "@/features/interview-apply/interview-apply.css";

export default function InterviewApplyError({ reset }: { reset: () => void }) {
  return (
    <main className={styles.errorPage}>
      <section className={styles.errorCard}>
        <h1 className={styles.errorTitle}>참가 신청 정보를 불러오지 못했어요</h1>
        <p className={styles.errorDescription}>
          면접이나 이력서 정보를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
        <div className={styles.errorActions}>
          <Button onClick={reset}>다시 시도하기</Button>
          <LinkButton href="/" variant="secondary">
            탐색으로 돌아가기
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
