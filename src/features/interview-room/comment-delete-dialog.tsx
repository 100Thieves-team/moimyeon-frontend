"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  deleteRoomCommentMutation,
  getRoomCommentsInfiniteOptions,
  getRoomCommentsInfiniteQueryKey,
  roomDetailQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { ConfirmActionPopup } from "@/components/confirm-action";
import { getRoomRequestError } from "./participant-model";

function useCommentDeletion(roomId: string, close: () => void) {
  const client = useQueryClient();
  return useMutation({
    ...deleteRoomCommentMutation(),
    onSuccess: () => {
      close();
      void client.invalidateQueries({
        queryKey: getRoomCommentsInfiniteQueryKey({ path: { roomId }, query: { size: "20" } }),
      });
    },
    onError: (error) => {
      const { code } = getRoomRequestError(error);
      if (["E1419", "E2101", "E2102", "E2103"].includes(String(code))) {
        void client.invalidateQueries({
          queryKey: getRoomCommentsInfiniteQueryKey({ path: { roomId }, query: { size: "20" } }),
        });
        if (code === "E1419" || code === "E2101") {
          close();
          void client.invalidateQueries({ queryKey: roomDetailQueryKey({ path: { roomId } }) });
        }
      }
    },
  });
}
const CommentDeleteContext = createContext<{
  handle: ReturnType<typeof AlertDialog.createHandle<number>>;
  remove: ReturnType<typeof useCommentDeletion>;
} | null>(null);

export function useCommentDelete() {
  const context = useContext(CommentDeleteContext);
  if (!context) throw new Error("CommentDeleteProvider is required");
  return context;
}

export function CommentDeleteProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) {
  const [handle] = useState(() => AlertDialog.createHandle<number>());
  const [open, setOpen] = useState(false);
  const remove = useCommentDeletion(roomId, () => setOpen(false));
  return (
    <CommentDeleteContext value={{ handle, remove }}>
      {children}
      <AlertDialog.Root
        handle={handle}
        open={open}
        onOpenChange={(next) => {
          if (remove.isPending) return;
          if (next) remove.reset();
          setOpen(next);
        }}
      >
        {({ payload }) =>
          open &&
          payload !== undefined && (
            <CommentDeleteConfirmation
              roomId={roomId}
              commentId={payload}
              close={() => setOpen(false)}
            />
          )
        }
      </AlertDialog.Root>
    </CommentDeleteContext>
  );
}

function CommentDeleteConfirmation({
  roomId,
  commentId,
  close,
}: {
  roomId: string;
  commentId: number;
  close: () => void;
}) {
  const { remove } = useCommentDelete();
  const query = useInfiniteQuery({
    ...getRoomCommentsInfiniteOptions({ path: { roomId }, query: { size: "20" } }),
    initialPageParam: { path: { roomId }, query: {} },
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor ?? undefined,
    enabled: false,
  });
  const pages = query.data?.pages;
  const comment = pages
    ?.flatMap((page) => page.data?.comments ?? [])
    .find((entry) => entry.commentId === commentId);
  const unavailable =
    getRoomRequestError(query.error).code === "E1419" ||
    (pages !== undefined &&
      (!comment ||
        comment.isDeleted ||
        !comment.isMine ||
        pages.some((page) => page.data?.writable === false)));
  useEffect(() => {
    if (unavailable && !remove.isPending) close();
  }, [unavailable, remove.isPending, close]);
  return (
    <ConfirmActionPopup
      title="댓글을 삭제할까요?"
      description="삭제한 댓글은 되돌릴 수 없어요."
      confirmLabel="삭제하기"
      pendingLabel="삭제 중..."
      pending={remove.isPending}
      error={remove.isError ? getRoomRequestError(remove.error).message : undefined}
      onConfirm={() => {
        if (!unavailable && !remove.isPending)
          remove.mutate({ path: { roomId, commentId: String(commentId) } });
      }}
    />
  );
}
