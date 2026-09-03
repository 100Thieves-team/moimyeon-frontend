"use client";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { useMutation, useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  myRoomApplicationQueryKey,
  resumesOptions,
  resumesQueryKey,
  roomDetailOptions,
  roomDetailQueryKey,
  roomsQueryKey,
  submitRoomApplicationMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { formatInterviewStart } from "@/features/interview-detail/interview-detail-model";
import { ResumePicker, ResumeSummary, useResumePickerData } from "@/features/resume/resume-picker";
import { getPreferredResumeId, getResumesData } from "@/features/resume/resume-model";
import * as styles from "./interview-apply.css";

type InterviewApplyFormValues = {
  note: string;
  resumeId: string;
};

function getApplicationError(error: unknown) {
  const fallback = "참가 신청을 보내지 못했어요. 잠시 후 다시 시도해 주세요.";

  if (typeof error !== "object" || error === null || !("error" in error)) {
    return { code: null, message: fallback };
  }

  const detail = error.error;

  if (typeof detail !== "object" || detail === null) {
    return { code: null, message: fallback };
  }

  return {
    code: "code" in detail && typeof detail.code === "string" ? detail.code : null,
    message: "message" in detail && typeof detail.message === "string" ? detail.message : fallback,
  };
}

function InterviewApplicationForm({
  initialResumeId,
  roomId,
}: {
  initialResumeId: string;
  roomId: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const methods = useForm<InterviewApplyFormValues>({
    defaultValues: { note: "", resumeId: initialResumeId },
    mode: "onBlur",
  });
  const selectedResumeId = useWatch({ control: methods.control, name: "resumeId" });
  const { resumes, selectedResume } = useResumePickerData(selectedResumeId);
  const submitApplication = useMutation(submitRoomApplicationMutation());

  const submit = methods.handleSubmit(async (values) => {
    methods.clearErrors("root.serverError");

    try {
      await submitApplication.mutateAsync({
        body: { note: values.note, resumeId: values.resumeId },
        path: { roomId },
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomDetailQueryKey({ path: { roomId } }) }),
        queryClient.invalidateQueries({
          queryKey: myRoomApplicationQueryKey({ path: { roomId } }),
        }),
        queryClient.invalidateQueries({ queryKey: roomsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: resumesQueryKey() }),
      ]);
      router.replace(`/interviews/${roomId}`);
    } catch (error) {
      const applicationError = getApplicationError(error);

      if (applicationError.code === "E1010") {
        methods.setValue("resumeId", "", { shouldDirty: true });
        await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
        methods.setError("resumeId", {
          message: "선택한 이력서를 찾을 수 없어요. 다시 선택해 주세요.",
          type: "server",
        });
      } else {
        methods.setError("root.serverError", {
          message: applicationError.message,
          type: "server",
        });
      }
    }
  });

  return (
    <Form className={styles.formCard} method="post" onSubmit={submit}>
      <Controller
        control={methods.control}
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
              onChange={(resumeId) => {
                field.onChange(resumeId);
                methods.clearErrors("root.serverError");
              }}
              resumes={resumes.resumes}
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
        control={methods.control}
        name="note"
        rules={{
          maxLength: { message: "전달 사항은 300자까지 입력할 수 있어요.", value: 300 },
        }}
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <Field.Label className={styles.fieldLabel}>
              방장에게 전할 말 <span className={styles.fieldRequirement}>선택</span>
            </Field.Label>
            <Field.Control
              className={styles.note}
              onBlur={field.onBlur}
              onValueChange={(value) => {
                field.onChange(value);
                methods.clearErrors("root.serverError");
              }}
              placeholder="간단한 소개나 참여 목적을 남겨 주세요."
              ref={field.ref}
              render={<textarea rows={2} />}
              value={field.value}
            />
            <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
              {fieldState.error?.message}
            </Field.Error>
          </Field.Root>
        )}
      />

      {methods.formState.errors.root?.serverError?.message ? (
        <p className={styles.rootError} role="alert">
          {methods.formState.errors.root.serverError.message}
        </p>
      ) : null}

      <Button className={styles.submitButton} disabled={submitApplication.isPending} type="submit">
        {submitApplication.isPending ? "신청 중..." : "참가 신청하기"}
      </Button>
    </Form>
  );
}

export function InterviewApplyContent({ roomId }: { roomId: string }) {
  const [{ data: roomResponse }, { data: resumesResponse }] = useSuspenseQueries({
    queries: [roomDetailOptions({ path: { roomId } }), resumesOptions()],
  });
  const room = roomResponse.data;

  if (room === undefined || room === null) {
    throw new Error("Failed to load interview detail");
  }

  const resumes = getResumesData(resumesResponse);
  const detailHref = `/interviews/${roomId}` as const;
  const summary = [
    formatInterviewStart(room.schedule),
    room.methodLabel,
    room.region?.label,
    room.recruit ? `${room.recruit.current} / ${room.recruit.max}명` : "인원 정보 없음",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.heading}>
          <h1 className={styles.title}>참가 신청</h1>
        </header>

        <section aria-label="신청할 면접" className={styles.roomSummary}>
          <div className={styles.roomCopy}>
            <h2 className={styles.roomTitle}>{room.title}</h2>
            <p className={styles.roomMeta}>{summary}</p>
          </div>
          <Link className={styles.detailLink} href={detailHref}>
            상세 보기
          </Link>
        </section>

        <InterviewApplicationForm initialResumeId={getPreferredResumeId(resumes)} roomId={roomId} />
      </div>
    </main>
  );
}
