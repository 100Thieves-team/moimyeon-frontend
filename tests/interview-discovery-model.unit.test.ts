import { describe, expect, it, vi } from "vitest";

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  roomsInfiniteOptions: () => ({
    queryFn: async () => ({ data: { rooms: [], sort: "SCHEDULE", totalCount: 0 } }),
    queryKey: ["rooms"],
  }),
}));

import {
  interviewDiscoveryFiltersSchema,
  toRoomsQuery,
  writeInterviewDiscoveryFilters,
} from "@/features/interview-discovery/interview-discovery-model";

describe("interview discovery URL filters", () => {
  it("회사와 공고가 함께 있으면 공고를 우선해 룸 조회 조건을 만든다", () => {
    const filters = interviewDiscoveryFiltersSchema.parse({
      companyId: "10",
      jobPostingId: "20",
      jobRoleId: "30",
      method: "OFFLINE",
      round: "SECOND",
      sigunguId: "40",
      sort: "RECENT",
    });

    expect(filters).toEqual({
      companyId: null,
      jobPostingId: "20",
      jobRoleId: "30",
      method: "OFFLINE",
      round: "SECOND",
      sigunguId: "40",
      sort: "RECENT",
    });
    expect(toRoomsQuery(filters)).toEqual({
      jobPostingId: "20",
      jobRoleId: "30",
      method: "OFFLINE",
      round: "SECOND",
      sigunguId: "40",
      size: "20",
      sort: "RECENT",
    });
  });

  it("잘못된 값은 제거하고 기본 정렬은 URL에 표시한다", () => {
    const filters = interviewDiscoveryFiltersSchema.parse({
      companyId: "-1",
      method: "PHONE",
      round: "FINAL",
      sort: "UNKNOWN",
    });
    const nextSearchParams = writeInterviewDiscoveryFilters(
      new URLSearchParams("campaign=summer&targetLabel=ignored"),
      filters,
    );

    expect(filters.sort).toBe("SCHEDULE");
    expect(nextSearchParams.toString()).toBe("campaign=summer&sort=SCHEDULE");
  });

  it("중복된 Search Param은 첫 번째 값을 사용한다", () => {
    const filters = interviewDiscoveryFiltersSchema.parse({
      companyId: ["10", "20"],
      sort: ["RECENT", "SCHEDULE"],
    });

    expect(filters.companyId).toBe("10");
    expect(filters.sort).toBe("RECENT");
  });
});
