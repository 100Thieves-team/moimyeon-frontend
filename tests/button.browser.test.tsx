import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Button, LinkButton } from "@/components/button";
import "@/styles/global.css";

function ButtonFixture() {
  const [actionCount, setActionCount] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitCount((count) => count + 1);
      }}
    >
      <output aria-label="액션 횟수">{actionCount}</output>
      <output aria-label="제출 횟수">{submitCount}</output>
      <Button className="consumer-button" onClick={() => setActionCount((count) => count + 1)}>
        액션 실행
      </Button>
      <Button disabled onClick={() => setActionCount((count) => count + 1)}>
        비활성 액션
      </Button>
      <Button type="submit" variant="secondary">
        폼 제출
      </Button>
    </form>
  );
}

describe("Button", () => {
  it("일반 액션과 명시적인 폼 제출을 구분하고 비활성 액션을 실행하지 않는다", async () => {
    const screen = await render(<ButtonFixture />);

    const actionButton = screen.getByRole("button", { name: "액션 실행" });
    await expect.element(actionButton).toHaveClass("consumer-button");
    await actionButton.click();
    await expect.element(screen.getByLabelText("액션 횟수")).toHaveTextContent("1");
    await expect.element(screen.getByLabelText("제출 횟수")).toHaveTextContent("0");

    await screen.getByRole("button", { name: "비활성 액션" }).click({ force: true });
    await expect.element(screen.getByLabelText("액션 횟수")).toHaveTextContent("1");

    await screen.getByRole("button", { name: "폼 제출" }).click();
    await expect.element(screen.getByLabelText("제출 횟수")).toHaveTextContent("1");
  });
});

describe("LinkButton", () => {
  it("Next.js 링크의 이동 주소와 앵커 속성을 유지한다", async () => {
    const screen = await render(
      <LinkButton
        className="consumer-link"
        href="/interviews/new"
        rel="noreferrer"
        target="_blank"
        variant="secondary"
      >
        면접 만들기
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "면접 만들기" });
    await expect.element(link).toHaveClass("consumer-link");
    await expect.element(link).toHaveAttribute("href", "/interviews/new");
    await expect.element(link).toHaveAttribute("target", "_blank");
    await expect.element(link).toHaveAttribute("rel", "noreferrer");
  });
});
