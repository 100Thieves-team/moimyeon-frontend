"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { getReviewOptions, getReviewQueryKey } from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { QueryBoundary } from "@/components/query-boundary";
import { TrustCardPopover } from "@/features/trust-card/trust-card-popover";
import { getReviewFormInitialValues, isSubmittedTarget, type ReviewTarget } from "./review-model";
import { ReviewForm } from "./review-form";
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
      <Collapsible.Panel className={styles.panel}>
        <div className={styles.panelContent}>{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export function TargetRow(props: TargetRowProps) {
  return (
    <TargetRowFrame {...props} submitted={false}>
      <ReviewForm
        mode="create"
        onCompleted={props.onCompleted}
        roomId={props.roomId}
        target={props.target}
      />
    </TargetRowFrame>
  );
}

type SubmittedTargetRowContentProps = TargetRowProps & {
  reviewId: number;
};

function SubmittedTargetRowContent({ reviewId, ...props }: SubmittedTargetRowContentProps) {
  const { data: reviewResponse } = useSuspenseQuery(
    getReviewOptions({ path: { reviewId: String(reviewId) } }),
  );
  const initialValues = getReviewFormInitialValues(reviewResponse, {
    reviewId,
    roomId: props.roomId,
    targetMemberId: props.target.memberId,
  });

  return (
    <TargetRowFrame {...props} submitted>
      <ReviewForm
        initialValues={initialValues}
        mode="edit"
        onCompleted={props.onCompleted}
        reviewId={reviewId}
        roomId={props.roomId}
        target={props.target}
      />
    </TargetRowFrame>
  );
}

function SubmittedTargetState({ children, ...props }: TargetRowProps & { children: ReactNode }) {
  return (
    <TargetRowFrame {...props} submitted>
      <div className={styles.queryState}>{children}</div>
    </TargetRowFrame>
  );
}

function SubmittedTargetError({ retry, ...props }: TargetRowProps & { retry: () => void }) {
  const queryClient = useQueryClient();
  const retryReview = () => {
    const reviewId = props.target.reviewId;

    if (reviewId !== undefined && reviewId !== null) {
      queryClient.removeQueries({
        exact: true,
        queryKey: getReviewQueryKey({ path: { reviewId: String(reviewId) } }),
      });
    }

    retry();
  };

  return (
    <SubmittedTargetState {...props}>
      <p role="alert">기존 후기를 불러오지 못했어요.</p>
      <Button onClick={retryReview} size="sm" type="button" variant="secondary">
        다시 불러오기
      </Button>
    </SubmittedTargetState>
  );
}

export function SubmittedTargetRow(props: TargetRowProps) {
  if (!isSubmittedTarget(props.target) || props.target.reviewId == null) {
    return (
      <SubmittedTargetState {...props}>
        <p role="alert">기존 후기를 불러오지 못했어요.</p>
      </SubmittedTargetState>
    );
  }

  const reviewId = props.target.reviewId;

  return (
    <QueryBoundary
      errorFallback={SubmittedTargetError}
      errorFallbackProps={props}
      pendingFallback={
        <SubmittedTargetState {...props}>기존 후기를 불러오는 중이에요.</SubmittedTargetState>
      }
    >
      <SubmittedTargetRowContent {...props} reviewId={reviewId} />
    </QueryBoundary>
  );
}
