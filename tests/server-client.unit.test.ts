import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createServerClient } from "@/api/server-client";

const { cookiesMock, originalApiBaseUrl } = vi.hoisted(() => {
  const previousApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.test";

  return {
    cookiesMock: vi.fn(),
    originalApiBaseUrl: previousApiBaseUrl,
  };
});

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));
vi.mock("server-only", () => ({}));

beforeEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  if (originalApiBaseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
  }
});

describe("server API client", () => {
  it("client를 생성한 요청의 Cookie만 헤더에 저장한다", async () => {
    cookiesMock
      .mockResolvedValueOnce({ toString: () => "accessToken=first" })
      .mockResolvedValueOnce({ toString: () => "accessToken=second" });

    const firstClient = await createServerClient();
    const secondClient = await createServerClient();

    const firstHeaders = firstClient.getConfig().headers;
    const secondHeaders = secondClient.getConfig().headers;

    expect(firstHeaders).toBeInstanceOf(Headers);
    expect(secondHeaders).toBeInstanceOf(Headers);
    expect((firstHeaders as Headers).get("Cookie")).toBe("accessToken=first");
    expect((secondHeaders as Headers).get("Cookie")).toBe("accessToken=second");

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }));
    firstClient.setConfig({ fetch: fetchMock });

    await firstClient.get({ headers: { Accept: "application/json" }, url: "/test" });

    const requestHeaders = fetchMock.mock.calls[0]?.[1]?.headers;
    expect(requestHeaders).toBeInstanceOf(Headers);
    expect((requestHeaders as Headers).get("Cookie")).toBe("accessToken=first");
    expect((requestHeaders as Headers).get("Accept")).toBe("application/json");
  });
});
