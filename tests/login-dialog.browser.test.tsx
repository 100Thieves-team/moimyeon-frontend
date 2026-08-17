import { LoginDialog } from "@/features/auth/login-dialog";
import { LoginDialogController } from "@/features/auth/login-dialog-controller";
import { DevLoginForm } from "@/features/auth/dev-login-form";
import { TopBar } from "@/features/navigation/top-bar";
import "@/styles/global.css";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

const { issueDevSessionMock, navigation } = vi.hoisted(() => ({
  issueDevSessionMock: vi.fn(),
  navigation: {
    getCurrentMemberState: vi.fn(),
    routerRefresh: vi.fn(),
    routerReplace: vi.fn(),
    searchParams: new URLSearchParams(),
    segment: null as string | null,
  },
}));

vi.mock("@/api", () => ({
  issueDevSession: issueDevSessionMock,
}));
vi.mock("server-only", () => ({}));
vi.mock("@/features/auth/current-member-server", () => ({
  getCurrentMemberState: navigation.getCurrentMemberState,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: navigation.routerRefresh,
    replace: navigation.routerReplace,
  }),
  useSearchParams: () => navigation.searchParams,
  useSelectedLayoutSegment: () => navigation.segment,
}));

type TriggerName = "로그인" | "면접 만들기";

const dialogTitleByTrigger: Record<TriggerName, string> = {
  로그인: "로그인하고 함께 면접을 준비해 보세요",
  "면접 만들기": "로그인하고 면접을 만들어 보세요",
};

beforeEach(async () => {
  vi.clearAllMocks();
  navigation.getCurrentMemberState.mockResolvedValue({ error: {}, status: "anonymous" });
  navigation.searchParams = new URLSearchParams();
  navigation.segment = null;
  await page.viewport(1440, 1024);
});

async function openLoginDialog(triggerName: TriggerName, showDevLogin = false) {
  const screen = await render(
    <>
      {await TopBar()}
      <LoginDialog showDevLogin={showDevLogin} />
    </>,
  );
  const trigger = screen.getByRole("button", {
    exact: true,
    name: triggerName,
  });

  await trigger.click();

  const dialog = screen.getByRole("dialog", {
    name: dialogTitleByTrigger[triggerName],
  });
  await expect.element(dialog).toBeVisible();

  return { dialog, screen };
}

describe("LoginDialog", () => {
  it("로그인 클릭 시 함께 면접을 준비하는 문구와 홈 OAuth 의도를 표시한다", async () => {
    const { dialog, screen } = await openLoginDialog("로그인");
    const googleAction = screen.getByRole("link", {
      name: "Google로 계속하기",
    });

    await expect.element(googleAction).toHaveAttribute("href", "/auth/google/start?returnTo=%2F");
    await expect
      .element(screen.getByRole("heading", { name: "개발 환경 전용 로그인" }))
      .not.toBeInTheDocument();
    await screen.getByRole("button", { name: "로그인 창 닫기" }).click();

    await expect.element(dialog).not.toBeInTheDocument();
  });

  it("면접 만들기 클릭 시 면접 생성 문구와 생성 OAuth 의도를 표시한다", async () => {
    const { dialog, screen } = await openLoginDialog("면접 만들기");
    const googleAction = screen.getByRole("link", {
      name: "Google로 계속하기",
    });

    await expect
      .element(googleAction)
      .toHaveAttribute("href", "/auth/google/start?returnTo=%2Finterviews%2Fnew");

    await screen.getByRole("button", { name: "로그인 창 닫기" }).click();
    await expect.element(dialog).not.toBeInTheDocument();
  });

  it("OAuth 로그인 실패를 사용자에게 알린다", async () => {
    navigation.searchParams = new URLSearchParams("authError=login_failed");
    const screen = await render(<LoginDialogController />);

    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("로그인에 실패했어요. 다시 시도해 주세요.");
    await screen.getByRole("button", { name: "로그인 창 닫기" }).click();
  });
  it("개발 로그인을 활성화하면 UUID 폼을 표시한다", async () => {
    const { dialog, screen } = await openLoginDialog("로그인", true);

    await expect
      .element(screen.getByRole("heading", { name: "개발 환경 전용 로그인" }))
      .toBeVisible();
    await expect.element(screen.getByRole("textbox", { name: "회원 UUID" })).toBeVisible();

    await screen.getByRole("button", { name: "로그인 창 닫기" }).click();
    await expect.element(dialog).not.toBeInTheDocument();
  });

  it("개발 로그인에 성공하면 Dialog를 닫고 원래 경로로 이동한다", async () => {
    issueDevSessionMock.mockResolvedValue({ data: { result: "SUCCESS" } });
    const { dialog, screen } = await openLoginDialog("로그인", true);

    await screen
      .getByRole("textbox", { name: "회원 UUID" })
      .fill("518d3feb-5351-66b1-7ce1-3a32d6a50f0b");
    await screen.getByRole("button", { name: "dev 계정으로 로그인" }).click();

    await expect.element(dialog).not.toBeInTheDocument();
    await expect.poll(() => navigation.routerReplace).toHaveBeenCalledWith("/");
    expect(navigation.routerRefresh).toHaveBeenCalledOnce();
  });
});

describe("DevLoginForm", () => {
  const memberId = "518d3feb-5351-66b1-7ce1-3a32d6a50f0b";

  async function submitDevLogin(returnTo: "/" | "/interviews/new" = "/interviews/new") {
    const screen = await render(<DevLoginForm returnTo={returnTo} />);

    await screen.getByRole("textbox", { name: "회원 UUID" }).fill(memberId);
    await screen.getByRole("button", { name: "dev 계정으로 로그인" }).click();

    return screen;
  }

  it.each([
    ["비어 있으면", ""],
    ["공백뿐이면", "   "],
  ])("회원 UUID가 %s 오류를 안내하고 세션을 요청하지 않는다", async (_condition, value) => {
    const screen = await render(<DevLoginForm returnTo="/" />);

    await screen.getByRole("textbox", { name: "회원 UUID" }).fill(value);
    await screen.getByRole("button", { name: "dev 계정으로 로그인" }).click();

    await expect.element(screen.getByRole("alert")).toHaveTextContent("회원 UUID를 입력해 주세요.");
    expect(issueDevSessionMock).not.toHaveBeenCalled();
    expect(navigation.routerReplace).not.toHaveBeenCalled();
    expect(navigation.routerRefresh).not.toHaveBeenCalled();
  });

  it("UUID로 세션을 발급하면 바로 원래 경로로 이동한다", async () => {
    issueDevSessionMock.mockResolvedValue({ data: { result: "SUCCESS" } });

    await submitDevLogin();

    await expect.poll(() => navigation.routerReplace).toHaveBeenCalledWith("/interviews/new");
    expect(navigation.routerRefresh).toHaveBeenCalledOnce();
    expect(issueDevSessionMock).toHaveBeenCalledWith({
      body: { memberId },
      credentials: "include",
      throwOnError: false,
    });
  });

  it.each([
    ["E400", "회원 UUID 형식을 확인해 주세요."],
    ["E1006", "dev 환경에 존재하지 않는 회원이에요."],
  ])("%s 오류를 회원에게 안내하고 이동하지 않는다", async (code, message) => {
    issueDevSessionMock.mockResolvedValue({
      data: undefined,
      error: {
        error: { code, message: "API error" },
        result: "ERROR",
      },
    });

    const screen = await submitDevLogin("/");

    await expect.element(screen.getByRole("alert")).toHaveTextContent(message);
    expect(navigation.routerReplace).not.toHaveBeenCalled();
    expect(navigation.routerRefresh).not.toHaveBeenCalled();
  });

  it("알 수 없는 오류가 발생하면 공통 오류를 안내하고 이동하지 않는다", async () => {
    issueDevSessionMock.mockResolvedValue({
      data: undefined,
      error: {
        error: { code: "E500", message: "API error" },
        result: "ERROR",
      },
    });

    const screen = await submitDevLogin("/");

    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("dev 로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
    expect(navigation.routerReplace).not.toHaveBeenCalled();
    expect(navigation.routerRefresh).not.toHaveBeenCalled();
  });

  it("세션 발급 중에는 중복 제출을 막는다", async () => {
    let resolveRequest: (() => void) | undefined;
    issueDevSessionMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = () => resolve({ data: { result: "SUCCESS" } });
        }),
    );

    const screen = await submitDevLogin("/");
    const submitButton = screen.getByRole("button", { name: "로그인 중..." });

    await expect.element(submitButton).toBeDisabled();
    expect(issueDevSessionMock).toHaveBeenCalledTimes(1);
    expect(navigation.routerReplace).not.toHaveBeenCalled();
    expect(navigation.routerRefresh).not.toHaveBeenCalled();

    resolveRequest?.();

    await expect.poll(() => navigation.routerReplace).toHaveBeenCalledWith("/");
    expect(navigation.routerRefresh).toHaveBeenCalledOnce();
  });
});
