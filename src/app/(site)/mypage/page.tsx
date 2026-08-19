import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  jobRolesOptions,
  memberMeOptions,
  publicProfileOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { MyPageContent } from "@/features/mypage/mypage-content";

export const metadata: Metadata = {
  title: "마이페이지",
};

export default async function MyPage() {
  const queryClient = getQueryClient();
  const serverClient = await createServerClient();
  const requestOptions = {
    cache: "no-store" as const,
    client: serverClient,
  };
  const memberQuery = memberMeOptions(requestOptions);

  const [memberResponse] = await Promise.all([
    queryClient.ensureQueryData(memberQuery),
    queryClient.ensureQueryData(jobRolesOptions(requestOptions)),
  ]);

  if (memberResponse?.data !== undefined) {
    queryClient.prefetchQuery(
      publicProfileOptions({
        ...requestOptions,
        path: { memberId: memberResponse.data.memberId },
      }),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <MyPageContent />
      </Suspense>
    </HydrationBoundary>
  );
}
