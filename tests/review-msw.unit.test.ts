import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { GetReviewResponse, GetReviewTargetsResponse, SubmitReviewResponse } from "@/api";
import { MOCK_REVIEW_ROOM_ID, resetMockReviewState } from "@/features/review/review-mock";
import { server } from "@/mocks/node";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => resetMockReviewState());
afterAll(() => server.close());

describe("review MSW handlers", () => {
  it("기존 후기를 조회하고 신규 작성·수정·삭제 결과를 대상 목록에 반영한다", async () => {
    const targetsUrl = `https://api.example.test/v1/rooms/${MOCK_REVIEW_ROOM_ID}/review-targets`;
    const initialTargetsResponse = await fetch(targetsUrl);
    const initialTargets = (await initialTargetsResponse.json()) as GetReviewTargetsResponse;
    const submittedTarget = initialTargets.data?.targets.find(
      ({ status }) => status === "SUBMITTED",
    );
    const writableTarget = initialTargets.data?.targets.find(({ status }) => status === "WRITABLE");

    expect(initialTargets.data?.submittedCount).toBe(2);
    expect(submittedTarget?.reviewId).toBeDefined();
    expect(writableTarget).toBeDefined();

    const existingReviewResponse = await fetch(
      `https://api.example.test/v1/reviews/${submittedTarget?.reviewId}`,
    );
    const existingReview = (await existingReviewResponse.json()) as GetReviewResponse;

    expect(existingReview.data).toEqual(
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

    const submittedTargetsResponse = await fetch(targetsUrl);
    const submittedTargets = (await submittedTargetsResponse.json()) as GetReviewTargetsResponse;
    expect(submittedTargets.data?.submittedCount).toBe(3);

    const updateResponse = await fetch(`https://api.example.test/v1/reviews/${reviewId}`, {
      body: JSON.stringify({ content: "수정한 후기예요.", tags: ["소통이 원활해요"] }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    expect(updateResponse.ok).toBe(true);

    const updatedReviewResponse = await fetch(`https://api.example.test/v1/reviews/${reviewId}`);
    const updatedReview = (await updatedReviewResponse.json()) as GetReviewResponse;
    expect(updatedReview.data).toEqual(
      expect.objectContaining({ content: "수정한 후기예요.", tags: ["소통이 원활해요"] }),
    );

    const deleteResponse = await fetch(`https://api.example.test/v1/reviews/${reviewId}`, {
      method: "DELETE",
    });
    expect(deleteResponse.ok).toBe(true);

    const restoredTargetsResponse = await fetch(targetsUrl);
    const restoredTargets = (await restoredTargetsResponse.json()) as GetReviewTargetsResponse;
    expect(restoredTargets.data?.submittedCount).toBe(2);
    expect(
      restoredTargets.data?.targets.find(({ memberId }) => memberId === writableTarget?.memberId),
    ).toEqual(expect.objectContaining({ reviewId: null, status: "WRITABLE" }));
  });
});
