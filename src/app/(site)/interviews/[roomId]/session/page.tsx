import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InterviewSession } from "@/features/interview-mock/interview-session";
import { getMockInterview } from "@/features/interview-mock/mock-data";

type PageProps = { params: Promise<{ roomId: string }> };

export const metadata: Metadata = { title: "면접 진행" };

export default async function SessionPage({ params }: PageProps) {
  const { roomId } = await params;
  const interview = getMockInterview(roomId);
  if (!interview || !roomId.startsWith("hanbit-")) notFound();
  return (
    <Suspense fallback={null}>
      <InterviewSession interview={interview} />
    </Suspense>
  );
}
