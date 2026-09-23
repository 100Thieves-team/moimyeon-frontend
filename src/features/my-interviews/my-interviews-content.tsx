"use client";

import { Tabs } from "@base-ui/react/tabs";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { GetInterviewOverviewResponse } from "@/api/generated";
import { getInterviewOverviewOptions } from "@/api/generated/@tanstack/react-query.gen";
import { Button, LinkButton } from "@/components/button";
import {
  WithdrawApplicationProvider,
  useWithdrawApplicationDialog,
} from "@/features/interview-detail/withdraw-application-dialog";
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

function PendingCard({
  application,
}: {
  application: InterviewOverview["pendingApplications"][number];
}) {
  const { room } = application;
  const handle = useWithdrawApplicationDialog();

  return (
    <li className={styles.card}>
      <RoomInfo room={room} />
      <div className={styles.actions}>
        <span className={styles.pendingChip}>방장 확인 중</span>
        <AlertDialog.Trigger
          handle={handle}
          payload={{ roomId: room.roomId, title: room.title }}
          render={<Button size="sm" variant="secondary" />}
        >
          신청 취소
        </AlertDialog.Trigger>
        <LinkButton size="sm" href={`/interviews/${room.roomId}`}>
          면접 정보
        </LinkButton>
      </div>
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
    <WithdrawApplicationProvider refreshOnError>
      <main aria-label="내 면접" className={styles.page}>
        <Tabs.Root className={styles.column} defaultValue="pending">
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
                        면접 정보
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
    </WithdrawApplicationProvider>
  );
}
