"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  confirmRoomMutation,
  getInterviewOverviewQueryKey,
  roomApplicationsQueryKey,
  roomDetailQueryKey,
  roomParticipantsQueryKey,
  roomsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { formatInterviewSchedule } from "@/features/interview-detail/interview-detail-model";
import { confirmRoomDialog } from "./confirm-room-dialog-handle";
import { getConfirmationDisabledReason } from "./confirmation-model";
import { getRoomRequestError, type InterviewRoom } from "./participant-model";
import { useConfirmationReason } from "./use-confirmation-reason";
import * as styles from "./interview-room.css";

export function ConfirmRoomDialog({
  room,
  onConfirmed,
}: {
  room: InterviewRoom;
  onConfirmed: () => void;
}) {
  const client = useQueryClient();
  const toast = Toast.useToastManager();
  const [open, setOpen] = useState(false);
  const reason = useConfirmationReason(room);
  const path = { roomId: room.roomId };
  const refresh = () =>
    Promise.allSettled(
      [
        roomDetailQueryKey({ path }),
        roomParticipantsQueryKey({ path }),
        roomApplicationsQueryKey({ path }),
        roomsQueryKey(),
        getInterviewOverviewQueryKey(),
      ].map((queryKey) => client.invalidateQueries({ queryKey })),
    );
  const mutation = useMutation({
    ...confirmRoomMutation(),
    onSuccess: async (response) => {
      if (response.result !== "SUCCESS") throw response;
      await refresh();
      setOpen(false);
      toast.add({ title: "면접 진행을 확정했어요." });
      onConfirmed();
    },
    onError: () => {
      void refresh();
    },
  });
  const error = mutation.isError ? getRoomRequestError(mutation.error) : null;
  const errorMessage =
    error?.code === "E1421"
      ? "참여 인원이 변경됐어요. 최소 진행 인원을 채운 뒤 다시 확정해 주세요."
      : error?.code === "E1422"
        ? "진행 일정이 지나 확정할 수 없어요"
        : error?.code === "E1410"
          ? "면접 상태가 변경됐어요. 최신 상태를 확인해 주세요."
          : error?.message;

  return (
    <AlertDialog.Root
      handle={confirmRoomDialog}
      open={open}
      onOpenChange={(next) => {
        if (mutation.isPending) return;
        if (next) mutation.reset();
        setOpen(next);
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={styles.backdrop} />
        <AlertDialog.Popup className={styles.dialog}>
          <AlertDialog.Close
            aria-label="진행 확정 닫기"
            disabled={mutation.isPending}
            render={<DialogCloseButton />}
          />
          <header className={styles.dialogHeader}>
            <AlertDialog.Title className={styles.dialogTitle}>
              면접 진행을 확정할까요?
            </AlertDialog.Title>
          </header>
          <div className={styles.dialogBody}>
            <dl className={styles.confirmationSummary}>
              <div>
                <dt>진행 일정</dt>
                <dd>{formatInterviewSchedule(room.schedule)}</dd>
              </div>
              <div>
                <dt>진행 방식</dt>
                <dd>{[room.methodLabel, room.region?.label].filter(Boolean).join(" · ")}</dd>
              </div>
              <div>
                <dt>참여 인원</dt>
                <dd>
                  {room.recruit
                    ? `${room.recruit.current}명 · 최소 ${room.recruit.min}명`
                    : "인원 정보 없음"}
                </dd>
              </div>
            </dl>
            <ul className={styles.confirmationEffects}>
              <li>
                {room.resumePublic
                  ? "확정된 참여자끼리 제출한 이력서 원본을 볼 수 있어요."
                  : "이력서 원본은 공개되지 않고 AI 요약만 볼 수 있어요."}
              </li>
              <li>
                확정하면 대기 중인 신청 {room.recruit?.pendingApplicationCount ?? 0}건은 자동으로
                마감돼요.
              </li>
            </ul>
            {reason && <p className={styles.description}>{reason}</p>}
            {errorMessage && (
              <p className={styles.error} role="alert">
                {errorMessage}
              </p>
            )}
          </div>
          <footer className={styles.dialogFooter}>
            <AlertDialog.Close
              render={<Button variant="secondary" disabled={mutation.isPending} />}
            >
              돌아가기
            </AlertDialog.Close>
            <Button
              disabled={mutation.isPending || reason !== null}
              onClick={() => {
                if (!mutation.isPending && !getConfirmationDisabledReason(room))
                  mutation.mutate({ path });
              }}
            >
              {mutation.isPending ? "확정 중..." : "진행 확정하기"}
            </Button>
          </footer>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
