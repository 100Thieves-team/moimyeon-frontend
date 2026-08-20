import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InterviewComments } from "@/features/interview-mock/interview-comments";
import { getMockInterview } from "@/features/interview-mock/mock-data";

type CommentsPageProps = { params: Promise<{ roomId: string }> };

export const metadata: Metadata = { title: "면접 댓글" };

export default async function CommentsPage({ params }: CommentsPageProps) {
  const { roomId } = await params;
  const interview = getMockInterview(roomId);

  if (!interview) notFound();

  return (
    <Suspense fallback={null}>
      <InterviewComments interview={interview} />
    </Suspense>
  );
}
