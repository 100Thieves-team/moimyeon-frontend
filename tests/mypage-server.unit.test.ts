import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookiesMock, jobRolesMock, memberMeMock, publicProfileMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  jobRolesMock: vi.fn(),
  memberMeMock: vi.fn(),
  publicProfileMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: cookiesMock }));
vi.mock("@/api", () => ({
  jobRoles: jobRolesMock,
  memberMe: memberMeMock,
  publicProfile: publicProfileMock,
}));

import { loadMyPageData } from "@/features/mypage/mypage-server";

const cookieHeader = "accessToken=test-token";
const member = { memberId: "member-1" };
const publicProfile = { nickname: "테스트 사용자" };
const roles = { groups: [{ code: "DEVELOPMENT", roles: [] }] };

function successResponse(data: unknown) {
  return {
    data: { data, result: "SUCCESS" },
    response: new Response(null, { status: 200 }),
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  cookiesMock.mockResolvedValue({ toString: () => cookieHeader });
  memberMeMock.mockResolvedValue(successResponse(member));
  publicProfileMock.mockResolvedValue(successResponse(publicProfile));
  jobRolesMock.mockResolvedValue(successResponse(roles));
});

describe("loadMyPageData", () => {
  it("세 API의 성공 데이터를 마이페이지 데이터로 조합한다", async () => {
    const result = await loadMyPageData();
    const requestOptions = {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
      throwOnError: true,
    };

    expect(result).toEqual({
      jobRoleGroups: roles.groups,
      member,
      publicProfile,
    });
    expect(memberMeMock).toHaveBeenCalledWith(requestOptions);
    expect(publicProfileMock).toHaveBeenCalledWith({
      ...requestOptions,
      path: { memberId: member.memberId },
    });
    expect(jobRolesMock).toHaveBeenCalledWith(requestOptions);
  });

  it.each([
    ["member", memberMeMock, "Failed to load member"],
    ["public profile", publicProfileMock, "Failed to load public profile"],
    ["job roles", jobRolesMock, "Failed to load job roles"],
  ])("%s 성공 응답에 data가 없으면 명시적인 오류를 던진다", async (_, apiMock, message) => {
    apiMock.mockResolvedValue(successResponse(undefined));

    await expect(loadMyPageData()).rejects.toThrow(message);
  });

  it("SDK 오류를 변경하거나 리다이렉트하지 않고 전파한다", async () => {
    const sdkError = {
      error: { code: "E1102", message: "인증이 필요합니다." },
      result: "ERROR",
    };
    memberMeMock.mockRejectedValue(sdkError);

    await expect(loadMyPageData()).rejects.toBe(sdkError);
    expect(publicProfileMock).not.toHaveBeenCalled();
    expect(jobRolesMock).not.toHaveBeenCalled();
  });
});
