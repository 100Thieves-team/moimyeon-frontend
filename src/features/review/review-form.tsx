"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Checkbox } from "@base-ui/react/checkbox";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Toast } from "@base-ui/react/toast";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  deleteReviewMutation,
  getReviewTargetsQueryKey,
  skipReviewMutation,
  submitReviewMutation,
  updateReviewMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import type {
  DeleteReviewError,
  SkipReviewError,
  SubmitReviewError,
  UpdateReviewError,
} from "@/api/generated";
import { Button } from "@/components/button";
import { REVIEW_TAG_LABELS, type ReviewTarget } from "./review-model";
import * as styles from "./review-form.css";

type ReviewFormProps = {
  onCompleted: () => void;
  /* SUBMITTED 대상의 수정 모드. targets 확장(제출값 조회)이 생기면 프리필로 교체한다 */
  reviewId?: number | null;
  roomId: string;
  target: ReviewTarget;
};

type ReviewFormValues = {
  anonymous: boolean;
  content: string;
  tags: string[];
};

function getApiErrorMessage(error: unknown) {
  const apiError = (
    error as DeleteReviewError | SkipReviewError | SubmitReviewError | UpdateReviewError
  ).error;

  return apiError?.message ?? "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
}

export function ReviewForm({ onCompleted, reviewId, roomId, target }: ReviewFormProps) {
  const isEdit = reviewId !== undefined && reviewId !== null;
  const queryClient = useQueryClient();
  const toastManager = Toast.useToastManager();
  const submitReview = useMutation(submitReviewMutation());
  const updateReview = useMutation(updateReviewMutation());
  const deleteReview = useMutation(deleteReviewMutation());
  const skipReview = useMutation(skipReviewMutation());
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<ReviewFormValues>({
    defaultValues: {
      anonymous: true,
      content: "",
      tags: [],
    },
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isBusy = isSubmitting || skipReview.isPending || deleteReview.isPending;
  const watchedTags = useWatch({ control, name: "tags" });
  const watchedContent = useWatch({ control, name: "content" });
  const hasInput = watchedTags.length > 0 || watchedContent.trim() !== "";

  const invalidateTargets = () =>
    queryClient.invalidateQueries({
      queryKey: getReviewTargetsQueryKey({ path: { roomId } }),
    });

  const submitForm = handleSubmit(async ({ anonymous, content, tags }) => {
    const normalizedContent = content.trim() === "" ? null : content.trim();

    try {
      if (isEdit) {
        await updateReview.mutateAsync({
          body: { content: normalizedContent, tags },
          path: { reviewId: String(reviewId) },
        });
      } else {
        await submitReview.mutateAsync({
          body: {
            /* dev API가 anonymous 누락 시 E400을 반환하므로 항상 명시한다(계약상 optional·기본 true지만 필수로 동작) */
            anonymous,
            content: normalizedContent,
            tags,
            targetMemberId: target.memberId,
          },
          path: { roomId },
        });
      }
    } catch (error) {
      setError("root", { message: getApiErrorMessage(error), type: "server" });

      return;
    }

    await invalidateTargets();
    toastManager.add({
      title: isEdit
        ? `${target.nickname} 님에게 남긴 후기를 수정했어요`
        : `${target.nickname} 님에게 후기를 남겼어요`,
    });
    onCompleted();
  });

  const deleteSubmittedReview = async () => {
    if (!isEdit) {
      return;
    }

    clearErrors("root");

    try {
      await deleteReview.mutateAsync({ path: { reviewId: String(reviewId) } });
    } catch (error) {
      setError("root", { message: getApiErrorMessage(error), type: "server" });

      return;
    }

    await invalidateTargets();
    toastManager.add({ title: "후기를 삭제했어요. 다시 작성할 수 있어요" });
    onCompleted();
  };

  const confirmDelete = async () => {
    await deleteSubmittedReview();
    setDeleteDialogOpen(false);
  };

  const skipTarget = async () => {
    clearErrors("root");

    try {
      await skipReview.mutateAsync({
        body: { targetMemberId: target.memberId },
        path: { roomId },
      });
    } catch (error) {
      setError("root", { message: getApiErrorMessage(error), type: "server" });

      return;
    }

    await invalidateTargets();
    toastManager.add({ title: "이번엔 건너뛰었어요" });
    onCompleted();
  };

  return (
    <Form className={styles.form} onSubmit={submitForm}>
      {isEdit && (
        <p className={styles.editNotice}>
          이전에 남긴 내용은 불러오지 못해요. 저장하면 새로 입력한 내용으로 교체돼요.
        </p>
      )}
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
                clearErrors("root");
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
                clearErrors("root");
                field.onChange(event);
              }}
              placeholder="어땠는지 한 줄이면 충분해요. 후기 원문은 상대에게만 보여요."
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
      {!isEdit && (
        <Controller
          control={control}
          name="anonymous"
          render={({ field }) => (
            <label className={styles.anonymousRow} htmlFor={`review-anonymous-${target.memberId}`}>
              <Checkbox.Root
                checked={field.value}
                className={styles.checkbox}
                id={`review-anonymous-${target.memberId}`}
                inputRef={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                onCheckedChange={(checked) => field.onChange(checked)}
              >
                <Checkbox.Indicator className={styles.checkboxIndicator}>
                  <Check size={12} strokeWidth={3} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className={styles.anonymousLabel}>익명으로 남기기</span>
              <span className={styles.anonymousHint}>끄면 상대에게 닉네임이 공개돼요</span>
            </label>
          )}
        />
      )}
      {errors.root !== undefined && <p className={styles.rootError}>{errors.root.message}</p>}
      <div className={styles.footer}>
        {isEdit ? (
          <AlertDialog.Root onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
            <AlertDialog.Trigger
              render={
                <Button
                  className={styles.deleteButton}
                  disabled={isBusy}
                  size="md"
                  variant="ghost"
                />
              }
            >
              후기 삭제하기
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Backdrop className={styles.dialogBackdrop} />
              <AlertDialog.Popup className={styles.dialogPopup}>
                <AlertDialog.Title className={styles.dialogTitle}>
                  후기를 삭제할까요?
                </AlertDialog.Title>
                <AlertDialog.Description className={styles.dialogDescription}>
                  {target.nickname} 님에게 남긴 후기가 삭제돼요. 반영 전이니 다시 작성할 수 있어요.
                </AlertDialog.Description>
                <div className={styles.dialogActions}>
                  <AlertDialog.Close render={<Button size="md" variant="ghost" />}>
                    취소
                  </AlertDialog.Close>
                  <Button
                    className={styles.deleteConfirmButton}
                    disabled={isBusy}
                    onClick={confirmDelete}
                    size="md"
                    type="button"
                    variant="primary"
                  >
                    삭제하기
                  </Button>
                </div>
              </AlertDialog.Popup>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        ) : (
          <Button disabled={isBusy} onClick={skipTarget} size="md" type="button" variant="ghost">
            건너뛰기
          </Button>
        )}
        <Button disabled={isBusy || !hasInput} size="md" type="submit" variant="primary">
          {isEdit ? "후기 수정하기" : "후기 제출하기"}
        </Button>
      </div>
    </Form>
  );
}
