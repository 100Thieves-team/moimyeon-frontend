import type { RoomApplicationsResponse } from "@/api/generated";

export type RoomApplication = NonNullable<RoomApplicationsResponse["data"]>["applications"][number];

export function getApplicationActionError(error: unknown) {
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
        : "신청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.",
  };
}

export function getApplicationSummary(application: RoomApplication) {
  return application.aiSummary.status === "DONE" && application.aiSummary.text
    ? application.aiSummary.text
    : "AI 요약을 준비 중이에요.";
}

export function formatAppliedAt(appliedAt: string) {
  const date = new Date(
    /(?:Z|[+-]\d{2}:\d{2})$/.test(appliedAt) ? appliedAt : `${appliedAt}+09:00`,
  );
  if (Number.isNaN(date.getTime())) return appliedAt;
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000));
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(date);
}
