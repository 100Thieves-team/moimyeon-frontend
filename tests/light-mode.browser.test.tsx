import { afterEach, describe, expect, it } from "vitest";
import { server } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Skeleton } from "@/components/skeleton";
import * as interviewStyles from "@/features/my-interviews/my-interviews.css";
import * as trustStyles from "@/features/trust-card/trust-card.css";
import "@/styles/global.css";

const previousTheme = localStorage.getItem("theme");

afterEach(() => {
  if (previousTheme === null) localStorage.removeItem("theme");
  else localStorage.setItem("theme", previousTheme);
});

describe("라이트모드 고정", () => {
  it.each([false, true])(
    "저장된 다크 선택값(%s)과 시스템 설정에 관계없이 라이트 색상을 표시한다",
    async (savedDark) => {
      if (savedDark) localStorage.setItem("theme", "dark");
      else localStorage.removeItem("theme");

      expect(matchMedia("(prefers-color-scheme: dark)").matches).toBe(
        server.config.name === "chromium-light-in-dark-system",
      );

      const screen = await render(
        <main>
          <article className={interviewStyles.card} aria-label="내 면접">
            <h1 className={interviewStyles.title}>면접 준비</h1>
            <span className={interviewStyles.pendingChip}>승인 대기</span>
            <span className={interviewStyles.upcomingChip}>진행 예정</span>
          </article>
          <section className={trustStyles.popup} aria-label="참여자 정보">
            <span className={trustStyles.hostBadge}>방장</span>
          </section>
          <div data-testid="loading">
            <Skeleton width="20rem" height="2rem" />
          </div>
        </main>,
      );

      expect(getComputedStyle(document.documentElement).colorScheme).toBe("light only");
      expect(getComputedStyle(document.body).backgroundColor).toBe("rgb(248, 248, 248)");
      expect(getComputedStyle(document.body).color).toBe("rgba(0, 0, 0, 0.85)");
      await expect
        .element(screen.getByRole("article", { name: "내 면접" }))
        .toHaveStyle({ backgroundColor: "rgb(255, 255, 255)" });
      await expect
        .element(screen.getByRole("heading", { name: "면접 준비" }))
        .toHaveStyle({ color: "rgba(0, 0, 0, 0.85)" });
      await expect.element(screen.getByText("승인 대기")).toHaveStyle({ color: "rgb(52, 11, 5)" });
      await expect.element(screen.getByText("진행 예정")).toHaveStyle({ color: "rgb(3, 88, 247)" });
      await expect
        .element(screen.getByRole("region", { name: "참여자 정보" }))
        .toHaveStyle({ backgroundColor: "rgb(255, 255, 255)" });
      await expect.element(screen.getByText("방장")).toHaveStyle({ color: "rgb(52, 11, 5)" });
      const skeleton = screen.getByTestId("loading").element().firstElementChild!;
      expect(getComputedStyle(skeleton).backgroundColor).toBe("rgba(0, 0, 0, 0.08)");
      expect(getComputedStyle(skeleton, "::after").backgroundImage).toContain(
        "rgba(248, 248, 248, 0.5)",
      );
    },
  );
});
