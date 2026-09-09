"use client";

import { Checkbox } from "@base-ui/react/checkbox";
import { Form } from "@base-ui/react/form";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import {
  getReviewOverviewQueryKey,
  submitReviewMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { ReviewFormFields, type ReviewFormValues } from "./review-form-fields";
import * as styles from "./review-form.css";
import { getReviewErrorMessage, type ReviewTarget } from "./review-model";

type CreateReviewFormProps = {
  onCompleted: () => void;
  roomId: string;
  target: ReviewTarget;
};

type CreateReviewFormValues = ReviewFormValues & {
  anonymous: boolean;
};

export function CreateReviewForm({ onCompleted, roomId, target }: CreateReviewFormProps) {
  const queryClient = useQueryClient();
  const toastManager = Toast.useToastManager();
  const submitReview = useMutation(submitReviewMutation());
  const methods = useForm<CreateReviewFormValues>({
    defaultValues: {
      anonymous: true,
      content: "",
      tags: [],
    },
  });
  const [watchedTags, watchedContent] = useWatch({
    control: methods.control,
    name: ["tags", "content"],
  });
  const hasInput = watchedTags.length > 0 || watchedContent.trim() !== "";

  const submitForm = methods.handleSubmit(async ({ anonymous, content, tags }) => {
    try {
      await submitReview.mutateAsync({
        body: {
          /* dev API가 anonymous 누락 시 E400을 반환하므로 항상 명시한다(계약상 optional·기본 true지만 필수로 동작) */
          anonymous,
          content: content.trim() === "" ? null : content.trim(),
          tags,
          targetMemberId: target.memberId,
        },
        path: { roomId },
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
    toastManager.add({ title: `${target.nickname} 님에게 후기를 남겼어요` });
    onCompleted();
  });

  return (
    <FormProvider {...methods}>
      <Form className={styles.form} onSubmit={submitForm}>
        <ReviewFormFields />
        <Controller
          control={methods.control}
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
                onCheckedChange={(checked) => {
                  methods.clearErrors("root.serverError");
                  field.onChange(checked);
                }}
              >
                <Checkbox.Indicator className={styles.checkboxIndicator}>
                  <Check size={12} strokeWidth={3} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className={styles.anonymousLabel}>익명으로 남기기</span>
            </label>
          )}
        />
        <div className={styles.footer}>
          <Button
            disabled={methods.formState.isSubmitting || !hasInput}
            size="md"
            type="submit"
            variant="primary"
          >
            후기 제출하기
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
}
