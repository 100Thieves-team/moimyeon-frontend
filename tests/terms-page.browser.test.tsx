import { beforeEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { TermsPage } from "@/features/terms/terms-page";
import "@/styles/global.css";

const { termsListMock } = vi.hoisted(() => ({
  termsListMock: vi.fn(),
}));

vi.mock("@/api/generated/sdk.gen", () => ({
  termsList: termsListMock,
}));

const serviceTerm = {
  content: "서비스 약관 본문",
  effectiveFrom: "2026-08-18",
  title: "모이면 서비스 이용약관",
  type: "SERVICE",
  version: "1.0",
};

beforeEach(async () => {
  vi.clearAllMocks();
  await page.viewport(1440, 1024);
});

async function renderTermsPage() {
  return render(await TermsPage({ type: "SERVICE" }));
}

describe("TermsPage", () => {
  it("요청한 종류의 약관 내용을 보여준다", async () => {
    termsListMock.mockResolvedValue({
      data: { data: { terms: [serviceTerm] }, result: "SUCCESS" },
    });
    const screen = await renderTermsPage();

    await expect
      .element(screen.getByRole("heading", { name: "모이면 서비스 이용약관" }))
      .toBeVisible();
    await expect.element(screen.getByText("서비스 약관 본문")).toBeVisible();
  });

  it("이용약관의 조항과 목록·링크를 읽을 수 있고 동일한 머리말은 한 번만 표시한다", async () => {
    termsListMock.mockResolvedValue({
      data: {
        data: {
          terms: [
            {
              ...serviceTerm,
              content: `# 모이면 서비스 이용약관

문서 버전: 1.0 · 시행일: 2026년 8월 18일

## 제1조 서비스 이용

1. 서비스는 **무료**로 운영합니다.
2. [개인정보 처리방침](/terms/privacy)을 확인할 수 있습니다.

## 제2조 문의

문의는 담당자에게 전달합니다.`,
            },
          ],
        },
        result: "SUCCESS",
      },
    });
    const screen = await renderTermsPage();

    await expect
      .element(screen.getByRole("heading", { name: serviceTerm.title, level: 1 }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("heading", { name: "제1조 서비스 이용", level: 2 }))
      .toBeVisible();
    await expect.element(screen.getByRole("list")).toHaveTextContent("서비스는 무료로 운영합니다.");
    await expect
      .element(screen.getByRole("link", { name: "개인정보 처리방침" }))
      .toHaveAttribute("href", "/terms/privacy");
    await expect.element(screen.getByText("문서 버전:", { exact: false })).not.toBeInTheDocument();
    await expect.element(screen.getByText("문의는 담당자에게 전달합니다.")).toBeVisible();
  });

  it("개인정보 처리방침의 수집 항목 표와 확인 중인 안내를 읽을 수 있다", async () => {
    termsListMock.mockResolvedValue({
      data: {
        data: {
          terms: [
            serviceTerm,
            {
              ...serviceTerm,
              type: "PRIVACY",
              title: "개인정보 처리방침",
              content: `> **[확정 필요]**로 표시한 보유기간은 확인 중입니다.

## 처리 목적과 항목

| 처리 업무 | 처리하는 정보 | 이용 목적 |
|---|---|---|
| 가입·로그인 | 이메일 | 회원 인증 |
| 이력서 요약 | PDF 추출 텍스트 | 면접 준비 |

[문의 기관](https://privacy.kisa.or.kr/)`,
            },
          ],
        },
        result: "SUCCESS",
      },
    });
    const screen = await render(await TermsPage({ type: "PRIVACY" }));

    await expect.element(screen.getByRole("heading", { name: "개인정보 처리방침" })).toBeVisible();
    await expect
      .element(screen.getByText("[확정 필요]로 표시한 보유기간은 확인 중입니다.", { exact: true }))
      .toBeVisible();
    await expect.element(screen.getByRole("columnheader", { name: "처리하는 정보" })).toBeVisible();
    await expect.element(screen.getByRole("cell", { name: "이메일", exact: true })).toBeVisible();
    await expect.element(screen.getByRole("cell", { name: "PDF 추출 텍스트" })).toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "문의 기관" }))
      .toHaveAttribute("href", "https://privacy.kisa.or.kr/");
  });

  it("요청한 종류의 약관이 없으면 실패 안내를 표시한다", async () => {
    termsListMock.mockResolvedValue({
      data: { data: { terms: [] }, result: "SUCCESS" },
    });
    const screen = await renderTermsPage();

    await expect.element(screen.getByRole("alert")).toHaveTextContent("약관을 불러오지 못했어요.");
  });

  it("API 요청이 실패하면 실패 안내를 표시한다", async () => {
    termsListMock.mockResolvedValue({
      data: undefined,
      error: { result: "ERROR" },
    });
    const screen = await renderTermsPage();

    await expect.element(screen.getByRole("alert")).toHaveTextContent("약관을 불러오지 못했어요.");
  });
});
