import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { GetReviewOverviewResponse, SubmitReviewResponse } from "@/api";
import { MOCK_REVIEW_ROOM_ID, resetMockReviewState } from "@/features/review/review-mock";
import { server } from "@/mocks/node";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => resetMockReviewState());
afterAll(() => server.close());

describe("review MSW handlers", () => {
  it("후기 개요를 조회하고 신규 작성·수정·삭제 결과를 다시 반영한다", async () => {
    const overviewUrl = `https://api.example.test/v1/rooms/${MOCK_REVIEW_ROOM_ID}/reviews/overview`;
    const initialOverviewResponse = await fetch(overviewUrl);
    const initialOverview = (await initialOverviewResponse.json()) as GetReviewOverviewResponse;
    const submittedTarget = initialOverview.data?.targets.find(
      ({ status }) => status === "SUBMITTED",
    );
    const writableTarget = initialOverview.data?.targets.find(
      ({ status }) => status === "WRITABLE",
    );
    const existingReview = initialOverview.data?.reviews.find(
      ({ targetMemberId }) => targetMemberId === submittedTarget?.memberId,
    );

    expect(initialOverview.data?.submittedCount).toBe(2);
    expect(writableTarget).toBeDefined();
    expect(existingReview).toEqual(
      expect.objectContaining({
        content: expect.any(String),
        targetMemberId: submittedTarget?.memberId,
      }),
    );

    const createResponse = await fetch(
      `https://api.example.test/v1/rooms/${MOCK_REVIEW_ROOM_ID}/reviews`,
      {
        body: JSON.stringify({
          anonymous: true,
          content: "작성 가능한 대상의 후기예요.",
          tags: ["준비가 성실해요"],
          targetMemberId: writableTarget?.memberId,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );
    const createdReview = (await createResponse.json()) as SubmitReviewResponse;
    const reviewId = createdReview.data?.reviewId;

    expect(createResponse.status).toBe(201);
    expect(reviewId).toBeDefined();

    const submittedOverviewResponse = await fetch(overviewUrl);
    const submittedOverview = (await submittedOverviewResponse.json()) as GetReviewOverviewResponse;
    expect(submittedOverview.data?.submittedCount).toBe(3);
    expect(submittedOverview.data?.reviews).toContainEqual(
      expect.objectContaining({ reviewId, targetMemberId: writableTarget?.memberId }),
    );

    const updateResponse = await fetch(`https://api.example.test/v1/reviews/${reviewId}`, {
      body: JSON.stringify({ content: "수정한 후기예요.", tags: ["소통이 원활해요"] }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    expect(updateResponse.ok).toBe(true);

    const updatedOverviewResponse = await fetch(overviewUrl);
    const updatedOverview = (await updatedOverviewResponse.json()) as GetReviewOverviewResponse;
    expect(updatedOverview.data?.reviews.find((review) => review.reviewId === reviewId)).toEqual(
      expect.objectContaining({ content: "수정한 후기예요.", tags: ["소통이 원활해요"] }),
    );

    const deleteResponse = await fetch(`https://api.example.test/v1/reviews/${reviewId}`, {
      method: "DELETE",
    });
    expect(deleteResponse.ok).toBe(true);

    const restoredOverviewResponse = await fetch(overviewUrl);
    const restoredOverview = (await restoredOverviewResponse.json()) as GetReviewOverviewResponse;
    expect(restoredOverview.data?.submittedCount).toBe(2);
    expect(
      restoredOverview.data?.targets.find(({ memberId }) => memberId === writableTarget?.memberId),
    ).toEqual(expect.objectContaining({ status: "WRITABLE" }));
    expect(restoredOverview.data?.reviews.some((review) => review.reviewId === reviewId)).toBe(
      false,
    );
  });
});
