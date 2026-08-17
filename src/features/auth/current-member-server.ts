import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { memberMe, type MemberMeResponse } from "@/api";

type CurrentMember = NonNullable<MemberMeResponse["data"]>;

export type CurrentMemberState =
  | {
      status: "anonymous";
      error: unknown;
    }
  | {
      status: "authenticated";
      member: CurrentMember;
    };

async function loadCurrentMemberState(): Promise<CurrentMemberState> {
  const cookieHeader = (await cookies()).toString();
  const result = await memberMe({
    cache: "no-store",
    headers: { Cookie: cookieHeader },
    throwOnError: false,
  });

  if (result.data !== undefined) {
    const member = result.data.data;

    if (member === undefined) {
      throw new Error("Failed to load member");
    }

    return { member, status: "authenticated" };
  }

  if (result.response?.status === 401 || result.response?.status === 404) {
    return { error: result.error, status: "anonymous" };
  }

  throw result.error;
}

export const getCurrentMemberState = cache(loadCurrentMemberState);

export async function requireCurrentMember(): Promise<CurrentMember> {
  const state = await getCurrentMemberState();

  if (state.status === "anonymous") {
    throw state.error;
  }

  return state.member;
}
