import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { GetRoomCommentsResponse } from "@/api/generated";
import {
  getRoomCommentsInfiniteOptions,
  rejectReasonsOptions,
  roomApplicationsOptions,
  roomDetailOptions,
  roomParticipantsOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { getCurrentMemberState } from "@/features/auth/current-member-server";
import { InterviewRoomContent } from "@/features/interview-room/interview-room-content";

export const metadata: Metadata = { title: "면접 상세" };

export default async function InterviewDetailPage({ params }: PageProps<"/interviews/[roomId]">) {
  const { roomId } = await params;
  const queryClient = getQueryClient();
  const client = await createServerClient();
  const requestOptions = { cache: "no-store" as const, client };
  const response = await queryClient.fetchQuery(
    roomDetailOptions({ ...requestOptions, path: { roomId } }),
  );

  if (!response.data) throw new Error("Failed to load interview detail");
  const memberState = await getCurrentMemberState();
  const currentMemberId =
    memberState.status === "authenticated" ? memberState.member.memberId : null;
  const isHost = currentMemberId !== null && response.data.viewer?.isHost === true;
  const canViewParticipants =
    currentMemberId !== null && (isHost || response.data.viewer?.isParticipating === true);

  if (isHost) {
    void queryClient.prefetchQuery(
      roomApplicationsOptions({ ...requestOptions, path: { roomId } }),
    );
    void queryClient.prefetchQuery(rejectReasonsOptions(requestOptions));
  }
  if (canViewParticipants) {
    void queryClient.prefetchInfiniteQuery({
      ...getRoomCommentsInfiniteOptions({
        ...requestOptions,
        path: { roomId },
        query: { size: "20" },
      }),
      initialPageParam: { path: { roomId }, query: {} },
      getNextPageParam: (lastPage: GetRoomCommentsResponse) =>
        lastPage.data?.nextCursor ?? undefined,
    });
    void queryClient.prefetchQuery(
      roomParticipantsOptions({ ...requestOptions, path: { roomId } }),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InterviewRoomContent key={roomId} roomId={roomId} currentMemberId={currentMemberId} />
    </HydrationBoundary>
  );
}
