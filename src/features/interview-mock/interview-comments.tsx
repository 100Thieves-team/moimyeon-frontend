"use client";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import type { MockInterview } from "./mock-data";
import { mockComments } from "./mock-data";
import * as styles from "./interview-mock.css";

type Comment = {
  author: string;
  badge?: string;
  content: string;
  id: string;
  mine: boolean;
  time: string;
};

type CommentFormValues = { content: string };

export function InterviewComments({ interview }: { interview: MockInterview }) {
  const searchParams = useSearchParams();
  const readonly = searchParams.get("mode") === "readonly";
  const [comments, setComments] = useState<Comment[]>(
    mockComments.map((comment) => ({ ...comment })),
  );
  const { control, handleSubmit, reset } = useForm<CommentFormValues>({
    defaultValues: { content: "" },
  });

  const submit = handleSubmit(({ content }) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setComments((current) => [
      {
        author: "든든한 곰 21",
        badge: "나",
        content: trimmed,
        id: `comment-${Date.now()}`,
        mine: true,
        time: "방금 전",
      },
      ...current,
    ]);
    reset();
  });

  return (
    <main className={styles.page}>
      <header className={styles.sessionHeader}>
        <div className={styles.sessionMeta}>
          <span className={`${styles.statusBadge} ${styles.leadingStatusBadge}`}>모집 중</span>
          <span>
            {interview.currentParticipants} / {interview.maxParticipants}명
          </span>
        </div>
        <h1 className={styles.sessionTitle}>{interview.title}</h1>
        <nav aria-label="면접 메뉴" className={styles.sessionTabs}>
          <Link className={styles.sessionTab} href={`/interviews/${interview.id}`}>
            면접 정보
          </Link>
          <span className={styles.sessionTab}>참여자 {interview.currentParticipants}</span>
          <span aria-current="page" className={`${styles.sessionTab} ${styles.sessionTabActive}`}>
            댓글
          </span>
        </nav>
      </header>

      <div className={styles.commentsColumn}>
        {readonly ? (
          <>
            <span className={styles.systemNotice}>
              면접이 끝났어요. 댓글은 곧 읽기 전용으로 바뀌어요
            </span>
            <div className={styles.readonlyNotice}>
              읽기 전용이에요. 지난 댓글은 볼 수 있지만 새 댓글은 남길 수 없어요.
            </div>
          </>
        ) : (
          <Form className={styles.composer} onSubmit={submit}>
            <Controller
              control={control}
              name="content"
              rules={{ validate: (value) => Boolean(value.trim()) }}
              render={({ field }) => (
                <Field.Root name={field.name}>
                  <Field.Label className={styles.filterLabel}>
                    댓글을 남겨요 — 일정 조율, 준비할 것, 당일 안내 무엇이든
                  </Field.Label>
                  <Field.Control
                    className={styles.composerTextarea}
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                    placeholder="댓글을 입력해 주세요."
                    ref={field.ref}
                    render={<textarea rows={2} />}
                    value={field.value}
                  />
                </Field.Root>
              )}
            />
            <div className={styles.composerFoot}>
              <span className={styles.helper}>
                텍스트만 남길 수 있어요 · 이력서는 참여자 탭에서 공유해요
              </span>
              <Button size="sm" type="submit">
                남기기
              </Button>
            </div>
          </Form>
        )}

        <section aria-label="댓글 목록" className={styles.commentList}>
          {comments.map((comment) => (
            <article className={styles.commentRow} key={comment.id}>
              <span aria-hidden="true" className={styles.commentAvatar}>
                {comment.author.includes("여우")
                  ? "여"
                  : comment.author.includes("곰")
                    ? "곰"
                    : "사"}
              </span>
              <div className={styles.commentContent}>
                <div className={styles.commentHead}>
                  <strong className={styles.commentAuthor}>{comment.author}</strong>
                  {comment.badge ? (
                    <span
                      className={`${styles.commentBadge} ${comment.mine ? styles.mineBadge : ""}`}
                    >
                      {comment.badge}
                    </span>
                  ) : null}
                  <time className={styles.commentTime}>{comment.time}</time>
                  {comment.mine && !readonly ? (
                    <button
                      className={styles.deleteComment}
                      onClick={() =>
                        setComments((current) => current.filter((item) => item.id !== comment.id))
                      }
                      type="button"
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
                <p className={styles.commentCopy}>{comment.content}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
