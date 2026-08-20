import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomParticipants } from "@/features/interview-mock/room-participants";
import { getMockInterview } from "@/features/interview-mock/mock-data";

type PageProps = { params: Promise<{ roomId: string }> };

export const metadata: Metadata = { title: "면접 참여자" };

export default async function ParticipantsPage({ params }: PageProps) {
  const { roomId } = await params;
  const interview = getMockInterview(roomId);
  if (!interview) notFound();
  return <RoomParticipants interview={interview} />;
}
