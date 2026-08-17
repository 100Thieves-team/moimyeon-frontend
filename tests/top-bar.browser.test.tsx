import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { TopBar } from "@/features/navigation/top-bar";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  getCurrentMemberState: vi.fn(),
  issueDevSession: vi.fn(),
  routerRefresh: vi.fn(),
  routerReplace: vi.fn(),
  segment: null as string | null,
}));

vi.mock("@/api", () => ({
  issueDevSession: mocks.issueDevSession,
}));
vi.mock("server-only", () => ({}));
vi.mock("@/features/auth/current-member-server", () => ({
  getCurrentMemberState: mocks.getCurrentMemberState,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mocks.routerRefresh,
    replace: mocks.routerReplace,
  }),
  useSelectedLayoutSegment: () => mocks.segment,
}));

beforeEach(async () => {
  vi.clearAllMocks();
  mocks.getCurrentMemberState.mockResolvedValue({ error: {}, status: "anonymous" });
  mocks.segment = null;
  await page.viewport(1440, 1024);
});

describe("TopBar", () => {
  it("로그인 회원에게 면접 만들기와 마이페이지 Avatar를 보여준다", async () => {
    mocks.getCurrentMemberState.mockResolvedValue({
      member: { nickname: "집요한 수달 07" },
      status: "authenticated",
    });
    const screen = await render(await TopBar());
    const avatarLink = screen.getByRole("link", { name: "집요한 수달 07 마이페이지" });

    await expect
      .element(screen.getByRole("link", { exact: true, name: "마이페이지" }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("link", { name: "면접 만들기" }))
      .toHaveAttribute("href", "/interviews/new");
    await expect.element(avatarLink).toHaveAttribute("href", "/mypage");
    await expect.element(avatarLink).toHaveTextContent("집");
  });

  it("홈에서 면접 탐색 메뉴를 활성 상태로 표시한다", async () => {
    mocks.getCurrentMemberState.mockResolvedValue({
      member: { nickname: "집요한 수달 07" },
      status: "authenticated",
    });
    const screen = await render(await TopBar());

    await expect
      .element(screen.getByRole("link", { name: "면접 탐색" }))
      .toHaveAttribute("aria-current", "page");
  });
});
