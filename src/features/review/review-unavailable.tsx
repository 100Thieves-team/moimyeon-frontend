import { LinkButton } from "@/components/button";
import { SiteErrorPage } from "@/features/error/error-page";
import * as styles from "@/features/error/error-page.css";

export function ReviewUnavailable({
  roomId,
  reason,
}: {
  roomId: string;
  reason: "ABSENT" | "NO_TARGET";
}) {
  return (
    <SiteErrorPage
      title={reason === "ABSENT" ? "후기를 작성할 수 없어요" : "후기를 남길 대상이 없어요"}
      description={
        reason === "ABSENT"
          ? "불참으로 기록된 면접에는 후기를 남길 수 없어요."
          : "함께 출석한 다른 참여자가 없어 후기를 남길 수 없어요."
      }
      actions={
        <LinkButton className={styles.actionLayout} href={`/interviews/${roomId}`}>
          면접 상세로 돌아가기
        </LinkButton>
      }
    />
  );
}
