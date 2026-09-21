import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getQueryClient: vi.fn(),
  room: vi.fn(),
  applications: vi.fn(),
  reasons: vi.fn(),
  redirect: vi.fn((href: string) => {
    throw new Error(`REDIRECT:${href}`);
  }),
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/api/query-client", () => ({ getQueryClient: mocks.getQueryClient }));
vi.mock("@/api/server-client", () => ({ createServerClient: vi.fn(() => ({})) }));
vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  roomDetailOptions: () => ({ queryKey: ["room"], queryFn: mocks.room }),
  roomApplicationsOptions: () => ({ queryKey: ["applications"], queryFn: mocks.applications }),
  rejectReasonsOptions: () => ({ queryKey: ["reasons"], queryFn: mocks.reasons }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getQueryClient.mockReturnValue(
    new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );
  mocks.room.mockResolvedValue({ data: { viewer: { isHost: true } } });
  mocks.applications.mockResolvedValue({ data: { applications: [] } });
  mocks.reasons.mockResolvedValue({ data: { reasons: [] } });
  mocks.redirect.mockImplementation((href: string) => {
    throw new Error(`REDIRECT:${href}`);
  });
});

describe("방장 신청 관리 서버 라우트", () => {
  it.each([null, { isHost: false, isParticipating: true }, { isHost: false }])(
    "방장이 아닌 사용자는 상세로 돌려보내며 비공개 신청을 조회하지 않는다: %j",
    async (viewer) => {
      mocks.room.mockResolvedValue({ data: { viewer } });
      const { default: Page } = await import("@/app/(site)/interviews/[roomId]/room/page");
      await expect(Page({ params: Promise.resolve({ roomId: "room-1" }) })).rejects.toThrow(
        "REDIRECT:/interviews/room-1",
      );
      expect(mocks.applications).not.toHaveBeenCalled();
      expect(mocks.reasons).not.toHaveBeenCalled();
    },
  );

  it("방장 권한 확인이 끝난 뒤에만 신청 목록을 조회한다", async () => {
    let allow!: (value: unknown) => void;
    mocks.room.mockReturnValue(
      new Promise((resolve) => {
        allow = resolve;
      }),
    );
    const { default: Page } = await import("@/app/(site)/interviews/[roomId]/room/page");
    const rendering = Page({ params: Promise.resolve({ roomId: "room-1" }) });
    await expect.poll(() => mocks.room.mock.calls.length).toBe(1);
    expect(mocks.applications).not.toHaveBeenCalled();
    allow({ data: { viewer: { isHost: true } } });
    await rendering;
    await expect.poll(() => mocks.applications.mock.calls.length).toBe(1);
    expect(mocks.reasons).toHaveBeenCalledOnce();
  });

  it("룸 조회 실패는 오류 경계로 전달하고 신청 목록을 조회하지 않는다", async () => {
    mocks.room.mockRejectedValue(new Error("room unavailable"));
    const { default: Page } = await import("@/app/(site)/interviews/[roomId]/room/page");
    await expect(Page({ params: Promise.resolve({ roomId: "room-1" }) })).rejects.toThrow(
      "room unavailable",
    );
    expect(mocks.applications).not.toHaveBeenCalled();
  });
});
