import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/auth/callback/route";

const { createServerClientMock, memberMeMock, serverClientMock } = vi.hoisted(() => ({
  createServerClientMock: vi.fn(),
  memberMeMock: vi.fn(),
  serverClientMock: { get: vi.fn() },
}));

vi.mock("@/api", () => ({
  memberMe: memberMeMock,
}));
vi.mock("@/api/server-client", () => ({
  createServerClient: createServerClientMock,
}));

vi.mock("server-only", () => ({}));

function createCallbackRequest(returnTo?: string) {
  const headers = new Headers();

  if (returnTo) {
    headers.set("Cookie", `moimyeon_return_to=${returnTo}`);
  }

  return new NextRequest("https://moimyeon.plady.io/auth/callback", { headers });
}

function expectLoginIntentCleared(response: Response) {
  const setCookie = response.headers.get("Set-Cookie");

  expect(setCookie).toContain("moimyeon_return_to=");
  expect(setCookie).toContain("Max-Age=0");
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.dev.moimyeon.plady.io");
  createServerClientMock.mockResolvedValue(serverClientMock);
  memberMeMock.mockResolvedValue({
    data: {
      data: {
        memberId: "518d3feb-5351-66b1-7ce1-3a32d6a50f0b",
      },
      result: "SUCCESS",
    },
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("OAuth callback", () => {
  it("인증된 회원을 로그인 전에 의도한 경로로 돌려보낸다", async () => {
    const response = await GET(createCallbackRequest("/interviews/new"));

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("https://moimyeon.plady.io/interviews/new");
    expect(memberMeMock).toHaveBeenCalledWith({
      cache: "no-store",
      client: serverClientMock,
      headers: {
        Accept: "application/json",
      },
      throwOnError: false,
    });
    expectLoginIntentCleared(response);
  });

  it("로그인 의도가 없으면 홈으로 돌려보낸다", async () => {
    const response = await GET(createCallbackRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("https://moimyeon.plady.io/");
    expectLoginIntentCleared(response);
  });

  it.each([
    ["회원 조회 실패", () => Promise.resolve({ data: undefined, error: { result: "ERROR" } })],
    ["네트워크 오류", () => Promise.reject(new Error("network error"))],
  ])("%s 시 로그인 실패를 표시할 홈으로 돌려보낸다", async (_, memberMeResult) => {
    memberMeMock.mockImplementation(memberMeResult);

    const response = await GET(createCallbackRequest("/interviews/new"));

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe(
      "https://moimyeon.plady.io/?authError=login_failed",
    );
    expectLoginIntentCleared(response);
  });
});
