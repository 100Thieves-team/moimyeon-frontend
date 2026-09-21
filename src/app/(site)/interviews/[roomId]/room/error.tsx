"use client";

import { Button, LinkButton } from "@/components/button";
import * as styles from "@/features/interview-room/interview-room.css";

export default function InterviewRoomError({ reset }: { reset: () => void }) {
  return (
    <main className={styles.page}>
      <section className={styles.empty}>
        <h1 className={styles.title}>면접을 불러오지 못했어요</h1>
        <p>접근 권한이 없거나 일시적인 문제가 발생했어요.</p>
        <div className={styles.actions}>
          <Button onClick={reset}>다시 시도하기</Button>
          <LinkButton href="/interviews/me" variant="secondary">
            내 면접으로 돌아가기
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
