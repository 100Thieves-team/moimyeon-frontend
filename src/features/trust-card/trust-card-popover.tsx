"use client";

import { Popover } from "@base-ui/react/popover";
import { Suspense, type ReactNode } from "react";
import { TrustCard } from "./trust-card";
import * as styles from "./trust-card.css";

type TrustCardPopoverProps = {
  memberId: string;
  trigger: ReactNode;
  triggerLabel: string;
};

export function TrustCardPopover({ memberId, trigger, triggerLabel }: TrustCardPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={`${triggerLabel} 공개 신뢰 카드 열기`}
        className={styles.trigger}
      >
        {trigger}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="start" side="bottom" sideOffset={8}>
          <Popover.Popup className={styles.popup}>
            <Suspense fallback={<p className={styles.loading}>불러오는 중…</p>}>
              <TrustCard memberId={memberId} />
            </Suspense>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
