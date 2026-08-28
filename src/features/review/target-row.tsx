"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { Check, ChevronDown } from "lucide-react";
import { TrustCardPopover } from "@/features/trust-card/trust-card-popover";
import { isSubmittedTarget, type ReviewTarget } from "./review-model";
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

export function TargetRow({
  expanded,
  isHost,
  onCompleted,
  onExpandedChange,
  roomId,
  target,
}: TargetRowProps) {
  const submitted = isSubmittedTarget(target);
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
        <div className={styles.panelContent}>
          <ReviewForm
            onCompleted={onCompleted}
            reviewId={target.reviewId}
            roomId={roomId}
            target={target}
          />
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
