import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  rejectReasonsOptions,
  roomApplicationsOptions,
  roomDetailOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { InterviewRoomContent } from "@/features/interview-room/interview-room-content";
import * as styles from "@/features/interview-room/interview-room.css";

export const metadata: Metadata = { title: "참가 신청 관리" };

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
  if (response.data.viewer?.isHost !== true) redirect(`/interviews/${roomId}`);

  void queryClient.prefetchQuery(roomApplicationsOptions({ ...requestOptions, path: { roomId } }));
  void queryClient.prefetchQuery(rejectReasonsOptions(requestOptions));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p className={styles.empty}>참가 신청을 불러오는 중이에요.</p>}>
        <InterviewRoomContent roomId={roomId} />
      </Suspense>
    </HydrationBoundary>
  );
}
