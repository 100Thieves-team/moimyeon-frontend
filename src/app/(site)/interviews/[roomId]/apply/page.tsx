import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { resumesOptions, roomDetailOptions } from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { InterviewApplyContent } from "@/features/interview-apply/interview-apply-content";
import * as styles from "@/features/interview-apply/interview-apply.css";
import { getInterviewViewerState } from "@/features/interview-detail/interview-detail-model";

export const metadata: Metadata = { title: "참가 신청" };

type InterviewApplyPageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function InterviewApplyPage({ params }: InterviewApplyPageProps) {
  const { roomId } = await params;
  const queryClient = getQueryClient();
  const serverClient = await createServerClient();
  const requestOptions = { cache: "no-store" as const, client: serverClient };
  const roomResponse = await queryClient.fetchQuery(
    roomDetailOptions({ ...requestOptions, path: { roomId } }),
  );
  const room = roomResponse.data;

  if (room === undefined || room === null) {
    throw new Error("Failed to load interview detail");
  }

  if (getInterviewViewerState(room).kind !== "APPLY") {
    redirect(`/interviews/${roomId}`);
  }

  void queryClient.prefetchQuery(resumesOptions(requestOptions));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p className={styles.loading}>신청 정보를 불러오는 중이에요.</p>}>
        <InterviewApplyContent roomId={roomId} />
      </Suspense>
    </HydrationBoundary>
  );
}
