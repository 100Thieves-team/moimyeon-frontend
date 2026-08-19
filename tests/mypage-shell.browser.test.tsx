import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { ZodError } from "zod";
import type { MyPageData } from "@/features/mypage/mypage-model";
import { MyPageShell } from "@/features/mypage/mypage-shell";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  authLogout: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  authLogoutMutation: () => ({
    mutationFn: (options: Record<string, unknown>) =>
      mocks.authLogout({ ...options, throwOnError: true }),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mocks.refresh,
    replace: mocks.replace,
  }),
}));

const myPageData: MyPageData = {
  jobRoleGroups: [
    {
      code: "DEVELOPMENT",
      displayName: "개발",
      roles: [
        { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
        { code: "FULLSTACK", displayName: "웹풀스택", jobRoleId: 20 },
      ],
    },
  ],
  member: {
    email: "otter@example.com",
    memberId: "member-1",
    nickname: "집요한 수달 07",
    profile: {
      bio: "프론트엔드 개발자예요.",
      interestCompanies: [],
      interestJobRoleIds: [10, 20],
      memberId: "member-1",
    },
    status: "ACTIVE",
  },
  publicProfile: {
    bio: "프론트엔드 개발자예요.",
    interestJobRoles: [
      { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
      { code: "FULLSTACK", displayName: "웹풀스택", jobRoleId: 20 },
    ],
    memberId: "member-1",
    nickname: "집요한 수달 07",
    trust: {
      activityTopPercent: 12,
      noShowCount: 3,
      recentAttendances: ["ATTENDED", "ABSENT", "ATTENDED", "ATTENDED", "ATTENDED"],
      representativeTags: [{ count: 8, label: "피드백이 구체적이에요" }],
    },
  },
};

beforeEach(async () => {
  vi.clearAllMocks();
  await page.viewport(1440, 1024);
});

async function renderMyPageShell() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <MyPageShell publicProfile={myPageData.publicProfile}>
        <p>프로필 편집 폼</p>
      </MyPageShell>
    </QueryClientProvider>,
  );

  return { queryClient, screen };
}

describe("MyPageShell", () => {
  it("공개 프로필과 신뢰 정보, 프로필 수정 탭을 보여준다", async () => {
    const { screen } = await renderMyPageShell();

    await expect.element(screen.getByRole("heading", { name: "집요한 수달 07" })).toBeVisible();
    await expect.element(screen.getByText("프론트엔드 · 웹풀스택")).toBeVisible();
    await expect.element(screen.getByText("상위 12%")).toBeVisible();
    expect(screen.getByRole("listitem", { name: "출석" }).elements()).toHaveLength(4);
    expect(screen.getByRole("listitem", { name: "불참" }).elements()).toHaveLength(1);
    await expect.element(screen.getByText("피드백이 구체적이에요")).toBeVisible();
    await expect
      .element(screen.getByRole("tab", { name: "프로필 수정" }))
      .toHaveAttribute("aria-selected", "true");
    await expect.element(screen.getByRole("tab", { name: "이력서 관리" })).toBeDisabled();
    await expect.element(screen.getByRole("tab", { name: "활동과 후기" })).toBeDisabled();
    await expect.element(screen.getByRole("heading", { name: "프로필 수정" })).toBeVisible();
    await expect.element(screen.getByText("회원 탈퇴")).not.toBeInTheDocument();
    await expect.element(screen.getByText("3", { exact: true })).not.toBeInTheDocument();
  });

  it("로그아웃 요청 중 버튼을 비활성화하고 성공하면 홈으로 이동한다", async () => {
    let resolveLogout!: () => void;
    mocks.authLogout.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogout = resolve;
        }),
    );
    const { queryClient, screen } = await renderMyPageShell();
    queryClient.setQueryData(["member"], { memberId: "member-1" });

    await screen.getByRole("button", { name: "로그아웃" }).click();

    await expect.element(screen.getByRole("button", { name: "로그아웃 중" })).toBeDisabled();
    expect(mocks.authLogout).toHaveBeenCalledOnce();

    resolveLogout();

    await vi.waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith("/");
      expect(mocks.refresh).toHaveBeenCalledOnce();
    });
    expect(queryClient.getQueryData(["member"])).toBeUndefined();
    expect(mocks.authLogout).toHaveBeenCalledWith({ throwOnError: true });
  });

  it("로그아웃 요청이 실패하면 현재 화면에서 다시 시도할 수 있다", async () => {
    mocks.authLogout.mockRejectedValue(new ZodError([]));
    const { screen } = await renderMyPageShell();

    await screen.getByRole("button", { name: "로그아웃" }).click();

    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("로그아웃하지 못했어요. 다시 시도해 주세요.");
    await expect.element(screen.getByRole("button", { name: "로그아웃" })).toBeEnabled();
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });
});
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
