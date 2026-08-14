import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

const validTermsResponse = {
  result: "SUCCESS",
  data: {
    terms: [
      {
        termsId: "terms-1",
        title: "서비스 이용약관",
        type: "SERVICE",
        effectiveFrom: "2026-08-15",
        version: "1.0",
        required: true,
        content: "약관 본문",
      },
    ],
  },
};

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

describe("generated SDK response validation", () => {
  beforeAll(() => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it("유효한 성공 응답을 그대로 반환한다", async () => {
    const { termsList } = await import("@/api/generated");
    const result = await termsList({
      fetch: vi.fn().mockResolvedValue(jsonResponse(validTermsResponse)),
    });

    expect(result.error).toBeUndefined();
    expect(result.data).toEqual(validTermsResponse);
  });

  it("잘못된 2xx 응답을 Zod 오류로 반환한다", async () => {
    const { termsList } = await import("@/api/generated");
    const result = await termsList({
      fetch: vi.fn().mockResolvedValue(
        jsonResponse({
          ...validTermsResponse,
          data: {
            terms: [{ ...validTermsResponse.data.terms[0], required: "yes" }],
          },
        }),
      ),
    });

    expect(result.data).toBeUndefined();
    expect(result.error).toBeInstanceOf(ZodError);
    expect(result.response?.status).toBe(200);
  });

  it("throwOnError 호출은 응답 검증 오류를 전파한다", async () => {
    const { termsList } = await import("@/api/generated");

    await expect(
      termsList({
        fetch: vi.fn().mockResolvedValue(jsonResponse({ result: "SUCCESS", data: {} })),
        throwOnError: true,
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});
