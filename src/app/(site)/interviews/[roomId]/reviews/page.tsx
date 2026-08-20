import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InterviewReview } from "@/features/interview-mock/interview-review";
import { getMockInterview } from "@/features/interview-mock/mock-data";

type ReviewsPageProps = { params: Promise<{ roomId: string }> };

export const metadata: Metadata = { title: "면접 후기" };

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { roomId } = await params;
  const interview = getMockInterview(roomId);

  if (!interview) notFound();

  return (
    <Suspense fallback={null}>
      <InterviewReview interview={interview} />
    </Suspense>
  );
}
