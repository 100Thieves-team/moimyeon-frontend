import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InterviewDetail } from "@/features/interview-mock/interview-detail";
import { getMockInterview } from "@/features/interview-mock/mock-data";
import { RoomInfo } from "@/features/interview-mock/room-info";

type InterviewDetailPageProps = {
  params: Promise<{ roomId: string }>;
};

export const metadata: Metadata = { title: "면접 상세" };

export default async function InterviewDetailPage({ params }: InterviewDetailPageProps) {
  const { roomId } = await params;
  const interview = getMockInterview(roomId);

  if (!interview) notFound();

  if (roomId.startsWith("hanbit-host-") || roomId === "hanbit-participant-confirmed") {
    return <RoomInfo interview={interview} />;
  }

  return (
    <Suspense fallback={null}>
      <InterviewDetail interview={interview} />
    </Suspense>
  );
}
