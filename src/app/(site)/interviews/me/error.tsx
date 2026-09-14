"use client";

import * as styles from "@/features/my-interviews/my-interviews.css";

export default function MyInterviewsError() {
  return (
    <main className={styles.page}>
      <section className={styles.empty}>
        <h1 className={styles.title}>내 면접을 불러오지 못했어요</h1>
        <p>잠시 후 다시 확인해 주세요.</p>
      </section>
    </main>
  );
}
