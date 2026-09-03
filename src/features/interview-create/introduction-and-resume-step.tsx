"use client";

import { Field } from "@base-ui/react/field";
import { Switch } from "@base-ui/react/switch";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ResumePicker, ResumeSummary, useResumePickerData } from "@/features/resume/resume-picker";
import type { InterviewCreateFormValues } from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

export function IntroductionAndResumeStep() {
  const { control } = useFormContext<InterviewCreateFormValues>();
  const selectedResumeId = useWatch({ control, name: "resumeId" });
  const { resumes, selectedResume } = useResumePickerData(selectedResumeId);

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
