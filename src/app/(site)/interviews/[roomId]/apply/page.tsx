import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InterviewApplyForm } from "@/features/interview-mock/interview-apply-form";
import { getMockInterview } from "@/features/interview-mock/mock-data";

type ApplyPageProps = { params: Promise<{ roomId: string }> };

export const metadata: Metadata = { title: "참가 신청" };

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { roomId } = await params;
  const interview = getMockInterview(roomId);

  if (!interview) notFound();

  return (
    <Suspense fallback={null}>
      <InterviewApplyForm interview={interview} />
    </Suspense>
  );
}
