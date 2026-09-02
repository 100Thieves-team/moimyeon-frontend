import type { PublicProfileResponse, RoomDetailResponse } from "@/api";
import { getMockInterviewRoom } from "@/features/interview-discovery/interview-discovery-mock";

type InterviewDetail = NonNullable<RoomDetailResponse["data"]>;
type InterviewViewer = NonNullable<InterviewDetail["viewer"]>;

export const MOCK_INTERVIEW_HOST_ID = "00000000-0000-4000-8000-000000000001";

const futureSchedule = {
  durationMinutes: 90,
  startAt: "2099-09-01T19:00:00+09:00",
};

const regularRecruit = {
  current: 3,
  max: 5,
  min: 3,
  pendingApplicationCount: 1,
  recruitStatus: "RECRUITING",
  recruitStatusLabel: "모집 중",
};

const waitlistRecruit = {
  ...regularRecruit,
  current: 5,
  pendingApplicationCount: 2,
  recruitStatus: "CLOSED",
  recruitStatusLabel: "모집 마감",
};

const eligibleViewer: InterviewViewer = {
  hasRemovalHistory: false,
  isHost: false,
  isParticipating: false,
  latestApplicationStatus: null,
  member: {
    isActive: true,
    participationSlots: { limit: 3, occupied: 0 },
    pendingApplicationQuota: { limit: 3, occupied: 0 },
  },
};

function createViewer(
  overrides: Partial<InterviewViewer> & {
    member?: Partial<NonNullable<InterviewViewer["member"]>>;
  } = {},
): InterviewViewer {
  return {
    ...eligibleViewer,
    ...overrides,
    member: overrides.member
      ? { ...eligibleViewer.member, ...overrides.member }
      : eligibleViewer.member,
  };
}

export type MockInterviewDetailCategory =
  | "신청 CTA"
  | "나와의 관계"
  | "면접 상태"
  | "신청 제한"
  | "응답 이상";

export type MockInterviewDetailScenario = {
  category: MockInterviewDetailCategory;
  description: string;
  key: string;
  label: string;
  room: InterviewDetail;
};

function createScenario(
  index: number,
  scenario: Omit<MockInterviewDetailScenario, "room"> & {
    room?: Partial<InterviewDetail>;
  },
): MockInterviewDetailScenario {
  const roomId = `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`;

  return {
    category: scenario.category,
    description: scenario.description,
    key: scenario.key,
    label: scenario.label,
    room: {
      company: { companyId: 43429, name: "모이면" },
      description: scenario.description,
      hostMemberId: MOCK_INTERVIEW_HOST_ID,
      jobPosting: { jobPostingId: 101, postingName: "면접 상세 UI 상태 카탈로그" },
      jobRole: { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
      method: "ONLINE",
      methodLabel: "온라인",
      recruit: regularRecruit,
      resumePublic: true,
      roomId,
      round: "FIRST",
      roundLabel: "1차",
      schedule: futureSchedule,
      status: "RECRUITING",
      title: scenario.label,
      type: "JOB",
      typeLabel: "직무 면접",
      viewer: eligibleViewer,
      ...scenario.room,
    },
  };
}

export const MOCK_INTERVIEW_DETAIL_SCENARIOS = [
  createScenario(101, {
    category: "신청 CTA",
    description: "로그인하지 않은 사용자가 참가 신청 전 로그인을 안내받는 상태입니다.",
    key: "anonymous-regular",
    label: "비로그인 · 참가 신청",
    room: { viewer: null },
  }),
  createScenario(102, {
    category: "신청 CTA",
    description: "로그인하지 않은 사용자가 정원이 찬 면접에 대기 신청하는 상태입니다.",
    key: "anonymous-waitlist",
    label: "비로그인 · 대기 신청",
    room: { recruit: waitlistRecruit, viewer: null },
  }),
  createScenario(103, {
    category: "신청 CTA",
    description: "신청 가능한 사용자가 일반 참가 신청을 시작하는 상태입니다.",
    key: "eligible-regular",
    label: "참가 신청 가능",
  }),
  createScenario(104, {
    category: "신청 CTA",
    description: "정원이 찼지만 서버 정책에 따라 대기 신청할 수 있는 상태입니다.",
    key: "eligible-waitlist",
    label: "대기 신청 가능",
    room: { recruit: waitlistRecruit },
  }),
  createScenario(105, {
    category: "나와의 관계",
    description: "내가 만든 면접이라 관리 화면으로 이동할 수 있는 상태입니다.",
    key: "host",
    label: "내가 만든 면접",
    room: { viewer: createViewer({ isHost: true, isParticipating: true }) },
  }),
  createScenario(106, {
    category: "나와의 관계",
    description: "참여가 확정되어 내 면접 화면으로 이동할 수 있는 상태입니다.",
    key: "participant",
    label: "참여 중인 면접",
    room: {
      viewer: createViewer({ isParticipating: true, latestApplicationStatus: "ACCEPTED" }),
    },
  }),
  createScenario(107, {
    category: "나와의 관계",
    description: "방장의 수락을 기다리며 신청을 취소할 수 있는 상태입니다.",
    key: "pending",
    label: "참가 신청 수락 대기",
    room: { viewer: createViewer({ latestApplicationStatus: "PENDING" }) },
  }),
  ...(["CANCELED", "COMPLETED", "CONFIRMED", "IN_PROGRESS"] as const).map((status, offset) =>
    createScenario(108 + offset, {
      category: "면접 상태",
      description: {
        CANCELED: "취소되어 더 이상 참가 신청할 수 없는 면접입니다.",
        COMPLETED: "이미 종료되어 참가 신청할 수 없는 면접입니다.",
        CONFIRMED: "참여자가 확정되어 신규 신청할 수 없는 면접입니다.",
        IN_PROGRESS: "현재 진행 중이라 참가 신청할 수 없는 면접입니다.",
      }[status],
      key: status.toLowerCase(),
      label: {
        CANCELED: "취소된 면접",
        COMPLETED: "종료된 면접",
        CONFIRMED: "참여자가 확정된 면접",
        IN_PROGRESS: "진행 중인 면접",
      }[status],
      room: { status },
    }),
  ),
  createScenario(113, {
    category: "신청 제한",
    description: "이 면접에서 이전 참가 신청이 반려되어 재신청할 수 없는 상태입니다.",
    key: "rejected",
    label: "참가 신청 반려",
    room: { viewer: createViewer({ latestApplicationStatus: "REJECTED" }) },
  }),
  createScenario(114, {
    category: "신청 제한",
    description: "이 면접에서 퇴장 처리된 이력이 있어 재신청할 수 없는 상태입니다.",
    key: "removed",
    label: "면접 퇴장 이력",
    room: {
      viewer: createViewer({ hasRemovalHistory: true, latestApplicationStatus: "ACCEPTED" }),
    },
  }),
  createScenario(115, {
    category: "신청 제한",
    description: "현재 계정이 이용 제한 상태라 참가 신청할 수 없습니다.",
    key: "inactive-member",
    label: "이용 제한 계정",
    room: { viewer: createViewer({ member: { isActive: false } }) },
  }),
  createScenario(116, {
    category: "신청 제한",
    description: "참여 가능한 면접 슬롯을 모두 사용한 상태입니다.",
    key: "participation-limit",
    label: "참여 면접 한도 도달",
    room: { viewer: createViewer({ member: { participationSlots: { limit: 3, occupied: 3 } } }) },
  }),
  createScenario(117, {
    category: "신청 제한",
    description: "처리 대기 중인 참가 신청 한도를 모두 사용한 상태입니다.",
    key: "application-limit",
    label: "대기 신청 한도 도달",
    room: {
      viewer: createViewer({ member: { pendingApplicationQuota: { limit: 3, occupied: 3 } } }),
    },
  }),
  createScenario(118, {
    category: "응답 이상",
    description: "상세 응답에 모집 정보가 없어 신청 상태를 구성할 수 없는 경우입니다.",
    key: "missing-recruit",
    label: "모집 정보 없음",
    room: { recruit: undefined },
  }),
  createScenario(119, {
    category: "응답 이상",
    description: "상세 응답에서 조회자 정보가 누락된 경우입니다.",
    key: "missing-viewer",
    label: "조회자 정보 없음",
    room: { viewer: undefined },
  }),
  createScenario(120, {
    category: "응답 이상",
    description: "서버 계약에 없는 최근 신청 상태를 받은 경우입니다.",
    key: "unknown-application-status",
    label: "알 수 없는 신청 상태",
    room: { viewer: createViewer({ latestApplicationStatus: "UNKNOWN" }) },
  }),
] satisfies MockInterviewDetailScenario[];

export function getMockInterviewDetail(roomId: string): RoomDetailResponse | null {
  const scenario = MOCK_INTERVIEW_DETAIL_SCENARIOS.find(({ room }) => room.roomId === roomId);

  if (scenario) return { data: scenario.room, result: "SUCCESS" };

  const discoveryRoom = getMockInterviewRoom(roomId);
  if (!discoveryRoom) return null;

  const schedule = discoveryRoom.schedule;
  const recruit = discoveryRoom.recruit;
  const viewer = discoveryRoom.viewer;

  return {
    data: {
      company: discoveryRoom.company,
      description: `${discoveryRoom.title} 참여자를 모집하고 있어요.`,
      hostMemberId: MOCK_INTERVIEW_HOST_ID,
      jobPosting: discoveryRoom.jobPosting,
      jobRole: discoveryRoom.jobRole,
      method: discoveryRoom.method,
      methodLabel: discoveryRoom.methodLabel,
      recruit: recruit
        ? {
            current: recruit.current,
            max: recruit.max,
            min: Math.min(3, recruit.max),
            pendingApplicationCount: recruit.pending,
            recruitStatus: recruit.recruitStatus,
            recruitStatusLabel: recruit.recruitStatusLabel,
          }
        : undefined,
      region: discoveryRoom.region,
      resumePublic: true,
      roomId: discoveryRoom.roomId,
      round: discoveryRoom.round,
      roundLabel: discoveryRoom.roundLabel,
      schedule: schedule
        ? {
            durationMinutes: schedule.durationMinutes,
            startAt: `${schedule.date}T${schedule.startTime}:00+09:00`,
          }
        : null,
      status: "RECRUITING",
      title: discoveryRoom.title,
      type: "JOB",
      typeLabel: "직무 면접",
      viewer:
        viewer === null
          ? null
          : viewer
            ? {
                ...viewer,
                member: eligibleViewer.member,
              }
            : undefined,
    },
    result: "SUCCESS",
  };
}

export function getMockInterviewHostProfile(memberId: string): PublicProfileResponse | null {
  if (memberId !== MOCK_INTERVIEW_HOST_ID) return null;

  return {
    data: {
      bio: "면접 상세 UI 상태를 함께 점검하는 개발용 방장 프로필입니다.",
      interestJobRoles: [{ code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 }],
      memberId,
      nickname: "꼼꼼한 여우 12",
      trust: {
        activityTopPercent: 10,
        noShowCount: 0,
        recentAttendances: ["ATTENDED", "ATTENDED", "ABSENT"],
        representativeTags: [{ count: 4, label: "피드백이 구체적이에요" }],
      },
    },
    result: "SUCCESS",
  };
}
