"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Form } from "@base-ui/react/form";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { FallbackProps } from "react-error-boundary";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  deleteReviewMutation,
  getReviewOptions,
  getReviewQueryKey,
  getReviewTargetsQueryKey,
  updateReviewMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { ReviewFormFields, type ReviewFormValues } from "./review-form-fields";
import * as styles from "./review-form.css";
import { getReviewErrorMessage, REVIEW_TAG_LABELS, type ReviewTarget } from "./review-model";

type EditReviewFormProps = {
  onCompleted: () => void;
  reviewId: number;
  roomId: string;
  target: ReviewTarget;
};

type EditReviewFormContentProps = EditReviewFormProps & {
  initialValues: ReviewFormValues;
};

function EditReviewFormContent({
  initialValues,
  onCompleted,
  reviewId,
  roomId,
  target,
}: EditReviewFormContentProps) {
  const queryClient = useQueryClient();
  const toastManager = Toast.useToastManager();
  const updateReview = useMutation(updateReviewMutation());
  const deleteReview = useMutation(deleteReviewMutation());
  const methods = useForm<ReviewFormValues>({ defaultValues: initialValues });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [watchedTags, watchedContent] = useWatch({
    control: methods.control,
    name: ["tags", "content"],
  });
  const isBusy = methods.formState.isSubmitting || deleteReview.isPending;
  const hasInput = watchedTags.length > 0 || watchedContent.trim() !== "";

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

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getReviewTargetsQueryKey({ path: { roomId } }),
      }),
      queryClient.invalidateQueries({
        queryKey: getReviewQueryKey({ path: { reviewId: String(reviewId) } }),
      }),
    ]);
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
      queryKey: getReviewTargetsQueryKey({ path: { roomId } }),
    });
    queryClient.removeQueries({
      exact: true,
      queryKey: getReviewQueryKey({ path: { reviewId: String(reviewId) } }),
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

export function EditReviewForm(props: EditReviewFormProps) {
  const { data: reviewResponse } = useSuspenseQuery(
    getReviewOptions({ path: { reviewId: String(props.reviewId) } }),
  );
  const review = reviewResponse.data;

  if (
    review === undefined ||
    review === null ||
    !review.tags.every(
      (tag): tag is string =>
        typeof tag === "string" && REVIEW_TAG_LABELS.some((label) => label === tag),
    )
  ) {
    throw new Error("Failed to load submitted review");
  }

  return (
    <EditReviewFormContent
      {...props}
      initialValues={{
        content: review.content ?? "",
        tags: review.tags,
      }}
    />
  );
}

export function EditReviewFormError({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className={styles.queryState}>
      <p role="alert">기존 후기를 불러오지 못했어요.</p>
      <Button onClick={resetErrorBoundary} size="sm" type="button" variant="secondary">
        다시 불러오기
      </Button>
    </div>
  );
}
