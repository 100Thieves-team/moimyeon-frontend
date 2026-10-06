"use client";

import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getInterviewOverviewOptions } from "@/api/generated/@tanstack/react-query.gen";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useWithdrawApplicationDialog } from "./withdraw-application-dialog";
import { Button, LinkButton } from "@/components/button";
import { LoginTrigger } from "@/features/auth/login-dialog";
import { LeaveRoomTrigger } from "@/features/interview-room/leave-room-trigger";
import { ConfirmRoomTrigger } from "@/features/interview-room/confirm-room-trigger";
import { getRoomStatusLabel } from "@/features/interview-room/confirmation-model";
import {
  getInterviewRelationLabel,
  type InterviewDetail,
  type InterviewViewerState,
} from "./interview-detail-model";
import * as styles from "./interview-detail.css";
import { ParticipantAvatarStack } from "./participant-avatar-stack";

function WithdrawAction({ room }: { room: InterviewDetail }) {
  const handle = useWithdrawApplicationDialog();
  return (
    <AlertDialog.Trigger
      handle={handle}
      payload={{ roomId: room.roomId, title: room.title }}
      render={<Button variant="secondary" />}
    >
      신청 취소하기
    </AlertDialog.Trigger>
  );
}

function CompletedReviewAction({ roomId }: { roomId: string }) {
  const { data } = useSuspenseQuery(getInterviewOverviewOptions());
  const reviewStatus = data.data?.completedRooms.find(
    ({ room }) => room.roomId === roomId,
  )?.reviewStatus;
  if (reviewStatus !== "WRITABLE" && reviewStatus !== "WRITTEN") return null;

  return (
    <LinkButton href={`/interviews/${roomId}/review`}>
      {reviewStatus === "WRITABLE" ? "후기 남기기" : "후기 수정하기"}
    </LinkButton>
  );
}

function CompletedReviewActionBoundary({ roomId }: { roomId: string }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          // oxlint-disable-next-line react/no-unstable-nested-components -- fallbackRender는 컴포넌트 타입이 아닌 렌더 콜백이다.
          fallbackRender={({ resetErrorBoundary }) => (
            <div className={styles.actionControls}>
              <p role="alert" className={styles.actionMessage}>
                후기 정보를 불러오지 못했어요
              </p>
              <Button variant="secondary" onClick={resetErrorBoundary}>
                다시 불러오기
              </Button>
            </div>
          )}
        >
          <Suspense fallback={<Button disabled>후기 정보 불러오는 중</Button>}>
            <CompletedReviewAction roomId={roomId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function ActionControl({ room, state }: { room: InterviewDetail; state: InterviewViewerState }) {
  const roomId = room.roomId;
  const returnTo = `/interviews/${roomId}` as const;
  if (
    room.status === "COMPLETED" &&
    (state.kind === "MANAGE_INTERVIEW" || state.kind === "VIEW_INTERVIEW")
  ) {
    return <CompletedReviewActionBoundary roomId={roomId} />;
  }

  switch (state.kind) {
    case "LOGIN_REQUIRED":
      return (
        <LoginTrigger returnTo={returnTo}>
          {state.applicationMode === "WAITLIST" ? "대기 신청하기" : "참가 신청하기"}
        </LoginTrigger>
      );
    case "APPLY":
      return (
        <LinkButton href={`/interviews/${roomId}/apply`}>
          {state.applicationMode === "WAITLIST" ? "대기 신청하기" : "참가 신청하기"}
        </LinkButton>
      );
    case "PENDING_APPLICATION":
      return <WithdrawAction room={room} />;
    case "VIEW_INTERVIEW":
      return <LeaveRoomTrigger variant="card" />;
    case "MANAGE_INTERVIEW":
      if (room.status === "RECRUITING") return <ConfirmRoomTrigger />;
      if (room.status === "CONFIRMED") return <Button disabled>면접 완료하기</Button>;
      return <p className={styles.actionMessage}>{getRoomStatusLabel(room.status)}</p>;
    case "BLOCKED":
    case "UNAVAILABLE":
      return <Button disabled>{state.message}</Button>;
    default:
      return null;
  }
}

export function InterviewActionCard({
  room,
  state,
}: {
  room: InterviewDetail;
  state: InterviewViewerState;
}) {
  const recruit = room.recruit;
  const isHost = room.viewer?.isHost === true;
  const isParticipant = !isHost && room.viewer?.isParticipating === true;
  const relation = isHost ? "방장" : getInterviewRelationLabel(room);
  const current = recruit?.current ?? 0;
  const max = recruit?.max ?? 0;

  return (
    <aside aria-label="면접 참가 신청" className={styles.actionCard}>
      <div className={styles.quotaStats}>
        {(recruit || relation) && (
          <div className={styles.quotaStatusRow}>
            {recruit && !isParticipant && (
              <span
                className={
                  recruit.recruitStatus === "RECRUITING"
                    ? styles.statusBadge.recruiting
                    : styles.statusBadge.closed
                }
              >
                {room.status === "RECRUITING"
                  ? recruit.recruitStatusLabel
                  : getRoomStatusLabel(room.status)}
              </span>
            )}
            {relation && (
              <span
                className={
                  isHost
                    ? styles.hostBadge
                    : isParticipant
                      ? styles.statusBadge.recruiting
                      : styles.relationBadge
                }
              >
                {relation}
              </span>
            )}
          </div>
        )}
        {recruit && (
          <>
            <ParticipantAvatarStack
              currentCount={current}
              hostMemberId={room.hostMemberId}
              participants={room.participants}
            />
            <div className={styles.progressMeta}>
              <span className={styles.quotaLabel}>참여 인원</span>
              <span className={styles.quotaNumber}>
                {current} / {max}명
              </span>
            </div>
            <progress
              aria-label={`모집 현황 ${current}/${max}명`}
              className={styles.actionProgress}
              max={Math.max(max, 1)}
              value={Math.min(current, Math.max(max, 1))}
            />
          </>
        )}
      </div>

      <div className={styles.actionControls}>
        <ActionControl room={room} state={state} />
        {state.kind === "PENDING_APPLICATION" && (
          <p className={styles.actionMessage}>방장의 수락을 기다리고 있어요</p>
        )}
      </div>
    </aside>
  );
}
