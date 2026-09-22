"use client";

import { Toast } from "@base-ui/react/toast";
import { useRouter } from "next/navigation";
import { Tabs } from "@base-ui/react/tabs";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Activity, type ReactNode } from "react";
import Link from "next/link";
import {
  roomApplicationsOptions,
  roomApplicationsQueryKey,
  roomParticipantsQueryKey,
  roomDetailOptions,
  roomLeaveMutation,
  roomDetailQueryKey,
  getInterviewOverviewQueryKey,
  roomsQueryKey,
  participationSlotsQueryKey,
  myRoomApplicationQueryKey,
  memberMeQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { getInterviewRelationLabel } from "@/features/interview-detail/interview-detail-model";
import { ApplicationRow } from "./application-row";
import { ParticipantsPanel } from "./participants-panel";
import { RoomPanelBoundary } from "./room-query-state";
import { ApplicationsSkeleton, ParticipantsSkeleton } from "./interview-room-skeleton";
import * as styles from "./interview-room.css";

type RoomTab = "applications" | "participants";

export function InterviewRoomContent({
  roomId,
  currentMemberId,
}: {
  roomId: string;
  currentMemberId: string;
}) {
  const roomQuery = useSuspenseQuery(roomDetailOptions({ path: { roomId } }));
  const client = useQueryClient();
  const { replace, refresh } = useRouter();
  const toast = Toast.useToastManager();
  const leaveMutation = useMutation({ ...roomLeaveMutation(), retry: false });

  async function leave() {
    const response = await leaveMutation.mutateAsync({ path: { roomId } });
    if (response.result === "SUCCESS") {
      void Promise.allSettled(
        [
          roomDetailQueryKey({ path: { roomId } }),
          roomApplicationsQueryKey({ path: { roomId } }),
          roomParticipantsQueryKey({ path: { roomId } }),
          getInterviewOverviewQueryKey(),
          roomsQueryKey(),
          participationSlotsQueryKey(),
          myRoomApplicationQueryKey({ path: { roomId } }),
          memberMeQueryKey(),
        ].map((queryKey) => client.invalidateQueries({ queryKey, refetchType: "none" })),
      );
      toast.add({ title: "참여를 취소했어요." });
      replace("/interviews/me");
      refresh();
    }
    return response;
  }
  const room = roomQuery.data.data;
  const isHost = room?.viewer?.isHost === true;
  if (!room) throw new Error("Failed to load interview room");
  if (leaveMutation.isSuccess && leaveMutation.data.result === "SUCCESS")
    return <p className={styles.empty}>참여를 취소했어요. 내 면접으로 이동하고 있어요.</p>;
  const relation = getInterviewRelationLabel(room);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.heading}>
          <div className={styles.roomMeta}>
            {room.recruit && (
              <span className={styles.recruitStatus}>{room.recruit.recruitStatusLabel}</span>
            )}
            {relation && <span className={styles.joinedBadge}>{relation}</span>}
            {room.recruit && (
              <span>
                {room.recruit.current} / {room.recruit.max}명
                {isHost && ` · 신청 ${room.recruit.pendingApplicationCount}건 대기`}
              </span>
            )}
          </div>
          <h1 className={styles.title}>{room.title}</h1>
        </header>
        <Tabs.Root
          key={isHost ? "host" : "participant"}
          defaultValue={isHost ? "applications" : "participants"}
        >
          <div className={styles.navigation}>
            {!isHost && (
              <Link className={styles.infoLink} href={`/interviews/${roomId}`}>
                면접 정보
              </Link>
            )}
            <Tabs.List aria-label="면접 관리" className={styles.tabs}>
              {isHost && (
                <Tabs.Tab className={styles.tab} value="applications">
                  참여 신청 {room.recruit?.pendingApplicationCount}
                </Tabs.Tab>
              )}
              <Tabs.Tab className={styles.tab} value="participants">
                참여자 {room.recruit?.current}
              </Tabs.Tab>
            </Tabs.List>
            {isHost && (
              <Link className={styles.infoLink} href={`/interviews/${roomId}`}>
                면접 정보
              </Link>
            )}
          </div>
          {isHost && (
            <RoomTabPanel value="applications">
              <RoomPanelBoundary label="참여 신청" fallback={<ApplicationsSkeleton />}>
                <ApplicationsPanel roomId={roomId} />
              </RoomPanelBoundary>
            </RoomTabPanel>
          )}
          <RoomTabPanel value="participants">
            <RoomPanelBoundary label="참여자 목록" fallback={<ParticipantsSkeleton />}>
              <ParticipantsPanel
                room={room}
                currentMemberId={currentMemberId}
                onLeave={leave}
                isPending={leaveMutation.isPending}
              />
            </RoomPanelBoundary>
          </RoomTabPanel>
        </Tabs.Root>
      </div>
    </main>
  );
}

function RoomTabPanel({ value, children }: { value: RoomTab; children: ReactNode }) {
  return (
    <Tabs.Panel
      value={value}
      className={styles.panel}
      keepMounted
      render={(props, { hidden }) => (
        <div {...props}>
          <Activity mode={hidden ? "hidden" : "visible"}>{children}</Activity>
        </div>
      )}
    />
  );
}

function ApplicationsPanel({ roomId }: { roomId: string }) {
  const query = useSuspenseQuery(roomApplicationsOptions({ path: { roomId } }));
  const data = query.data.data;
  if (!data) throw new Error("Failed to load room applications");
  return data.applications.length === 0 ? (
    <p className={styles.empty}>아직 참여 신청이 없어요.</p>
  ) : (
    <ul aria-label="참여 신청 목록" className={styles.list}>
      {data.applications.map((application) => (
        <ApplicationRow
          application={application}
          key={application.applicationId}
          roomId={roomId}
          refreshFailed={query.isRefetchError}
          refreshing={query.isFetching}
        />
      ))}
    </ul>
  );
}
