import RootError from "@/app/error";
import NotFound from "@/app/not-found";
import "@/styles/global.css";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

const reset = vi.fn();

beforeEach(() => {
  reset.mockClear();
});

describe("오류 페이지", () => {
  it("없는 페이지에서 홈으로 돌아갈 수 있다", async () => {
    const screen = await render(<NotFound />);

    await expect.element(screen.getByRole("heading", { name: "404" })).toBeVisible();
    await expect.element(screen.getByText("페이지를 찾을 수 없어요.")).toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "홈으로 돌아가기" }))
      .toHaveAttribute("href", "/");
  });

  it("예기치 않은 오류에서 다시 시도하거나 홈으로 이동할 수 있다", async () => {
    const screen = await render(<RootError error={new Error("테스트 오류")} reset={reset} />);

    await screen.getByRole("button", { name: "다시 시도하기" }).click();

    expect(reset).toHaveBeenCalledOnce();
    await expect
      .element(screen.getByRole("link", { name: "홈으로 돌아가기" }))
      .toHaveAttribute("href", "/");
  });
});
