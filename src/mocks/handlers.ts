import { http, HttpResponse, passthrough } from "msw";
import { getMockInterviewRooms } from "@/features/interview-discovery/interview-discovery-mock";
import {
  getMockInterviewDetail,
  getMockInterviewHostProfile,
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

function mockError(message: string, status: number) {
  return HttpResponse.json(
    { error: { code: `MOCK_${status}`, data: null, message }, result: "ERROR" },
    { status },
  );
}

export const handlers = [
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
    const response = getMockReviewOverview(String(params.roomId));

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
