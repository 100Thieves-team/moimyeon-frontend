import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  clearLoginIntent,
  getLoginIntent,
  hasAuthenticatedMember,
} from "@/features/auth/auth-server";

function createLoginFailureResponse(request: NextRequest) {
  const destination = new URL("/", request.url);
  destination.searchParams.set("authError", "login_failed");

  const response = NextResponse.redirect(destination, 303);
  clearLoginIntent(response);

  return response;
}

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await hasAuthenticatedMember(request);

    if (!isAuthenticated) {
      return createLoginFailureResponse(request);
    }

    const returnTo = getLoginIntent(request);
    const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
    clearLoginIntent(response);

    return response;
  } catch {
    return createLoginFailureResponse(request);
  }
}
