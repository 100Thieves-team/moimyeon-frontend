import { LoginDialog } from "@/features/auth/login-dialog";
import { TopBar } from "@/features/navigation/top-bar";
import "@/styles/global.css";
import { beforeEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

function LoginFixture() {
  return (
    <>
      <TopBar />
      <LoginDialog />
    </>
  );
}

type TriggerName = "로그인" | "면접 만들기";

beforeEach(async () => {
  await page.viewport(1440, 1024);
});

async function openLoginDialog(triggerName: TriggerName) {
  const screen = await render(<LoginFixture />);
  const trigger = screen.getByRole("button", {
    name: triggerName,
  });

  await trigger.click();

  const dialog = screen.getByRole("dialog", {
    name: "로그인하고 면접을 만들 수 있어요",
  });
  await expect.element(dialog).toBeVisible();

  return { dialog, screen };
}

describe("LoginDialog", () => {
  it("로그인 의도를 홈 OAuth 시작 주소로 전달한다", async () => {
    const { dialog, screen } = await openLoginDialog("로그인");
    const googleAction = screen.getByRole("link", {
      name: "Google로 계속하기",
    });

    await expect.element(googleAction).toHaveAttribute("href", "/auth/google/start?returnTo=%2F");
    await screen.getByRole("button", { name: "다음에 할게요" }).click();

    await expect.element(dialog).not.toBeInTheDocument();
  });

  it("생성 의도를 OAuth 시작 주소로 전달한다", async () => {
    const { dialog, screen } = await openLoginDialog("면접 만들기");
    const googleAction = screen.getByRole("link", {
      name: "Google로 계속하기",
    });

    await expect
      .element(googleAction)
      .toHaveAttribute("href", "/auth/google/start?returnTo=%2Finterviews%2Fnew");

    await screen.getByRole("button", { name: "다음에 할게요" }).click();
    await expect.element(dialog).not.toBeInTheDocument();
  });
});
