import type {
  GetReviewResponse,
  GetReviewTargetsResponse,
  RoomDetailResponse,
} from "@/api/generated";

export type RoomDetail = NonNullable<RoomDetailResponse["data"]>;
export type ReviewTargets = NonNullable<GetReviewTargetsResponse["data"]>;
export type ReviewTarget = ReviewTargets["targets"][number];

export type ReviewFormInitialValues = {
  anonymous: boolean;
  content: string;
  tags: string[];
};

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

/* 서버가 태그를 한글 라벨 그대로 검증한다 (ReviewTagOption.labels) */
export const REVIEW_TAG_LABELS = [
  "시간을 잘 지켜요",
  "준비가 성실해요",
  "질문이 날카로워요",
  "피드백이 구체적이에요",
  "소통이 원활해요",
] as const;

function isReviewTagLabel(value: unknown): value is (typeof REVIEW_TAG_LABELS)[number] {
  return REVIEW_TAG_LABELS.some((label) => label === value);
}

export function getReviewFormInitialValues(
  response: GetReviewResponse,
  expected: { reviewId: number; roomId: string; targetMemberId: string },
): ReviewFormInitialValues {
  const review = response.data;

  if (
    review === undefined ||
    review === null ||
    review.reviewId !== expected.reviewId ||
    review.roomId !== expected.roomId ||
    review.targetMemberId !== expected.targetMemberId ||
    !review.tags.every(isReviewTagLabel)
  ) {
    throw new Error("Failed to load submitted review");
  }

  return {
    anonymous: review.anonymous,
    content: review.content ?? "",
    tags: review.tags,
  };
}
