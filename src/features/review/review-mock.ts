import type {
  GetReviewResponse,
  GetReviewTargetsResponse,
  PublicProfileResponse,
  RoomDetailResponse,
  SubmitReviewResponse,
} from "@/api";

type MockReview = NonNullable<GetReviewResponse["data"]>;
type MockProfile = NonNullable<PublicProfileResponse["data"]>;

export const MOCK_REVIEW_ROOM_ID = "00000000-0000-4000-8002-000000000001";

const MOCK_REVIEW_AUTHOR_ID = "00000000-0000-4000-8002-000000000002";
const MOCK_REVIEW_HOST_ID = "00000000-0000-4000-8002-000000000003";
const MOCK_REVIEW_MEMBER_IDS = [
  MOCK_REVIEW_HOST_ID,
  "00000000-0000-4000-8002-000000000004",
  "00000000-0000-4000-8002-000000000005",
  "00000000-0000-4000-8002-000000000006",
] as const;

const mockMembers = [
  { memberId: MOCK_REVIEW_MEMBER_IDS[0], nickname: "꼼꼼한 여우 12" },
  { memberId: MOCK_REVIEW_MEMBER_IDS[1], nickname: "명쾌한 수달 02" },
  { memberId: MOCK_REVIEW_MEMBER_IDS[2], nickname: "차분한 라쿤 03" },
  { memberId: MOCK_REVIEW_MEMBER_IDS[3], nickname: "든든한 곰 04" },
] as const;

const initialReviews: MockReview[] = [
  {
    anonymous: true,
    content: "답변의 강점과 보완점을 구체적으로 짚어 주셨어요.",
    reviewId: 9101,
    roomId: MOCK_REVIEW_ROOM_ID,
    tags: ["시간을 잘 지켜요", "피드백이 구체적이에요"],
    targetMemberId: MOCK_REVIEW_MEMBER_IDS[0],
    targetNickname: mockMembers[0].nickname,
  },
  {
    anonymous: false,
    content: "꼬리 질문 덕분에 실전처럼 연습할 수 있었어요.",
    reviewId: 9102,
    roomId: MOCK_REVIEW_ROOM_ID,
    tags: ["질문이 날카로워요", "소통이 원활해요"],
    targetMemberId: MOCK_REVIEW_MEMBER_IDS[1],
    targetNickname: mockMembers[1].nickname,
  },
];

const mockProfiles: MockProfile[] = [
  {
    bio: "프론트엔드 면접에서 구체적인 피드백을 주고받는 것을 좋아해요.",
    interestJobRoles: [{ code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 }],
    memberId: MOCK_REVIEW_MEMBER_IDS[0],
    nickname: mockMembers[0].nickname,
    trust: {
      activityTopPercent: 8,
      noShowCount: 0,
      recentAttendances: ["ATTENDED", "ATTENDED", "ATTENDED"],
      representativeTags: [
        { count: 7, label: "피드백이 구체적이에요" },
        { count: 5, label: "준비가 성실해요" },
      ],
    },
  },
  {
    bio: "백엔드 시스템 설계와 문제 해결 과정을 함께 연습하고 있어요.",
    interestJobRoles: [{ code: "BACKEND", displayName: "백엔드", jobRoleId: 11 }],
    memberId: MOCK_REVIEW_MEMBER_IDS[1],
    nickname: mockMembers[1].nickname,
    trust: {
      activityTopPercent: 15,
      noShowCount: 1,
      recentAttendances: ["ATTENDED", "ATTENDED", "ABSENT"],
      representativeTags: [{ count: 4, label: "질문이 날카로워요" }],
    },
  },
  {
    bio: "프로덕트 디자인 면접을 함께 준비하고 있어요.",
    interestJobRoles: [{ code: "PRODUCT_DESIGN", displayName: "프로덕트 디자인", jobRoleId: 12 }],
    memberId: MOCK_REVIEW_MEMBER_IDS[2],
    nickname: mockMembers[2].nickname,
    trust: {
      activityTopPercent: null,
      noShowCount: 0,
      recentAttendances: ["ATTENDED"],
      representativeTags: [],
    },
  },
  {
    bio: "새로운 면접 동료들과 연습을 시작했어요.",
    interestJobRoles: [],
    memberId: MOCK_REVIEW_MEMBER_IDS[3],
    nickname: mockMembers[3].nickname,
    trust: {
      activityTopPercent: null,
      noShowCount: 0,
      recentAttendances: [],
      representativeTags: [],
    },
  },
];

let reviews = new Map(initialReviews.map((review) => [review.reviewId, structuredClone(review)]));
let nextReviewId = 9103;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isMockReviewRoom(roomId: string) {
  return roomId === MOCK_REVIEW_ROOM_ID;
}

export function isMockReviewId(reviewId: number) {
  return reviewId >= 9101 && reviewId < 9200;
}

export function resetMockReviewState() {
  reviews = new Map(initialReviews.map((review) => [review.reviewId, structuredClone(review)]));
  nextReviewId = 9103;
}

export function getMockReviewRoomDetail(roomId: string): RoomDetailResponse | null {
  if (!isMockReviewRoom(roomId)) return null;

  return {
    data: {
      company: { companyId: 43429, name: "모이면" },
      description: "후기 작성 화면과 기존 후기 수정 흐름을 확인하는 개발용 면접입니다.",
      hostMemberId: MOCK_REVIEW_HOST_ID,
      jobPosting: { jobPostingId: 101, postingName: "Frontend Engineer" },
      jobRole: { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
      method: "ONLINE",
      methodLabel: "온라인",
      participants: [
        { memberId: MOCK_REVIEW_AUTHOR_ID, nickname: "집요한 사슴 06" },
        ...mockMembers,
      ],
      recruit: {
        current: 5,
        max: 5,
        min: 3,
        pendingApplicationCount: 0,
        recruitStatus: "CLOSED",
        recruitStatusLabel: "모집 마감",
      },
      region: null,
      resumePublic: true,
      roomId,
      round: "SECOND",
      roundLabel: "2차",
      schedule: { durationMinutes: 90, startAt: "2026-08-31T19:00:00+09:00" },
      status: "COMPLETED",
      title: "모이면 프론트엔드 2차 면접 회고",
      type: "JOB",
      typeLabel: "직무 면접",
      viewer: {
        hasRemovalHistory: false,
        isHost: false,
        isParticipating: true,
        latestApplicationStatus: "ACCEPTED",
        member: {
          isActive: true,
          participationSlots: { limit: 3, occupied: 1 },
          pendingApplicationQuota: { limit: 3, occupied: 0 },
        },
      },
    },
    result: "SUCCESS",
  };
}

export function getMockReviewTargets(roomId: string): GetReviewTargetsResponse | null {
  if (!isMockReviewRoom(roomId)) return null;

  const targets = mockMembers.map((member) => {
    const review = [...reviews.values()].find(
      ({ targetMemberId }) => targetMemberId === member.memberId,
    );

    return {
      ...member,
      reviewId: review?.reviewId ?? null,
      status: review ? "SUBMITTED" : "WRITABLE",
    };
  });

  return {
    data: {
      submittedCount: targets.filter(({ status }) => status === "SUBMITTED").length,
      targets,
      totalCount: targets.length,
    },
    result: "SUCCESS",
  };
}

export function getMockReview(reviewId: number): GetReviewResponse | null {
  const review = reviews.get(reviewId);

  return review ? { data: structuredClone(review), result: "SUCCESS" } : null;
}

export function getMockReviewProfile(memberId: string): PublicProfileResponse | null {
  const profile = mockProfiles.find((candidate) => candidate.memberId === memberId);

  return profile ? { data: profile, result: "SUCCESS" } : null;
}

export function submitMockReview(roomId: string, body: unknown): SubmitReviewResponse | null {
  if (!isMockReviewRoom(roomId) || !isRecord(body)) return null;

  const targetMemberId = body.targetMemberId;
  const target = mockMembers.find((member) => member.memberId === targetMemberId);
  const tags = body.tags;

  if (
    !target ||
    typeof body.anonymous !== "boolean" ||
    !Array.isArray(tags) ||
    !tags.every((tag) => typeof tag === "string") ||
    (body.content !== null && typeof body.content !== "string")
  ) {
    return null;
  }

  const reviewId = nextReviewId++;
  reviews.set(reviewId, {
    anonymous: body.anonymous,
    content: body.content,
    reviewId,
    roomId,
    tags,
    targetMemberId: target.memberId,
    targetNickname: target.nickname,
  });

  return { data: { reviewId }, result: "SUCCESS" };
}

export function updateMockReview(reviewId: number, body: unknown) {
  const review = reviews.get(reviewId);

  if (!review || !isRecord(body) || !Array.isArray(body.tags)) return false;
  if (
    !body.tags.every((tag) => typeof tag === "string") ||
    (body.content !== null && typeof body.content !== "string")
  ) {
    return false;
  }

  reviews.set(reviewId, { ...review, content: body.content, tags: body.tags });
  return true;
}

export function deleteMockReview(reviewId: number) {
  return reviews.delete(reviewId);
}
