"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { Check, ChevronDown } from "lucide-react";
import { isSubmittedTarget, type ReviewTarget } from "./review-model";
import { ReviewForm } from "./review-form";
import * as styles from "./target-row.css";

type TargetRowProps = {
  expanded: boolean;
  isHost: boolean;
  onExpandedChange: (expanded: boolean) => void;
  roomId: string;
  target: ReviewTarget;
};

function TargetRowHead({ isHost, target }: Pick<TargetRowProps, "isHost" | "target">) {
  return (
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
  );
}

export function TargetRow({ expanded, isHost, onExpandedChange, roomId, target }: TargetRowProps) {
  if (isSubmittedTarget(target)) {
    return (
      <div className={styles.row}>
        <div className={styles.rowHead}>
          <TargetRowHead isHost={isHost} target={target} />
          <span className={styles.submitted}>
            <span aria-hidden="true" className={styles.submittedCheck}>
              <Check size={12} strokeWidth={3} />
            </span>
            제출함
          </span>
        </div>
      </div>
    );
  }

  return (
    <Collapsible.Root className={styles.row} onOpenChange={onExpandedChange} open={expanded}>
      <Collapsible.Trigger className={styles.rowTrigger}>
        <TargetRowHead isHost={isHost} target={target} />
        <ChevronDown
          aria-hidden="true"
          className={expanded ? styles.chevronOpen : styles.chevron}
          size={16}
          strokeWidth={2}
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className={styles.panel}>
        <div className={styles.panelContent}>
          <ReviewForm onCompleted={() => onExpandedChange(false)} roomId={roomId} target={target} />
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
