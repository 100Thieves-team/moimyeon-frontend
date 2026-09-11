"use client";

import { Controller } from "react-hook-form";

import { Dialog } from "@base-ui/react/dialog";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { type Ref, useRef, useState } from "react";
import { resumesOptions } from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import {
  formatFileSize,
  getResumesData,
  validateResumeFile,
  type ResumeItem,
} from "./resume-model";
import { useResumeUpload } from "./use-resume-upload";
import * as styles from "./resume-picker.css";

const SUMMARY_POLL_INTERVAL_MS = 3_000;

type ResumePickerProps = {
  onBlur: () => void;
  onChange: (resumeId: string) => void;
  resumes: ResumeItem[];
  selectedResume: ResumeItem | null;
  triggerRef: Ref<HTMLButtonElement>;
  value: string;
};

function formatUsedDate(usedAt?: string | null) {
  const match = usedAt?.match(/^\d{4}-(\d{2})-(\d{2})/);

  if (!match) {
    return null;
  }

  return `${Number(match[1])}월 ${Number(match[2])}일`;
}

function formatResumeMeta(resume: ResumeItem) {
  const fileSize = formatFileSize(resume.file?.sizeBytes);
  const usedDate = formatUsedDate(resume.lastUsed?.usedAt);

  if (usedDate && resume.lastUsed?.roomTitle) {
    return `${fileSize} · ${usedDate} ${resume.lastUsed.roomTitle}에서 사용`;
  }

  if (usedDate) {
    return `${fileSize} · ${usedDate}에 사용`;
  }

  return fileSize;
}

export function useResumePickerData(selectedResumeId: string) {
  const { data: resumesResponse } = useSuspenseQuery({
    ...resumesOptions(),
    refetchInterval: (query) => {
      const selectedResume = query.state.data?.data?.resumes.find(
        (resume) => resume.resumeId === selectedResumeId,
      );

      return selectedResume?.aiSummary?.status === "PROCESSING" ? SUMMARY_POLL_INTERVAL_MS : false;
    },
  });
  const resumes = getResumesData(resumesResponse);

  return {
    resumes,
    selectedResume: resumes.resumes.find((resume) => resume.resumeId === selectedResumeId) ?? null,
  };
}

export function ResumeSummary({ resume }: { resume: ResumeItem }) {
  const status = resume.aiSummary?.status;
  const message =
    status === "DONE" && resume.aiSummary?.text
      ? resume.aiSummary.text
      : status === "PROCESSING"
        ? "AI 요약을 만들고 있어요"
        : status === "FAILED"
          ? "AI 요약을 만들지 못했어요."
          : "AI 요약 정보가 아직 없어요.";

  return (
    <div className={styles.resumeSummary}>
      <span className={styles.resumeSummaryLabel}>AI 요약</span>
      <output aria-live="polite" className={styles.resumeSummaryText}>
        {message}
      </output>
    </div>
  );
}

export function ResumePicker({
  onBlur,
  onChange,
  resumes,
  selectedResume,
  triggerRef,
  value,
}: ResumePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draftResumeId, setDraftResumeId] = useState(value);
  const { control, isUploading, resetUploadError, uploadError, uploadResume } = useResumeUpload(
    (uploadedResume) => setDraftResumeId(uploadedResume.resumeId),
  );

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) {
          setDraftResumeId(value);
          resetUploadError();
        } else {
          onBlur();
        }
      }}
    >
      {selectedResume ? (
        <div className={styles.resumeFileRow}>
          <span className={styles.resumePdfBadge}>PDF</span>
          <span className={styles.resumeFileInfo}>
            <span className={styles.resumeFileName}>{selectedResume.name}</span>
            <span className={styles.resumeFileMeta}>{formatResumeMeta(selectedResume)}</span>
          </span>
          <Dialog.Trigger className={styles.resumeChangeButton} ref={triggerRef} type="button">
            변경하기
          </Dialog.Trigger>
        </div>
      ) : (
        <Dialog.Trigger className={styles.resumeEmptyTrigger} ref={triggerRef} type="button">
          이력서 업로드
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Backdrop className={styles.resumeDialogBackdrop} />
        <Dialog.Popup className={styles.resumeDialogPopup}>
          <header className={styles.resumeDialogHeader}>
            <Dialog.Title className={styles.resumeDialogTitle}>이력서 선택</Dialog.Title>
            <Dialog.Close
              aria-label="이력서 선택 닫기"
              className={styles.resumeDialogClose}
              type="button"
            >
              <X aria-hidden="true" size={18} strokeWidth={1.75} />
            </Dialog.Close>
          </header>

          <div className={styles.resumeDialogBody}>
            {resumes.length > 0 ? (
              <RadioGroup
                aria-label="저장된 이력서"
                className={styles.resumeOptionList}
                onValueChange={setDraftResumeId}
                value={draftResumeId}
              >
                {resumes.map((resume, index) => (
                  <Radio.Root
                    aria-labelledby={`resume-option-${resume.resumeId}`}
                    className={styles.resumeOption}
                    key={resume.resumeId}
                    value={resume.resumeId}
                  >
                    <span className={styles.resumeOptionCopy}>
                      <span className={styles.resumeOptionHeading}>
                        <span
                          className={styles.resumeOptionName}
                          id={`resume-option-${resume.resumeId}`}
                        >
                          {resume.name}
                        </span>
                        {index === 0 && resume.lastUsed?.usedAt ? (
                          <span className={styles.resumeRecentBadge}>최근 사용</span>
                        ) : null}
                      </span>
                      <span className={styles.resumeOptionMeta}>{formatResumeMeta(resume)}</span>
                    </span>
                    <Check
                      aria-hidden="true"
                      className={styles.resumeOptionCheck}
                      size={17}
                      strokeWidth={1.75}
                    />
                  </Radio.Root>
                ))}
              </RadioGroup>
            ) : (
              <p className={styles.resumeDialogEmpty}>저장된 이력서가 아직 없어요.</p>
            )}

            <Controller
              control={control}
              name="file"
              rules={{
                validate: (file) =>
                  file ? (validateResumeFile(file) ?? true) : "이력서 파일을 선택해 주세요.",
              }}
              render={({ field }) => (
                <input
                  accept="application/pdf,.pdf"
                  aria-label="새 이력서 파일"
                  className={styles.visuallyHidden}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    event.currentTarget.value = "";
                    if (!file) return;
                    resetUploadError();
                    field.onChange(file);
                    void uploadResume();
                  }}
                  ref={(element) => {
                    fileInputRef.current = element;
                    field.ref(element);
                  }}
                  type="file"
                />
              )}
            />
            <Button
              className={styles.resumeUploadButton}
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              type="button"
              variant="secondary"
            >
              {isUploading ? "업로드 중..." : "이력서 업로드"}
            </Button>
            {uploadError ? (
              <p className={styles.resumeUploadError} role="alert">
                {uploadError}
              </p>
            ) : null}
          </div>

          <footer className={styles.resumeDialogFooter}>
            <Dialog.Close render={<Button size="sm" type="button" variant="secondary" />}>
              취소
            </Dialog.Close>
            <Dialog.Close
              render={
                <Button
                  disabled={!draftResumeId}
                  onClick={() => {
                    if (draftResumeId) onChange(draftResumeId);
                  }}
                  size="sm"
                  type="button"
                />
              }
            >
              선택하기
            </Dialog.Close>
          </footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
