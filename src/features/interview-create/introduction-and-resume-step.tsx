"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Switch } from "@base-ui/react/switch";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { type ChangeEvent, type Ref, useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { ResumeResponse, ResumesResponse } from "@/api";
import {
  createResumeMutation,
  resumesOptions,
  resumesQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import {
  getResumesData,
  type InterviewCreateFormValues,
  type ResumeItem,
} from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;
const SUMMARY_POLL_INTERVAL_MS = 3_000;

type ResumePickerProps = {
  onBlur: () => void;
  onChange: (resumeId: string) => void;
  resumes: ResumeItem[];
  selectedResume: ResumeItem | null;
  triggerRef: Ref<HTMLButtonElement>;
  value: string;
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

function formatFileSize(sizeBytes?: number) {
  if (sizeBytes === undefined) {
    return "크기 정보 없음";
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))}KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")}MB`;
}

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

  return `${fileSize} · 저장된 이력서에서 가져왔어요`;
}

function upsertResume(
  current: ResumesResponse | undefined,
  nextResume: NonNullable<ResumeResponse["data"]>,
) {
  if (current?.data === undefined) {
    return current;
  }

  const existingResume = current.data.resumes.find(
    (resume) => resume.resumeId === nextResume.resumeId,
  );
  const mergedResume = { ...existingResume, ...nextResume };
  const hasResume = existingResume !== undefined;

  return {
    ...current,
    data: {
      ...current.data,
      resumes: hasResume
        ? current.data.resumes.map((resume) =>
            resume.resumeId === nextResume.resumeId ? mergedResume : resume,
          )
        : [mergedResume, ...current.data.resumes],
    },
  };
}

function ResumeSummary({ resume }: { resume: ResumeItem }) {
  const status = resume.aiSummary?.status;
  const message =
    status === "DONE" && resume.aiSummary?.text
      ? resume.aiSummary.text
      : status === "PROCESSING"
        ? "AI 요약을 만들고 있어요 — 잠깐이면 돼요."
        : status === "FAILED"
          ? "AI 요약을 만들지 못했어요. 이력서는 그대로 사용할 수 있어요."
          : "AI 요약 정보가 아직 없어요. 이력서는 그대로 사용할 수 있어요.";

  return (
    <div className={styles.resumeSummary}>
      <span className={styles.resumeSummaryLabel}>AI 요약</span>
      <output aria-live="polite" className={styles.resumeSummaryText}>
        {message}
      </output>
    </div>
  );
}

function ResumePicker({
  onBlur,
  onChange,
  resumes,
  selectedResume,
  triggerRef,
  value,
}: ResumePickerProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draftResumeId, setDraftResumeId] = useState(value);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const createResume = useMutation(createResumeMutation());

  const uploadResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    setUploadError(null);

    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("PDF 파일만 올릴 수 있어요.");
      return;
    }

    if (file.size === 0) {
      setUploadError("비어 있는 파일은 올릴 수 없어요.");
      return;
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      setUploadError("이력서는 10MB 이하의 PDF 파일만 올릴 수 있어요.");
      return;
    }

    try {
      const response = await createResume.mutateAsync({ body: { file } });
      const uploadedResume = response.data;

      if (uploadedResume === undefined) {
        throw new Error("Resume response did not include data.");
      }

      queryClient.setQueryData<ResumesResponse>(resumesQueryKey(), (current) =>
        upsertResume(current, uploadedResume),
      );
      setDraftResumeId(uploadedResume.resumeId);
      await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
    } catch (error) {
      setUploadError(getErrorMessage(error, "이력서를 올리지 못했어요. 다시 시도해 주세요."));
    }
  };

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) {
          setDraftResumeId(value);
          setUploadError(null);
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
            <Dialog.Title className={styles.resumeDialogTitle}>이력서 가져오기</Dialog.Title>
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

            <input
              accept="application/pdf,.pdf"
              aria-label="새 이력서 파일"
              className={styles.visuallyHidden}
              onChange={(event) => void uploadResume(event)}
              ref={fileInputRef}
              type="file"
            />
            <Button
              className={styles.resumeUploadButton}
              disabled={createResume.isPending}
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              type="button"
              variant="secondary"
            >
              {createResume.isPending ? "업로드 중..." : "이력서 업로드"}
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
                    if (draftResumeId) {
                      onChange(draftResumeId);
                    }
                  }}
                  size="sm"
                  type="button"
                />
              }
            >
              이 이력서 쓰기
            </Dialog.Close>
          </footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function IntroductionAndResumeStep() {
  const { control } = useFormContext<InterviewCreateFormValues>();
  const selectedResumeId = useWatch({ control, name: "resumeId" });
  const { data: resumesResponse } = useSuspenseQuery({
    ...resumesOptions(),
    refetchInterval: (query) => {
      const selectedResume = query.state.data?.data?.resumes.find(
        (resume) => resume.resumeId === selectedResumeId,
      );

      return selectedResume?.aiSummary?.status === "PROCESSING" ? SUMMARY_POLL_INTERVAL_MS : false;
    },
  });
  const currentResumes = getResumesData(resumesResponse);
  const selectedResume =
    currentResumes.resumes.find((resume) => resume.resumeId === selectedResumeId) ?? null;

  return (
    <div className={styles.formCard}>
      <Controller
        control={control}
        name="title"
        rules={{
          maxLength: { message: "면접 제목은 60자까지 입력할 수 있어요.", value: 60 },
          validate: (value) => Boolean(value.trim()) || "면접 제목을 입력해 주세요.",
        }}
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <Field.Label className={styles.fieldLabel}>면접 제목</Field.Label>
            <Field.Control
              className={styles.introductionInput}
              maxLength={60}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              ref={field.ref}
              value={field.value}
            />
            <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
              {fieldState.error?.message}
            </Field.Error>
          </Field.Root>
        )}
      />

      <Controller
        control={control}
        name="description"
        rules={{
          maxLength: { message: "면접 설명은 1,000자까지 입력할 수 있어요.", value: 1_000 },
        }}
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <Field.Label className={styles.fieldLabel}>면접 설명</Field.Label>
            <Field.Control
              className={styles.introductionTextarea}
              maxLength={1_000}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              ref={field.ref}
              render={<textarea rows={3} />}
              value={field.value}
            />
            <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
              {fieldState.error?.message}
            </Field.Error>
          </Field.Root>
        )}
      />

      <Controller
        control={control}
        name="resumeId"
        rules={{ required: "이력서를 선택해 주세요." }}
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <Field.Label className={styles.fieldLabel}>내 이력서</Field.Label>
            <ResumePicker
              onBlur={field.onBlur}
              onChange={field.onChange}
              resumes={currentResumes.resumes}
              selectedResume={selectedResume}
              triggerRef={field.ref}
              value={field.value}
            />
            {selectedResume ? <ResumeSummary resume={selectedResume} /> : null}
            <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
              {fieldState.error?.message}
            </Field.Error>
          </Field.Root>
        )}
      />

      <Controller
        control={control}
        name="resumePublic"
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <Field.Label className={styles.fieldLabel}>이력서 공유</Field.Label>
            <div className={styles.resumeShareRow}>
              <span className={styles.resumeShareCopy}>
                <span className={styles.resumeShareTitle} id="resume-public-label">
                  면접에서 이력서 원본을 공유해요
                </span>
                <span className={styles.resumeShareDescription}>
                  면접 참여가 확정된 사람들만 볼 수 있어요.
                </span>
              </span>
              <Switch.Root
                aria-labelledby="resume-public-label"
                checked={field.value}
                className={styles.resumeShareSwitch}
                inputRef={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                onCheckedChange={field.onChange}
              >
                <Switch.Thumb className={styles.resumeShareThumb} />
              </Switch.Root>
            </div>
          </Field.Root>
        )}
      />
    </div>
  );
}
