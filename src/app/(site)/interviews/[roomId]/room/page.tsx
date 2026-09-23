import { redirect } from "next/navigation";

export default async function InterviewRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  redirect(`/interviews/${roomId}`);
}
