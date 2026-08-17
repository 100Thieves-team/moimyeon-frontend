import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookiesMock, memberMeMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  memberMeMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("react", () => ({ cache: (load: unknown) => load }));
vi.mock("next/headers", () => ({ cookies: cookiesMock }));
vi.mock("@/api", () => ({ memberMe: memberMeMock }));

import { getCurrentMemberState, requireCurrentMember } from "@/features/auth/current-member-server";

const cookieHeader = "accessToken=test-token";
const member = {
  memberId: "member-1",
  nickname: "집요한 수달 07",
};

function successResponse(data: unknown) {
  return {
    data: { data, result: "SUCCESS" },
    error: undefined,
    response: new Response(null, { status: 200 }),
  };
}

function errorResponse(error: unknown, status: number) {
  return {
    data: undefined,
    error,
    response: new Response(null, { status }),
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  cookiesMock.mockResolvedValue({ toString: () => cookieHeader });
  memberMeMock.mockResolvedValue(successResponse(member));
});

describe("current member server", () => {
  it("회원 조회에 성공하면 인증 상태와 회원을 반환한다", async () => {
    await expect(getCurrentMemberState()).resolves.toEqual({
      member,
      status: "authenticated",
    });
    expect(memberMeMock).toHaveBeenCalledWith({
      cache: "no-store",
      headers: { Cookie: cookieHeader },
      throwOnError: false,
    });
  });

  it.each([401, 404])("%i 응답을 미로그인 상태로 구분한다", async (status) => {
    const sdkError = {
      error: { code: status === 401 ? "E1102" : "E1006", message: "회원 조회 실패" },
      result: "ERROR",
    };
    memberMeMock.mockResolvedValue(errorResponse(sdkError, status));

    await expect(getCurrentMemberState()).resolves.toEqual({
      error: sdkError,
      status: "anonymous",
    });
  });

  it("인증이 필요한 소비자에서는 미로그인 SDK 오류를 그대로 던진다", async () => {
    const sdkError = {
      error: { code: "E1102", message: "인증이 필요합니다." },
      result: "ERROR",
    };
    memberMeMock.mockResolvedValue(errorResponse(sdkError, 401));

    await expect(requireCurrentMember()).rejects.toBe(sdkError);
  });

  it("정상 응답에 회원 데이터가 없으면 명시적인 오류를 던진다", async () => {
    memberMeMock.mockResolvedValue(successResponse(undefined));

    await expect(getCurrentMemberState()).rejects.toThrow("Failed to load member");
  });

  it("인증 실패가 아닌 SDK 오류는 변경하지 않고 전파한다", async () => {
    const sdkError = {
      error: { code: "E500", message: "서버 오류" },
      result: "ERROR",
    };
    memberMeMock.mockResolvedValue(errorResponse(sdkError, 500));

    await expect(getCurrentMemberState()).rejects.toBe(sdkError);
  });
});
