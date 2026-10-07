"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Toast } from "@base-ui/react/toast";
import {
  QueryErrorResetBoundary,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  completeRoomProgressMutation,
  getInterviewOverviewOptions,
  getInterviewOverviewQueryKey,
  getMyAttendanceQueryKey,
  getReviewOverviewQueryKey,
  participationSlotsQueryKey,
  roomDetailOptions,
  roomDetailQueryKey,
  roomParticipantsOptions,
  roomParticipantsQueryKey,
  roomsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { formatInterviewSchedule } from "@/features/interview-detail/interview-detail-model";
import { CompleteRoomAttendanceForm, type RoomAttendance } from "./complete-room-attendance-form";
import { completeRoomDialog } from "./complete-room-dialog-handle";
import { getRoomRequestError, type InterviewRoom } from "./participant-model";
import * as styles from "./interview-room.css";

export function CompleteRoomDialog({
  room,
  currentMemberId,
}: {
  room: InterviewRoom;
  currentMemberId: string;
}) {
  const client = useQueryClient();
  const router = useRouter();
  const toast = Toast.useToastManager();
  const [open, setOpen] = useState(false);
  const roomId = room.roomId;
  const path = { roomId };
  const refresh = () =>
    Promise.allSettled(
      [
        roomDetailQueryKey({ path }),
        roomParticipantsQueryKey({ path }),
        roomsQueryKey(),
        getInterviewOverviewQueryKey(),
        participationSlotsQueryKey(),
        getMyAttendanceQueryKey({ query: { roomId } }),
        getReviewOverviewQueryKey({ path }),
      ].map((queryKey) => client.invalidateQueries({ queryKey })),
    );
  const mutation = useMutation({
    ...completeRoomProgressMutation(),
    onSuccess: async () => {
      await refresh();
      setOpen(false);
      toast.add({ title: "면접을 완료했어요." });
      try {
        const overview = await client.fetchQuery({
          ...getInterviewOverviewOptions(),
          staleTime: Infinity,
        });
        if (
          overview.data?.completedRooms.find(({ room: completed }) => completed.roomId === roomId)
            ?.reviewStatus === "WRITABLE"
        ) {
          router.push(`/interviews/${roomId}/review`);
        }
      } catch {
        // 완료 요청은 성공했으며, 후기 조회는 카드의 오류 경계에서 재시도한다.
      }
    },
    onError: async (error) => {
      const { code } = getRoomRequestError(error);
      if (code !== "E1707" && code !== "E1708" && code !== "E1406") return;
      await refresh();
      try {
        const latest = await client.fetchQuery({
          ...roomDetailOptions({ path }),
          staleTime: Infinity,
        });
        if (latest.data?.status === "COMPLETED") {
          setOpen(false);
          toast.add({ title: "이미 면접이 완료됐어요. 저장된 출석 결과를 확인해 주세요." });
        } else if (
          latest.data &&
          (latest.data.status !== "CONFIRMED" || !latest.data.viewer?.isHost)
        ) {
          setOpen(false);
          toast.add({ title: "면접 상태가 변경됐어요. 최신 정보를 확인해 주세요." });
        }
      } catch {
        // 조회 실패는 기존 상세 오류 경계에서 처리한다. 제출 성공으로 간주하지 않는다.
      }
    },
  });

  return (
    <Dialog.Root
      handle={completeRoomDialog}
      open={open}
      onOpenChange={(next) => {
        if (mutation.isPending) return;
        if (next) mutation.reset();
        setOpen(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.dialog}>
          <Dialog.Close
            aria-label="출석 확인 닫기"
            disabled={mutation.isPending}
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
                  <AttendanceForm
                    roomId={roomId}
                    currentMemberId={currentMemberId}
                    pending={mutation.isPending}
                    onSubmit={async (attendances) => {
                      await mutation.mutateAsync({ path, body: { attendances } });
                    }}
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

function AttendanceForm({
  roomId,
  ...props
}: {
  roomId: string;
  currentMemberId: string;
  pending: boolean;
  onSubmit: (attendances: RoomAttendance[]) => Promise<void>;
}) {
  const client = useQueryClient();
  const options = roomParticipantsOptions({ path: { roomId } });
  const { data } = useSuspenseQuery(options);
  if (!data.data) throw new Error("Failed to load confirmed participants");

  return (
    <CompleteRoomAttendanceForm
      {...props}
      participants={data.data.confirmedParticipants}
      onRosterMismatch={async () => {
        await client.invalidateQueries({ queryKey: roomDetailQueryKey({ path: { roomId } }) });
        const latest = await client.fetchQuery({ ...options, staleTime: 0 });
        if (!latest.data) throw new Error("Failed to refresh confirmed participants");
        return latest.data.confirmedParticipants;
      }}
    />
  );
}
