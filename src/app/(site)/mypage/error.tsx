"use client";

import { Button } from "@/components/button";
import * as styles from "@/features/mypage/mypage-shell.css";

type MyPageErrorProps = {
  reset: () => void;
};

export default function MyPageError({ reset }: MyPageErrorProps) {
  return (
    <main className={styles.errorPage}>
      <section className={styles.errorCard}>
        <h1 className={styles.errorTitle}>마이페이지를 불러오지 못했어요</h1>
        <p className={styles.errorDescription}>잠시 후 다시 시도해 주세요.</p>
        <Button className={styles.retryButtonLayout} onClick={reset}>
          다시 시도하기
        </Button>
      </section>
    </main>
  );
}
