"use client";

import { useParams } from "next/navigation";
import { ReviewError } from "@/features/review/review-error";

export default function RoomReviewError({ error, reset }: { error: unknown; reset: () => void }) {
  const { roomId } = useParams<{ roomId: string }>();

  return <ReviewError error={error} roomId={roomId} reset={reset} />;
}
