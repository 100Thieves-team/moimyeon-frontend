"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Checkbox } from "@base-ui/react/checkbox";
import { Form } from "@base-ui/react/form";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  deleteReviewMutation,
  getReviewOverviewOptions,
  getReviewOverviewQueryKey,
  updateReviewMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { ReviewFormFields, type ReviewFormValues } from "./review-form-fields";
import * as styles from "./review-form.css";
import { getReviewErrorMessage, REVIEW_TAG_LABELS, type ReviewTarget } from "./review-model";

type EditReviewFormProps = {
  onCompleted: () => void;
  roomId: string;
  target: ReviewTarget;
};

export function EditReviewForm({ onCompleted, roomId, target }: EditReviewFormProps) {
  const { data: overviewResponse } = useSuspenseQuery(
    getReviewOverviewOptions({ path: { roomId } }),
  );
  const review = overviewResponse.data?.reviews.find(
    ({ targetMemberId }) => targetMemberId === target.memberId,
  );
  const reviewTags = review?.tags.every(
    (tag): tag is string =>
      typeof tag === "string" && REVIEW_TAG_LABELS.some((label) => label === tag),
  )
    ? review.tags
    : undefined;
  const queryClient = useQueryClient();
  const toastManager = Toast.useToastManager();
  const updateReview = useMutation(updateReviewMutation());
  const deleteReview = useMutation(deleteReviewMutation());
  const methods = useForm<ReviewFormValues>({
    defaultValues:
      review !== undefined && reviewTags !== undefined
        ? { content: review.content, tags: reviewTags }
        : { content: "", tags: [] },
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [watchedTags, watchedContent] = useWatch({
    control: methods.control,
    name: ["tags", "content"],
  });
  const isBusy = methods.formState.isSubmitting || deleteReview.isPending;
  const hasInput = watchedTags.length > 0 || watchedContent.trim() !== "";

  if (review === undefined || reviewTags === undefined) {
    throw new Error("Failed to load submitted review");
  }

  const { reviewId } = review;

  const submitForm = methods.handleSubmit(async ({ content, tags }) => {
    try {
      await updateReview.mutateAsync({
        body: { content: content.trim() === "" ? null : content.trim(), tags },
        path: { reviewId: String(reviewId) },
      });
    } catch (error) {
      methods.setError("root.serverError", {
        message: getReviewErrorMessage(error),
        type: "server",
      });

      return;
    }

    await queryClient.invalidateQueries({
      queryKey: getReviewOverviewQueryKey({ path: { roomId } }),
    });
    toastManager.add({ title: `${target.nickname} 님에게 남긴 후기를 수정했어요` });
    onCompleted();
  });

  const deleteSubmittedReview = async () => {
    methods.clearErrors("root.serverError");

    try {
      await deleteReview.mutateAsync({ path: { reviewId: String(reviewId) } });
    } catch (error) {
      methods.setError("root.serverError", {
        message: getReviewErrorMessage(error),
        type: "server",
      });

      return;
    }

    await queryClient.invalidateQueries({
      queryKey: getReviewOverviewQueryKey({ path: { roomId } }),
    });
    toastManager.add({ title: "후기를 삭제했어요. 다시 작성할 수 있어요" });
    onCompleted();
  };

  const confirmDelete = async () => {
    await deleteSubmittedReview();
    setDeleteDialogOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <Form className={styles.form} onSubmit={submitForm}>
        <ReviewFormFields />
        <label
          className={styles.anonymousRowLocked}
          htmlFor={`review-anonymous-${target.memberId}`}
        >
          <Checkbox.Root
            checked={review.anonymous}
            className={styles.checkbox}
            disabled
            id={`review-anonymous-${target.memberId}`}
            name="anonymous"
          >
            <Checkbox.Indicator className={styles.checkboxIndicator}>
              <Check size={12} strokeWidth={3} />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <span className={styles.anonymousLabel}>익명으로 남기기</span>
        </label>
        <div className={styles.footer}>
          <AlertDialog.Root onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
            <AlertDialog.Trigger
              render={
                <Button
                  className={styles.deleteButton}
                  disabled={isBusy}
                  size="sm"
                  variant="secondary"
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
          <Button disabled={isBusy || !hasInput} size="sm" type="submit" variant="primary">
            후기 수정하기
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
}
