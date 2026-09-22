"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useId, type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Controller, useForm } from "react-hook-form";
import { rejectReasonsOptions } from "@/api/generated/@tanstack/react-query.gen";
import { DialogCloseButton } from "@/components/dialog-close-button";
import { Button } from "@/components/button";
import { getApplicationActionError } from "./interview-room-model";
import { RejectReasonsSkeleton } from "./interview-room-skeleton";
import * as styles from "./interview-room.css";

type RejectApplicationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (
    reason: string | null,
    callbacks: { onSuccess: () => void; onError: (error: unknown) => void },
  ) => void;
  pending: boolean;
  actionable: boolean;
};

export function RejectApplicationDialog({
  open,
  onOpenChange,
  onReject,
  pending,
  actionable,
}: RejectApplicationDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!pending) onOpenChange(nextOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.dialog}>
          <header className={styles.dialogHeader}>
            <Dialog.Title className={styles.dialogTitle}>신청을 반려할게요</Dialog.Title>
            <Dialog.Close
              aria-label="반려 사유 닫기"
              disabled={pending}
              render={<DialogCloseButton />}
            />
          </header>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary FallbackComponent={RejectReasonsError} onReset={reset}>
                <Suspense
                  fallback={
                    <RejectReasonsState>
                      <RejectReasonsSkeleton />
                    </RejectReasonsState>
                  }
                >
                  <RejectApplicationForm
                    onOpenChange={onOpenChange}
                    onReject={onReject}
                    pending={pending}
                    actionable={actionable}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function RejectApplicationForm({
  onOpenChange,
  onReject,
  pending,
  actionable,
}: Omit<RejectApplicationDialogProps, "open">) {
  const reasonLabelId = useId();
  const { data } = useSuspenseQuery(rejectReasonsOptions());
  const reasons = data.data?.reasons;
  const methods = useForm<{ reason: string }>({ defaultValues: { reason: "" } });
  if (!reasons) throw new Error("Failed to load reject reasons");
  const submit = methods.handleSubmit(({ reason }) => {
    if (!actionable || pending) return;
    methods.clearErrors("root.serverError");
    onReject(reason === "" ? null : reason, {
      onSuccess: () => onOpenChange(false),
      onError: (error) => {
        methods.setError("root.serverError", {
          type: "server",
          message: getApplicationActionError(error).message,
        });
      },
    });
  });

  return (
    <Form method="post" onSubmit={submit}>
      <div className={styles.dialogBody}>
        <Controller
          control={methods.control}
          name="reason"
          rules={{
            validate: (value) =>
              value === "" ||
              reasons.some((reason) => reason.code === value) ||
              "반려 사유를 다시 선택해 주세요.",
          }}
          render={({ field, fieldState }) => (
            <Field.Root
              name={field.name}
              dirty={fieldState.isDirty}
              touched={fieldState.isTouched}
              invalid={fieldState.invalid}
            >
              <Field.Label className={styles.visuallyHidden}>반려 사유</Field.Label>
              <RadioGroup
                className={styles.reasons}
                disabled={pending || !actionable}
                name={field.name}
                onBlur={field.onBlur}
                onValueChange={(value) => {
                  field.onChange(value);
                  methods.clearErrors("root.serverError");
                }}
                value={field.value}
              >
                {[...reasons, { code: "", label: "사유 없이 반려할게요" }].map((reason) => (
                  <Radio.Root
                    aria-labelledby={`${reasonLabelId}-${reason.code}`}
                    className={styles.reason}
                    key={reason.code}
                    value={reason.code}
                    ref={field.value === reason.code ? field.ref : undefined}
                  >
                    <span aria-hidden="true" className={styles.radioCircle}>
                      <Radio.Indicator className={styles.radioDot} />
                    </span>
                    <span id={`${reasonLabelId}-${reason.code}`}>{reason.label}</span>
                  </Radio.Root>
                ))}
              </RadioGroup>
              <Field.Error match={Boolean(fieldState.error)} className={styles.error}>
                {fieldState.error?.message}
              </Field.Error>
            </Field.Root>
          )}
        />
        {methods.formState.errors.root?.serverError?.message && (
          <p className={styles.error} role="alert">
            {methods.formState.errors.root.serverError.message}
          </p>
        )}
        {!actionable && (
          <p className={styles.description}>이미 처리된 신청이에요. 최신 목록을 확인해 주세요.</p>
        )}
      </div>
      <RejectDialogFooter pending={pending} disabled={pending || !actionable} />
    </Form>
  );
}

function RejectDialogFooter({
  pending = false,
  disabled,
}: {
  pending?: boolean;
  disabled: boolean;
}) {
  return (
    <footer className={styles.dialogFooter}>
      <Dialog.Close render={<Button disabled={pending} type="button" variant="secondary" />}>
        취소
      </Dialog.Close>
      <Button disabled={disabled} type="submit">
        {pending ? "반려 중..." : "반려하기"}
      </Button>
    </footer>
  );
}

function RejectReasonsState({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={styles.dialogBody}>{children}</div>
      <RejectDialogFooter disabled />
    </>
  );
}

function RejectReasonsError({ resetErrorBoundary }: FallbackProps) {
  return (
    <RejectReasonsState>
      <div className={styles.feedback}>
        <p role="alert">반려 사유를 불러오지 못했어요.</p>
        <Button onClick={resetErrorBoundary} type="button" variant="secondary" size="sm">
          사유 다시 불러오기
        </Button>
      </div>
    </RejectReasonsState>
  );
}
