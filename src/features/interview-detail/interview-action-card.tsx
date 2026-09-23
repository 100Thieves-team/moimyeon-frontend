"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useWithdrawApplicationDialog } from "./withdraw-application-dialog";
import { Button, LinkButton } from "@/components/button";
import { LoginTrigger } from "@/features/auth/login-dialog";
import { LeaveRoomTrigger } from "@/features/interview-room/leave-room-trigger";
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

function ActionControl({
  room,
  state,
  onViewApplications,
}: {
  room: InterviewDetail;
  state: InterviewViewerState;
  onViewApplications: () => void;
}) {
  const roomId = room.roomId;
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
      return <WithdrawAction room={room} />;
    case "VIEW_INTERVIEW":
      return <LeaveRoomTrigger room={room} variant="card" />;
    case "MANAGE_INTERVIEW":
      return <Button onClick={onViewApplications}>참여 신청 확인하기</Button>;
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
  onViewApplications,
}: {
  room: InterviewDetail;
  state: InterviewViewerState;
  onViewApplications: () => void;
}) {
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
        <ActionControl room={room} state={state} onViewApplications={onViewApplications} />
        {state.kind === "PENDING_APPLICATION" && (
          <p className={styles.actionMessage}>방장의 수락을 기다리고 있어요</p>
        )}
      </div>
    </aside>
  );
}
