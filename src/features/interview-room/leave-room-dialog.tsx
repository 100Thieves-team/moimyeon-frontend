"use client";

import type { RoomLeaveResponse } from "@/api/generated";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  roomDetailQueryKey,
  roomParticipantsQueryKey,
  getInterviewOverviewQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { Button } from "@/components/button";
import {
  getLeaveDisabledReason,
  getRoomRequestError,
  type InterviewRoom,
} from "./participant-model";
import * as styles from "./interview-room.css";

export function LeaveRoomDialog({
  room,
  onLeave,
  isPending,
  variant = "compact",
}: {
  room: InterviewRoom;
  onLeave: () => Promise<RoomLeaveResponse>;
  isPending: boolean;
  variant?: "compact" | "card";
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reason = getLeaveDisabledReason(room);
  const disabled = isPending || reason !== null;

  async function leave() {
    if (disabled) return;
    setError(null);
    try {
      const response = await onLeave();
      if (response.result !== "SUCCESS") throw new Error("Unexpected leave result");
    } catch (actionError) {
      const { code, message } = getRoomRequestError(actionError);
      setError(
        code === "E1423"
          ? "최소 진행 인원이라 참여를 취소할 수 없어요. 도움이 필요하면 고객센터에 문의해 주세요."
          : message,
      );
      // A concurrent confirmation/leave may have changed the state even when our request failed.
      void Promise.allSettled(
        [
          roomDetailQueryKey({ path: { roomId: room.roomId } }),
          roomParticipantsQueryKey({ path: { roomId: room.roomId } }),
          getInterviewOverviewQueryKey(),
        ].map((queryKey) => client.invalidateQueries({ queryKey })),
      );
    }
  }

  return (
    <div className={variant === "card" ? styles.cardLeaveAction : styles.leaveAction}>
      <AlertDialog.Root
        open={open}
        onOpenChange={(next) => {
          if (isPending) return;
          setOpen(next);
          if (next) setError(null);
        }}
      >
        <AlertDialog.Trigger
          render={
            <Button
              variant="secondary"
              size="sm"
              className={variant === "card" ? styles.cardLeaveButton : undefined}
              disabled={disabled}
            />
          }
        >
          참여 취소하기
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className={styles.backdrop} />
          <AlertDialog.Popup className={styles.dialog}>
            <AlertDialog.Close
              aria-label="참여 취소 닫기"
              disabled={isPending}
              render={<DialogCloseButton />}
            />
            <header className={styles.dialogHeader}>
              <AlertDialog.Title className={styles.dialogTitle}>
                면접 참여를 취소할까요?
              </AlertDialog.Title>
            </header>
            <div className={styles.dialogBody}>
              {room.status === "CONFIRMED" && (
                <p className={styles.description}>진행 확정 후 참여를 취소한 기록이 남아요.</p>
              )}
              {room.viewer?.isHost && (
                <p className={styles.description}>
                  방장은 다음 참여자 또는 대기 신청자에게 자동으로 위임돼요. 위임할 사람이 없으면
                  면접이 취소돼요.
                </p>
              )}
              {reason && reason !== error && <p className={styles.description}>{reason}</p>}
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
            </div>
            <footer className={styles.dialogFooter}>
              <AlertDialog.Close render={<Button variant="secondary" disabled={isPending} />}>
                돌아가기
              </AlertDialog.Close>
              <Button disabled={disabled} onClick={() => void leave()}>
                {isPending ? "취소 중..." : "취소하기"}
              </Button>
            </footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      {reason && <p className={styles.leaveReason}>{reason}</p>}
    </div>
  );
}
