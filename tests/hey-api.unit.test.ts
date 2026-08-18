import { afterEach, describe, expect, it, vi } from "vitest";

const DEV_API_BASE_URL = "https://api.dev.moimyeon.plady.io";

type ClientConfigOptions = {
  apiBaseUrl?: string;
  browser?: boolean;
  nodeEnv?: string;
  token?: string;
};

async function createConfig({
  apiBaseUrl = DEV_API_BASE_URL,
  browser = false,
  nodeEnv = "development",
  token = "test-access-token",
}: ClientConfigOptions = {}) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", apiBaseUrl);
  vi.stubEnv("NODE_ENV", nodeEnv);
  vi.stubEnv("DEV_ACCESS_TOKEN", token);

  if (browser) {
    vi.stubGlobal("window", {});
  }

  const { createClientConfig } = await import("@/api/hey-api");

  return createClientConfig({ headers: { "X-Test-Header": "preserved" } });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("API client development access token", () => {
  it("로컬 Next 서버가 dev API를 호출하면 Bearer 토큰을 추가한다", async () => {
    const config = await createConfig();
    const headers = new Headers(config.headers as HeadersInit);

    expect(headers.get("Authorization")).toBe("Bearer test-access-token");
    expect(headers.get("X-Test-Header")).toBe("preserved");
  });

  it.each([
    ["토큰이 없을 때", { token: "  " }],
    ["production일 때", { nodeEnv: "production" }],
    ["다른 API를 호출할 때", { apiBaseUrl: "https://api.example.test" }],
    ["브라우저에서 호출할 때", { browser: true }],
  ])("%s Authorization 헤더를 추가하지 않는다", async (_, options) => {
    const config = await createConfig(options);
    const headers = new Headers(config.headers as HeadersInit);

    expect(headers.has("Authorization")).toBe(false);
    expect(headers.get("X-Test-Header")).toBe("preserved");
  });
});
