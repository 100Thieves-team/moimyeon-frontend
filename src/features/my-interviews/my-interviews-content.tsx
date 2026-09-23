"use client";

import { Tabs } from "@base-ui/react/tabs";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { GetInterviewOverviewResponse } from "@/api/generated";
import {
  getInterviewOverviewOptions,
  getInterviewOverviewQueryKey,
  myRoomApplicationQueryKey,
  roomDetailQueryKey,
  roomsQueryKey,
  withdrawRoomApplicationMutation,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button, LinkButton } from "@/components/button";
import { formatInterviewStart } from "@/features/interview-detail/interview-detail-model";
import * as styles from "./my-interviews.css";

type InterviewOverview = NonNullable<GetInterviewOverviewResponse["data"]>;
type Room = InterviewOverview["pendingApplications"][number]["room"];

function RoomInfo({ room, completed = false }: { room: Room; completed?: boolean }) {
  const meta = [
    formatInterviewStart({ startAt: room.startAt, durationMinutes: room.durationMinutes }),
    room.meetingTypeLabel,
    room.meetingType === "OFFLINE" ? room.region?.label : null,
    completed
      ? `${room.participantCount}명 참여`
      : `${room.participantCount} / ${room.maxParticipants}명`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={styles.info}>
      <h2 className={styles.title}>{room.title}</h2>
      <p className={styles.meta}>{meta}</p>
    </div>
  );
}

function isApplicationStateChangedError(error: unknown) {
  const detail =
    typeof error === "object" && error !== null && "error" in error ? error.error : null;
  const code =
    typeof detail === "object" && detail !== null && "code" in detail ? detail.code : null;
  return code === "E1408" || code === "E1409";
}

function PendingCard({
  application,
}: {
  application: InterviewOverview["pendingApplications"][number];
}) {
  const { room } = application;
  const queryClient = useQueryClient();
  const toast = Toast.useToastManager();
  const withdrawal = useMutation({
    ...withdrawRoomApplicationMutation(),
    onSuccess: () => {
      toast.add({ title: "참가 신청을 취소했어요." });
    },
    onError: (error) => {
      if (isApplicationStateChangedError(error)) {
        toast.add({ title: "신청 상태가 변경됐어요. 최신 목록을 확인해 주세요." });
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getInterviewOverviewQueryKey() }),
        queryClient.invalidateQueries({
          queryKey: roomDetailQueryKey({ path: { roomId: room.roomId } }),
        }),
        queryClient.invalidateQueries({
          queryKey: myRoomApplicationQueryKey({ path: { roomId: room.roomId } }),
        }),
        queryClient.invalidateQueries({ queryKey: roomsQueryKey() }),
      ]);
    },
  });

  return (
    <li className={styles.card}>
      <RoomInfo room={room} />
      <div className={styles.actions}>
        <span className={styles.pendingChip}>방장 확인 중</span>
        <Button
          size="sm"
          variant="secondary"
          disabled={withdrawal.isPending}
          onClick={() => withdrawal.mutate({ path: { roomId: room.roomId } })}
        >
          {withdrawal.isPending ? "취소 중..." : "신청 취소"}
        </Button>
        <LinkButton size="sm" href={`/interviews/${room.roomId}`}>
          면접 정보
        </LinkButton>
      </div>
      {withdrawal.isError && (
        <p className={styles.error} role="alert">
          신청을 취소하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </li>
  );
}

function EmptyState({ children }: { children: string }) {
  return (
    <div className={styles.empty}>
      <p>{children}</p>
    </div>
  );
}

export function MyInterviewsContent() {
  const { data: response } = useSuspenseQuery(getInterviewOverviewOptions());
  const overview = response.data;
  if (overview === undefined || overview === null)
    throw new Error("Failed to load interview overview");
  const { pendingApplications, participatingRooms, completedRooms } = overview;

  return (
    <main aria-label="내 면접" className={styles.page}>
      <Tabs.Root className={styles.column} defaultValue="upcoming">
        <Tabs.List aria-label="내 면접 상태" className={styles.tabs}>
          <Tabs.Tab className={styles.tab} value="pending">
            신청 중 <span>{pendingApplications.length}</span>
          </Tabs.Tab>
          <Tabs.Tab className={styles.tab} value="upcoming">
            예정 <span>{participatingRooms.length}</span>
          </Tabs.Tab>
          <Tabs.Tab className={styles.tab} value="completed">
            완료 <span>{completedRooms.length}</span>
          </Tabs.Tab>
          <Tabs.Indicator
            className={styles.tabIndicator}
            style={({ activeTabPosition, activeTabSize }) => ({
              transform: `translateX(${activeTabPosition?.left ?? 0}px) scaleX(${activeTabSize?.width ?? 0})`,
            })}
          />
        </Tabs.List>
        <Tabs.Panel value="pending" keepMounted>
          {pendingApplications.length === 0 ? (
            <EmptyState>신청 중인 면접이 없어요.</EmptyState>
          ) : (
            <ul className={styles.list}>
              {pendingApplications.map((application) => (
                <PendingCard key={application.applicationId} application={application} />
              ))}
            </ul>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="upcoming">
          {participatingRooms.length === 0 ? (
            <EmptyState>예정된 면접이 없어요.</EmptyState>
          ) : (
            <ul className={styles.list}>
              {participatingRooms.map(({ room }) => (
                <li className={styles.card} key={room.roomId}>
                  <RoomInfo room={room} />
                  <div className={styles.actions}>
                    <span className={styles.upcomingChip}>참여 확정</span>
                    <LinkButton size="sm" href={`/interviews/${room.roomId}`}>
                      면접 보기
                    </LinkButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="completed">
          {completedRooms.length === 0 ? (
            <EmptyState>완료된 면접이 없어요.</EmptyState>
          ) : (
            <ul className={styles.list}>
              {completedRooms.map(({ room, reviewStatus }) => (
                <li className={styles.card} key={room.roomId}>
                  <RoomInfo room={room} completed />
                  <div className={styles.actions}>
                    <span className={styles.completedChip}>완료</span>
                    {(reviewStatus === "WRITABLE" || reviewStatus === "WRITTEN") && (
                      <LinkButton
                        size="sm"
                        variant={reviewStatus === "WRITABLE" ? "secondary" : "ghost"}
                        href={`/interviews/${room.roomId}/review`}
                      >
                        {reviewStatus === "WRITABLE" ? "후기 남기기" : "남긴 후기 보기"}
                      </LinkButton>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Tabs.Panel>
      </Tabs.Root>
    </main>
  );
}
