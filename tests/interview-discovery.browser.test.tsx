import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { InterviewDiscoveryContent } from "@/features/interview-discovery/interview-discovery-content";
import {
  DEFAULT_DISCOVERY_FILTERS,
  type InterviewDiscoveryFilters,
} from "@/features/interview-discovery/interview-discovery-model";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  rooms: vi.fn(),
  searchJobPostings: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  jobRolesOptions: () => ({
    queryFn: async () => ({
      data: {
        groups: [
          {
            code: "DEVELOPMENT",
            displayName: "개발",
            roles: [{ code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 }],
          },
        ],
      },
      result: "SUCCESS",
    }),
    queryKey: ["jobRoles"],
  }),
  regionsOptions: () => ({
    queryFn: async () => ({
      data: {
        sidos: [
          {
            name: "서울특별시",
            shortName: "서울",
            sigungus: [{ name: "강남구", sigunguId: 1 }],
          },
          {
            name: "부산광역시",
            shortName: "부산",
            sigungus: [{ name: "해운대구", sigunguId: 2 }],
          },
        ],
      },
      result: "SUCCESS",
    }),
    queryKey: ["regions"],
  }),
  roomFormOptionsOptions: () => ({
    queryFn: async () => ({
      data: {
        durations: [],
        methods: [
          { code: "ONLINE", hint: "화상", label: "온라인" },
          { code: "OFFLINE", hint: "대면", label: "오프라인" },
        ],
        rounds: [
          { code: "FIRST", label: "1차" },
          { code: "SECOND", label: "2차" },
        ],
        types: [],
      },
      result: "SUCCESS",
    }),
    queryKey: ["roomFormOptions"],
  }),
  roomsInfiniteOptions: (options: { query: Record<string, string> }) => ({
    queryFn: async ({ pageParam }: { pageParam: string | { query?: Record<string, string> } }) => {
      const pageQuery =
        typeof pageParam === "string" ? { cursor: pageParam } : (pageParam.query ?? {});
      return mocks.rooms({ ...options.query, ...pageQuery });
    },
    queryKey: ["rooms", options.query],
  }),
  searchJobPostingsOptions: (options: { query: { query: string } }) => ({
    queryFn: async () => mocks.searchJobPostings(options.query.query),
    queryKey: ["searchJobPostings", options.query.query],
  }),
  searchJobPostingsQueryKey: () => ["searchJobPostings"],
}));

function room(roomId: string, title: string) {
  return {
    company: { companyId: 1, name: "네이버" },
    jobPosting: { jobPostingId: 11, postingName: "프론트엔드 개발자" },
    jobRole: { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
    method: "ONLINE",
    methodLabel: "온라인",
    recruit: {
      current: 2,
      max: 4,
      pending: 0,
      recruitStatus: "RECRUITING",
      recruitStatusLabel: "모집 중",
    },
    roomId,
    round: "FIRST",
    roundLabel: "1차",
    schedule: { date: "2026-09-01", durationMinutes: 60, startTime: "19:00" },
    title,
    viewer: { actions: [], relation: "ANONYMOUS" },
  };
}

function roomsResponse(rooms: ReturnType<typeof room>[], nextCursor: string | null) {
  return {
    data: { nextCursor, rooms, sort: "SCHEDULE", totalCount: rooms.length },
    result: "SUCCESS",
  };
}

function discoveryContent(queryClient: QueryClient, filters: InterviewDiscoveryFilters) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<p>불러오는 중</p>}>
        <InterviewDiscoveryContent filters={filters} />
      </Suspense>
    </QueryClientProvider>
  );
}

async function renderDiscovery() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const renderResult = await render(discoveryContent(queryClient, DEFAULT_DISCOVERY_FILTERS));

  return {
    rerenderWithFilters: (filters: InterviewDiscoveryFilters) =>
      renderResult.rerender(discoveryContent(queryClient, filters)),
  };
}

beforeEach(async () => {
  vi.resetAllMocks();
  await page.viewport(800, 900);
  window.history.replaceState(null, "", "/");
  mocks.rooms.mockResolvedValue(roomsResponse([room("room-1", "첫 번째 면접")], null));
  mocks.searchJobPostings.mockResolvedValue({
    data: {
      companies: [{ companyId: 1, name: "네이버" }],
      jobPostings: [
        {
          company: { companyId: 1, name: "네이버" },
          jobPostingId: 11,
          postingName: "프론트엔드 개발자",
          verified: true,
        },
      ],
      query: "네이버",
    },
    result: "SUCCESS",
  });
});

describe("InterviewDiscoveryContent", () => {
  it("지역 Dialog에서 선택을 완료하면 시군구 ID로 목록을 다시 조회한다", async () => {
    await page.viewport(1200, 900);
    const discovery = await renderDiscovery();

    await userEvent.click(page.getByRole("button", { name: "지역을 선택해 주세요" }));
    await userEvent.click(page.getByRole("tab", { name: "부산광역시" }));
    await userEvent.click(page.getByRole("button", { name: "해운대구" }));
    await userEvent.click(page.getByRole("button", { name: "선택 완료" }));

    await vi.waitFor(() => expect(window.location.search).toBe("?sigunguId=2&sort=SCHEDULE"));
    await discovery.rerenderWithFilters({ ...DEFAULT_DISCOVERY_FILTERS, sigunguId: "2" });

    await vi.waitFor(() => {
      expect(mocks.rooms).toHaveBeenCalledWith(
        expect.objectContaining({ sigunguId: "2", sort: "SCHEDULE" }),
      );
    });
  });

  it("모바일 필터에서는 지역 선택 후 적용해야 URL을 변경한다", async () => {
    await renderDiscovery();

    await userEvent.click(page.getByRole("button", { name: "필터" }));
    await userEvent.click(page.getByRole("button", { name: "지역을 선택해 주세요" }));
    await userEvent.click(page.getByRole("button", { name: "강남구" }));
    await userEvent.click(page.getByRole("button", { name: "선택 완료" }));

    expect(window.location.search).toBe("");

    await userEvent.click(page.getByRole("button", { name: "적용" }));
    await vi.waitFor(() => expect(window.location.search).toBe("?sigunguId=1&sort=SCHEDULE"));
  });

  it("통합 검색에서 회사를 선택하면 회사 ID로 목록을 다시 조회한다", async () => {
    const discovery = await renderDiscovery();

    await userEvent.click(page.getByRole("button", { name: "필터" }));
    const searchInput = page.getByRole("combobox", { name: "회사 또는 채용 공고 검색" });
    await userEvent.fill(searchInput, "네이버");
    const companyOption = page.getByRole("option", { name: "회사 네이버" });
    await expect.element(companyOption).toBeVisible();
    await userEvent.click(companyOption);
    await userEvent.click(page.getByRole("button", { name: "적용" }));

    await vi.waitFor(() => expect(window.location.search).toBe("?companyId=1&sort=SCHEDULE"));
    await discovery.rerenderWithFilters({ ...DEFAULT_DISCOVERY_FILTERS, companyId: "1" });

    await vi.waitFor(() => {
      expect(mocks.rooms).toHaveBeenCalledWith(
        expect.objectContaining({ companyId: "1", sort: "SCHEDULE" }),
      );
    });
  });

  it("모바일 필터에서 공고를 선택하면 선택값과 Dialog를 유지한다", async () => {
    await renderDiscovery();

    await userEvent.click(page.getByRole("button", { name: "필터" }));
    const searchInput = page.getByRole("combobox", { name: "회사 또는 채용 공고 검색" });
    await userEvent.fill(searchInput, "네이버");
    const postingOption = page.getByRole("option", {
      name: "공고 프론트엔드 개발자 네이버",
    });
    await expect.element(postingOption).toBeVisible();
    await userEvent.click(postingOption);

    await expect.element(searchInput).toHaveValue("[네이버] 프론트엔드 개발자");
    await expect.element(page.getByRole("button", { name: "적용" })).toBeVisible();

    await userEvent.click(searchInput);
    await expect.element(postingOption).toBeVisible();
    await userEvent.keyboard("{Escape}");

    await userEvent.click(page.getByRole("button", { name: "적용" }));
    await vi.waitFor(() => expect(window.location.search).toBe("?jobPostingId=11&sort=SCHEDULE"));
  });

  it("목록 끝이 보이면 React Query로 다음 커서 페이지를 이어서 표시한다", async () => {
    class VisibleIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "0px";
      readonly thresholds = [0];

      constructor(private readonly callback: IntersectionObserverCallback) {}

      disconnect() {}
      observe() {
        queueMicrotask(() =>
          this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this),
        );
      }
      takeRecords() {
        return [];
      }
      unobserve() {}
    }

    vi.stubGlobal("IntersectionObserver", VisibleIntersectionObserver);
    mocks.rooms.mockImplementation((query: { cursor?: string }) =>
      query.cursor === "next-1"
        ? Promise.resolve(roomsResponse([room("room-2", "두 번째 면접")], null))
        : Promise.resolve(roomsResponse([room("room-1", "첫 번째 면접")], "next-1")),
    );

    await renderDiscovery();

    await expect.element(page.getByRole("heading", { name: "첫 번째 면접" })).toBeVisible();
    await expect.element(page.getByRole("heading", { name: "두 번째 면접" })).toBeVisible();
    expect(mocks.rooms).toHaveBeenCalledWith(expect.objectContaining({ cursor: "next-1" }));
  });
});
