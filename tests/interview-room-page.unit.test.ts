import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getQueryClient: vi.fn(),
  room: vi.fn(),
  applications: vi.fn(),
  reasons: vi.fn(),
  participants: vi.fn(),
  member: vi.fn(),
}));
vi.mock("@/features/auth/current-member-server", () => ({ getCurrentMemberState: mocks.member }));
vi.mock("@/api/query-client", () => ({ getQueryClient: mocks.getQueryClient }));
vi.mock("@/api/server-client", () => ({ createServerClient: vi.fn(() => ({})) }));
vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  roomDetailOptions: () => ({ queryKey: ["room"], queryFn: mocks.room }),
  roomApplicationsOptions: () => ({ queryKey: ["applications"], queryFn: mocks.applications }),
  roomParticipantsOptions: () => ({ queryKey: ["participants"], queryFn: mocks.participants }),
  rejectReasonsOptions: () => ({ queryKey: ["reasons"], queryFn: mocks.reasons }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getQueryClient.mockReturnValue(
    new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );
  mocks.member.mockResolvedValue({ status: "authenticated", member: { memberId: "me" } });
  mocks.participants.mockResolvedValue({ data: { participants: [] } });
  mocks.room.mockResolvedValue({ data: { viewer: { isHost: true } } });
  mocks.applications.mockResolvedValue({ data: { applications: [] } });
  mocks.reasons.mockResolvedValue({ data: { reasons: [] } });
});

describe("통합 면접 상세 서버 라우트", () => {
  it.each([null, { isHost: false, isParticipating: false }, { isHost: false }])(
    "비참여자는 상세를 보고 비공개 목록을 조회하지 않는다: %j",
    async (viewer) => {
      mocks.room.mockResolvedValue({ data: { viewer } });
      const { default: Page } = await import("@/app/(site)/interviews/[roomId]/page");
      await Page({ params: Promise.resolve({ roomId: "room-1" }) });
      expect(mocks.applications).not.toHaveBeenCalled();
      expect(mocks.reasons).not.toHaveBeenCalled();
      expect(mocks.participants).not.toHaveBeenCalled();
    },
  );

  it("방장 권한 확인이 끝나면 신청 목록과 참여자 명부를 미리 조회한다", async () => {
    let allow!: (value: unknown) => void;
    mocks.room.mockReturnValue(
      new Promise((resolve) => {
        allow = resolve;
      }),
    );
    const { default: Page } = await import("@/app/(site)/interviews/[roomId]/page");
    const rendering = Page({ params: Promise.resolve({ roomId: "room-1" }) });
    await expect.poll(() => mocks.room.mock.calls.length).toBe(1);
    expect(mocks.applications).not.toHaveBeenCalled();
    allow({ data: { viewer: { isHost: true } } });
    await rendering;
    await expect.poll(() => mocks.applications.mock.calls.length).toBe(1);
    expect(mocks.reasons).toHaveBeenCalledOnce();
    expect(mocks.participants).toHaveBeenCalledOnce();
  });

  it("룸 조회 실패는 오류 경계로 전달하고 신청 목록을 조회하지 않는다", async () => {
    mocks.room.mockRejectedValue(new Error("room unavailable"));
    const { default: Page } = await import("@/app/(site)/interviews/[roomId]/page");
    await expect(Page({ params: Promise.resolve({ roomId: "room-1" }) })).rejects.toThrow(
      "room unavailable",
    );
    expect(mocks.applications).not.toHaveBeenCalled();
  });

  it("일반 참여자는 명부를 조회하고 방장 전용 신청 목록을 조회하지 않는다", async () => {
    mocks.room.mockResolvedValue({ data: { viewer: { isHost: false, isParticipating: true } } });
    const { default: Page } = await import("@/app/(site)/interviews/[roomId]/page");
    await Page({ params: Promise.resolve({ roomId: "room-1" }) });
    await expect.poll(() => mocks.participants.mock.calls.length).toBe(1);
    expect(mocks.applications).not.toHaveBeenCalled();
    expect(mocks.reasons).not.toHaveBeenCalled();
  });
  it("회원 인증이 만료되면 공개 정보만 조회한다", async () => {
    mocks.member.mockResolvedValue({ status: "anonymous" });
    const { default: Page } = await import("@/app/(site)/interviews/[roomId]/page");
    await Page({ params: Promise.resolve({ roomId: "room-1" }) });
    expect(mocks.participants).not.toHaveBeenCalled();
    expect(mocks.applications).not.toHaveBeenCalled();
  });
});
