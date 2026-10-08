"use client";

import { Dialog } from "@base-ui/react/dialog";
import { QueryErrorResetBoundary, useIsMutating } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/button";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { formatInterviewSchedule } from "@/features/interview-detail/interview-detail-model";
import {
  CompleteRoomAttendanceForm,
  completeRoomMutationKey,
} from "./complete-room-attendance-form";
import { completeRoomDialog } from "./complete-room-dialog-handle";
import type { InterviewRoom } from "./participant-model";
import * as styles from "./interview-room.css";

export function CompleteRoomDialog({
  room,
  currentMemberId,
}: {
  room: InterviewRoom;
  currentMemberId: string;
}) {
  const [open, setOpen] = useState(false);
  const roomId = room.roomId;
  const pending = useIsMutating({ mutationKey: completeRoomMutationKey(roomId) }) > 0;

  return (
    <Dialog.Root
      handle={completeRoomDialog}
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        setOpen(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.dialog}>
          <Dialog.Close
            aria-label="출석 확인 닫기"
            disabled={pending}
            render={<DialogCloseButton />}
          />
          <header className={styles.dialogHeader}>
            <Dialog.Title className={styles.attendanceDialogTitle}>
              출석을 확인하고 면접을 완료할까요?
            </Dialog.Title>
          </header>
          <div className={styles.dialogBody}>
            <dl className={styles.confirmationSummary}>
              <div>
                <dt>진행 일정</dt>
                <dd>{formatInterviewSchedule(room.schedule)}</dd>
              </div>
            </dl>
          </div>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                // oxlint-disable-next-line react/no-unstable-nested-components -- fallbackRender는 렌더 콜백이다.
                fallbackRender={({ resetErrorBoundary }) => (
                  <div className={styles.dialogBody}>
                    <p className={styles.error} role="alert">
                      출석 대상 명단을 불러오지 못했어요.
                    </p>
                    <Button variant="secondary" onClick={resetErrorBoundary}>
                      다시 불러오기
                    </Button>
                  </div>
                )}
              >
                <Suspense
                  fallback={<p className={styles.dialogBody}>출석 대상 명단 불러오는 중</p>}
                >
                  <CompleteRoomAttendanceForm
                    roomId={roomId}
                    currentMemberId={currentMemberId}
                    onClose={() => setOpen(false)}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
