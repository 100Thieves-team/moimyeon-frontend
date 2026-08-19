import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { roomFormOptionsOptions } from "@/api/generated/@tanstack/react-query.gen";
import { getQueryClient } from "@/api/query-client";
import { createServerClient } from "@/api/server-client";
import { InterviewCreateWizard } from "@/features/interview-create/interview-create-wizard";

export const metadata: Metadata = {
  title: "면접 만들기",
};

export default async function NewInterviewPage() {
  const queryClient = getQueryClient();
  const serverClient = await createServerClient();

  await queryClient.ensureQueryData(
    roomFormOptionsOptions({ cache: "no-store", client: serverClient }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InterviewCreateWizard />
    </HydrationBoundary>
  );
}
