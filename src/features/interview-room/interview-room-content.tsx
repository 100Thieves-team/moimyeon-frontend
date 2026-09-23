"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Activity, useState, type ReactNode } from "react";
import { LeaveRoomDialog } from "./leave-room-dialog";
import type { InterviewRoom } from "./participant-model";
import {
  roomApplicationsOptions,
  roomDetailOptions,
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
  const room = roomQuery.data.data;
  const isHost = currentMemberId !== null && room?.viewer?.isHost === true;
  const canViewParticipants =
    currentMemberId !== null && (isHost || room?.viewer?.isParticipating === true);
  if (!room) throw new Error("Failed to load interview room");

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
        />
        {canViewParticipants && <LeaveRoomDialog room={room} />}
      </div>
    </main>
  );
}

function RoomTabs({
  room,
  currentMemberId,
  isHost,
  canViewParticipants,
}: {
  room: InterviewRoom;
  currentMemberId: string | null;
  isHost: boolean;
  canViewParticipants: boolean;
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
            currentMemberId={currentMemberId}
            onViewApplications={() => setTab("applications")}
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
            <ParticipantsPanel room={room} currentMemberId={currentMemberId} />
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
