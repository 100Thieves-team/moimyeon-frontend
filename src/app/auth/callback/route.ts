import {
  getFailureProperties,
  type FailureProperties,
} from "@/features/analytics/analytics-contract";
import {
  LOGIN_RESULT_COOKIE,
  LOGIN_INTENT_MAX_AGE_SECONDS,
} from "@/features/analytics/login-tracking-contract";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  clearLoginIntent,
  getLoginIntent,
  hasAuthenticatedMember,
} from "@/features/auth/auth-server";

function setAnalyticsLoginResult(
  response: NextResponse,
  result: { status: "success" | "failed" } & Partial<FailureProperties>,
) {
  response.cookies.set(LOGIN_RESULT_COOKIE, JSON.stringify(result), {
    httpOnly: false,
    maxAge: LOGIN_INTENT_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

function createLoginFailureResponse(
  request: NextRequest,
  failure: FailureProperties = { failure_type: "api" },
) {
  const destination = new URL("/", request.url);
  destination.searchParams.set("authError", "login_failed");

  const response = NextResponse.redirect(destination, 303);
  clearLoginIntent(response);
  setAnalyticsLoginResult(response, { status: "failed", ...failure });

  return response;
}

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await hasAuthenticatedMember();

    if (!isAuthenticated) {
      return createLoginFailureResponse(request);
    }

    const returnTo = getLoginIntent(request);
    const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
    clearLoginIntent(response);
    setAnalyticsLoginResult(response, { status: "success" });

    return response;
  } catch (error) {
    return createLoginFailureResponse(request, getFailureProperties(error));
  }
}
