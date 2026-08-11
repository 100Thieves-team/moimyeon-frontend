import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getGoogleAuthorizationUrl, setLoginIntent } from "@/features/auth/auth-server";
import { normalizeLoginReturnTo } from "@/features/auth/auth-intent";

export function GET(request: NextRequest) {
  const returnTo = normalizeLoginReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const response = NextResponse.redirect(getGoogleAuthorizationUrl());

  setLoginIntent(response, returnTo);

  return response;
}
