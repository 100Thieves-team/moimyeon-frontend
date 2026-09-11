"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { ResumesResponse } from "@/api";
import {
  deleteResumeMutation,
  makeResumeDefaultMutation,
  resumesOptions,
  resumesQueryKey,
  retryResumeSummaryMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import {
  applyDefaultResume,
  formatRegisteredMeta,
  getResumesData,
  removeResume,
  type ResumeItem,
  upsertResume,
} from "@/features/resume/resume-model";
import { useResumeUpload } from "@/features/resume/use-resume-upload";
import * as styles from "./resume-manager.css";

const SUMMARY_POLL_INTERVAL_MS = 3_000;

type ResumeSummaryCellProps = {
  isRetrying: boolean;
  onRetry: () => void;
  resume: ResumeItem;
  retryError: string | null;
};

type DeleteResumeDialogProps = {
  onDelete: () => Promise<void>;
  resumeName: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("error" in error)) {
    return fallback;
  }

  const detail = error.error;

  if (typeof detail !== "object" || detail === null || !("message" in detail)) {
    return fallback;
  }

  return typeof detail.message === "string" ? detail.message : fallback;
}

function ResumeSummaryCell({ isRetrying, onRetry, resume, retryError }: ResumeSummaryCellProps) {
  const status = resume.aiSummary?.status;
  const isDone = status === "DONE" && Boolean(resume.aiSummary?.text);
  const message = isDone
    ? `AI 요약 — ${resume.aiSummary?.text}`
    : status === "PROCESSING"
      ? "AI 요약을 만들고 있어요 — 잠깐이면 돼요"
      : status === "FAILED"
        ? (retryError ?? "AI 요약을 만들지 못했어요.")
        : "AI 요약 정보가 아직 없어요.";

  return (
    <div className={styles.summaryCell}>
      <output
        aria-live="polite"
        className={isDone ? styles.summaryText : `${styles.summaryText} ${styles.summaryPending}`}
      >
        {message}
      </output>
      {status === "FAILED" && (
        <button
          aria-label={`${resume.name} AI 요약 다시 만들기`}
          className={styles.retryButton}
          disabled={isRetrying}
          onClick={onRetry}
          type="button"
        >
          {isRetrying ? "다시 만드는 중..." : "다시 만들기"}
        </button>
      )}
    </div>
  );
}

function DeleteResumeDialog({ onDelete, resumeName }: DeleteResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteResume = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await onDelete();
      setOpen(false);
    } catch (error) {
      setDeleteError(getErrorMessage(error, "이력서를 삭제하지 못했어요. 다시 시도해 주세요."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog.Root
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          setDeleteError(null);
        }
      }}
      open={open}
    >
      <AlertDialog.Trigger
        aria-label={`${resumeName} 삭제`}
        className={styles.deleteButton}
        type="button"
      >
        삭제
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={styles.dialogBackdrop} />
        <AlertDialog.Popup className={styles.dialogPopup}>
          <AlertDialog.Title className={styles.dialogTitle}>이력서 삭제</AlertDialog.Title>
          <AlertDialog.Description className={styles.dialogDescription}>
            {resumeName} 이력서를 삭제할까요? 삭제한 이력서는 되돌릴 수 없지만, 이미 제출한 면접의
            기록은 그대로 유지돼요.
          </AlertDialog.Description>
          {deleteError && (
            <p className={styles.dialogError} role="alert">
              {deleteError}
            </p>
          )}
          <div className={styles.dialogFooter}>
            <AlertDialog.Close
              disabled={isDeleting}
              render={<Button size="sm" type="button" variant="secondary" />}
            >
              취소
            </AlertDialog.Close>
            <Button
              disabled={isDeleting}
              onClick={() => void deleteResume()}
              size="sm"
              type="button"
            >
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export function ResumeManager() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [retryError, setRetryError] = useState<{ message: string; resumeId: string } | null>(null);
  const [defaultError, setDefaultError] = useState<{ message: string; resumeId: string } | null>(
    null,
  );
  const { isUploading, uploadError, uploadResume } = useResumeUpload();
  const deleteResume = useMutation(deleteResumeMutation());
  const makeDefault = useMutation(makeResumeDefaultMutation());
  const retrySummary = useMutation(retryResumeSummaryMutation());
  const { data: resumesResponse } = useSuspenseQuery({
    ...resumesOptions(),
    refetchInterval: (query) =>
      query.state.data?.data?.resumes.some((resume) => resume.aiSummary?.status === "PROCESSING")
        ? SUMMARY_POLL_INTERVAL_MS
        : false,
  });
  const { maxCount, resumes } = getResumesData(resumesResponse);
  const isFull = resumes.length >= maxCount;

  const deleteResumeById = async (resumeId: string) => {
    await deleteResume.mutateAsync({ path: { resumeId } });
    queryClient.setQueryData<ResumesResponse>(resumesQueryKey(), (current) =>
      removeResume(current, resumeId),
    );
    await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
  };

  const makeDefaultById = async (resumeId: string) => {
    setDefaultError(null);

    try {
      await makeDefault.mutateAsync({ path: { resumeId } });
      queryClient.setQueryData<ResumesResponse>(resumesQueryKey(), (current) =>
        applyDefaultResume(current, resumeId),
      );
    } catch (error) {
      setDefaultError({
        message: getErrorMessage(error, "기본 이력서로 지정하지 못했어요. 다시 시도해 주세요."),
        resumeId,
      });
    } finally {
      await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
    }
  };

  const retrySummaryById = async (resumeId: string) => {
    setRetryError(null);

    try {
      const response = await retrySummary.mutateAsync({ path: { resumeId } });
      const retriedResume = response.data;

      if (retriedResume === undefined || retriedResume === null) {
        throw new Error("Retry response did not include data.");
      }

      queryClient.setQueryData<ResumesResponse>(resumesQueryKey(), (current) =>
        upsertResume(current, retriedResume),
      );
    } catch (error) {
      setRetryError({
        message: getErrorMessage(error, "AI 요약을 다시 만들지 못했어요. 잠시 후 시도해 주세요."),
        resumeId,
      });
    } finally {
      await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
    }
  };

  return (
    <div className={styles.manager}>
      {resumes.length > 0 ? (
        <ul aria-label="보관 이력서 목록" className={styles.list}>
          {resumes.map((resume) => (
            <li className={styles.row} key={resume.resumeId}>
              <div className={styles.fileCell}>
                <span className={styles.pdfBadge}>PDF</span>
                <div className={styles.fileInfo}>
                  <span className={styles.fileHeading}>
                    <span className={styles.fileName}>{resume.name}</span>
                    {resume.isDefault && <span className={styles.defaultBadge}>기본</span>}
                  </span>
                  <span className={styles.fileMeta}>{formatRegisteredMeta(resume)}</span>
                </div>
              </div>
              <ResumeSummaryCell
                isRetrying={
                  retrySummary.isPending &&
                  retrySummary.variables?.path.resumeId === resume.resumeId
                }
                onRetry={() => void retrySummaryById(resume.resumeId)}
                resume={resume}
                retryError={retryError?.resumeId === resume.resumeId ? retryError.message : null}
              />
              <div className={styles.rowActions}>
                {!resume.isDefault && (
                  <button
                    aria-label={`${resume.name} 기본으로 지정`}
                    className={styles.makeDefaultButton}
                    disabled={resume.aiSummary?.status !== "DONE" || makeDefault.isPending}
                    onClick={() => void makeDefaultById(resume.resumeId)}
                    type="button"
                  >
                    기본으로 지정
                  </button>
                )}
                <DeleteResumeDialog
                  onDelete={() => deleteResumeById(resume.resumeId)}
                  resumeName={resume.name}
                />
              </div>
              {defaultError?.resumeId === resume.resumeId && (
                <p className={styles.rowError} role="alert">
                  {defaultError.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>
          보관 중인 이력서가 아직 없어요.
          <br />
          이력서를 올리면 AI 요약과 함께 보관해요.
        </p>
      )}

      <div className={styles.footer}>
        {uploadError && (
          <p className={styles.uploadError} role="alert">
            {uploadError}
          </p>
        )}
        {isFull && (
          <p className={styles.footerMessage}>
            이력서는 최대 {maxCount}개까지 보관할 수 있어요. 새로 올리려면 먼저 삭제해 주세요.
          </p>
        )}
        <input
          accept="application/pdf,.pdf"
          aria-label="새 이력서 파일"
          className={styles.visuallyHidden}
          onChange={(event) => void uploadResume(event)}
          ref={fileInputRef}
          type="file"
        />
        <Button
          disabled={isUploading || isFull}
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          {isUploading ? "업로드 중..." : "이력서 업로드"}
        </Button>
      </div>
    </div>
  );
}
