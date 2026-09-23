import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getInterviewOverviewOptions } from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { MyInterviewsContent } from "@/features/my-interviews/my-interviews-content";

export const metadata: Metadata = { title: "내 면접" };

export default async function MyInterviewsPage() {
  const queryClient = getQueryClient();
  const client = await createServerClient();
  void queryClient.prefetchQuery(getInterviewOverviewOptions({ client, cache: "no-store" }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyInterviewsContent />
    </HydrationBoundary>
  );
}
