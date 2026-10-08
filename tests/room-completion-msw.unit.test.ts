import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  zCompleteRoomProgressResponse,
  zGetInterviewOverviewResponse,
  zGetMyAttendanceResponse,
  zGetReviewOverviewResponse,
  zRoomDetailResponse,
  zRoomParticipantsResponse,
} from "@/api/generated/zod.gen";
import { MOCK_INTERVIEW_HOST_ID } from "@/features/interview-detail/interview-detail-mock";
import { resetMockReviewState } from "@/features/review/review-mock";
import { server } from "@/mocks/node";
import { resetMockConfirmation } from "@/mocks/room-confirmation";

const baseUrl = "https://api.example.test";
const roomId = "00000000-0000-4000-8000-000000000208";
const roomUrl = `${baseUrl}/v1/rooms/${roomId}`;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  resetMockConfirmation();
  resetMockReviewState();
});
afterAll(() => server.close());

async function readParticipants() {
  return zRoomParticipantsResponse.parse(await (await fetch(`${roomUrl}/participants`)).json())
    .data!;
}

function complete(attendances: { memberId: string; status: string }[]) {
  return fetch(`${roomUrl}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attendances }),
  });
}

async function readOverview() {
  return zGetInterviewOverviewResponse.parse(
    await (await fetch(`${baseUrl}/v1/members/me/rooms`)).json(),
  ).data!;
}

describe("면접 완료 MSW 흐름", () => {
  it("이탈자까지 출석을 확정하면 목록과 후기 대상을 갱신하고 동일 요청은 성공으로 재응답한다", async () => {
    const roster = await readParticipants();
    expect(roster.participants).toHaveLength(3);
    expect(roster.confirmedParticipants).toHaveLength(4);
    const departed = roster.confirmedParticipants.find(
      ({ memberId }) =>
        !roster.participants.some((participant) => participant.memberId === memberId),
    )!;
    const attendances = roster.confirmedParticipants.map(({ memberId }) => ({
      memberId,
      status: memberId === departed.memberId ? "ABSENT" : "ATTENDED",
    }));
    const incomplete = await complete(
      attendances.filter(({ memberId }) => memberId !== departed.memberId),
    );
    expect(incomplete.status).toBe(400);
    expect(await incomplete.json()).toMatchObject({ error: { code: "E1706" } });

    const response = await complete(attendances);
    expect(response.status).toBe(200);
    const saved = zCompleteRoomProgressResponse.parse(await response.json());
    expect(saved.data?.status).toBe("COMPLETED");
    expect(saved.data?.attendances).toContainEqual({ ...departed, status: "ABSENT" });
    const overview = await readOverview();
    expect(overview.participatingRooms.some(({ room }) => room.roomId === roomId)).toBe(false);
    expect(overview.completedRooms.find(({ room }) => room.roomId === roomId)?.reviewStatus).toBe(
      "WRITABLE",
    );
    const review = zGetReviewOverviewResponse.parse(
      await (await fetch(`${roomUrl}/reviews/overview`)).json(),
    ).data!;
    expect(review.targets).toHaveLength(2);
    expect(review.targets.some(({ memberId }) => memberId === departed.memberId)).toBe(false);

    const replay = await complete(attendances.toReversed());
    expect(replay.status).toBe(200);
    expect(zCompleteRoomProgressResponse.parse(await replay.json()).data?.status).toBe("COMPLETED");
    const conflict = await complete(
      attendances.map((attendance) => ({ ...attendance, status: "ABSENT" })),
    );
    expect(conflict.status).toBe(409);
    expect(await conflict.json()).toMatchObject({ error: { code: "E1708" } });
    const attendance = zGetMyAttendanceResponse.parse(
      await (await fetch(`${baseUrl}/v1/attendances/me?roomId=${roomId}`)).json(),
    );
    expect(attendance.data?.status).toBe("ATTENDED");
  });

  it.each([
    { status: "NOT_ELIGIBLE_ABSENT", selfStatus: "ABSENT", otherStatus: "ATTENDED" },
    { status: "NOT_ELIGIBLE_NO_TARGET", selfStatus: "ATTENDED", otherStatus: "ABSENT" },
  ])(
    "$status 결과에 맞춰 후기 조회 응답을 제공한다",
    async ({ status, selfStatus, otherStatus }) => {
      const { confirmedParticipants } = await readParticipants();
      await complete(
        confirmedParticipants.map(({ memberId }) => ({
          memberId,
          status: memberId === MOCK_INTERVIEW_HOST_ID ? selfStatus : otherStatus,
        })),
      );
      expect(
        (await readOverview()).completedRooms.find(({ room }) => room.roomId === roomId)
          ?.reviewStatus,
      ).toBe(status);
      const response = await fetch(`${roomUrl}/reviews/overview`);
      if (status === "NOT_ELIGIBLE_ABSENT") {
        expect(response.status).toBe(403);
        expect(await response.json()).toMatchObject({ error: { code: "E2002" } });
      } else {
        expect(response.status).toBe(200);
        expect(zGetReviewOverviewResponse.parse(await response.json()).data?.targets).toEqual([]);
      }
    },
  );

  it("새 서버 조회에서도 개발용 완료 쿠키로 저장된 출석 결과를 복원한다", async () => {
    const { confirmedParticipants } = await readParticipants();
    const attendances = confirmedParticipants.map(({ memberId }) => ({
      memberId,
      status: memberId === MOCK_INTERVIEW_HOST_ID ? "ABSENT" : "ATTENDED",
    }));
    await complete(attendances);
    resetMockConfirmation();
    const response = await fetch(roomUrl, {
      headers: {
        Cookie: `moimyeon_mock_completion_${roomId}=${encodeURIComponent(JSON.stringify(attendances))}`,
      },
    });
    expect(zRoomDetailResponse.parse(await response.json()).data?.status).toBe("COMPLETED");
    expect(
      (await readOverview()).completedRooms.find(({ room }) => room.roomId === roomId)
        ?.reviewStatus,
    ).toBe("NOT_ELIGIBLE_ABSENT");
  });
});
