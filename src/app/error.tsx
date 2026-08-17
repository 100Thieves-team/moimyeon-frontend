"use client";

import { Button, LinkButton } from "@/components/button";
import { ErrorPage } from "@/features/error/error-page";
import * as styles from "@/features/error/error-page.css";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ reset }: RootErrorProps) {
  return (
    <ErrorPage
      actions={
        <>
          <Button className={styles.actionLayout} onClick={reset} size="md">
            다시 시도하기
          </Button>
          <LinkButton className={styles.actionLayout} href="/" size="md" variant="secondary">
            홈으로 돌아가기
          </LinkButton>
        </>
      }
      description="문제가 발생했어요. 잠시 후 다시 시도해 주세요."
      documentTitle="오류 | 모이면"
      title="오류"
    />
  );
}
