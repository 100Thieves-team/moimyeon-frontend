import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { issueDevSessionMock } = vi.hoisted(() => ({
  issueDevSessionMock: vi.fn(),
}));

vi.mock("@/api", () => ({
  issueDevSession: issueDevSessionMock,
}));

import { POST } from "@/app/api/v1/auth/dev-sessions/route";

const memberId = "b31e76ad-f9a9-4f42-9616-2ef3ae452950";

function createRequest() {
  return new NextRequest("http://localhost:3000/api/v1/auth/dev-sessions", {
    body: JSON.stringify({ memberId }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NODE_ENV", "development");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("development session proxy", () => {
  it("개발 로그인에 성공하면 두 인증 쿠키를 localhost용으로 전달한다", async () => {
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      "DEV_ACCESS_TOKEN=access-token; Path=/; Domain=dev.moimyeon.plady.io; Max-Age=1800; Secure; HttpOnly; SameSite=None",
    );
    headers.append(
      "Set-Cookie",
      "DEV_REFRESH_TOKEN=refresh-token; Path=/v1/auth; Domain=dev.moimyeon.plady.io; Max-Age=1209600; Secure; HttpOnly; SameSite=None",
    );
    issueDevSessionMock.mockResolvedValue({
      data: { data: null, result: "SUCCESS" },
      response: new Response(null, { headers, status: 200 }),
    });

    const response = await POST(createRequest());
    const setCookies = response.headers.getSetCookie();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: null, result: "SUCCESS" });
    expect(issueDevSessionMock).toHaveBeenCalledWith({
      body: { memberId },
      throwOnError: false,
    });
    expect(setCookies).toEqual([
      "DEV_ACCESS_TOKEN=access-token; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax",
      "DEV_REFRESH_TOKEN=refresh-token; Path=/; Max-Age=1209600; HttpOnly; SameSite=Lax",
    ]);
  });

  it("API가 오류를 반환하면 상태와 오류 본문을 그대로 전달한다", async () => {
    const error = {
      error: { code: "E1006", data: null, message: "회원을 찾을 수 없습니다." },
      result: "ERROR",
    };
    issueDevSessionMock.mockResolvedValue({
      error,
      response: new Response(null, { status: 404 }),
    });

    const response = await POST(createRequest());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual(error);
    expect(response.headers.getSetCookie()).toEqual([]);
  });
});
