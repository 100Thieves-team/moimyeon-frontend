import "server-only";

import { cookies } from "next/headers";
import { jobRoles, memberMe, publicProfile } from "@/api";
import type { MyPageData } from "./mypage-model";

export async function loadMyPageData(): Promise<MyPageData> {
  const cookieHeader = (await cookies()).toString();
  const requestOptions = {
    cache: "no-store" as const,
    headers: { Cookie: cookieHeader },
    throwOnError: true as const,
  };
  const { data: memberResponse } = await memberMe(requestOptions);
  const member = memberResponse.data;

  if (member === undefined) {
    throw new Error("Failed to load member");
  }

  const [{ data: publicProfileResponse }, { data: jobRolesResponse }] = await Promise.all([
    publicProfile({
      ...requestOptions,
      path: { memberId: member.memberId },
    }),
    jobRoles(requestOptions),
  ]);

  const profile = publicProfileResponse.data;
  const roles = jobRolesResponse.data;

  if (profile === undefined) {
    throw new Error("Failed to load public profile");
  }

  if (roles === undefined) {
    throw new Error("Failed to load job roles");
  }

  return {
    jobRoleGroups: roles.groups,
    member,
    publicProfile: profile,
  };
}
