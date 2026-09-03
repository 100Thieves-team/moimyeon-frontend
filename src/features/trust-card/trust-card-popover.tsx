"use client";

import { Popover } from "@base-ui/react/popover";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { publicProfileQueryKey } from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { QueryBoundary } from "@/components/query-boundary";
import { TrustCard } from "./trust-card";
import * as styles from "./trust-card.css";

type TrustCardPopoverProps = {
  memberId: string;
  trigger: ReactNode;
  triggerLabel: string;
};

function TrustCardError({ memberId, retry }: { memberId: string; retry: () => void }) {
  const queryClient = useQueryClient();
  const retryProfile = () => {
    queryClient.removeQueries({
      exact: true,
      queryKey: publicProfileQueryKey({ path: { memberId } }),
    });
    retry();
  };

  return (
    <div className={styles.queryState}>
      <p role="alert">공개 신뢰 카드를 불러오지 못했어요.</p>
      <Button onClick={retryProfile} size="sm" type="button" variant="secondary">
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
            <QueryBoundary
              errorFallback={TrustCardError}
              errorFallbackProps={{ memberId }}
              pendingFallback={<p className={styles.loading}>불러오는 중…</p>}
            >
              <TrustCard memberId={memberId} />
            </QueryBoundary>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
