import { Button, LinkButton } from "@/components/button";
import { SiteErrorPage } from "@/features/error/error-page";
import * as styles from "@/features/error/error-page.css";
import { getRoomRequestError } from "@/features/interview-room/participant-model";
import { ReviewUnavailable } from "./review-unavailable";

export function ReviewError({
  error,
  roomId,
  reset,
}: {
  error: unknown;
  roomId: string;
  reset: () => void;
}) {
  if (getRoomRequestError(error).code === "E2002")
    return <ReviewUnavailable roomId={roomId} reason="ABSENT" />;

  return (
    <SiteErrorPage
      title="후기 작성 정보를 불러오지 못했어요"
      description="면접이나 후기 대상 정보를 확인하지 못했어요. 잠시 후 다시 시도해 주세요."
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
