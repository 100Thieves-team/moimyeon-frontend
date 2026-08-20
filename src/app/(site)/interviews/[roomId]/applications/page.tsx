import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomApplications } from "@/features/interview-mock/room-applications";
import { getMockInterview } from "@/features/interview-mock/mock-data";

type PageProps = { params: Promise<{ roomId: string }> };

export const metadata: Metadata = { title: "참가 신청 관리" };

export default async function ApplicationsPage({ params }: PageProps) {
  const { roomId } = await params;
  const interview = getMockInterview(roomId);
  if (!interview || interview.relation !== "host") notFound();
  return <RoomApplications interview={interview} />;
}
