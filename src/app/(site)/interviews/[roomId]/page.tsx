import { InterviewDetailSkeleton } from "@/features/interview-detail/interview-detail-skeleton";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { roomDetailOptions } from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { InterviewDetailContent } from "@/features/interview-detail/interview-detail-content";

export const metadata: Metadata = {
  title: "면접 상세",
};

type InterviewDetailPageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function InterviewDetailPage({ params }: InterviewDetailPageProps) {
  const { roomId } = await params;
  const queryClient = getQueryClient();
  const serverClient = await createServerClient();
  const requestOptions = {
    cache: "no-store" as const,
    client: serverClient,
  };

  void queryClient.prefetchQuery(
    roomDetailOptions({
      ...requestOptions,
      path: { roomId },
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<InterviewDetailSkeleton />}>
        <InterviewDetailContent roomId={roomId} />
      </Suspense>
    </HydrationBoundary>
  );
}
