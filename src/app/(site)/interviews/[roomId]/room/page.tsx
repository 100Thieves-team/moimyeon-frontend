import { InterviewRoomSkeleton } from "@/features/interview-room/interview-room-skeleton";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  rejectReasonsOptions,
  roomApplicationsOptions,
  roomDetailOptions,
  roomParticipantsOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { getCurrentMemberState } from "@/features/auth/current-member-server";
import { InterviewRoomContent } from "@/features/interview-room/interview-room-content";

export const metadata: Metadata = { title: "면접" };

export default async function InterviewRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const queryClient = getQueryClient();
  const client = await createServerClient();
  const requestOptions = { cache: "no-store" as const, client };
  const response = await queryClient.fetchQuery(
    roomDetailOptions({ ...requestOptions, path: { roomId } }),
  );

  if (!response.data) throw new Error("Failed to load interview detail");
  const isHost = response.data.viewer?.isHost === true;
  if (!isHost && response.data.viewer?.isParticipating !== true) redirect(`/interviews/${roomId}`);
  const memberState = await getCurrentMemberState();
  if (memberState.status !== "authenticated") redirect(`/interviews/${roomId}`);

  if (isHost) {
    void queryClient.prefetchQuery(
      roomApplicationsOptions({ ...requestOptions, path: { roomId } }),
    );
    void queryClient.prefetchQuery(rejectReasonsOptions(requestOptions));
  }
  void queryClient.prefetchQuery(roomParticipantsOptions({ ...requestOptions, path: { roomId } }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<InterviewRoomSkeleton />}>
        <InterviewRoomContent
          key={roomId}
          roomId={roomId}
          currentMemberId={memberState.member.memberId}
        />
      </Suspense>
    </HydrationBoundary>
  );
}
