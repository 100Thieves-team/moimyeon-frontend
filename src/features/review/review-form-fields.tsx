"use client";

import { Field } from "@base-ui/react/field";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Controller, useFormContext } from "react-hook-form";
import { REVIEW_TAG_LABELS } from "./review-model";
import * as styles from "./review-form.css";

export type ReviewFormValues = {
  content: string;
  tags: string[];
};

export function ReviewFormFields() {
  const {
    clearErrors,
    control,
    formState: { errors },
  } = useFormContext<ReviewFormValues>();

  return (
    <>
      <Controller
        control={control}
        name="tags"
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <div className={styles.fieldLabelRow}>
              <Field.Label className={styles.fieldLabel}>이런 점이 좋았어요</Field.Label>
              <span className={styles.fieldOptional}>선택</span>
            </div>
            <ToggleGroup
              aria-label="이런 점이 좋았어요"
              className={styles.tagChips}
              multiple
              onValueChange={(nextValue) => {
                clearErrors("root.serverError");
                field.onChange(nextValue);
              }}
              value={field.value}
            >
              {REVIEW_TAG_LABELS.map((label) => (
                <Toggle className={styles.tagChip} key={label} value={label}>
                  {label}
                </Toggle>
              ))}
            </ToggleGroup>
          </Field.Root>
        )}
      />
      <Controller
        control={control}
        name="content"
        rules={{
          maxLength: { message: "한 줄 후기는 200자까지 입력할 수 있어요.", value: 200 },
        }}
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <div className={styles.fieldLabelRow}>
              <Field.Label className={styles.fieldLabel}>한 줄 후기</Field.Label>
              <span className={styles.fieldOptional}>선택</span>
            </div>
            <Field.Control
              className={styles.textarea}
              maxLength={200}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(event) => {
                clearErrors("root.serverError");
                field.onChange(event);
              }}
              placeholder="함께한 면접에서 느낀 점을 남겨주세요."
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
      {errors.root?.serverError !== undefined && (
        <p className={styles.rootError} role="alert">
          {errors.root.serverError.message}
        </p>
      )}
    </>
  );
}
