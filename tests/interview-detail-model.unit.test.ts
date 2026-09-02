import { describe, expect, it } from "vitest";
import {
  getInterviewViewerState,
  type InterviewDetail,
} from "@/features/interview-detail/interview-detail-model";

const eligibleViewer = {
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

function createRoom(overrides: Partial<InterviewDetail> = {}): InterviewDetail {
  return {
    hostMemberId: "019db000-0000-7000-8000-000000001001",
    method: "ONLINE",
    methodLabel: "온라인",
    recruit: {
      current: 3,
      max: 5,
      min: 3,
      pendingApplicationCount: 0,
      recruitStatus: "RECRUITING",
      recruitStatusLabel: "모집 중",
    },
    resumePublic: true,
    roomId: "019db000-0000-7000-8000-000000002001",
    round: "SECOND",
    roundLabel: "2차",
    schedule: { durationMinutes: 90, startAt: "2099-09-01T19:00:00+09:00" },
    status: "RECRUITING",
    title: "백엔드 면접 준비",
    viewer: eligibleViewer,
    ...overrides,
  };
}

describe("면접 상세 조회자 상태", () => {
  it.each([
    ["방장", { ...eligibleViewer, isHost: true, isParticipating: true }, "MANAGE_INTERVIEW"],
    ["참여자", { ...eligibleViewer, isParticipating: true }, "VIEW_INTERVIEW"],
    [
      "신청 대기자",
      { ...eligibleViewer, latestApplicationStatus: "PENDING" },
      "PENDING_APPLICATION",
    ],
  ])("%s 상태를 다음 행동으로 우선 판정한다", (_name, viewer, expectedKind) => {
    expect(getInterviewViewerState(createRoom({ viewer })).kind).toBe(expectedKind);
  });

  it("비로그인이고 정원이 찼으면 로그인 후 대기 신청하도록 안내한다", () => {
    const room = createRoom({
      recruit: {
        current: 5,
        max: 5,
        min: 3,
        pendingApplicationCount: 0,
        recruitStatus: "CLOSED",
        recruitStatusLabel: "모집 마감",
      },
      viewer: null,
    });

    expect(getInterviewViewerState(room)).toEqual({
      applicationMode: "WAITLIST",
      kind: "LOGIN_REQUIRED",
    });
  });

  it("신청 가능한 사용자는 정원이 찬 면접에 대기 신청할 수 있다", () => {
    const room = createRoom({
      recruit: {
        current: 5,
        max: 5,
        min: 3,
        pendingApplicationCount: 0,
        recruitStatus: "CLOSED",
        recruitStatusLabel: "모집 마감",
      },
    });

    expect(getInterviewViewerState(room)).toEqual({
      applicationMode: "WAITLIST",
      kind: "APPLY",
    });
  });

  it.each([
    ["CANCELED", "취소된 면접이에요"],
    ["COMPLETED", "종료된 면접이에요"],
    ["CONFIRMED", "참여자가 확정된 면접이에요"],
    ["IN_PROGRESS", "진행 중인 면접이에요"],
    ["UNKNOWN", "신청할 수 없는 면접이에요"],
  ])("비로그인이어도 %s 면접이면 로그인보다 신청 불가를 먼저 안내한다", (status, message) => {
    expect(getInterviewViewerState(createRoom({ status, viewer: null }))).toEqual({
      kind: "BLOCKED",
      message,
    });
  });

  it("일정이 지났어도 서버 상태가 모집 중이면 신청 가능 상태로 판정한다", () => {
    expect(
      getInterviewViewerState(
        createRoom({
          schedule: { durationMinutes: 90, startAt: "2020-09-01T19:00:00+09:00" },
        }),
      ),
    ).toEqual({
      applicationMode: "REGULAR",
      kind: "APPLY",
    });
  });

  it.each([
    ["조회자 정보 없음", undefined, "신청 가능 여부를 확인할 수 없어요"],
    [
      "알 수 없는 신청 상태",
      { ...eligibleViewer, latestApplicationStatus: "UNKNOWN" as never },
      "신청 상태를 확인할 수 없어요",
    ],
  ])("%s를 비활성 버튼 상태로 판정한다", (_name, viewer, message) => {
    expect(getInterviewViewerState(createRoom({ viewer }))).toEqual({
      kind: "BLOCKED",
      message,
    });
  });

  it.each([
    [
      "반려 이력",
      { ...eligibleViewer, latestApplicationStatus: "REJECTED" },
      "참가 신청이 반려됐어요",
    ],
    ["강퇴 이력", { ...eligibleViewer, hasRemovalHistory: true }, "면접에서 퇴장 처리됐어요"],
    [
      "회원 제재",
      { ...eligibleViewer, member: { ...eligibleViewer.member, isActive: false } },
      "이용이 제한된 계정이에요",
    ],
    [
      "참여 슬롯 소진",
      {
        ...eligibleViewer,
        member: {
          ...eligibleViewer.member,
          participationSlots: { limit: 3, occupied: 3 },
        },
      },
      "참여 면접 한도에 도달했어요",
    ],
    [
      "신청 한도 소진",
      {
        ...eligibleViewer,
        member: {
          ...eligibleViewer.member,
          pendingApplicationQuota: { limit: 3, occupied: 3 },
        },
      },
      "대기 신청 한도에 도달했어요",
    ],
  ])("%s를 상세에서 선제 안내한다", (_name, viewer, message) => {
    expect(getInterviewViewerState(createRoom({ viewer }))).toEqual({
      kind: "BLOCKED",
      message,
    });
  });

  it.each(["WITHDRAWN", "ROOM_CANCELED", "ROOM_CONFIRMED", "SLOT_EXCEEDED", "ACCEPTED"])(
    "최근 신청 상태가 %s여도 현재 사실이 허용하면 재신청할 수 있다",
    (latestApplicationStatus) => {
      expect(
        getInterviewViewerState(
          createRoom({ viewer: { ...eligibleViewer, latestApplicationStatus } }),
        ).kind,
      ).toBe("APPLY");
    },
  );
});
