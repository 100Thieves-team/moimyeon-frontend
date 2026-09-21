"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useSuspenseQueries } from "@tanstack/react-query";
import Link from "next/link";
import {
  roomApplicationsOptions,
  roomDetailOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { ApplicationRow } from "./application-row";
import * as styles from "./interview-room.css";

export function InterviewRoomContent({ roomId }: { roomId: string }) {
  const [roomQuery, applicationsQuery] = useSuspenseQueries({
    queries: [
      roomDetailOptions({ path: { roomId } }),
      roomApplicationsOptions({ path: { roomId } }),
    ],
  });
  const room = roomQuery.data.data;
  const data = applicationsQuery.data.data;
  if (!room || !data) throw new Error("Failed to load room applications");
  if (room.viewer?.isHost !== true)
    return (
      <main className={styles.page}>
        <p className={styles.empty}>
          방장만 참가 신청을 확인할 수 있어요.{" "}
          <Link href={`/interviews/${roomId}`}>면접 정보로 돌아가기</Link>
        </p>
      </main>
    );

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.heading}>
          <div className={styles.roomMeta}>
            {room.recruit && (
              <>
                <span className={styles.recruitStatus}>{room.recruit.recruitStatusLabel}</span>
                <span>
                  {room.recruit.current} / {room.recruit.max}명 · 신청{" "}
                  {room.recruit.pendingApplicationCount}건 대기
                </span>
              </>
            )}
          </div>
          <h1 className={styles.title}>{room.title}</h1>
        </header>
        <Tabs.Root defaultValue="applications">
          <div className={styles.navigation}>
            <Tabs.List aria-label="면접 관리" className={styles.tabs}>
              <Tabs.Tab className={styles.tab} value="applications">
                참가 신청 {room.recruit?.pendingApplicationCount}
              </Tabs.Tab>
              <Tabs.Tab className={styles.tab} disabled value="participants">
                참여자 {room.recruit?.current}
              </Tabs.Tab>
              <Tabs.Tab className={styles.tab} disabled value="comments">
                댓글
              </Tabs.Tab>
            </Tabs.List>
            <Link className={styles.infoLink} href={`/interviews/${roomId}`}>
              면접 정보
            </Link>
          </div>
          <Tabs.Panel value="applications" className={styles.panel}>
            {data.applications.length === 0 ? (
              <p className={styles.empty}>아직 참가 신청이 없어요.</p>
            ) : (
              <ul aria-label="참가 신청 목록" className={styles.list}>
                {data.applications.map((application) => (
                  <ApplicationRow
                    application={application}
                    key={application.applicationId}
                    roomId={roomId}
                    refreshFailed={roomQuery.isRefetchError || applicationsQuery.isRefetchError}
                    refreshing={roomQuery.isFetching || applicationsQuery.isFetching}
                  />
                ))}
              </ul>
            )}
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </main>
  );
}
