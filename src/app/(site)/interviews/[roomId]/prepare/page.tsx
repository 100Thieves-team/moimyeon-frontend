import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InterviewPrepare } from "@/features/interview-mock/interview-prepare";
import { getMockInterview } from "@/features/interview-mock/mock-data";

type PageProps = { params: Promise<{ roomId: string }> };

export const metadata: Metadata = { title: "면접 진행 준비" };

export default async function PreparePage({ params }: PageProps) {
  const { roomId } = await params;
  const interview = getMockInterview(roomId);
  if (!interview || !roomId.startsWith("hanbit-")) notFound();
  return <InterviewPrepare interview={interview} />;
}
