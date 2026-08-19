import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  participationSlotsOptions,
  regionsOptions,
  roomFormOptionsOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { InterviewCreateWizard } from "@/features/interview-create/interview-create-wizard";

export const metadata: Metadata = {
  title: "면접 만들기",
};

export default async function NewInterviewPage() {
  const queryClient = getQueryClient();
  const serverClient = await createServerClient();

  const requestOptions = { cache: "no-store" as const, client: serverClient };
  await Promise.all([
    queryClient.ensureQueryData(roomFormOptionsOptions(requestOptions)),
    queryClient.ensureQueryData(regionsOptions(requestOptions)),
    queryClient.ensureQueryData(participationSlotsOptions(requestOptions)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InterviewCreateWizard />
    </HydrationBoundary>
  );
}
