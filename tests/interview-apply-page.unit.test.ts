import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getQueryClient: vi.fn(),
  redirect: vi.fn((href: string) => {
    throw new Error(`REDIRECT:${href}`);
  }),
  resumes: vi.fn(),
  roomDetail: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/api/query-client", () => ({ getQueryClient: mocks.getQueryClient }));
vi.mock("@/api/server-client", () => ({ createServerClient: vi.fn(() => ({})) }));
vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  resumesOptions: () => ({
    queryFn: () => mocks.resumes(),
    queryKey: ["resumes"],
  }),
  roomDetailOptions: ({ path }: { path: { roomId: string } }) => ({
    queryFn: () => mocks.roomDetail(path.roomId),
    queryKey: ["roomDetail", path.roomId],
  }),
}));

const roomId = "019db000-0000-7000-8000-000000002001";
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
const room = {
  hostMemberId: "host-id",
  method: "ONLINE",
  methodLabel: "온라인",
  recruit: {
    current: 2,
    max: 5,
    min: 2,
    pendingApplicationCount: 0,
    recruitStatus: "RECRUITING",
    recruitStatusLabel: "모집 중",
  },
  resumePublic: false,
  roomId,
  round: "FIRST",
  roundLabel: "1차",
  schedule: { durationMinutes: 60, startAt: "2099-09-01T19:00:00+09:00" },
  status: "RECRUITING",
  title: "프론트엔드 면접",
  viewer: eligibleViewer,
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getQueryClient.mockReturnValue(
    new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );
  mocks.roomDetail.mockResolvedValue({ data: room, result: "SUCCESS" });
  mocks.resumes.mockResolvedValue({ data: { maxCount: 10, resumes: [] }, result: "SUCCESS" });
});

describe("참가 신청 서버 라우트", () => {
  it("비로그인 사용자는 면접 상세로 돌려보낸다", async () => {
    mocks.roomDetail.mockResolvedValue({ data: { ...room, viewer: null }, result: "SUCCESS" });
    const { default: InterviewApplyPage } =
      await import("@/app/(site)/interviews/[roomId]/apply/page");

    await expect(InterviewApplyPage({ params: Promise.resolve({ roomId }) })).rejects.toThrow(
      `REDIRECT:/interviews/${roomId}`,
    );
    expect(mocks.resumes).not.toHaveBeenCalled();
  });

  it("이미 참여 중인 사용자는 면접 상세로 돌려보낸다", async () => {
    mocks.roomDetail.mockResolvedValue({
      data: {
        ...room,
        viewer: { ...eligibleViewer, isParticipating: true },
      },
      result: "SUCCESS",
    });
    const { default: InterviewApplyPage } =
      await import("@/app/(site)/interviews/[roomId]/apply/page");

    await expect(InterviewApplyPage({ params: Promise.resolve({ roomId }) })).rejects.toThrow(
      `REDIRECT:/interviews/${roomId}`,
    );
    expect(mocks.resumes).not.toHaveBeenCalled();
  });

  it("신청 가능한 사용자는 룸 상세를 확인한 뒤 이력서 목록을 prefetch한다", async () => {
    const { default: InterviewApplyPage } =
      await import("@/app/(site)/interviews/[roomId]/apply/page");

    await InterviewApplyPage({ params: Promise.resolve({ roomId }) });

    expect(mocks.roomDetail).toHaveBeenCalledWith(roomId);
    await expect.poll(() => mocks.resumes.mock.calls.length).toBe(1);
  });
});
