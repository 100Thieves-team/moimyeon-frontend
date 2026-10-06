import type { RoomDetailResponse, RoomParticipantsResponse } from "@/api/generated";

export type InterviewRoom = NonNullable<RoomDetailResponse["data"]>;
export type RoomParticipant = NonNullable<RoomParticipantsResponse["data"]>["participants"][number];

export function getRoomRequestError(error: unknown) {
  const detail =
    typeof error === "object" && error !== null && "error" in error ? error.error : null;
  return {
    code: typeof detail === "object" && detail !== null && "code" in detail ? detail.code : null,
    message:
      typeof detail === "object" &&
      detail !== null &&
      "message" in detail &&
      typeof detail.message === "string"
        ? detail.message
        : "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.",
  };
}

export function getParticipantSummary(participant: RoomParticipant) {
  const summary = participant.aiSummary;
  if (!summary) return "제공된 AI 요약이 없어요.";
  if (summary.status === "DONE") return summary.text || "AI 요약을 확인할 수 없어요.";
  return "AI 요약을 준비 중이에요.";
}
