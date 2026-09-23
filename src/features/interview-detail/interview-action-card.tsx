"use client";

import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  getInterviewOverviewQueryKey,
  myRoomApplicationQueryKey,
  roomDetailQueryKey,
  roomsQueryKey,
  withdrawRoomApplicationMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button, LinkButton } from "@/components/button";
import { LoginTrigger } from "@/features/auth/login-dialog";
import {
  getInterviewViewerState,
  getInterviewRelationLabel,
  type InterviewDetail,
  type InterviewViewerState,
} from "./interview-detail-model";
import * as styles from "./interview-detail.css";
import { ParticipantAvatarStack } from "./participant-avatar-stack";

function WithdrawAction({ roomId }: { roomId: string }) {
  const queryClient = useQueryClient();
  const toastManager = Toast.useToastManager();
  const withdrawApplication = useMutation({
    ...withdrawRoomApplicationMutation(),
    onSuccess: async () => {
      toastManager.add({ title: "참가 신청을 취소했어요." });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: roomDetailQueryKey({ path: { roomId } }),
        }),
        queryClient.invalidateQueries({
          queryKey: myRoomApplicationQueryKey({ path: { roomId } }),
        }),
        queryClient.invalidateQueries({ queryKey: roomsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getInterviewOverviewQueryKey() }),
      ]);
    },
  });

  return (
    <>
      <Button
        disabled={withdrawApplication.isPending}
        onClick={() => withdrawApplication.mutate({ path: { roomId } })}
        variant="secondary"
      >
        {withdrawApplication.isPending ? "취소 중..." : "신청 취소하기"}
      </Button>
      {withdrawApplication.isError && (
        <p className={styles.actionError} role="alert">
          신청을 취소하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </>
  );
}

function ActionControl({
  roomId,
  state,
  memberAction,
}: {
  roomId: string;
  state: InterviewViewerState;
  memberAction: ReactNode;
}) {
  const returnTo = `/interviews/${roomId}` as const;

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
      return <WithdrawAction roomId={roomId} />;
    case "VIEW_INTERVIEW":
    case "MANAGE_INTERVIEW":
      return memberAction;
    case "BLOCKED":
    case "UNAVAILABLE":
      return <Button disabled>{state.message}</Button>;
    default:
      return null;
  }
}

export function InterviewActionCard({
  room,
  memberAction,
}: {
  room: InterviewDetail;
  memberAction: ReactNode;
}) {
  const state = getInterviewViewerState(room);
  const recruit = room.recruit;
  const isHost = room.viewer?.isHost === true;
  const isParticipant = !isHost && room.viewer?.isParticipating === true;
  const relation = isHost ? "방장" : getInterviewRelationLabel(room);
  const current = recruit?.current ?? 0;
  const max = recruit?.max ?? 0;
  const remaining = Math.max(max - current, 0);
  const isApplyState = state.kind === "APPLY" || state.kind === "LOGIN_REQUIRED";

  return (
    <aside aria-label="면접 참가 신청" className={styles.actionCard}>
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
              {recruit.recruitStatusLabel}
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
          {recruit && (
            <span className={styles.quotaNumber}>
              {current} / {max}명
            </span>
          )}
        </div>
      )}
      {recruit && (
        <div className={styles.quotaStats}>
          <ParticipantAvatarStack
            currentCount={current}
            hostMemberId={room.hostMemberId}
            participants={room.participants}
          />
          {isApplyState && remaining > 0 && (
            <span className={styles.remainingQuota}>{remaining}자리 남았어요</span>
          )}
          <progress
            aria-label={`모집 현황 ${current}/${max}명`}
            className={styles.actionProgress}
            max={Math.max(max, 1)}
            value={Math.min(current, Math.max(max, 1))}
          />
        </div>
      )}

      <div className={styles.actionControls}>
        <ActionControl roomId={room.roomId} state={state} memberAction={memberAction} />
        {state.kind === "PENDING_APPLICATION" && (
          <p className={styles.actionMessage}>방장의 수락을 기다리고 있어요</p>
        )}
      </div>
    </aside>
  );
}
