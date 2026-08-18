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
