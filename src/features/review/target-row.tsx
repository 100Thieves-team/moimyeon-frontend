"use client";

import { Popover } from "@base-ui/react/popover";
import { Collapsible } from "@base-ui/react/collapsible";
import { Check, ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { TrustCardPopover, type TrustCardPayload } from "@/features/trust-card/trust-card-popover";
import * as trustCardStyles from "@/features/trust-card/trust-card.css";
import { CreateReviewForm } from "./create-review-form";
import { EditReviewForm } from "./edit-review-form";
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
  const [profileHandle] = useState(() => Popover.createHandle<TrustCardPayload>());
  return (
    <>
      <Popover.Trigger
        handle={profileHandle}
        payload={{ memberId: target.memberId, isHost }}
        aria-label={`${target.nickname} 공개 신뢰 카드 열기`}
        className={trustCardStyles.trigger}
        openOnHover
        delay={300}
        closeDelay={150}
      >
        <span aria-hidden="true" className={styles.avatar}>
          {target.nickname.charAt(0)}
        </span>
        <span className={styles.nameColumn}>
          <span className={styles.nameRow}>
            <span className={styles.nickname}>{target.nickname}</span>
            {isHost && <span className={styles.hostBadge}>방장</span>}
          </span>
        </span>
      </Popover.Trigger>
      <TrustCardPopover handle={profileHandle} />
    </>
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
  return (
    <TargetRowFrame {...props} submitted>
      <EditReviewForm onCompleted={props.onCompleted} roomId={props.roomId} target={props.target} />
    </TargetRowFrame>
  );
}
