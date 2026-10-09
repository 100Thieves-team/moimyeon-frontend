import { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CaptureResult } from "posthog-js";

const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  identify: vi.fn(),
  setPersonProperties: vi.fn(),
  reset: vi.fn(),
  get_property: vi.fn(),
}));
vi.mock("posthog-js", () => ({ default: sdk }));

let analytics: typeof import("@/features/analytics/analytics");
let login: typeof import("@/features/analytics/login-tracking");
let cookies: string;
let storage: Map<string, string>;

beforeEach(async () => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_ENVIRONMENT", "dev");
  vi.stubGlobal("window", {
    location: { pathname: "/interviews/room-a", hash: "#secret", search: "?email=private" },
  });
  cookies = "";
  vi.stubGlobal("document", {
    get cookie() {
      return cookies;
    },
    set cookie(value: string) {
      cookies = value.includes("Max-Age=0") ? "" : value;
    },
  });
  storage = new Map();
  vi.stubGlobal("sessionStorage", {
    setItem: (key: string, value: string) => storage.set(key, value),
    getItem: (key: string) => storage.get(key) ?? null,
    removeItem: (key: string) => storage.delete(key),
  });
  analytics = await import("@/features/analytics/analytics");
  login = await import("@/features/analytics/login-tracking");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const capturedNames = () => sdk.capture.mock.calls.map(([event]) => event);
const loginReturn = (result: object) => {
  cookies = `${login.LOGIN_RESULT_COOKIE}=${encodeURIComponent(JSON.stringify(result))}`;
};

describe("PostHog 사용자 수집 계약", () => {
  it.each(["false", ""])("활성화하지 않으면 탐색과 로그인도 전송하지 않는다 (%s)", (value) => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_ENABLED", value);
    analytics.initializeAnalytics();
    analytics.capturePageview("/");
    analytics.syncAnalyticsMember("member-a");
    analytics.captureEvent("interview_applied", { room_id: "room-a" });
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.capture).not.toHaveBeenCalled();
    expect(sdk.identify).not.toHaveBeenCalled();
  });

  it("테스트 환경에서는 명시적으로 활성화해도 실제 SDK를 초기화하지 않는다", () => {
    vi.stubEnv("NODE_ENV", "test");
    analytics.initializeAnalytics();
    expect(sdk.init).not.toHaveBeenCalled();
  });

  it("익명 탐색을 회원에게 연결하고 같은 회원 재조회와 세션 복원을 로그인 성공으로 세지 않는다", () => {
    analytics.initializeAnalytics();
    analytics.capturePageview("/interviews/room-a");
    expect(sdk.capture.mock.calls[0][1]).toMatchObject({ is_authenticated: false });
    analytics.syncAnalyticsMember("member-a");
    analytics.syncAnalyticsMember("member-a");
    login.completeLoginTracking("member-a");
    expect(sdk.identify).toHaveBeenCalledExactlyOnceWith("member-a");
    expect(sdk.reset).not.toHaveBeenCalled();
    expect(capturedNames()).not.toContain("login_completed");
  });

  it("기존 회원 식별이 저장돼 있으면 같은 세션을 다시 identify하지 않는다", () => {
    sdk.get_property.mockReturnValue("member-a");
    analytics.initializeAnalytics();
    analytics.syncAnalyticsMember("member-a");
    expect(sdk.identify).not.toHaveBeenCalled();
  });

  it("회원 기본 정보를 연결하고 닉네임 변경은 같은 회원 속성으로 갱신한다", () => {
    analytics.initializeAnalytics();
    const member = {
      name: "꼼꼼한 여우 12",
      email: "member@example.test",
      member_status: "ACTIVE",
    };
    analytics.syncAnalyticsMember("member-a", member);
    analytics.syncAnalyticsMember("member-a", { ...member });
    expect(sdk.identify).toHaveBeenCalledExactlyOnceWith("member-a", member);
    expect(sdk.setPersonProperties).not.toHaveBeenCalled();
    analytics.syncAnalyticsMember("member-a", { ...member, name: "든든한 곰 04" });
    expect(sdk.setPersonProperties).toHaveBeenCalledExactlyOnceWith({
      ...member,
      name: "든든한 곰 04",
    });
    expect(sdk.reset).not.toHaveBeenCalled();
    analytics.syncAnalyticsMember("member-b", { ...member, email: "other@example.test" });
    expect(sdk.reset).toHaveBeenCalledTimes(1);
    expect(sdk.identify).toHaveBeenLastCalledWith("member-b", {
      ...member,
      email: "other@example.test",
    });
  });

  it("기존 로그인 세션에도 기본 정보를 갱신하고 SDK 오류가 화면 흐름을 막지 않는다", () => {
    sdk.get_property.mockReturnValue("member-a");
    analytics.initializeAnalytics();
    const member = {
      name: "꼼꼼한 여우 12",
      email: "member@example.test",
      member_status: "ACTIVE",
    };
    sdk.setPersonProperties.mockImplementationOnce(() => {
      throw new Error("blocked");
    });
    expect(() => analytics.syncAnalyticsMember("member-a", member)).not.toThrow();
    analytics.syncAnalyticsMember("member-a", member);
    expect(sdk.setPersonProperties).toHaveBeenLastCalledWith(member);
    expect(sdk.identify).not.toHaveBeenCalled();
    expect(capturedNames()).not.toContain("login_completed");
  });

  it.each(["$identify", "$set"])("%s 사용자 속성에서 기본 회원 정보만 허용한다", (event) => {
    const member = {
      name: "꼼꼼한 여우 12",
      email: "member@example.test",
      member_status: "ACTIVE",
    };
    for (const topLevel of [true, false]) {
      const set = {
        ...member,
        bio: "private",
        resume: "private",
        $initial_current_url: "https://site.test/?private",
      };
      const payload = {
        uuid: "event-a",
        event,
        properties: { distinct_id: "member-a", ...(topLevel ? {} : { $set: set }) },
        ...(topLevel ? { $set: set } : {}),
        $set_once: { nickname: "private" },
      } as CaptureResult;
      const clean = analytics.sanitizeCapture(payload)!;
      expect(clean.$set).toEqual(member);
      expect(JSON.stringify(clean)).not.toContain("private");
      expect(clean.properties.$set).toBeUndefined();
      expect(clean.$set_once).toBeUndefined();
    }
  });

  it("계정을 바꾸기 전에 식별을 reset하고 로그아웃 후에는 익명으로 기록한다", () => {
    analytics.initializeAnalytics();
    analytics.syncAnalyticsMember("member-a");
    analytics.syncAnalyticsMember("member-b");
    expect(sdk.reset.mock.invocationCallOrder[0]).toBeLessThan(
      sdk.identify.mock.invocationCallOrder[1],
    );
    analytics.resetAnalyticsMember();
    analytics.captureEvent("interview_detail_viewed", { room_id: "room-a", actor_role: "visitor" });
    expect(sdk.reset).toHaveBeenCalledTimes(2);
    expect(sdk.capture.mock.calls.at(-1)?.[1]).toMatchObject({ is_authenticated: false });
  });

  it("로그인 시작 후 서버에서 확인한 복귀만 한 번 소비하여 성공으로 기록한다", () => {
    analytics.initializeAnalytics();
    login.startLoginTracking();
    login.completeLoginTracking("member-a");
    expect(capturedNames()).toEqual(["login_started"]);
    loginReturn({ status: "success" });
    analytics.syncAnalyticsMember("member-a");
    login.completeLoginTracking("member-a");
    login.completeLoginTracking("member-a");
    expect(capturedNames()).toEqual(["login_started", "login_completed"]);
    expect(storage.size).toBe(0);
    expect(cookies).toBe("");
  });

  it("10분이 지난 로그인 표시로 성공을 수집하지 않는다", () => {
    analytics.initializeAnalytics();
    storage.set(login.LOGIN_TRACKING_KEY, String(Date.now() - 600_001));
    loginReturn({ status: "success" });
    login.completeLoginTracking("member-a");
    expect(sdk.capture).not.toHaveBeenCalled();
    expect(storage.size).toBe(0);
  });

  it.each(["api", "network"] as const)(
    "로그인 실패는 원본 오류 없이 한 번 기록한다 (%s)",
    (failure_type) => {
      analytics.initializeAnalytics();
      login.startLoginTracking();
      loginReturn({ status: "failed", failure_type, error_code: "Auth-001", message: "private" });
      login.completeLoginTracking(null);
      login.completeLoginTracking(null);
      expect(capturedNames()).toEqual(["login_started", "core_action_failed"]);
      expect(sdk.capture.mock.calls.at(-1)?.[1]).toMatchObject({
        action: "login",
        failure_type,
        error_code: "Auth-001",
      });
      expect(JSON.stringify(sdk.capture.mock.calls)).not.toContain("private");
    },
  );

  it("같은 화면 재진입 Effect와 Query 재조회는 중복 수집하지 않고 실제 경로와 단계 이동은 수집한다", () => {
    analytics.initializeAnalytics();
    analytics.capturePageview("/interviews/room-a");
    analytics.captureEntry("interview_detail_viewed", { room_id: "room-a", actor_role: "visitor" });
    analytics.capturePageview("/interviews/room-a");
    analytics.captureEntry("interview_detail_viewed", {
      room_id: "room-a",
      actor_role: "participant",
    });
    window.location.pathname = "/interviews/new";
    analytics.captureEntry("interview_create_started", {});
    analytics.captureEntry("interview_create_step_viewed", { step: "interview-info" });
    analytics.captureEntry("interview_create_step_viewed", { step: "interview-info" });
    analytics.captureEntry("interview_create_step_viewed", { step: "final-review" });
    analytics.captureEntry("interview_create_step_viewed", { step: "interview-info" });
    analytics.capturePageview("/interviews/new");
    window.location.pathname = "/interviews/room-a";
    analytics.capturePageview("/interviews/room-a");
    analytics.captureEntry("interview_detail_viewed", { room_id: "room-a" });
    expect(capturedNames().filter((name) => name === "$pageview")).toHaveLength(3);
    expect(capturedNames().filter((name) => name === "interview_detail_viewed")).toHaveLength(2);
    expect(capturedNames().filter((name) => name === "interview_create_step_viewed")).toHaveLength(
      3,
    );
  });

  it("일반 행동 이벤트에서 본문·회원 정보·query·hash·자동 person 속성을 제외한다", () => {
    const payload = {
      uuid: "event-id",
      event: "interview_applied",
      $set: { email: "private@example.com" },
      $set_once: { $initial_current_url: "https://site.test/?token=private" },
      properties: {
        token: "phc_test",
        distinct_id: "member-a",
        room_id: "room-a",
        actor_role: "visitor",
        event_version: 1,
        environment: "dev",
        page_path: "/interviews/room-a/apply?secret=yes#secret",
        is_authenticated: true,
        event_source: "frontend",
        email: "private@example.com",
        nickname: "private",
        note: "private",
        resume: "private",
        content: "private",
        reason: "private",
        $current_url: "https://site.test/interviews/room-a/apply?token=private#private",
        $referrer: "https://source.test/unknown-user-text?email=private#private",
        $set: { email: "private" },
        $set_once: { $initial_current_url: "private" },
      },
    } as CaptureResult;
    const clean = analytics.sanitizeCapture(payload)!;
    expect(clean.properties).toMatchObject({
      room_id: "room-a",
      page_path: "/interviews/[roomId]/apply",
      $current_url: "https://site.test/interviews/[roomId]/apply",
      $referrer: "https://source.test/[unknown]",
    });
    expect(JSON.stringify(clean)).not.toMatch(/private|secret|\$set/);
    expect(analytics.sanitizeCapture({ ...payload, event: "$autocapture" })).toBeNull();
  });

  it("동작한 방장의 memberId와 실제 roomId를 수락 이벤트에 사용한다", async () => {
    analytics.initializeAnalytics();
    analytics.syncAnalyticsMember("host-member");
    const { trackMutation } = await import("@/features/analytics/track-mutation");
    const client = new QueryClient();
    const mutation = client.getMutationCache().build(
      client,
      trackMutation(
        {
          mutationFn: async (_variables: { roomId: string; applicantId: string }) => ({
            result: "SUCCESS",
          }),
        },
        {
          action: "interview_application_accept",
          event: "interview_application_accepted",
          properties: (_, variables) => ({ room_id: variables.roomId, actor_role: "host" }),
        },
      ),
    );
    await mutation.execute({ roomId: "room-a", applicantId: "applicant-member" });
    expect(sdk.identify).toHaveBeenCalledWith("host-member");
    expect(sdk.capture).toHaveBeenCalledWith(
      "interview_application_accepted",
      expect.objectContaining({ room_id: "room-a", actor_role: "host", is_authenticated: true }),
    );
    expect(JSON.stringify(sdk.capture.mock.calls)).not.toContain("applicant-member");
  });

  it.each([
    [{ result: "ERROR", error: { code: "E1421", message: "private" } }, "api", "E1421"],
    [new TypeError("private network error"), "network", undefined],
  ])(
    "API·네트워크 실패는 성공 이벤트 없이 안전한 실패 속성만 기록한다",
    async (error, failure_type, error_code) => {
      analytics.initializeAnalytics();
      const { trackMutation } = await import("@/features/analytics/track-mutation");
      const client = new QueryClient();
      const mutation = client.getMutationCache().build(
        client,
        trackMutation(
          {
            mutationFn: async () => {
              throw error;
            },
          },
          {
            action: "interview_confirm",
            event: "interview_confirmed",
            properties: () => ({ room_id: "room-a" }),
            failureProperties: { room_id: "room-a", actor_role: "host" },
          },
        ),
      );
      await expect(mutation.execute(undefined)).rejects.toBe(error);
      expect(capturedNames()).toEqual(["core_action_failed"]);
      expect(sdk.capture.mock.calls[0][1]).toMatchObject({
        action: "interview_confirm",
        failure_type,
        ...(error_code ? { error_code } : {}),
      });
      expect(JSON.stringify(sdk.capture.mock.calls)).not.toContain("private");
    },
  );

  it("성공 후 캐시 재조회 콜백이 실패해도 성공을 한 번 기록하고 작업 실패로 기록하지 않는다", async () => {
    analytics.initializeAnalytics();
    const { trackMutation } = await import("@/features/analytics/track-mutation");
    const client = new QueryClient();
    const mutation = client.getMutationCache().build(client, {
      ...trackMutation(
        { mutationFn: async () => ({ result: "SUCCESS" }) },
        {
          action: "interview_apply",
          event: "interview_applied",
          properties: () => ({ room_id: "room-a" }),
        },
      ),
      onSuccess: async () => {
        throw new Error("cache refresh failed");
      },
    });
    await expect(mutation.execute(undefined)).rejects.toThrow("cache refresh failed");
    expect(capturedNames()).toEqual(["interview_applied"]);
  });

  it("SDK 전송이 throw해도 면접 완료 API의 성공 결과를 유지한다", async () => {
    analytics.initializeAnalytics();
    sdk.capture.mockImplementation(() => {
      throw new Error("blocked");
    });
    const { trackMutation } = await import("@/features/analytics/track-mutation");
    const client = new QueryClient();
    const mutation = client.getMutationCache().build(
      client,
      trackMutation(
        { mutationFn: async () => "completed" },
        {
          action: "interview_complete",
          event: "interview_completed",
          properties: () => ({ room_id: "room-a" }),
        },
      ),
    );
    await expect(mutation.execute(undefined)).resolves.toBe("completed");
  });
});
