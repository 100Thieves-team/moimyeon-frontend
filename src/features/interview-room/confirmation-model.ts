import type { InterviewRoom } from "./participant-model";

export function getConfirmationStartAt(room: InterviewRoom) {
  const startAt = room.schedule?.startAt;
  if (!startAt) return NaN;
  return new Date(/(?:Z|[+-]\d{2}:\d{2})$/.test(startAt) ? startAt : `${startAt}+09:00`).getTime();
}

export function getConfirmationDisabledReason(room: InterviewRoom, now = Date.now()) {
  if (!room.viewer?.isHost) return "방장만 진행을 확정할 수 있어요";
  if (room.status !== "RECRUITING") return "모집 중인 면접만 진행을 확정할 수 있어요";
  if (!room.recruit || !Number.isFinite(getConfirmationStartAt(room)))
    return "인원·일정 정보를 확인하지 못했어요. 다시 불러와 주세요";
  if (!room.previouslyConfirmed && getConfirmationStartAt(room) <= now)
    return "진행 일정이 지나 확정할 수 없어요";
  if (room.recruit.current < room.recruit.min)
    return `진행 확정에는 최소 ${room.recruit.min}명이 필요해요`;
  return null;
}

export function getRoomStatusLabel(status: string) {
  switch (status) {
    case "RECRUITING":
      return "모집 중";
    case "CONFIRMED":
      return "진행 확정";
    case "COMPLETED":
      return "면접 완료";
    case "CANCELED":
      return "면접 취소";
    default:
      return "상태 확인 필요";
  }
}
