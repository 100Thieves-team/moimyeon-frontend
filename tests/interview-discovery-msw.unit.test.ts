import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { RoomDetailResponse, RoomsResponse } from "@/api";
import {
  MOCK_INTERVIEW_DETAIL_SCENARIOS,
  MOCK_INTERVIEW_HOST_ID,
} from "@/features/interview-detail/interview-detail-mock";
import { server } from "@/mocks/node";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

describe("interview MSW handlers", () => {
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

  it("상태 카탈로그의 면접 상세와 방장 프로필을 반환한다", async () => {
    const scenario = MOCK_INTERVIEW_DETAIL_SCENARIOS[0];
    const detailResponse = await fetch(`https://api.example.test/v1/rooms/${scenario.room.roomId}`);
    const profileResponse = await fetch(
      `https://api.example.test/v1/members/${MOCK_INTERVIEW_HOST_ID}/profile`,
    );

    expect(await detailResponse.json()).toEqual({ data: scenario.room, result: "SUCCESS" });
    expect(await profileResponse.json()).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({ memberId: MOCK_INTERVIEW_HOST_ID }),
        result: "SUCCESS",
      }),
    );
  });

  it("탐색 목록에서 선택한 면접의 상세를 반환한다", async () => {
    const roomsResponse = await fetch("https://api.example.test/v1/rooms?sort=SCHEDULE&size=6");
    const rooms = (await roomsResponse.json()) as RoomsResponse;
    const room = rooms.data?.rooms[0];

    expect(room).toBeDefined();

    const detailResponse = await fetch(`https://api.example.test/v1/rooms/${room?.roomId}`);
    const detail = (await detailResponse.json()) as RoomDetailResponse;

    expect(detail).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          roomId: room?.roomId,
          title: room?.title,
        }),
        result: "SUCCESS",
      }),
    );
  });
});
