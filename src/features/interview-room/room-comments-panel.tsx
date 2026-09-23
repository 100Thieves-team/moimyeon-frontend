"use client";

import {
  QueryErrorResetBoundary,
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import {
  createRoomCommentMutation,
  getRoomCommentsInfiniteOptions,
  roomDetailQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import { CommentComposer, type CommentFormValues } from "./comment-composer";
import { useCommentDelete } from "./comment-delete-dialog";
import { CommentRow } from "./comment-row";
import { getRoomRequestError } from "./participant-model";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { formatCommentDate } from "./room-comments-model";
import * as styles from "./room-comments.css";

export function RoomCommentsPanel({ roomId }: { roomId: string }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          // oxlint-disable-next-line react/no-unstable-nested-components -- fallbackRender는 컴포넌트 타입이 아닌 렌더 콜백이다.
          fallbackRender={({ error, resetErrorBoundary }) => (
            <section className={styles.status}>
              <p role="alert">
                {getRoomRequestError(error).code === "E1419"
                  ? "현재 참여자만 댓글을 볼 수 있어요."
                  : "댓글을 불러오지 못했어요."}
              </p>
              <Button variant="secondary" onClick={resetErrorBoundary}>
                다시 불러오기
              </Button>
            </section>
          )}
        >
          <Suspense
            fallback={
              <section className={styles.panel} aria-label="댓글 불러오는 중" aria-busy="true">
                <Skeleton width="100%" height="11.2rem" />
                <Skeleton width="100%" height="25rem" />
              </section>
            }
          >
            <CommentsContent roomId={roomId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function CommentsContent({ roomId }: { roomId: string }) {
  const client = useQueryClient();
  const options = getRoomCommentsInfiniteOptions({ path: { roomId }, query: { size: "20" } });
  if (typeof options.queryFn !== "function")
    throw new Error("Room comments query function is unavailable");
  const refreshRoom = () =>
    client.invalidateQueries({ queryKey: roomDetailQueryKey({ path: { roomId } }) });
  const query = useSuspenseInfiniteQuery({
    ...options,
    queryFn: options.queryFn,
    initialPageParam: { path: { roomId }, query: {} },
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor ?? undefined,
  });
  const form = useForm<CommentFormValues>({ defaultValues: { content: "" } });
  const refreshComments = () => client.invalidateQueries({ queryKey: options.queryKey });
  const handlePolicyError = (error: unknown) => {
    const { code } = getRoomRequestError(error);
    if (["E1419", "E2101", "E2102", "E2103"].includes(String(code))) {
      void refreshComments();
      if (code === "E1419" || code === "E2101") void refreshRoom();
    }
  };
  const create = useMutation({
    ...createRoomCommentMutation(),
    onError: handlePolicyError,
  });
  const { remove } = useCommentDelete();
  const codes = [query.error, create.error, remove.error].map(
    (error) => getRoomRequestError(error).code,
  );
  const denied = codes.includes("E1419");
  const pages = query.data.pages.map((page) => {
    if (!page.data) throw new Error("Failed to load room comments");
    return page.data;
  });
  const writable = !codes.includes("E2101") && pages.every((page) => page.writable);
  const readOnlyAt = pages.find((page) => page.readOnlyAt)?.readOnlyAt;
  const comments = [
    ...new Map(
      pages.flatMap((page) => page.comments).map((comment) => [comment.commentId, comment]),
    ).values(),
  ];

  const submit = async ({ content }: CommentFormValues) => {
    if (!writable || denied || create.isPending) return;
    try {
      await create.mutateAsync({
        path: { roomId },
        body: { content: content.trim() },
      });
    } catch (error) {
      form.setError("root.serverError", {
        type: "server",
        message: getRoomRequestError(error).message,
      });
      return;
    }
    form.reset({ content: "" });
    void refreshComments();
  };

  if (denied)
    return (
      <section className={styles.status}>
        <p role="alert">현재 참여자만 댓글을 볼 수 있어요.</p>
      </section>
    );

  return (
    <section className={styles.panel} aria-label="세션 댓글">
      {writable && readOnlyAt && (
        <p className={styles.preview}>
          {formatCommentDate(readOnlyAt)}부터 댓글이 읽기 전용으로 바뀌어요.
        </p>
      )}
      {writable ? (
        <FormProvider {...form}>
          <CommentComposer pending={create.isPending} onSubmit={submit} />
        </FormProvider>
      ) : (
        <p className={styles.notice}>
          읽기 전용이에요. 지난 댓글은 볼 수 있지만 새 댓글을 남기거나 삭제할 수 없어요.
        </p>
      )}
      {form.formState.errors.root?.serverError && (
        <p role="alert" className={styles.error}>
          {form.formState.errors.root.serverError.message}
        </p>
      )}
      {remove.isError && !writable && (
        <p role="alert" className={styles.error}>
          {getRoomRequestError(remove.error).message}
        </p>
      )}
      {comments.length === 0 ? (
        <p className={styles.status}>
          {writable ? "아직 댓글이 없어요. 첫 댓글을 남겨 보세요." : "아직 댓글이 없어요."}
        </p>
      ) : (
        <ul className={styles.list} aria-label="댓글 목록">
          {comments.map((comment) => (
            <CommentRow key={comment.commentId} comment={comment} writable={writable} />
          ))}
        </ul>
      )}
      {query.isRefetchError && (
        <div className={styles.status}>
          <p role="alert">최신 댓글을 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={() => void query.refetch()}>
            다시 불러오기
          </Button>
        </div>
      )}
      {query.hasNextPage && (
        <div className={styles.status}>
          {query.isFetchNextPageError && <p role="alert">이전 댓글을 불러오지 못했어요.</p>}
          <Button
            variant="secondary"
            disabled={query.isFetchingNextPage}
            onClick={() => void query.fetchNextPage({ cancelRefetch: false })}
          >
            {query.isFetchingNextPage
              ? "불러오는 중"
              : query.isFetchNextPageError
                ? "더 보기 다시 시도"
                : "더 보기"}
          </Button>
        </div>
      )}
    </section>
  );
}
