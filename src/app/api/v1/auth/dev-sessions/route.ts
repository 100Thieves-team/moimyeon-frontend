import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { issueDevSession, type IssueDevSessionData } from "@/api";

const DEV_SESSION_COOKIE_NAMES = ["DEV_ACCESS_TOKEN", "DEV_REFRESH_TOKEN"] as const;

const proxyError = {
  error: {
    code: "DEV_SESSION_PROXY_ERROR",
    data: null,
    message: "개발 로그인 세션을 전달하지 못했습니다.",
  },
  result: "ERROR",
};

function localizeSessionCookie(setCookie: string) {
  return setCookie
    .replace(/;\s*Domain=[^;]*/gi, "")
    .replace(/;\s*Path=[^;]*/gi, "; Path=/")
    .replace(/;\s*Secure(?=;|$)/gi, "")
    .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const body = (await request.json()) as NonNullable<IssueDevSessionData["body"]>;
    const result = await issueDevSession({ body, throwOnError: false });
    const status = result.response?.status ?? 502;

    if (result.data === undefined) {
      return NextResponse.json(result.error ?? proxyError, { status });
    }

    const upstreamCookies = result.response?.headers.getSetCookie() ?? [];
    const localizedCookies = new Map<string, string>();

    for (const setCookie of upstreamCookies) {
      const cookieName = setCookie.slice(0, setCookie.indexOf("="));

      if (
        DEV_SESSION_COOKIE_NAMES.includes(cookieName as (typeof DEV_SESSION_COOKIE_NAMES)[number])
      ) {
        localizedCookies.set(cookieName, localizeSessionCookie(setCookie));
      }
    }

    if (DEV_SESSION_COOKIE_NAMES.some((cookieName) => !localizedCookies.has(cookieName))) {
      return NextResponse.json(proxyError, { status: 502 });
    }

    const response = NextResponse.json(result.data, { status });

    for (const cookieName of DEV_SESSION_COOKIE_NAMES) {
      response.headers.append("Set-Cookie", localizedCookies.get(cookieName)!);
    }

    return response;
  } catch {
    return NextResponse.json(proxyError, { status: 502 });
  }
}
