"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useCallback, Suspense, type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "@/components/button";
import * as styles from "./interview-room.css";

export function RoomPanelBoundary({
  label,
  children,
  fallback,
}: {
  label: string;
  children: ReactNode;
  fallback: ReactNode;
}) {
  const renderFallback = useCallback(
    ({ resetErrorBoundary }: FallbackProps) => (
      <RoomPanelError label={label} resetErrorBoundary={resetErrorBoundary} />
    ),
    [label],
  );
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={renderFallback}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function RoomPanelError({
  label,
  resetErrorBoundary,
}: Pick<FallbackProps, "resetErrorBoundary"> & { label: string }) {
  return (
    <section className={styles.empty}>
      <h2 className={styles.dialogTitle}>{label}을 불러오지 못했어요</h2>
      <Button onClick={resetErrorBoundary} variant="secondary">
        다시 불러오기
      </Button>
    </section>
  );
}
