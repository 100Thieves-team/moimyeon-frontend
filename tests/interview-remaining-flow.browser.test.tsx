import { beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/toast";
import { InterviewPrepare } from "@/features/interview-mock/interview-prepare";
import { InterviewSession } from "@/features/interview-mock/interview-session";
import { MockActivityReviews, MockResumeManager } from "@/features/interview-mock/mock-mypage-tabs";
import { mockScenarioInterviews } from "@/features/interview-mock/mock-data";
import { MockFlowProvider } from "@/features/interview-mock/mock-flow-store";
import { RoomApplications } from "@/features/interview-mock/room-applications";
import { RoomInfo } from "@/features/interview-mock/room-info";
import "@/styles/global.css";

beforeEach(async () => {
  window.history.replaceState(null, "", "/");
  await page.viewport(1200, 900);
});

function renderFlow(children: ReactNode) {
  return render(
    <ToastProvider>
      <MockFlowProvider>{children}</MockFlowProvider>
    </ToastProvider>,
  );
}

describe("남은 Figma 발표 흐름", () => {
  it("방장이 신청을 수락하고 반려하면 신청 목록과 참여 인원을 갱신한다", async () => {
    const screen = await renderFlow(
      <RoomApplications interview={mockScenarioInterviews.hostRecruiting} />,
    );

    await screen.getByRole("button", { name: "수락" }).first().click();
    await expect.element(screen.getByText("5 / 5명", { exact: false })).toBeVisible();

    await screen.getByRole("button", { name: "반려" }).click();
    await expect.element(screen.getByRole("dialog")).toBeVisible();
    await screen.getByRole("button", { name: "반려 보내기" }).click();

    await expect.element(screen.getByText("대기 중인 참가 신청이 없어요")).toBeVisible();
  });

  it("방장이 조건을 확인한 뒤 진행을 확정한다", async () => {
    const screen = await renderFlow(<RoomInfo interview={mockScenarioInterviews.hostRecruiting} />);

    await screen.getByRole("button", { name: "진행 확정하기" }).click();
    await expect.element(screen.getByRole("dialog")).toBeVisible();
    await screen.getByRole("button", { name: "진행 확정하기" }).last().click();

    await expect.element(screen.getByText("면접 진행을 준비해 주세요")).toBeVisible();
    await expect.element(screen.getByRole("link", { name: "진행 준비하기" })).toBeVisible();
  });

  it("참여자는 AI 질문을 채택하고 자기 카드셋 잠금 상태를 확인한다", async () => {
    const screen = await renderFlow(
      <InterviewPrepare interview={mockScenarioInterviews.confirmedParticipant} />,
    );

    const suggestion = "배치 처리에서 대규모 트래픽을 가정한다면 무엇부터 바꾸시겠어요?";
    await expect.element(screen.getByText(suggestion)).toBeVisible();
    await screen.getByRole("button", { name: "채택" }).first().click();
    await expect.element(screen.getByText("AI 생성")).toBeVisible();

    await screen.getByRole("button", { name: /든든한 곰 21/ }).click();
    await expect.element(screen.getByText("내 면접 질문은 볼 수 없어요")).toBeVisible();
  });

  it("출석 확인 후 면접과 피드백, 클로징을 순서대로 진행한다", async () => {
    window.history.replaceState(null, "", "/interviews/hanbit-host-today/prepare");
    const prepareScreen = await renderFlow(
      <InterviewPrepare interview={mockScenarioInterviews.hostToday} />,
    );

    await prepareScreen.getByRole("button", { name: "면접 진행하기" }).click();
    await prepareScreen.getByRole("button", { name: "면접 시작하기" }).click();
    await expect.poll(() => window.location.pathname).toBe("/interviews/hanbit-host-today/session");
    await prepareScreen.unmount();

    window.history.replaceState(
      null,
      "",
      "/interviews/hanbit-host-today/session?stage=interview&target=deer&onboarding=1",
    );
    const sessionScreen = await renderFlow(
      <InterviewSession interview={mockScenarioInterviews.hostToday} />,
    );

    await sessionScreen.getByRole("button", { name: "다음" }).click();
    await sessionScreen.getByRole("button", { name: "다음" }).click();
    await sessionScreen.getByRole("button", { name: "시작하기" }).click();
    await sessionScreen
      .getByRole("textbox", { name: /떠오른 질문/ })
      .fill("장애 복구 시간을 어떻게 측정했나요?");
    await sessionScreen.getByRole("button", { name: "질문 추가" }).click();
    await expect
      .element(sessionScreen.getByText("장애 복구 시간을 어떻게 측정했나요?"))
      .toBeVisible();

    await sessionScreen.getByRole("button", { name: "피드백" }).click();
    await expect.element(sessionScreen.getByRole("textbox", { name: "최종 피드백" })).toBeVisible();

    await sessionScreen.getByRole("button", { name: "든든한 곰 21" }).click();
    await sessionScreen.getByRole("button", { name: "피드백" }).click();
    await sessionScreen.getByRole("button", { name: "열람하기" }).click();
    await sessionScreen.getByRole("button", { name: "열람하기" }).last().click();
    await expect.element(sessionScreen.getByText(/질문 의도를 되묻고/)).toBeVisible();

    await sessionScreen.getByRole("button", { name: "클로징" }).click();
    await sessionScreen.getByRole("button", { name: "면접 완료하기" }).click();
    await expect.poll(() => window.location.pathname).toBe("/my-interviews");
  });

  it("마이페이지에서 이력서와 받은 후기를 로컬 상태로 관리한다", async () => {
    const screen = await renderFlow(
      <>
        <MockResumeManager />
        <MockActivityReviews />
      </>,
    );

    const input = screen.getByLabelText("이력서 업로드").element() as HTMLInputElement;
    const transfer = new DataTransfer();
    transfer.items.add(new File(["pdf"], "발표용_이력서.pdf", { type: "application/pdf" }));
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    await expect.element(screen.getByText("발표용_이력서.pdf")).toBeVisible();
    await screen.getByRole("button", { name: "후기 8개 더 보기" }).click();
    await expect.element(screen.getByText("다음에 연습할 방향까지 제안해 주셨어요.")).toBeVisible();
    await screen.getByRole("button", { name: "신고" }).first().click();
    await expect.element(screen.getByRole("button", { name: "신고됨" })).toBeDisabled();
  });
});
