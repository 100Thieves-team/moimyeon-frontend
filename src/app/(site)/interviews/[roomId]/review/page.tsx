import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  getReviewOptions,
  getReviewTargetsOptions,
  roomDetailOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { ReviewContent } from "@/features/review/review-content";

export const metadata: Metadata = {
  title: "후기 남기기",
};

type RoomReviewRouteProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function RoomReviewPage({ params }: RoomReviewRouteProps) {
  const { roomId } = await params;
  const queryClient = getQueryClient();
  const serverClient = await createServerClient();
  const requestOptions = {
    cache: "no-store" as const,
    client: serverClient,
    path: { roomId },
  };

  void queryClient.prefetchQuery(roomDetailOptions(requestOptions));
  const targetsResponse = await queryClient.fetchQuery(getReviewTargetsOptions(requestOptions));
  const reviewTargets = targetsResponse.data;

  if (reviewTargets === undefined || reviewTargets === null) {
    throw new Error("Failed to load review targets");
  }

  for (const target of reviewTargets.targets) {
    if (
      target.status !== "SUBMITTED" ||
      target.reviewId === undefined ||
      target.reviewId === null
    ) {
      continue;
    }

    void queryClient.prefetchQuery(
      getReviewOptions({
        cache: "no-store",
        client: serverClient,
        path: { reviewId: String(target.reviewId) },
      }),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <ReviewContent roomId={roomId} />
      </Suspense>
    </HydrationBoundary>
  );
}
