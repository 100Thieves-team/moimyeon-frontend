import type { RoomDetailResponse } from "@/api";

export type InterviewDetail = NonNullable<RoomDetailResponse["data"]>;

type InterviewApplicationMode = "REGULAR" | "WAITLIST";

export type InterviewViewerState =
  | { applicationMode: InterviewApplicationMode; kind: "APPLY" }
  | { kind: "BLOCKED"; message: string }
  | { applicationMode: InterviewApplicationMode; kind: "LOGIN_REQUIRED" }
  | { kind: "MANAGE_INTERVIEW" }
  | { kind: "PENDING_APPLICATION" }
  | { kind: "UNAVAILABLE"; message: string }
  | { kind: "VIEW_INTERVIEW" };

const applicationStatuses = new Set([
  "ACCEPTED",
  "PENDING",
  "REJECTED",
  "ROOM_CANCELED",
  "ROOM_CONFIRMED",
  "SLOT_EXCEEDED",
  "WITHDRAWN",
]);

const roomStatusMessages: Partial<Record<string, string>> = {
  CANCELED: "취소된 면접이에요",
  COMPLETED: "종료된 면접이에요",
  CONFIRMED: "참여자가 확정된 면접이에요",
  IN_PROGRESS: "진행 중인 면접이에요",
};

function hasReachedLimit(
  quota:
    | {
        limit?: number | null;
        occupied?: number | null;
      }
    | null
    | undefined,
) {
  if (typeof quota?.limit !== "number" || typeof quota.occupied !== "number") {
    return null;
  }

  return quota.occupied >= quota.limit;
}

export function getInterviewViewerState(room: InterviewDetail): InterviewViewerState {
  const viewer = room.viewer;

  if (viewer?.isHost === true) return { kind: "MANAGE_INTERVIEW" };
  if (viewer?.isParticipating === true) return { kind: "VIEW_INTERVIEW" };
  if (viewer?.latestApplicationStatus === "PENDING") {
    return { kind: "PENDING_APPLICATION" };
  }

  const roomStatusMessage = roomStatusMessages[room.status];
  if (room.status !== "RECRUITING") {
    return {
      kind: "BLOCKED",
      message: roomStatusMessage ?? "신청할 수 없는 면접이에요",
    };
  }

  if (!room.recruit) {
    return { kind: "UNAVAILABLE", message: "모집 정보를 확인할 수 없어요." };
  }

  const applicationMode = room.recruit.current >= room.recruit.max ? "WAITLIST" : "REGULAR";

  if (viewer === null) return { applicationMode, kind: "LOGIN_REQUIRED" };
  if (viewer === undefined) {
    return { kind: "BLOCKED", message: "신청 가능 여부를 확인할 수 없어요" };
  }

  if (
    typeof viewer.isHost !== "boolean" ||
    typeof viewer.isParticipating !== "boolean" ||
    typeof viewer.hasRemovalHistory !== "boolean"
  ) {
    return { kind: "UNAVAILABLE", message: "신청 가능 여부를 확인할 수 없어요." };
  }

  if (
    viewer.latestApplicationStatus !== null &&
    viewer.latestApplicationStatus !== undefined &&
    !applicationStatuses.has(viewer.latestApplicationStatus)
  ) {
    return { kind: "BLOCKED", message: "신청 상태를 확인할 수 없어요" };
  }

  if (viewer.latestApplicationStatus === "REJECTED") {
    return { kind: "BLOCKED", message: "참가 신청이 반려됐어요" };
  }

  if (viewer.hasRemovalHistory) {
    return {
      kind: "BLOCKED",
      message: "면접에서 퇴장 처리됐어요",
    };
  }

  const member = viewer.member;
  if (!member || typeof member.isActive !== "boolean") {
    return { kind: "UNAVAILABLE", message: "신청 가능 여부를 확인할 수 없어요." };
  }

  if (!member.isActive) {
    return {
      kind: "BLOCKED",
      message: "이용이 제한된 계정이에요",
    };
  }

  const participationLimitReached = hasReachedLimit(member.participationSlots);
  const applicationLimitReached = hasReachedLimit(member.pendingApplicationQuota);

  if (participationLimitReached === null || applicationLimitReached === null) {
    return { kind: "UNAVAILABLE", message: "신청 가능 여부를 확인할 수 없어요." };
  }

  if (participationLimitReached) {
    return {
      kind: "BLOCKED",
      message: "참여 면접 한도에 도달했어요",
    };
  }

  if (applicationLimitReached) {
    return {
      kind: "BLOCKED",
      message: "대기 신청 한도에 도달했어요",
    };
  }

  return { applicationMode, kind: "APPLY" };
}

export function getInterviewRelationLabel(room: InterviewDetail) {
  const viewer = room.viewer;

  if (viewer?.isHost) return "내가 만든 면접";
  if (viewer?.isParticipating) return "참여 중";
  if (viewer?.latestApplicationStatus === "PENDING") return "수락 대기";
  if (viewer?.latestApplicationStatus === "REJECTED") return "신청 반려";
  if (viewer?.hasRemovalHistory) return "참여 종료";

  return null;
}

export function formatInterviewSchedule(schedule: InterviewDetail["schedule"]) {
  if (!schedule) return "일정 정보 없음";

  return `${formatInterviewStart(schedule)} · ${schedule.durationMinutes}분`;
}

export function formatInterviewStart(schedule: InterviewDetail["schedule"]) {
  if (!schedule) return "일정 정보 없음";

  const date = new Date(schedule.startAt);

  if (Number.isNaN(date.getTime())) {
    return schedule.startAt;
  }

  const dateLabel = new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "long",
    weekday: "short",
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  }).format(date);

  return `${dateLabel} ${timeLabel}`;
}

export function getInterviewMetaLabels(room: InterviewDetail) {
  return [
    room.company?.name,
    room.jobPosting?.postingName,
    room.jobRole?.displayName,
    `${room.roundLabel} 면접`,
    room.typeLabel,
  ].filter((label): label is string => Boolean(label));
}
