"use client";

import { useQueryClient, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { getInterviewOverviewQueryKey } from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import * as styles from "@/features/my-interviews/my-interviews.css";

export default function MyInterviewsError({ reset }: { reset: () => void }) {
  const queryClient = useQueryClient();
  const { reset: resetQueryError } = useQueryErrorResetBoundary();

  const retry = async () => {
    resetQueryError();
    await queryClient.resetQueries({ queryKey: getInterviewOverviewQueryKey() });
    reset();
  };

  return (
    <main className={styles.page}>
      <section className={styles.empty}>
        <h1 className={styles.title}>내 면접을 불러오지 못했어요</h1>
        <p>잠시 후 다시 시도해 주세요.</p>
        <Button onClick={retry}>다시 시도하기</Button>
      </section>
    </main>
  );
}
