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

export function getLeaveDisabledReason(room: InterviewRoom) {
  if (!room.viewer?.isHost && !room.viewer?.isParticipating)
    return "현재 참여자만 참여를 취소할 수 있어요.";
  switch (room.status) {
    case "RECRUITING":
      return null;
    case "CONFIRMED":
      if (!room.recruit) return "인원 정보를 확인하지 못했어요. 다시 불러와 주세요.";
      return room.recruit.current > room.recruit.min
        ? null
        : "최소 진행 인원이라 참여를 취소할 수 없어요. 도움이 필요하면 고객센터에 문의해 주세요.";
    case "IN_PROGRESS":
      return "이미 진행 중인 면접은 참여를 취소할 수 없어요.";
    case "COMPLETED":
      return "완료된 면접은 참여를 취소할 수 없어요.";
    case "CANCELED":
      return "취소된 면접이에요.";
    default:
      return "면접 상태를 확인하지 못했어요. 다시 불러와 주세요.";
  }
}

export function getParticipantSummary(participant: RoomParticipant) {
  const summary = participant.aiSummary;
  if (!summary) return "제공된 AI 요약이 없어요.";
  if (summary.status === "DONE") return summary.text || "AI 요약을 확인할 수 없어요.";
  return "AI 요약을 준비 중이에요.";
}
