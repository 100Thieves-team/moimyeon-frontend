import RootError from "@/app/error";
import NotFound from "@/app/not-found";
import ReviewError from "@/app/(site)/interviews/[roomId]/review/error";
import DetailError from "@/app/(site)/interviews/[roomId]/error";
import ApplyError from "@/app/(site)/interviews/[roomId]/apply/error";
import MyPageError from "@/app/(site)/mypage/error";
import MyInterviewsError from "@/app/(site)/interviews/me/error";
import "@/styles/global.css";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

const reset = vi.fn();

beforeEach(() => {
  reset.mockClear();
});

describe("오류 페이지", () => {
  const errorPages = [
    { name: "면접 상세", element: <DetailError reset={reset} /> },
    { name: "참가 신청", element: <ApplyError reset={reset} /> },
    { name: "후기 작성", element: <ReviewError reset={reset} /> },
    { name: "마이페이지", element: <MyPageError reset={reset} /> },
    { name: "내 면접", element: <MyInterviewsError /> },
  ];

  for (const { name, element } of errorPages) {
    it.each([
      { width: 390, titleSize: 36, bodySize: 18, buttonSize: 18 },
      { width: 1280, titleSize: 48, bodySize: 22, buttonSize: 20 },
    ])(
      `${name} 오류 화면은 너비 $width에서 제목을 설명과 버튼보다 크게 표시한다`,
      async ({ width, titleSize, bodySize, buttonSize }) => {
        await page.viewport(width, 900);
        const screen = await render(element);
        const heading = screen.getByRole("heading", { level: 1 }).element();
        expect(getComputedStyle(heading).fontSize).toBe(`${titleSize}px`);
        expect(getComputedStyle(heading).fontWeight).toBe("300");
        const container = screen.container;
        const contentStyle = getComputedStyle(container.querySelector("section")!);
        expect(contentStyle.borderWidth).toBe("0px");
        expect(contentStyle.boxShadow).toBe("none");
        expect(contentStyle.backgroundColor).toBe("rgba(0, 0, 0, 0)");
        expect(contentStyle.textAlign).toBe("center");
        for (const body of container.querySelectorAll("p, button, a")) {
          expect(getComputedStyle(body).fontSize).toBe(
            `${body.tagName === "P" ? bodySize : buttonSize}px`,
          );
        }
      },
    );
  }

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

  it("후기 정보를 불러오지 못하면 후기 문맥에서 다시 시도할 수 있다", async () => {
    const screen = await render(<ReviewError reset={reset} />);

    await expect
      .element(screen.getByRole("heading", { name: "후기 작성 정보를 불러오지 못했어요" }))
      .toBeVisible();
    await screen.getByRole("button", { name: "다시 시도하기" }).click();

    expect(reset).toHaveBeenCalledOnce();
    await expect
      .element(screen.getByRole("link", { name: "탐색으로 돌아가기" }))
      .toHaveAttribute("href", "/");
  });
});
