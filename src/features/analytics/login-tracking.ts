import { captureEvent } from "./analytics";
import type { FailureProperties } from "./analytics-contract";

export const LOGIN_TRACKING_KEY = "moimyeon_analytics_login_started";
export { LOGIN_RESULT_COOKIE, LOGIN_INTENT_MAX_AGE_SECONDS } from "./login-tracking-contract";
import { LOGIN_RESULT_COOKIE, LOGIN_INTENT_MAX_AGE_SECONDS } from "./login-tracking-contract";

export function startLoginTracking() {
  try {
    document.cookie = `${LOGIN_RESULT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    sessionStorage.setItem(LOGIN_TRACKING_KEY, String(Date.now()));
  } catch {
    /* Storage may be blocked. */
  }
  captureEvent("login_started", {});
}

export function completeLoginTracking(memberId: string | null) {
  try {
    const startedAt = sessionStorage.getItem(LOGIN_TRACKING_KEY);
    if (!startedAt) return;
    const rawResult = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${LOGIN_RESULT_COOKIE}=`));
    if (!rawResult) return;
    const result = JSON.parse(
      decodeURIComponent(rawResult.slice(LOGIN_RESULT_COOKIE.length + 1)),
    ) as {
      status: "success" | "failed";
      failure_type?: FailureProperties["failure_type"];
      error_code?: string;
    };
    // Wait for server-confirmed authentication before consuming a successful return.
    if (result.status === "success" && !memberId) return;
    document.cookie = `${LOGIN_RESULT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    sessionStorage.removeItem(LOGIN_TRACKING_KEY);
    const age = Date.now() - Number(startedAt);
    if (!startedAt || !Number.isFinite(age) || age < 0 || age > LOGIN_INTENT_MAX_AGE_SECONDS * 1000)
      return;
    if (result.status === "success") {
      captureEvent("login_completed", {});
    } else if (result.status === "failed") {
      captureEvent("core_action_failed", {
        action: "login",
        failure_type: result.failure_type === "network" ? "network" : "api",
        ...(typeof result.error_code === "string" ? { error_code: result.error_code } : {}),
      });
    }
  } catch {
    /* Analytics storage and parsing must not affect authentication. */
  }
}
