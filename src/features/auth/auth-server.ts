import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { memberMe } from "@/api";
import { createServerClient } from "@/api/server-client";
import { DEFAULT_LOGIN_RETURN_TO, normalizeLoginReturnTo, type LoginReturnTo } from "./auth-intent";

const LOGIN_RETURN_TO_COOKIE = "moimyeon_return_to";

const loginIntentCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 10,
  path: "/auth",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
  }

  return apiBaseUrl.replace(/\/$/, "");
}

export function getGoogleAuthorizationUrl() {
  return new URL("/oauth2/authorization/google", getApiBaseUrl());
}

export function setLoginIntent(response: NextResponse, returnTo: LoginReturnTo) {
  response.cookies.set(LOGIN_RETURN_TO_COOKIE, returnTo, loginIntentCookieOptions);
}

export function clearLoginIntent(response: NextResponse) {
  response.cookies.set(LOGIN_RETURN_TO_COOKIE, "", {
    ...loginIntentCookieOptions,
    maxAge: 0,
  });
}

export function getLoginIntent(request: NextRequest): LoginReturnTo {
  const storedReturnTo =
    request.cookies.get(LOGIN_RETURN_TO_COOKIE)?.value ?? DEFAULT_LOGIN_RETURN_TO;

  return normalizeLoginReturnTo(storedReturnTo);
}

export async function hasAuthenticatedMember() {
  const serverClient = await createServerClient();
  const result = await memberMe({
    cache: "no-store",
    client: serverClient,
    headers: {
      Accept: "application/json",
    },
    throwOnError: false,
  });

  return result.data?.data !== undefined;
}
