import {
  getMockMyInterviews,
  withdrawMockMyInterview,
} from "@/features/my-interviews/my-interviews-mock";
import { http, HttpResponse, passthrough } from "msw";
import { getMockInterviewRooms } from "@/features/interview-discovery/interview-discovery-mock";
import {
  getMockInterviewDetail,
  getMockInterviewHostProfile,
  MOCK_INTERVIEW_HOST_ID,
} from "@/features/interview-detail/interview-detail-mock";
import {
  deleteMockReview,
  getMockReviewOverview,
  getMockReviewProfile,
  getMockReviewRoomDetail,
  isMockReviewId,
  isMockReviewRoom,
  submitMockReview,
  updateMockReview,
} from "@/features/review/review-mock";
import {
  confirmationHandlers,
  getMockRoomAttendance,
  restoreMockCompletion,
} from "./room-confirmation";

function mockError(message: string, status: number) {
  return HttpResponse.json(
    { error: { code: `MOCK_${status}`, data: null, message }, result: "ERROR" },
    { status },
  );
}

export const handlers = [
  http.all("*/v1/*", ({ request }) => {
    restoreMockCompletion(request.headers.get("cookie") ?? "");
  }),
  ...confirmationHandlers,
  http.get("*/v1/members/me/rooms", () => HttpResponse.json(getMockMyInterviews(true))),
  http.delete("*/v1/rooms/:roomId/applications/me", ({ params }) => {
    return withdrawMockMyInterview(String(params.roomId))
      ? HttpResponse.json({ result: "SUCCESS", data: null, error: null })
      : passthrough();
  }),
  http.get("*/v1/rooms", ({ request }) => {
    const { searchParams } = new URL(request.url);

    return HttpResponse.json(getMockInterviewRooms(searchParams));
  }),
  http.get("*/v1/rooms/:roomId", ({ params }) => {
    const roomId = String(params.roomId);
    const response = getMockInterviewDetail(roomId) ?? getMockReviewRoomDetail(roomId);

    return response ? HttpResponse.json(response) : passthrough();
  }),
  http.get("*/v1/rooms/:roomId/reviews/overview", ({ params }) => {
    const roomId = String(params.roomId);
    const attendance = getMockRoomAttendance(roomId)?.find(
      ({ memberId }) => memberId === MOCK_INTERVIEW_HOST_ID,
    );
    if (attendance?.status === "ABSENT")
      return HttpResponse.json(
        { result: "ERROR", error: { code: "E2002", message: "작성자가 결석한 면접이에요." } },
        { status: 403 },
      );
    const response = getMockReviewOverview(roomId);

    return response ? HttpResponse.json(response) : passthrough();
  }),
  http.post("*/v1/rooms/:roomId/reviews", async ({ params, request }) => {
    const roomId = String(params.roomId);

    if (!isMockReviewRoom(roomId)) return passthrough();

    const response = submitMockReview(roomId, await request.json());

    return response
      ? HttpResponse.json(response, { status: 201 })
      : mockError("후기 요청을 확인해 주세요.", 400);
  }),
  http.put("*/v1/reviews/:reviewId", async ({ params, request }) => {
    const reviewId = Number(params.reviewId);

    if (!isMockReviewId(reviewId)) return passthrough();

    return updateMockReview(reviewId, await request.json())
      ? HttpResponse.json({ result: "SUCCESS" })
      : mockError("후기 요청을 확인해 주세요.", 400);
  }),
  http.delete("*/v1/reviews/:reviewId", ({ params }) => {
    const reviewId = Number(params.reviewId);

    if (!isMockReviewId(reviewId)) return passthrough();

    return deleteMockReview(reviewId)
      ? HttpResponse.json({ result: "SUCCESS" })
      : mockError("후기를 찾을 수 없어요.", 404);
  }),
  http.get("*/v1/members/:memberId/profile", ({ params }) => {
    const memberId = String(params.memberId);
    const response = getMockInterviewHostProfile(memberId) ?? getMockReviewProfile(memberId);

    return response ? HttpResponse.json(response) : passthrough();
  }),
];
