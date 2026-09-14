import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { zGetInterviewOverviewResponse } from "@/api/generated/zod.gen";
import {
  MOCK_PENDING_ROOM_ID,
  resetMockMyInterviews,
} from "@/features/my-interviews/my-interviews-mock";
import { server } from "@/mocks/node";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => resetMockMyInterviews());
afterAll(() => server.close());

const read = async () =>
  zGetInterviewOverviewResponse.parse(
    await (await fetch("https://api.example.test/v1/members/me/rooms")).json(),
  );

describe("내 면접 MSW", () => {
  it("신청을 취소하면 계약에 맞는 목록에서 해당 신청이 사라진다", async () => {
    const before = await read();
    expect(before.data?.pendingApplications).toHaveLength(1);
    const response = await fetch(
      `https://api.example.test/v1/rooms/${MOCK_PENDING_ROOM_ID}/applications/me`,
      { method: "DELETE" },
    );
    expect(response.status).toBe(200);
    const after = await read();
    expect(after.data?.pendingApplications).toHaveLength(0);
    expect(after.data?.participatingRooms).toEqual(before.data?.participatingRooms);
    expect(after.data?.completedRooms).toEqual(before.data?.completedRooms);
  });
});
