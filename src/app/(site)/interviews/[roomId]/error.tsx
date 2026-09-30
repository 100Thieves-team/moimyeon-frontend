"use client";

import { Button, LinkButton } from "@/components/button";
import { SiteErrorPage } from "@/features/error/error-page";
import * as styles from "@/features/error/error-page.css";

export default function InterviewDetailError({ reset }: { reset: () => void }) {
  return (
    <SiteErrorPage
      title="면접 상세를 불러오지 못했어요"
      description="면접이 없거나 일시적인 문제가 발생했어요. 잠시 후 다시 시도해 주세요."
      actions={
        <>
          <Button className={styles.actionLayout} onClick={reset}>
            다시 시도하기
          </Button>
          <LinkButton className={styles.actionLayout} href="/" variant="secondary">
            탐색으로 돌아가기
          </LinkButton>
        </>
      }
    />
  );
}
