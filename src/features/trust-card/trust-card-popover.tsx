"use client";

import { Popover } from "@base-ui/react/popover";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "@/components/button";
import { TrustCard } from "./trust-card";
import { TrustCardSkeleton } from "./trust-card-skeleton";
import * as styles from "./trust-card.css";

export type TrustCardPayload = {
  memberId: string;
  isHost?: boolean;
};

type TrustCardPopoverProps = {
  handle: Popover.Handle<TrustCardPayload>;
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

export function TrustCardPopover({ handle }: TrustCardPopoverProps) {
  return (
    <Popover.Root handle={handle}>
      {({ payload }) => (
        <Popover.Portal>
          <Popover.Positioner align="start" side="bottom" sideOffset={12} collisionPadding={16}>
            <Popover.Arrow className={styles.arrow} render={<span />} />
            <Popover.Popup className={styles.popup}>
              {payload && (
                <QueryErrorResetBoundary key={payload.memberId}>
                  {({ reset }) => (
                    <ErrorBoundary FallbackComponent={TrustCardError} onReset={reset}>
                      <Suspense fallback={<TrustCardSkeleton />}>
                        <TrustCard memberId={payload.memberId} isHost={payload.isHost} />
                      </Suspense>
                    </ErrorBoundary>
                  )}
                </QueryErrorResetBoundary>
              )}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}
