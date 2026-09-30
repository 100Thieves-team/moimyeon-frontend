"use client";

import { Button } from "@/components/button";
import { SiteErrorPage } from "@/features/error/error-page";
import * as styles from "@/features/error/error-page.css";

export default function MyPageError({ reset }: { reset: () => void }) {
  return (
    <SiteErrorPage
      title="마이페이지를 불러오지 못했어요"
      description="잠시 후 다시 시도해 주세요."
      actions={
        <Button className={styles.actionLayout} onClick={reset}>
          다시 시도하기
        </Button>
      }
    />
  );
}
