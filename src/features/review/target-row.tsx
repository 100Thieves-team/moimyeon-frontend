"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Check, ChevronDown } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TrustCardPopover } from "@/features/trust-card/trust-card-popover";
import { CreateReviewForm } from "./create-review-form";
import { EditReviewForm, EditReviewFormError } from "./edit-review-form";
import * as reviewFormStyles from "./review-form.css";
import type { ReviewTarget } from "./review-model";
import * as styles from "./target-row.css";

type TargetRowProps = {
  expanded: boolean;
  isHost: boolean;
  onCompleted: () => void;
  onExpandedChange: (expanded: boolean) => void;
  roomId: string;
  target: ReviewTarget;
};

type TargetRowFrameProps = Omit<TargetRowProps, "onCompleted" | "roomId"> & {
  children: ReactNode;
  submitted: boolean;
};

function TargetIdentity({ isHost, target }: Pick<TargetRowProps, "isHost" | "target">) {
  return (
    <TrustCardPopover
      memberId={target.memberId}
      trigger={
        <>
          <span aria-hidden="true" className={styles.avatar}>
            {target.nickname.charAt(0)}
          </span>
          <span className={styles.nameColumn}>
            <span className={styles.nameRow}>
              <span className={styles.nickname}>{target.nickname}</span>
              {isHost && <span className={styles.hostBadge}>방장</span>}
            </span>
          </span>
        </>
      }
      triggerLabel={target.nickname}
    />
  );
}

function TargetRowFrame({
  children,
  expanded,
  isHost,
  onExpandedChange,
  submitted,
  target,
}: TargetRowFrameProps) {
  const actionLabel = submitted ? "후기 수정" : "후기 작성";

  return (
    <Collapsible.Root className={styles.row} onOpenChange={onExpandedChange} open={expanded}>
      <div className={styles.rowHead}>
        <TargetIdentity isHost={isHost} target={target} />
        <Collapsible.Trigger
          aria-label={`${target.nickname} ${actionLabel} ${expanded ? "접기" : "펼치기"}`}
          className={styles.expandTrigger}
        >
          {submitted && (
            <span className={styles.submitted}>
              <span aria-hidden="true" className={styles.submittedCheck}>
                <Check size={12} strokeWidth={3} />
              </span>
              제출함
            </span>
          )}
          <ChevronDown
            aria-hidden="true"
            className={expanded ? styles.chevronOpen : styles.chevron}
            size={16}
            strokeWidth={2}
          />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Panel className={styles.panel} keepMounted={submitted}>
        <div className={styles.panelContent}>{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export function TargetRow(props: TargetRowProps) {
  return (
    <TargetRowFrame {...props} submitted={false}>
      <CreateReviewForm
        onCompleted={props.onCompleted}
        roomId={props.roomId}
        target={props.target}
      />
    </TargetRowFrame>
  );
}

export function SubmittedTargetRow(props: TargetRowProps) {
  if (props.target.reviewId == null) {
    return (
      <TargetRowFrame {...props} submitted>
        <div className={styles.queryState}>
          <p role="alert">기존 후기를 불러오지 못했어요.</p>
        </div>
      </TargetRowFrame>
    );
  }

  const reviewId = props.target.reviewId;

  return (
    <TargetRowFrame {...props} submitted>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={EditReviewFormError} onReset={reset}>
            <Suspense
              fallback={
                <p className={reviewFormStyles.queryState}>기존 후기를 불러오는 중이에요.</p>
              }
            >
              <EditReviewForm
                onCompleted={props.onCompleted}
                reviewId={reviewId}
                roomId={props.roomId}
                target={props.target}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </TargetRowFrame>
  );
}
