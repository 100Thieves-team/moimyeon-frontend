import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { ToastProvider } from "@/components/toast";
import type { MyPageData } from "@/features/mypage/mypage-model";
import { ProfileEditor } from "@/features/mypage/profile-editor";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  nicknameAvailability: vi.fn(),
  nicknameSuggestion: vi.fn(),
  searchCompanies: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  memberMeQueryKey: () => ["memberMe"],
  nicknameAvailabilityOptions: (options: Record<string, unknown>) => ({
    queryKey: ["nicknameAvailability", options],
    queryFn: async () => {
      const result = await mocks.nicknameAvailability({ ...options, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
  nicknameSuggestionOptions: () => ({
    queryKey: ["nicknameSuggestion"],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.nicknameSuggestion({ signal, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
  nicknameSuggestionQueryKey: () => ["nicknameSuggestion"],
  publicProfileQueryKey: ({ path }: { path: { memberId: string } }) => [
    "publicProfile",
    path.memberId,
  ],
  searchCompaniesQueryKey: () => ["searchCompanies"],
  searchCompaniesOptions: (options: { query?: { query?: string } }) => ({
    queryKey: ["searchCompanies", options.query?.query],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.searchCompanies({ ...options, signal, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
  updateProfileMutation: () => ({
    mutationFn: async (options: Record<string, unknown>) => {
      const result = await mocks.updateProfile({ ...options, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
}));

const myPageData: MyPageData = {
  jobRoleGroups: [
    {
      code: "DEVELOPMENT",
      displayName: "개발",
      roles: [
        { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
        { code: "BACKEND", displayName: "백엔드", jobRoleId: 20 },
      ],
    },
    {
      code: "DATA",
      displayName: "데이터",
      roles: [{ code: "DATA_ANALYST", displayName: "데이터분석가", jobRoleId: 30 }],
    },
  ],
  member: {
    email: "otter@example.com",
    memberId: "member-1",
    nickname: "집요한 수달 07",
    profile: {
      bio: "프론트엔드 개발자예요.",
      interestCompanies: [{ companyId: 1, name: "달빛페이" }],
      interestJobRoleIds: [10],
      memberId: "member-1",
    },
    status: "ACTIVE",
  },
  publicProfile: {
    bio: "프론트엔드 개발자예요.",
    interestJobRoles: [{ code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 }],
    memberId: "member-1",
    nickname: "집요한 수달 07",
    trust: {
      activityTopPercent: null,
      noShowCount: 0,
      recentAttendances: [],
      representativeTags: [],
    },
  },
};

function success(data: Record<string, unknown> = {}) {
  return {
    data: { data, result: "SUCCESS" },
    error: undefined,
    response: new Response(null, { status: 200 }),
  };
}

function renderProfileEditor(data: MyPageData = myPageData) {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ProfileEditor jobRoleGroups={data.jobRoleGroups} member={data.member} />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

async function openJobRoleDialog(screen: Awaited<ReturnType<typeof renderProfileEditor>>) {
  await screen.getByRole("button", { name: "관심 직무" }).click();
  const dialog = screen.getByRole("dialog", { name: "직무 추가" });
  await expect.element(dialog).toBeVisible();
  return dialog;
}

beforeEach(async () => {
  vi.clearAllMocks();
  mocks.nicknameAvailability.mockResolvedValue(success({ available: true }));
  mocks.nicknameSuggestion.mockResolvedValue(success({ nickname: "차분한 여우 11" }));
  mocks.searchCompanies.mockResolvedValue(success({ companies: [] }));
  mocks.updateProfile.mockResolvedValue(success());
  await page.viewport(1000, 800);
});

describe("ProfileEditor", () => {
  it("관심 직무 필드를 클릭하면 기존 선택으로 직무 추가 Dialog를 연다", async () => {
    const screen = await renderProfileEditor();

    await expect.element(screen.getByLabelText("닉네임")).toBeVisible();
    await expect.element(screen.getByText("프론트엔드", { exact: true })).toBeVisible();
    await expect.element(screen.getByRole("button", { name: "프론트엔드 삭제" })).toBeVisible();

    await openJobRoleDialog(screen);

    await expect
      .element(screen.getByRole("tab", { name: "개발 1개 선택" }))
      .toHaveAttribute("data-active");
    await expect
      .element(screen.getByRole("button", { exact: true, name: "프론트엔드" }))
      .toHaveAttribute("aria-pressed", "true");
    await screen.getByRole("button", { name: "직무 선택 닫기" }).click();
  });

  it("닉네임과 관심 직무 입력 영역의 높이가 같다", async () => {
    const screen = await renderProfileEditor();
    const nicknameInput = screen.getByLabelText("닉네임").element();
    const interestJobRoleTrigger = screen.getByRole("button", { name: "관심 직무" }).element();
    const nicknameInputGroup = nicknameInput.parentElement;
    const interestJobRoleFrame = interestJobRoleTrigger.parentElement;

    expect(nicknameInputGroup).not.toBeNull();
    expect(interestJobRoleFrame).not.toBeNull();
    expect(nicknameInputGroup?.getBoundingClientRect().height).toBe(
      interestJobRoleFrame?.getBoundingClientRect().height,
    );
  });

  it("관심 직무 Pill의 X 버튼으로 Dialog 없이 직무를 삭제해 저장한다", async () => {
    const screen = await renderProfileEditor();

    await screen.getByRole("button", { name: "프론트엔드 삭제" }).click();

    await expect.element(screen.getByRole("dialog", { name: "직무 추가" })).not.toBeInTheDocument();
    await expect.element(screen.getByText("관심 직무를 선택해 주세요.")).toBeVisible();
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.poll(() => mocks.updateProfile.mock.calls.length).toBe(1);
    expect(mocks.updateProfile).toHaveBeenCalledWith({
      body: expect.objectContaining({ interestJobRoleIds: [] }),
      throwOnError: true,
    });
  });

  it("여러 직군에서 직무를 선택 완료하면 Pill과 저장 값에 반영한다", async () => {
    const screen = await renderProfileEditor();
    await openJobRoleDialog(screen);

    await screen.getByRole("button", { name: "백엔드" }).click();
    await screen.getByRole("tab", { name: "데이터" }).click();
    await screen.getByRole("button", { name: "데이터분석가" }).click();
    await screen.getByRole("button", { name: "선택 완료" }).click();

    await expect.element(screen.getByRole("button", { name: "백엔드 삭제" })).toBeVisible();
    await expect.element(screen.getByRole("button", { name: "데이터분석가 삭제" })).toBeVisible();
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.poll(() => mocks.updateProfile.mock.calls.length).toBe(1);
    expect(mocks.updateProfile).toHaveBeenCalledWith({
      body: expect.objectContaining({ interestJobRoleIds: [10, 20, 30] }),
      throwOnError: true,
    });
  });

  it("Dialog를 닫으면 완료하지 않은 직무 변경을 버린다", async () => {
    const screen = await renderProfileEditor();
    await openJobRoleDialog(screen);

    await screen.getByRole("button", { name: "백엔드" }).click();
    await screen.getByRole("button", { name: "직무 선택 닫기" }).click();
    await openJobRoleDialog(screen);

    await expect
      .element(screen.getByRole("button", { exact: true, name: "프론트엔드" }))
      .toHaveAttribute("aria-pressed", "true");
    await expect
      .element(screen.getByRole("button", { name: "백엔드" }))
      .toHaveAttribute("aria-pressed", "false");
    await screen.getByRole("button", { name: "직무 선택 닫기" }).click();
  });

  it("기존 관심 직무가 없으면 아무 직군도 선택하지 않는다", async () => {
    const screen = await renderProfileEditor({
      ...myPageData,
      member: {
        ...myPageData.member,
        profile: { ...myPageData.member.profile, interestJobRoleIds: [] },
      },
    });

    await openJobRoleDialog(screen);

    await expect.element(screen.getByText("직군을 선택해 주세요.")).toBeVisible();
    await expect
      .element(screen.getByRole("tab", { name: "개발" }))
      .not.toHaveAttribute("data-active");
    await expect
      .element(screen.getByRole("tab", { name: "데이터" }))
      .not.toHaveAttribute("data-active");
    await screen.getByRole("button", { name: "직무 선택 닫기" }).click();
  });

  it("Dialog에서 초기화하고 완료하면 관심 직무를 모두 제거한다", async () => {
    const screen = await renderProfileEditor();
    await openJobRoleDialog(screen);

    await screen.getByRole("button", { name: "초기화" }).click();
    await screen.getByRole("button", { name: "선택 완료" }).click();

    await expect.element(screen.getByText("관심 직무를 선택해 주세요.")).toBeVisible();
  });

  it("Dialog를 확정하지 않은 저장에서는 카탈로그에 없는 기존 관심 직무 ID를 보존한다", async () => {
    const screen = await renderProfileEditor({
      ...myPageData,
      member: {
        ...myPageData.member,
        profile: { ...myPageData.member.profile, interestJobRoleIds: [10, 999] },
      },
    });

    await screen.getByLabelText("자기소개").fill("구체적인 피드백을 좋아해요.");
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.poll(() => mocks.updateProfile.mock.calls.length).toBe(1);
    expect(mocks.updateProfile).toHaveBeenCalledWith({
      body: {
        nickname: "집요한 수달 07",
        bio: "구체적인 피드백을 좋아해요.",
        interestCompanyIds: [1],
        interestJobRoleIds: [10, 999],
      },
      throwOnError: true,
    });
    await expect
      .element(screen.getByRole("dialog", { name: "프로필을 저장했어요." }))
      .toBeVisible();
  });

  it("Dialog에서 새 선택을 확정하면 카탈로그에 없는 기존 관심 직무 ID를 제외한다", async () => {
    const screen = await renderProfileEditor({
      ...myPageData,
      member: {
        ...myPageData.member,
        profile: { ...myPageData.member.profile, interestJobRoleIds: [10, 999] },
      },
    });

    await openJobRoleDialog(screen);
    await screen.getByRole("button", { name: "선택 완료" }).click();
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.poll(() => mocks.updateProfile.mock.calls.length).toBe(1);
    expect(mocks.updateProfile).toHaveBeenCalledWith({
      body: expect.objectContaining({ interestJobRoleIds: [10] }),
      throwOnError: true,
    });
  });

  it("프로필 저장에 실패하면 폼 오류만 보여준다", async () => {
    mocks.updateProfile.mockResolvedValue({
      data: undefined,
      error: { error: { message: "프로필을 저장하지 못했어요." } },
      response: new Response(null, { status: 500 }),
    });
    const screen = await renderProfileEditor();

    await screen.getByLabelText("자기소개").fill("저장되지 않을 자기소개");
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("프로필을 저장하지 못했어요.");
    await expect
      .element(screen.getByRole("dialog", { name: "프로필을 저장했어요." }))
      .not.toBeInTheDocument();
  });

  it("회사 검색 결과를 선택해 관심 회사에 저장한다", async () => {
    mocks.searchCompanies.mockResolvedValue(
      success({ companies: [{ companyId: 2, name: "한빛커머스" }] }),
    );
    const screen = await renderProfileEditor();

    await screen.getByLabelText("관심 회사").fill("한빛");
    await expect.element(screen.getByRole("option", { name: "한빛커머스" })).toBeVisible();
    await screen.getByRole("option", { name: "한빛커머스" }).click();
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.poll(() => mocks.updateProfile.mock.calls.length).toBe(1);
    expect(mocks.updateProfile).toHaveBeenCalledWith({
      body: expect.objectContaining({ interestCompanyIds: [1, 2], interestJobRoleIds: [10] }),
      throwOnError: true,
    });
  });

  it("회사를 연속으로 검색해 여러 관심 회사를 함께 저장한다", async () => {
    mocks.searchCompanies.mockImplementation(({ query }: { query: { query: string } }) => {
      const companies =
        query.query === "한빛"
          ? [{ companyId: 2, name: "한빛커머스" }]
          : [{ companyId: 3, name: "모이테크" }];

      return Promise.resolve(success({ companies }));
    });
    const screen = await renderProfileEditor();
    const companyInput = screen.getByLabelText("관심 회사");

    await companyInput.fill("한빛");
    await screen.getByRole("option", { name: "한빛커머스" }).click();
    await companyInput.fill("모이");
    await screen.getByRole("option", { name: "모이테크" }).click();
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.poll(() => mocks.updateProfile.mock.calls.length).toBe(1);
    expect(mocks.updateProfile).toHaveBeenCalledWith({
      body: expect.objectContaining({ interestCompanyIds: [1, 2, 3] }),
      throwOnError: true,
    });
  });

  it("이전 회사 검색을 취소하고 최신 결과를 보여준다", async () => {
    mocks.searchCompanies.mockImplementation(
      ({ query, signal }: { query: { query: string }; signal?: AbortSignal }) => {
        if (query.query === "한빛") {
          return new Promise((_, reject) => {
            signal?.addEventListener(
              "abort",
              () => reject(new DOMException("The operation was aborted.", "AbortError")),
              { once: true },
            );
          });
        }

        return Promise.resolve(success({ companies: [{ companyId: 3, name: "모이테크" }] }));
      },
    );
    const screen = await renderProfileEditor();
    const companyInput = screen.getByLabelText("관심 회사");

    await companyInput.fill("한빛");
    await expect.poll(() => mocks.searchCompanies.mock.calls.length).toBe(1);
    await companyInput.fill("모이");
    await expect.element(screen.getByRole("option", { name: "모이테크" })).toBeVisible();

    await expect
      .element(screen.getByRole("option", { name: "한빛커머스" }))
      .not.toBeInTheDocument();
  });

  it("회사 검색 메시지가 없으면 빈 영역을 만들지 않는다", async () => {
    const screen = await renderProfileEditor();
    const companyInput = screen.getByLabelText("관심 회사");

    await screen.getByRole("button", { name: "달빛페이 삭제" }).click();
    await companyInput.click();

    const emptyRegion = screen.getByTestId("company-search-empty");
    await expect.element(emptyRegion).toBeInTheDocument();
    expect(emptyRegion.element().getBoundingClientRect().height).toBe(0);

    await companyInput.fill("없는 회사");

    await expect.element(screen.getByText("다른 회사명을 검색해 보세요.")).toBeVisible();
    expect(emptyRegion.element().getBoundingClientRect().height).toBeGreaterThan(0);
  });

  it("사용 중인 닉네임은 저장하지 않는다", async () => {
    mocks.nicknameAvailability.mockResolvedValue(success({ available: false }));
    const screen = await renderProfileEditor();

    await screen.getByLabelText("닉네임").fill("겹치는 닉네임");
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.element(screen.getByText("이미 사용 중인 닉네임이에요.")).toBeVisible();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });

  it("추천받은 닉네임은 저장하기를 눌렀을 때 프로필과 함께 저장한다", async () => {
    const screen = await renderProfileEditor();

    await screen.getByRole("button", { name: "새로 만들기" }).click();
    await expect.element(screen.getByLabelText("닉네임")).toHaveValue("차분한 여우 11");
    await expect.poll(() => mocks.nicknameAvailability.mock.calls.length).toBe(1);
    expect(mocks.nicknameAvailability).toHaveBeenCalledWith({
      query: { nickname: "차분한 여우 11" },
      throwOnError: true,
    });
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.poll(() => mocks.updateProfile.mock.calls.length).toBe(1);
    expect(mocks.updateProfile).toHaveBeenCalledWith({
      body: {
        bio: "프론트엔드 개발자예요.",
        interestCompanyIds: [1],
        interestJobRoleIds: [10],
        nickname: "차분한 여우 11",
      },
      throwOnError: true,
    });
  });

  it("새로 만들기를 다시 누르면 새로운 닉네임을 요청한다", async () => {
    mocks.nicknameSuggestion
      .mockResolvedValueOnce(success({ nickname: "차분한 여우 11" }))
      .mockResolvedValueOnce(success({ nickname: "용감한 토끼 22" }));
    const screen = await renderProfileEditor();

    await screen.getByRole("button", { name: "새로 만들기" }).click();
    await expect.element(screen.getByLabelText("닉네임")).toHaveValue("차분한 여우 11");
    await screen.getByRole("button", { name: "새로 만들기" }).click();

    await expect.element(screen.getByLabelText("닉네임")).toHaveValue("용감한 토끼 22");
    expect(mocks.nicknameSuggestion).toHaveBeenCalledTimes(2);
  });

  it("닉네임 추천에 실패하면 닉네임 필드에 안내한다", async () => {
    mocks.nicknameSuggestion.mockRejectedValue(new Error("추천 요청 실패"));
    const screen = await renderProfileEditor();

    await screen.getByRole("button", { name: "새로 만들기" }).click();

    await expect
      .element(screen.getByText("새 닉네임을 만들지 못했어요. 잠시 후 다시 시도해 주세요."))
      .toBeVisible();
  });

  it("저장 시 닉네임 중복 오류가 발생하면 닉네임 필드에 안내한다", async () => {
    mocks.updateProfile.mockResolvedValue({
      data: undefined,
      error: { error: { code: "E1007", message: "이미 사용 중인 닉네임이에요." } },
      response: new Response(null, { status: 409 }),
    });
    const screen = await renderProfileEditor();

    await screen.getByLabelText("닉네임").fill("겹치는 닉네임");
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect.poll(() => mocks.updateProfile.mock.calls.length).toBe(1);
    expect(mocks.updateProfile).toHaveBeenCalledOnce();
    await expect.element(screen.getByText("이미 사용 중인 닉네임이에요.")).toBeVisible();
    await expect
      .element(screen.getByRole("dialog", { name: "프로필을 저장했어요." }))
      .not.toBeInTheDocument();
    await expect.element(screen.getByLabelText("닉네임")).toHaveValue("겹치는 닉네임");
  });
});
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
