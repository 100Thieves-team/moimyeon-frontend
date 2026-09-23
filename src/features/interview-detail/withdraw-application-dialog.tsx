"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getInterviewOverviewOptions,
  getInterviewOverviewQueryKey,
  myRoomApplicationQueryKey,
  roomDetailOptions,
  roomDetailQueryKey,
  roomsQueryKey,
  withdrawRoomApplicationMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import { ConfirmActionPopup } from "@/components/confirm-action";

type Application = { roomId: string; title: string };
const WithdrawContext = createContext<ReturnType<
  typeof AlertDialog.createHandle<Application>
> | null>(null);
export function useWithdrawApplicationDialog() {
  const handle = useContext(WithdrawContext);
  if (!handle) throw new Error("WithdrawApplicationProvider is required");
  return handle;
}

export function WithdrawApplicationProvider({
  children,
  refreshOnError = false,
}: {
  children: ReactNode;
  refreshOnError?: boolean;
}) {
  const [handle] = useState(() => AlertDialog.createHandle<Application>());
  const [open, setOpen] = useState(false);
  const client = useQueryClient();
  const toast = Toast.useToastManager();
  const refresh = async (roomId: string) => {
    await Promise.all(
      [
        getInterviewOverviewQueryKey(),
        roomDetailQueryKey({ path: { roomId } }),
        myRoomApplicationQueryKey({ path: { roomId } }),
        roomsQueryKey(),
      ].map((queryKey) => client.invalidateQueries({ queryKey })),
    );
  };
  const withdrawal = useMutation({
    ...withdrawRoomApplicationMutation(),
    onSuccess: async (_response, variables) => {
      setOpen(false);
      toast.add({ title: "참가 신청을 취소했어요." });
      if (!refreshOnError) await refresh(variables.path.roomId);
    },
    onError: (error) => {
      const detail =
        typeof error === "object" && error !== null && "error" in error ? error.error : null;
      const code =
        typeof detail === "object" && detail !== null && "code" in detail ? detail.code : null;
      if (refreshOnError && (code === "E1408" || code === "E1409"))
        toast.add({ title: "신청 상태가 변경됐어요. 최신 목록을 확인해 주세요." });
    },
    onSettled: async (_data, _error, variables) => {
      if (refreshOnError) await refresh(variables.path.roomId);
    },
  });
  return (
    <WithdrawContext value={handle}>
      {children}
      <AlertDialog.Root
        handle={handle}
        open={open}
        onOpenChange={(next) => {
          if (withdrawal.isPending) return;
          if (next) withdrawal.reset();
          setOpen(next);
        }}
      >
        {({ payload }) =>
          open &&
          payload && (
            <WithdrawConfirmation
              application={payload}
              overview={refreshOnError}
              pending={withdrawal.isPending}
              error={withdrawal.isError}
              close={() => setOpen(false)}
              onConfirm={() => {
                if (!withdrawal.isPending) withdrawal.mutate({ path: { roomId: payload.roomId } });
              }}
            />
          )
        }
      </AlertDialog.Root>
    </WithdrawContext>
  );
}

function WithdrawConfirmation({
  application,
  overview,
  pending,
  error,
  close,
  onConfirm,
}: {
  application: Application;
  overview: boolean;
  pending: boolean;
  error: boolean;
  close: () => void;
  onConfirm: () => void;
}) {
  const room = useQuery({
    ...roomDetailOptions({ path: { roomId: application.roomId } }),
    enabled: false,
  });
  const list = useQuery({
    ...getInterviewOverviewOptions(),
    enabled: false,
  });
  const unavailable = overview
    ? list.data?.data !== undefined &&
      list.data.data !== null &&
      !list.data.data.pendingApplications.some((entry) => entry.room.roomId === application.roomId)
    : room.data?.data !== undefined &&
      room.data.data !== null &&
      room.data.data.viewer?.latestApplicationStatus !== "PENDING";
  useEffect(() => {
    if (unavailable && !pending) close();
  }, [unavailable, pending, close]);
  return (
    <ConfirmActionPopup
      title="참가 신청을 취소할까요?"
      description={
        <>
          {application.title}
          <br />
          참가 신청을 취소하면 신청 목록에서 사라져요.
        </>
      }
      confirmLabel="취소하기"
      pendingLabel="취소 중..."
      pending={pending}
      error={error ? "신청을 취소하지 못했어요. 잠시 후 다시 시도해 주세요." : undefined}
      onConfirm={() => {
        if (!unavailable) onConfirm();
      }}
    />
  );
}
