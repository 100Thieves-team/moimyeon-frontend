import { beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { InterviewApplyForm } from "@/features/interview-mock/interview-apply-form";
import { InterviewComments } from "@/features/interview-mock/interview-comments";
import { InterviewExplore } from "@/features/interview-mock/interview-explore";
import { InterviewReview } from "@/features/interview-mock/interview-review";
import { mockInterviews } from "@/features/interview-mock/mock-data";
import { MyInterviews } from "@/features/interview-mock/my-interviews";
import { MockFlowProvider } from "@/features/interview-mock/mock-flow-store";
import "@/styles/global.css";

beforeEach(async () => {
  window.history.replaceState(null, "", "/");
  await page.viewport(1200, 900);
});

describe("발표용 면접 흐름", () => {
  it("필터를 적용하고 결과가 없으면 면접 만들기와 추천 면접을 안내한다", async () => {
    const screen = await render(<InterviewExplore />);

    await expect.element(screen.getByRole("heading", { name: "면접 탐색 24개" })).toBeVisible();
    await screen.getByRole("button", { name: "PM" }).click();

    await expect.poll(() => new URLSearchParams(window.location.search).get("role")).toBe("pm");
    await expect.element(screen.getByRole("heading", { name: "면접 탐색 4개" })).toBeVisible();

    await screen.getByRole("textbox", { name: "회사" }).fill("존재하지 않는 회사");
    await screen.getByRole("button", { name: "회사 검색" }).click();

    await expect
      .element(screen.getByRole("heading", { name: "조건에 딱 맞는 면접이 아직 없어요" }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "이 조건으로 면접 만들기" }))
      .toHaveAttribute("href", expect.stringContaining("/interviews/new?"));
    await expect
      .element(screen.getByRole("heading", { name: "이런 면접은 어떠세요?" }))
      .toBeVisible();
  });

  it("참가 신청을 보내면 내 면접의 신청 중 상태로 이동한다", async () => {
    window.history.replaceState(
      null,
      "",
      "/interviews/hanbit-backend-second/apply?returnTo=%2F%3Frole%3Dbackend",
    );
    const screen = await render(<InterviewApplyForm interview={mockInterviews[0]} />);

    await expect.element(screen.getByText("든든한곰_이력서.pdf")).toBeVisible();
    await screen.getByRole("button", { name: "신청 보내기" }).click();

    await expect.poll(() => window.location.pathname).toBe("/my-interviews");
    const next = new URLSearchParams(window.location.search);
    expect(next.get("application")).toBe("pending");
    expect(next.get("tab")).toBe("pending");
    expect(next.get("returnTo")).toBe("/?role=backend");
  });

  it("참여자는 댓글을 새로 남길 수 있다", async () => {
    const screen = await render(<InterviewComments interview={mockInterviews[1]} />);

    await screen
      .getByRole("textbox", { name: /댓글을 남겨요/ })
      .fill("면접 전에 예상 질문을 공유할게요.");
    await screen.getByRole("button", { name: "남기기" }).click();

    await expect.element(screen.getByText("면접 전에 예상 질문을 공유할게요.")).toBeVisible();
  });

  it("신청을 취소하면 신청 중 목록에서 제거한다", async () => {
    window.history.replaceState(null, "", "/my-interviews?application=pending&tab=pending");
    const screen = await render(
      <MockFlowProvider>
        <MyInterviews />
      </MockFlowProvider>,
    );

    await screen.getByRole("button", { name: "신청 취소" }).click();

    await expect
      .poll(() => new URLSearchParams(window.location.search).get("application"))
      .toBe("withdrawn");
    await expect.element(screen.getByText("신청 중인 면접이 없어요.")).toBeVisible();
  });

  it("완료된 면접의 댓글은 읽기 전용으로 보여준다", async () => {
    window.history.replaceState(
      null,
      "",
      `/interviews/${mockInterviews[1].id}/comments?mode=readonly`,
    );
    const screen = await render(<InterviewComments interview={mockInterviews[1]} />);

    await expect
      .element(
        screen.getByText("읽기 전용이에요. 지난 댓글은 볼 수 있지만 새 댓글은 남길 수 없어요."),
      )
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: "남기기" })).not.toBeInTheDocument();
  });

  it("후기를 제출하면 완료 탭의 제출 상태로 이동한다", async () => {
    window.history.replaceState(null, "", `/interviews/${mockInterviews[2].id}/reviews`);
    const screen = await render(<InterviewReview interview={mockInterviews[2]} />);

    await screen.getByRole("button", { name: "후기 제출하기" }).click();

    await expect.poll(() => window.location.pathname).toBe("/my-interviews");
    const next = new URLSearchParams(window.location.search);
    expect(next.get("tab")).toBe("completed");
    expect(next.get("review")).toBe("submitted");
  });
});
