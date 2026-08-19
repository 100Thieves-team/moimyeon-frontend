import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  jobRolesOptions,
  participationSlotsOptions,
  regionsOptions,
  resumesOptions,
  roomFormOptionsOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { InterviewCreateContent } from "@/features/interview-create/interview-create-content";

export const metadata: Metadata = {
  title: "면접 만들기",
};

export default async function NewInterviewPage() {
  const queryClient = getQueryClient();
  const serverClient = await createServerClient();
  const requestOptions = {
    cache: "no-store" as const,
    client: serverClient,
  };

  queryClient.prefetchQuery(roomFormOptionsOptions(requestOptions));
  queryClient.prefetchQuery(jobRolesOptions(requestOptions));
  queryClient.prefetchQuery(regionsOptions(requestOptions));
  queryClient.prefetchQuery(participationSlotsOptions(requestOptions));
  queryClient.prefetchQuery(resumesOptions(requestOptions));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <InterviewCreateContent />
      </Suspense>
    </HydrationBoundary>
  );
}
