import { InterviewDiscoverySkeleton } from "@/features/interview-discovery/interview-discovery-skeleton";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  jobRolesOptions,
  regionsOptions,
  roomFormOptionsOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { InterviewDiscoveryContent } from "@/features/interview-discovery/interview-discovery-content";
import {
  interviewDiscoveryFiltersSchema,
  interviewRoomsInfiniteOptions,
} from "@/features/interview-discovery/interview-discovery-model";
import * as styles from "./page.css";

export const metadata: Metadata = {
  title: "면접",
};

export default async function Home({ searchParams }: PageProps<"/">) {
  const rawSearchParams = await searchParams;
  const filters = interviewDiscoveryFiltersSchema.parse(rawSearchParams);
  const urlSearchParams = new URLSearchParams();

  Object.entries(rawSearchParams).forEach(([key, value]) => {
    const firstValue = Array.isArray(value) ? value[0] : value;

    if (firstValue !== undefined) {
      urlSearchParams.set(key, firstValue);
    }
  });

  if (urlSearchParams.get("sort") !== filters.sort) {
    urlSearchParams.set("sort", filters.sort);
    redirect(`/?${urlSearchParams.toString()}`);
  }

  const queryClient = getQueryClient();
  const serverClient = await createServerClient();
  const requestOptions = {
    cache: "no-store" as const,
    client: serverClient,
  };

  queryClient.prefetchInfiniteQuery(interviewRoomsInfiniteOptions(filters, requestOptions));
  queryClient.prefetchQuery(jobRolesOptions(requestOptions));
  queryClient.prefetchQuery(regionsOptions(requestOptions));
  queryClient.prefetchQuery(roomFormOptionsOptions(requestOptions));

  return (
    <main className={styles.page}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<InterviewDiscoverySkeleton />}>
          <InterviewDiscoveryContent filters={filters} />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
