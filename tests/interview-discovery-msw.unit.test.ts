import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { RoomsResponse } from "@/api";
import { server } from "@/mocks/node";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

describe("interview discovery MSW handlers", () => {
  it("다음 커서로 요청하면 두 번째 면접 카드 페이지를 반환한다", async () => {
    const firstResponse = await fetch("https://api.example.test/v1/rooms?sort=SCHEDULE&size=6");
    const firstPage = (await firstResponse.json()) as RoomsResponse;
    const nextCursor = firstPage.data?.nextCursor;

    expect(firstPage.data?.rooms).toHaveLength(6);
    expect(nextCursor).toBe("mock-page-2");

    const secondResponse = await fetch(
      `https://api.example.test/v1/rooms?sort=SCHEDULE&size=6&cursor=${nextCursor}`,
    );
    const secondPage = (await secondResponse.json()) as RoomsResponse;

    expect(secondPage.data?.rooms).toHaveLength(4);
    expect(secondPage.data?.nextCursor).toBeNull();
  });

  it("회사 필터가 있으면 해당 회사의 면접 카드만 반환한다", async () => {
    const response = await fetch("https://api.example.test/v1/rooms?companyId=43429&sort=SCHEDULE");
    const body = (await response.json()) as RoomsResponse;

    expect(body.data?.rooms).toHaveLength(1);
    expect(body.data?.rooms[0]?.company?.name).toBe("네이버");
  });
});
