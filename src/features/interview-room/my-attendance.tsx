"use client";

import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarCheck, CalendarX } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getMyAttendanceOptions } from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { iconSizes } from "@/styles/tokens";
import * as styles from "./interview-room.css";

export function MyAttendance({ roomId }: { roomId: string }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          // oxlint-disable-next-line react/no-unstable-nested-components -- fallbackRender는 컴포넌트 타입이 아닌 렌더 콜백이다.
          fallbackRender={({ resetErrorBoundary }) => (
            <div className={styles.attendanceError}>
              <span role="alert" className={styles.attendanceFeedback}>
                출석 정보를 불러오지 못했어요
              </span>
              <Button variant="secondary" onClick={resetErrorBoundary}>
                출석 다시 불러오기
              </Button>
            </div>
          )}
        >
          <Suspense
            fallback={<span className={styles.attendanceFeedback}>출석 정보 불러오는 중</span>}
          >
            <AttendanceStatus roomId={roomId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function AttendanceStatus({ roomId }: { roomId: string }) {
  const { data } = useSuspenseQuery(getMyAttendanceOptions({ query: { roomId } }));
  const attendance = data.data;
  if (!attendance) throw new Error("Failed to load attendance");

  const attended = attendance.status === "ATTENDED";
  const label = attended ? "출석" : "불참";
  const Icon = attended ? CalendarCheck : CalendarX;

  return (
    <output
      aria-label={`내 출석: ${label}`}
      className={`${styles.attendanceStatus}${attended ? ` ${styles.attendanceAttended}` : ""}`}
    >
      <Icon aria-hidden="true" size={iconSizes.sm} strokeWidth={2} />
      <span aria-hidden="true" className={styles.attendanceLabel}>
        {label}
      </span>
    </output>
  );
}
