"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Switch } from "@base-ui/react/switch";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FileText, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  createResumeMutation,
  resumesOptions,
  resumesQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import type { InterviewCreateFormValues } from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

function AiSummary({ status, text }: { status?: string; text?: string | null }) {
  if (status === "DONE" && text)
    return (
      <div className={styles.aiSummary}>
        <strong>AI 요약</strong>
        <p>{text}</p>
      </div>
    );
  if (status === "PROCESSING")
    return (
      <p className={styles.help}>AI가 이력서를 요약하고 있어요. 기다리지 않고 계속할 수 있어요.</p>
    );
  if (status === "FAILED")
    return (
      <p className={styles.help}>AI 요약을 만들지 못했지만 이력서는 정상적으로 사용할 수 있어요.</p>
    );
  return null;
}

function ResumePicker() {
  const { control, setValue } = useFormContext<InterviewCreateFormValues>();
  const resumeId = useWatch({ control, name: "resumeId" });
  const { data } = useSuspenseQuery(resumesOptions());
  const queryClient = useQueryClient();
  const upload = useMutation(createResumeMutation());
  const fileInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const resumes = data.data?.resumes ?? [];
  const firstResumeId = resumes[0]?.resumeId;
  const selected = resumes.find((resume) => resume.resumeId === resumeId);

  useEffect(() => {
    if (!resumeId && firstResumeId) setValue("resumeId", firstResumeId, { shouldValidate: true });
  }, [firstResumeId, resumeId, setValue]);

  const uploadFile = async (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" || file.size === 0 || file.size > 10 * 1024 * 1024) {
      setUploadError("10MB 이하의 PDF 파일을 선택해 주세요.");
      return;
    }
    setUploadError(null);
    try {
      const response = await upload.mutateAsync({ body: { file } });
      await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
      if (response.data) {
        setValue("resumeId", response.data.resumeId, { shouldValidate: true });
        setOpen(false);
      }
    } catch {
      setUploadError("이력서를 업로드하지 못했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <Controller
      control={control}
      name="resumeId"
      rules={{ required: "이력서를 선택해 주세요." }}
      render={({ fieldState }) => (
        <div className={styles.field}>
          <span className={styles.label}>
            내 이력서 <span className={styles.required}>필수</span>
          </span>
          {selected ? (
            <div className={styles.resumeCard}>
              <FileText aria-hidden="true" size={20} />
              <div>
                <strong>{selected.name}</strong>
                <p>{Math.ceil((selected.file?.sizeBytes ?? 0) / 1024)}KB</p>
              </div>
              <Button onClick={() => setOpen(true)} type="button" variant="secondary">
                변경하기
              </Button>
            </div>
          ) : (
            <Button onClick={() => setOpen(true)} type="button" variant="secondary">
              이력서 선택
            </Button>
          )}
          <AiSummary status={selected?.aiSummary?.status} text={selected?.aiSummary?.text} />
          {fieldState.error ? <p className={styles.error}>{fieldState.error.message}</p> : null}
          <Dialog.Root onOpenChange={setOpen} open={open}>
            <Dialog.Portal>
              <Dialog.Backdrop className={styles.dialogBackdrop} />
              <Dialog.Popup className={styles.dialogPopup}>
                <div className={styles.dialogHeader}>
                  <div>
                    <Dialog.Title className={styles.dialogTitle}>저장 이력서 선택</Dialog.Title>
                    <Dialog.Description className={styles.dialogDescription}>
                      최근 사용한 이력서부터 보여드려요.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close aria-label="닫기" className={styles.iconButton}>
                    <X aria-hidden="true" size={18} />
                  </Dialog.Close>
                </div>
                <div className={styles.dialogBody}>
                  <div className={styles.resumeList}>
                    {resumes.map((resume) => (
                      <button
                        className={styles.resumeOption}
                        data-selected={resume.resumeId === resumeId}
                        key={resume.resumeId}
                        onClick={() => {
                          setValue("resumeId", resume.resumeId, { shouldValidate: true });
                          setOpen(false);
                        }}
                        type="button"
                      >
                        <FileText aria-hidden="true" size={18} />
                        <span>
                          <strong>{resume.name}</strong>
                          <small>
                            {resume.isDefault ? "기본 이력서 · " : ""}
                            {resume.aiSummary?.status === "DONE"
                              ? "AI 요약 완료"
                              : resume.aiSummary?.status === "PROCESSING"
                                ? "AI 요약 중"
                                : "AI 요약 없음"}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                  <input
                    accept="application/pdf,.pdf"
                    className={styles.visuallyHidden}
                    onChange={(event) => void uploadFile(event.target.files?.[0])}
                    ref={fileInput}
                    type="file"
                  />
                  <Button
                    disabled={upload.isPending || resumes.length >= (data.data?.maxCount ?? 10)}
                    onClick={() => fileInput.current?.click()}
                    type="button"
                    variant="secondary"
                  >
                    <Upload aria-hidden="true" size={16} />{" "}
                    {upload.isPending ? "업로드 중..." : "PDF 업로드"}
                  </Button>
                  {uploadError ? <p className={styles.error}>{uploadError}</p> : null}
                </div>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      )}
    />
  );
}

export function InterviewResumeStep() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<InterviewCreateFormValues>();
  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });
  return (
    <>
      <h1 className={styles.title}>참여할 사람들에게 면접을 소개해요</h1>
      <section className={styles.card}>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="interview-title">
              면접 제목 <span className={styles.required}>필수</span>
            </label>
            <span>{title.length}/60</span>
          </div>
          <input
            aria-invalid={Boolean(errors.title)}
            className={styles.inputStandalone}
            id="interview-title"
            maxLength={60}
            {...register("title", {
              required: "면접 제목을 입력해 주세요.",
              maxLength: { value: 60, message: "면접 제목은 60자까지 입력할 수 있어요." },
            })}
          />
          {errors.title ? <p className={styles.error}>{errors.title.message}</p> : null}
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="interview-description">
              면접 설명 <span className={styles.required}>선택</span>
            </label>
            <span>{description.length}/1000</span>
          </div>
          <textarea
            className={styles.textarea}
            id="interview-description"
            maxLength={1000}
            {...register("description", { maxLength: 1000 })}
          />
        </div>
        <ResumePicker />
        <Controller
          control={control}
          name="resumePublic"
          render={({ field }) => (
            <div className={styles.switchRow}>
              <span>
                <strong>면접에서 이력서 원본을 공유해요</strong>
                <small>면접 참여가 확정된 사람들만 볼 수 있어요.</small>
              </span>
              <Switch.Root
                aria-label="이력서 원본 공유"
                checked={field.value}
                className={styles.switchRoot}
                onCheckedChange={field.onChange}
              >
                <Switch.Thumb className={styles.switchThumb} />
              </Switch.Root>
            </div>
          )}
        />
      </section>
    </>
  );
}
