import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getQueryClient: vi.fn(),
  jobRoles: vi.fn(),
  participationSlots: vi.fn(),
  regions: vi.fn(),
  roomFormOptions: vi.fn(),
}));

type QueryOptions = {
  cache?: RequestCache;
  client?: unknown;
};

vi.mock("server-only", () => ({}));
vi.mock("@/api/query-client", () => ({ getQueryClient: mocks.getQueryClient }));
vi.mock("@/api/server-client", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("@/features/interview-create/interview-create-content", () => ({
  InterviewCreateContent: () => null,
}));
vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  jobRolesOptions: (options: QueryOptions = {}) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.jobRoles({ ...options, signal, throwOnError: true });
      return result.data;
    },
    queryKey: ["jobRoles"],
  }),
  participationSlotsOptions: (options: QueryOptions = {}) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.participationSlots({ ...options, signal, throwOnError: true });
      return result.data;
    },
    queryKey: ["participationSlots"],
  }),
  regionsOptions: (options: QueryOptions = {}) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.regions({ ...options, signal, throwOnError: true });
      return result.data;
    },
    queryKey: ["regions"],
  }),
  roomFormOptionsOptions: (options: QueryOptions = {}) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.roomFormOptions({ ...options, signal, throwOnError: true });
      return result.data;
    },
    queryKey: ["roomFormOptions"],
  }),
}));

import NewInterviewPage from "@/app/(site)/interviews/new/page";

const serverClient = { id: "server-client" };

function sdkSuccess(data: unknown) {
  return {
    data: { data, result: "SUCCESS" },
    response: new Response(null, { status: 200 }),
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  mocks.createServerClient.mockResolvedValue(serverClient);
  mocks.getQueryClient.mockReturnValue(queryClient);
  mocks.jobRoles.mockResolvedValue(sdkSuccess({ groups: [] }));
  mocks.participationSlots.mockResolvedValue(sdkSuccess({ limit: 3, occupied: 0, remaining: 3 }));
  mocks.regions.mockResolvedValue(sdkSuccess({ sidos: [] }));
  mocks.roomFormOptions.mockResolvedValue(sdkSuccess({ rounds: [], types: [] }));
});

describe("NewInterviewPage server prefetch", () => {
  it("면접 폼 선택지와 직무 목록을 서버에서 prefetch한다", async () => {
    await NewInterviewPage();

    expect(mocks.roomFormOptions).toHaveBeenCalledWith(
      expect.objectContaining({ cache: "no-store", client: serverClient, throwOnError: true }),
    );
    expect(mocks.jobRoles).toHaveBeenCalledWith(
      expect.objectContaining({ cache: "no-store", client: serverClient, throwOnError: true }),
    );
    expect(mocks.regions).toHaveBeenCalledWith(
      expect.objectContaining({ cache: "no-store", client: serverClient, throwOnError: true }),
    );
    expect(mocks.participationSlots).toHaveBeenCalledWith(
      expect.objectContaining({ cache: "no-store", client: serverClient, throwOnError: true }),
    );
  });

  it("폼 선택지 prefetch 실패를 서버 렌더링에서 전파하지 않는다", async () => {
    const error = { error: { code: "E500", message: "조회 실패" }, result: "ERROR" };
    mocks.roomFormOptions.mockRejectedValue(error);

    await expect(NewInterviewPage()).resolves.toBeDefined();
  });
});
