"use client";

import { Toast } from "@base-ui/react/toast";
import { useRouter } from "next/navigation";
import { Tabs } from "@base-ui/react/tabs";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Activity, useState, type ReactNode } from "react";
import type { RoomLeaveResponse } from "@/api/generated";
import { Button } from "@/components/button";
import { LeaveRoomDialog } from "./leave-room-dialog";
import type { InterviewRoom } from "./participant-model";
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
import { InterviewDetailSkeleton } from "@/features/interview-detail/interview-detail-skeleton";
import { InterviewDetailContent } from "@/features/interview-detail/interview-detail-content";
import { getInterviewMetaLabels } from "@/features/interview-detail/interview-detail-model";
import { ApplicationRow } from "./application-row";
import { ParticipantsPanel } from "./participants-panel";
import { RoomPanelBoundary } from "./room-query-state";
import { ApplicationsSkeleton, ParticipantsSkeleton } from "./interview-room-skeleton";
import * as styles from "./interview-room.css";

type RoomTab = "info" | "applications" | "participants";

export function InterviewRoomContent({
  roomId,
  currentMemberId,
}: {
  roomId: string;
  currentMemberId: string | null;
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
  const isHost = currentMemberId !== null && room?.viewer?.isHost === true;
  const canViewParticipants =
    currentMemberId !== null && (isHost || room?.viewer?.isParticipating === true);
  if (!room) throw new Error("Failed to load interview room");
  if (leaveMutation.isSuccess && leaveMutation.data.result === "SUCCESS")
    return <p className={styles.empty}>참여를 취소했어요. 내 면접으로 이동하고 있어요.</p>;

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.heading}>
          <h1 className={styles.title}>{room.title}</h1>
          <p className={styles.roomMeta}>{getInterviewMetaLabels(room).join(" · ")}</p>
        </header>
        <RoomTabs
          key={isHost ? "host" : canViewParticipants ? "participant" : "visitor"}
          room={room}
          currentMemberId={currentMemberId}
          isHost={isHost}
          canViewParticipants={canViewParticipants}
          onLeave={leave}
          isPending={leaveMutation.isPending}
        />
      </div>
    </main>
  );
}

function RoomTabs({
  room,
  currentMemberId,
  isHost,
  canViewParticipants,
  onLeave,
  isPending,
}: {
  room: InterviewRoom;
  currentMemberId: string | null;
  isHost: boolean;
  canViewParticipants: boolean;
  onLeave: () => Promise<RoomLeaveResponse>;
  isPending: boolean;
}) {
  const [tab, setTab] = useState<RoomTab>("info");
  const roomId = room.roomId;
  return (
    <Tabs.Root value={tab} onValueChange={(value) => setTab(value as RoomTab)}>
      <div className={styles.navigation}>
        <Tabs.List aria-label="면접 관리" className={styles.tabs}>
          <Tabs.Tab className={styles.tab} value="info">
            면접 정보
          </Tabs.Tab>
          {isHost && (
            <Tabs.Tab className={styles.tab} value="applications">
              참여 신청 {room.recruit?.pendingApplicationCount}
            </Tabs.Tab>
          )}
          <Tabs.Tab className={styles.tab} value="participants" disabled={!canViewParticipants}>
            참여자 {room.recruit?.current}
          </Tabs.Tab>
        </Tabs.List>
      </div>
      <RoomTabPanel value="info">
        <RoomPanelBoundary
          label="면접 정보"
          fallback={<InterviewDetailSkeleton presentation="panel" />}
        >
          <InterviewDetailContent
            roomId={roomId}
            memberAction={
              isHost ? (
                <Button onClick={() => setTab("applications")}>참여 신청 확인하기</Button>
              ) : canViewParticipants ? (
                <LeaveRoomDialog
                  room={room}
                  onLeave={onLeave}
                  isPending={isPending}
                  variant="card"
                />
              ) : null
            }
          />
        </RoomPanelBoundary>
      </RoomTabPanel>
      {isHost && (
        <RoomTabPanel value="applications">
          <RoomPanelBoundary label="참여 신청" fallback={<ApplicationsSkeleton />}>
            <ApplicationsPanel roomId={roomId} />
          </RoomPanelBoundary>
        </RoomTabPanel>
      )}
      {canViewParticipants && currentMemberId !== null && (
        <RoomTabPanel value="participants">
          <RoomPanelBoundary label="참여자 목록" fallback={<ParticipantsSkeleton />}>
            <ParticipantsPanel
              room={room}
              currentMemberId={currentMemberId}
              onLeave={onLeave}
              isPending={isPending}
            />
          </RoomPanelBoundary>
        </RoomTabPanel>
      )}
    </Tabs.Root>
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
