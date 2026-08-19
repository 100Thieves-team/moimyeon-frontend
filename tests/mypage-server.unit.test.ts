import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getQueryClient: vi.fn(),
  jobRoles: vi.fn(),
  memberMe: vi.fn(),
  publicProfile: vi.fn(),
}));

type QueryOptions = {
  cache?: RequestCache;
  client?: unknown;
  path?: { memberId: string };
};

vi.mock("server-only", () => ({}));
vi.mock("@/api/query-client", () => ({ getQueryClient: mocks.getQueryClient }));
vi.mock("@/api/server-client", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("@/features/mypage/mypage-content", () => ({ MyPageContent: () => null }));
vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  jobRolesOptions: (options: QueryOptions = {}) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.jobRoles({ ...options, signal, throwOnError: true });
      return result.data;
    },
    queryKey: ["jobRoles"],
  }),
  memberMeOptions: (options: QueryOptions = {}) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.memberMe({ ...options, signal, throwOnError: true });
      return result.data;
    },
    queryKey: ["memberMe"],
  }),
  publicProfileOptions: (options: QueryOptions) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.publicProfile({ ...options, signal, throwOnError: true });
      return result.data;
    },
    queryKey: ["publicProfile", options.path?.memberId],
  }),
}));

import MyPage from "@/app/(site)/mypage/page";

const serverClient = { id: "server-client" };
const member = { memberId: "member-1" };
const publicProfile = { nickname: "테스트 사용자" };
const jobRoles = { groups: [{ code: "DEVELOPMENT", roles: [] }] };

function sdkSuccess(data: unknown) {
  return {
    data: { data, result: "SUCCESS" },
    response: new Response(null, { status: 200 }),
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  mocks.createServerClient.mockResolvedValue(serverClient);
  mocks.getQueryClient.mockReturnValue(queryClient);
  mocks.memberMe.mockResolvedValue(sdkSuccess(member));
  mocks.publicProfile.mockResolvedValue(sdkSuccess(publicProfile));
  mocks.jobRoles.mockResolvedValue(sdkSuccess(jobRoles));
});

describe("MyPage server prefetch", () => {
  it("회원과 직무를 먼저 prefetch하고 회원 ID로 공개 프로필을 prefetch한다", async () => {
    await MyPage();

    expect(mocks.memberMe).toHaveBeenCalledWith(
      expect.objectContaining({ cache: "no-store", client: serverClient, throwOnError: true }),
    );
    expect(mocks.jobRoles).toHaveBeenCalledWith(
      expect.objectContaining({ cache: "no-store", client: serverClient, throwOnError: true }),
    );
    expect(mocks.publicProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        cache: "no-store",
        client: serverClient,
        path: { memberId: member.memberId },
        throwOnError: true,
      }),
    );
  });

  it("회원 조회가 실패하면 원본 오류를 전파하고 공개 프로필 조회는 생략한다", async () => {
    const error = {
      error: { code: "E1102", message: "인증이 필요합니다." },
      result: "ERROR",
    };
    mocks.memberMe.mockRejectedValue(error);

    await expect(MyPage()).rejects.toBe(error);
    expect(mocks.jobRoles).toHaveBeenCalledOnce();
    expect(mocks.publicProfile).not.toHaveBeenCalled();
  });
});
