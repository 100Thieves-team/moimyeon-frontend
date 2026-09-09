"use client";

import { Popover } from "@base-ui/react/popover";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "@/components/button";
import { TrustCard } from "./trust-card";
import * as styles from "./trust-card.css";

type TrustCardPopoverProps = {
  memberId: string;
  trigger: ReactNode;
  triggerLabel: string;
};

function TrustCardError({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className={styles.queryState}>
      <p role="alert">공개 신뢰 카드를 불러오지 못했어요.</p>
      <Button onClick={resetErrorBoundary} size="sm" type="button" variant="secondary">
        다시 불러오기
      </Button>
    </div>
  );
}

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
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary FallbackComponent={TrustCardError} onReset={reset}>
                  <Suspense fallback={<p className={styles.loading}>불러오는 중…</p>}>
                    <TrustCard memberId={memberId} />
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
