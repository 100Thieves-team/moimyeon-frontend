import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  getReviewOverviewOptions,
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
  void queryClient.prefetchQuery(getReviewOverviewOptions(requestOptions));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <ReviewContent roomId={roomId} />
      </Suspense>
    </HydrationBoundary>
  );
}
