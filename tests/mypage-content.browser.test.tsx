import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Component, Suspense, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { ToastProvider } from "@/components/toast";
import { MyPageContent } from "@/features/mypage/mypage-content";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  authLogout: vi.fn(),
  jobRoles: vi.fn(),
  memberMe: vi.fn(),
  nicknameSuggestion: vi.fn(),
  publicProfile: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  authLogoutMutation: () => ({ mutationFn: mocks.authLogout }),
  jobRolesOptions: () => ({
    queryFn: mocks.jobRoles,
    queryKey: ["jobRoles"],
  }),
  memberMeOptions: () => ({
    queryFn: mocks.memberMe,
    queryKey: ["memberMe"],
  }),
  memberMeQueryKey: () => ["memberMe"],
  nicknameAvailabilityOptions: (options: Record<string, unknown>) => ({
    queryFn: vi.fn(),
    queryKey: ["nicknameAvailability", options],
  }),
  nicknameSuggestionOptions: () => ({
    queryFn: mocks.nicknameSuggestion,
    queryKey: ["nicknameSuggestion"],
  }),
  nicknameSuggestionQueryKey: () => ["nicknameSuggestion"],
  publicProfileOptions: ({ path }: { path: { memberId: string } }) => ({
    queryFn: mocks.publicProfile,
    queryKey: ["publicProfile", path.memberId],
  }),
  publicProfileQueryKey: ({ path }: { path: { memberId: string } }) => [
    "publicProfile",
    path.memberId,
  ],
  searchCompaniesOptions: (options: Record<string, unknown>) => ({
    queryFn: vi.fn(),
    queryKey: ["searchCompanies", options],
  }),
  searchCompaniesQueryKey: () => ["searchCompanies"],
  updateProfileMutation: () => ({ mutationFn: mocks.updateProfile }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/mypage",
  useRouter: () => ({ refresh: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const member = {
  email: "otter@example.com",
  memberId: "member-1",
  nickname: "집요한 수달 07",
  profile: {
    bio: "프론트엔드 개발자예요.",
    interestCompanies: [],
    interestJobRoleIds: [10],
    memberId: "member-1",
  },
  status: "ACTIVE",
};
const publicProfile = {
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
};
const jobRoles = {
  groups: [
    {
      code: "DEVELOPMENT",
      displayName: "개발",
      roles: [{ code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 }],
    },
  ],
};

const memberResponse = { data: member, result: "SUCCESS" };
const publicProfileResponse = { data: publicProfile, result: "SUCCESS" };
const jobRolesResponse = { data: jobRoles, result: "SUCCESS" };

type ErrorBoundaryState = {
  error?: Error;
};

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <p role="alert">{this.state.error.message}</p>;
    }

    return this.props.children;
  }
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
    },
  });
}

async function renderMyPageContent(serverQueryClient?: QueryClient) {
  const clientQueryClient = createQueryClient();
  const content = (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <MyPageContent />
      </Suspense>
    </ErrorBoundary>
  );

  return render(
    <QueryClientProvider client={clientQueryClient}>
      <ToastProvider>
        {serverQueryClient ? (
          <HydrationBoundary state={dehydrate(serverQueryClient)}>{content}</HydrationBoundary>
        ) : (
          content
        )}
      </ToastProvider>
    </QueryClientProvider>,
  );
}

beforeEach(async () => {
  vi.clearAllMocks();
  mocks.authLogout.mockResolvedValue({ result: "SUCCESS" });
  mocks.memberMe.mockResolvedValue(memberResponse);
  mocks.publicProfile.mockResolvedValue(publicProfileResponse);
  mocks.jobRoles.mockResolvedValue(jobRolesResponse);
  mocks.updateProfile.mockResolvedValue({ result: "SUCCESS" });
  await page.viewport(1000, 800);
});

describe("MyPageContent", () => {
  it("hydration된 쿼리로 마이페이지를 표시하고 같은 데이터를 다시 요청하지 않는다", async () => {
    const serverQueryClient = createQueryClient();
    serverQueryClient.setQueryData(["memberMe"], memberResponse);
    serverQueryClient.setQueryData(["publicProfile", member.memberId], publicProfileResponse);
    serverQueryClient.setQueryData(["jobRoles"], jobRolesResponse);

    const screen = await renderMyPageContent(serverQueryClient);

    await expect.element(screen.getByRole("heading", { name: member.nickname })).toBeVisible();
    await expect.element(screen.getByRole("heading", { name: "프로필 수정" })).toBeVisible();
    expect(mocks.memberMe).not.toHaveBeenCalled();
    expect(mocks.publicProfile).not.toHaveBeenCalled();
    expect(mocks.jobRoles).not.toHaveBeenCalled();
  });

  it("hydration 데이터가 없으면 빈 fallback 뒤에 재요청한 마이페이지를 표시한다", async () => {
    let resolveMember!: (value: typeof memberResponse) => void;
    mocks.memberMe.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMember = resolve;
        }),
    );

    const screen = await renderMyPageContent();

    await expect
      .element(screen.getByRole("heading", { name: member.nickname }))
      .not.toBeInTheDocument();
    expect(mocks.memberMe).toHaveBeenCalledOnce();

    resolveMember(memberResponse);

    await expect.element(screen.getByRole("heading", { name: member.nickname })).toBeVisible();
    expect(mocks.publicProfile).toHaveBeenCalledOnce();
    expect(mocks.jobRoles).toHaveBeenCalledOnce();
  });

  it("프로필 저장 성공을 즉시 알리고 회원과 공개 프로필을 다시 조회한다", async () => {
    const updatedBio = "구체적인 피드백을 좋아해요.";
    let resolveMember!: (value: typeof memberResponse) => void;
    let resolvePublicProfile!: (value: typeof publicProfileResponse) => void;
    mocks.memberMe.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveMember = resolve;
        }),
    );
    mocks.publicProfile.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePublicProfile = resolve;
        }),
    );
    const serverQueryClient = createQueryClient();
    serverQueryClient.setQueryData(["memberMe"], memberResponse);
    serverQueryClient.setQueryData(["publicProfile", member.memberId], publicProfileResponse);
    serverQueryClient.setQueryData(["jobRoles"], jobRolesResponse);
    const screen = await renderMyPageContent(serverQueryClient);

    await screen.getByLabelText("자기소개").fill(updatedBio);
    await screen.getByRole("button", { name: "저장하기" }).click();

    await expect
      .element(screen.getByRole("dialog", { name: "프로필을 저장했어요." }))
      .toBeVisible();
    await expect.poll(() => mocks.memberMe.mock.calls.length).toBe(1);
    await expect.poll(() => mocks.publicProfile.mock.calls.length).toBe(1);
    expect(mocks.jobRoles).not.toHaveBeenCalled();

    resolveMember({
      data: { ...member, profile: { ...member.profile, bio: updatedBio } },
      result: "SUCCESS",
    });
    resolvePublicProfile({
      data: { ...publicProfile, bio: updatedBio },
      result: "SUCCESS",
    });

    await expect.element(screen.getByText(updatedBio)).toBeVisible();
  });

  it.each([
    [
      "member",
      { data: undefined, result: "SUCCESS" },
      publicProfileResponse,
      jobRolesResponse,
      "Failed to load member",
    ],
    [
      "public profile",
      memberResponse,
      { data: undefined, result: "SUCCESS" },
      jobRolesResponse,
      "Failed to load public profile",
    ],
    [
      "job roles",
      memberResponse,
      publicProfileResponse,
      { data: undefined, result: "SUCCESS" },
      "Failed to load job roles",
    ],
  ])(
    "%s 응답에 데이터가 없으면 오류 경계로 전달한다",
    async (_, memberResult, profileResult, rolesResult, message) => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

      try {
        const serverQueryClient = createQueryClient();
        serverQueryClient.setQueryData(["memberMe"], memberResult);
        serverQueryClient.setQueryData(["publicProfile", member.memberId], profileResult);
        serverQueryClient.setQueryData(["jobRoles"], rolesResult);

        const screen = await renderMyPageContent(serverQueryClient);

        await expect.element(screen.getByRole("alert")).toHaveTextContent(message);
      } finally {
        consoleError.mockRestore();
      }
    },
  );
});
