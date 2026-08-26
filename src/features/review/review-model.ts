import type { GetReviewTargetsResponse, RoomDetailResponse } from "@/api/generated";

export type RoomDetail = NonNullable<RoomDetailResponse["data"]>;
export type ReviewTargets = NonNullable<GetReviewTargetsResponse["data"]>;
export type ReviewTarget = ReviewTargets["targets"][number];

const completedDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  day: "numeric",
  month: "long",
  weekday: "short",
});

export function formatCompletedDate(startAt: string | undefined) {
  if (startAt === undefined) {
    return null;
  }

  const startDate = new Date(startAt);

  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const parts = completedDateFormatter.formatToParts(startDate);
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const weekday = parts.find((part) => part.type === "weekday")?.value;

  if (month === undefined || day === undefined || weekday === undefined) {
    return null;
  }

  return `${month} ${day}일 (${weekday}) 완료`;
}

export function isSubmittedTarget(target: ReviewTarget) {
  return target.status === "SUBMITTED";
}
