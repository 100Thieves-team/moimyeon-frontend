"use client";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/button";
import * as styles from "./room-comments.css";

export type CommentFormValues = { content: string };

export function CommentComposer({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (values: CommentFormValues) => Promise<void>;
}) {
  const { control, handleSubmit, clearErrors } = useFormContext<CommentFormValues>();

  return (
    <Form className={styles.composer} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="content"
        rules={{
          validate: (value) => {
            const length = value.trim().length;
            return length === 0
              ? "댓글을 입력해 주세요."
              : length > 1000
                ? "댓글은 1,000자까지 남길 수 있어요."
                : true;
          },
        }}
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            name={field.name}
            invalid={fieldState.invalid}
            touched={fieldState.isTouched}
            dirty={fieldState.isDirty}
          >
            <Field.Label className={styles.label}>댓글 내용</Field.Label>
            <Field.Control
              render={<textarea rows={1} />}
              className={styles.textarea}
              name={field.name}
              ref={field.ref}
              value={field.value}
              onBlur={field.onBlur}
              disabled={pending}
              placeholder="댓글을 남겨보세요."
              onChange={(event) => {
                clearErrors("root.serverError");
                field.onChange(event);
              }}
            />
            <div className={styles.footer}>
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "남기는 중" : "남기기"}
              </Button>
            </div>
            <Field.Error className={styles.error} match={Boolean(fieldState.error)}>
              {fieldState.error?.message}
            </Field.Error>
          </Field.Root>
        )}
      />
    </Form>
  );
}
