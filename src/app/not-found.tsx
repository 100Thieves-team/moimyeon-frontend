import { LinkButton } from "@/components/button";
import { ErrorPage } from "@/features/error/error-page";
import * as styles from "@/features/error/error-page.css";

export default function NotFound() {
  return (
    <ErrorPage
      actions={
        <LinkButton className={styles.actionLayout} href="/" size="md">
          홈으로 돌아가기
        </LinkButton>
      }
      description="페이지를 찾을 수 없어요."
      documentTitle="페이지를 찾을 수 없음 | 모이면"
      title="404"
    />
  );
}
