import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import type { Resumes } from "@/features/resume/resume-model";
import { ResumeManager } from "@/features/mypage/resume-manager";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  createResume: vi.fn(),
  deleteResume: vi.fn(),
  makeResumeDefault: vi.fn(),
  resumes: vi.fn(),
  retryResumeSummary: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  createResumeMutation: () => ({
    mutationFn: async (options: { body: { file: File } }) => {
      const result = await mocks.createResume({ ...options, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
  deleteResumeMutation: () => ({
    mutationFn: async (options: { path: { resumeId: string } }) => {
      const result = await mocks.deleteResume({ ...options, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
  makeResumeDefaultMutation: () => ({
    mutationFn: async (options: { path: { resumeId: string } }) => {
      const result = await mocks.makeResumeDefault({ ...options, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
  resumesOptions: () => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.resumes({ signal, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
    queryKey: ["resumes"],
  }),
  resumesQueryKey: () => ["resumes"],
  retryResumeSummaryMutation: () => ({
    mutationFn: async (options: { path: { resumeId: string } }) => {
      const result = await mocks.retryResumeSummary({ ...options, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
}));

const resumes: Resumes = {
  maxCount: 10,
  resumes: [
    {
      aiSummary: {
        status: "DONE",
        text: "핀테크 백엔드 3년 차 · 결제 정산 배치·대사 · Kotlin·Spring",
      },
      file: {
        contentType: "application/pdf",
        originalName: "든든한곰_이력서.pdf",
        sizeBytes: 217_088,
      },
      isDefault: true,
      name: "든든한곰_이력서.pdf",
      registeredAt: "2026-07-12T09:30:00",
      resumeId: "resume-done",
    },
    {
      aiSummary: { status: "PROCESSING", text: null },
      file: {
        contentType: "application/pdf",
        originalName: "든든한곰_이력서_시스템설계.pdf",
        sizeBytes: 229_376,
      },
      isDefault: false,
      name: "든든한곰_이력서_시스템설계.pdf",
      registeredAt: "2026-08-01T12:00:00",
      resumeId: "resume-processing",
    },
    {
      aiSummary: { status: "FAILED", text: null },
      file: {
        contentType: "application/pdf",
        originalName: "든든한곰_이력서_커머스.pdf",
        sizeBytes: 202_752,
      },
      isDefault: false,
      name: "든든한곰_이력서_커머스.pdf",
      registeredAt: "2026-06-28T12:00:00",
      resumeId: "resume-failed",
    },
  ],
};

function sdkSuccess(data: Record<string, unknown>) {
  return {
    data: { data, result: "SUCCESS" },
    error: undefined,
    response: new Response(null, { status: 200 }),
  };
}

function chooseFile(input: HTMLInputElement, file: File) {
  const transfer = new DataTransfer();
  transfer.items.add(file);
  Object.defineProperty(input, "files", { configurable: true, value: transfer.files });
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function renderResumeManager({ resumeData = resumes } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(["resumes"], { data: resumeData, result: "SUCCESS" });

  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <ResumeManager />
      </Suspense>
    </QueryClientProvider>,
  );
}

beforeEach(async () => {
  vi.clearAllMocks();
  mocks.resumes.mockResolvedValue(sdkSuccess(resumes));
  await page.viewport(1200, 900);
});

describe("ResumeManager", () => {
  it("보관 이력서 목록과 기본 배지, AI 요약 상태를 보여준다", async () => {
    const screen = await renderResumeManager();

    await expect.element(screen.getByText("든든한곰_이력서.pdf")).toBeVisible();
    await expect.element(screen.getByText("기본", { exact: true })).toBeVisible();
    await expect.element(screen.getByText("7월 12일 업데이트 · 212KB")).toBeVisible();
    await expect
      .element(
        screen.getByText("AI 요약 — 핀테크 백엔드 3년 차 · 결제 정산 배치·대사 · Kotlin·Spring"),
      )
      .toBeVisible();
    await expect.element(screen.getByText("AI 요약을 만들고 있어요 — 잠깐이면 돼요")).toBeVisible();
    await expect.element(screen.getByText("AI 요약을 만들지 못했어요.")).toBeVisible();
    await expect
      .element(
        screen.getByRole("button", { name: "든든한곰_이력서_커머스.pdf AI 요약 다시 만들기" }),
      )
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: "이력서 업로드" })).toBeEnabled();
    await expect
      .element(screen.getByRole("button", { name: "든든한곰_이력서.pdf 기본으로 지정" }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "든든한곰_이력서_시스템설계.pdf 기본으로 지정" }))
      .toBeDisabled();
    await expect
      .element(screen.getByRole("button", { name: "든든한곰_이력서_커머스.pdf 기본으로 지정" }))
      .toBeDisabled();
  });

  it("AI 요약이 완료된 이력서를 기본으로 지정하면 기본 배지가 옮겨간다", async () => {
    const commerceDone = {
      ...resumes.resumes[2],
      aiSummary: { status: "DONE", text: "커머스 주문·재고 프로젝트 중심" },
    };
    const seeded = { ...resumes, resumes: [resumes.resumes[0], resumes.resumes[1], commerceDone] };
    mocks.makeResumeDefault.mockResolvedValue(sdkSuccess({}));
    mocks.resumes.mockResolvedValue(
      sdkSuccess({
        ...seeded,
        resumes: seeded.resumes.map((resume) => ({
          ...resume,
          isDefault: resume.resumeId === "resume-failed",
        })),
      }),
    );
    const screen = await renderResumeManager({ resumeData: seeded });

    await screen.getByRole("button", { name: "든든한곰_이력서_커머스.pdf 기본으로 지정" }).click();

    await expect
      .element(screen.getByRole("button", { name: "든든한곰_이력서_커머스.pdf 기본으로 지정" }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "든든한곰_이력서.pdf 기본으로 지정" }))
      .toBeEnabled();
    expect(mocks.makeResumeDefault).toHaveBeenCalledWith(
      expect.objectContaining({ path: { resumeId: "resume-failed" } }),
    );
  });

  it("기본 지정에 실패하면 해당 이력서에 오류를 보여준다", async () => {
    const commerceDone = {
      ...resumes.resumes[2],
      aiSummary: { status: "DONE", text: "커머스 주문·재고 프로젝트 중심" },
    };
    const seeded = { ...resumes, resumes: [resumes.resumes[0], resumes.resumes[1], commerceDone] };
    mocks.makeResumeDefault.mockResolvedValue({
      data: undefined,
      error: { error: { code: "E1012", message: "AI 요약이 완료된 이력서만 사용할 수 있습니다." } },
      response: new Response(null, { status: 409 }),
    });
    const screen = await renderResumeManager({ resumeData: seeded });

    await screen.getByRole("button", { name: "든든한곰_이력서_커머스.pdf 기본으로 지정" }).click();

    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("AI 요약이 완료된 이력서만 사용할 수 있습니다.");
  });

  it("PDF 파일을 올리면 이력서가 목록에 추가된다", async () => {
    const uploadedResume = {
      aiSummary: { status: "PROCESSING", text: null },
      file: { contentType: "application/pdf", originalName: "새_이력서.pdf", sizeBytes: 1_024 },
      isDefault: false,
      name: "새_이력서.pdf",
      registeredAt: "2026-08-31T12:00:00",
      resumeId: "resume-uploaded",
    };
    mocks.createResume.mockResolvedValue(sdkSuccess(uploadedResume));
    mocks.resumes.mockResolvedValue(
      sdkSuccess({ ...resumes, resumes: [uploadedResume, ...resumes.resumes] }),
    );
    const screen = await renderResumeManager();

    const fileInput = screen.getByLabelText("새 이력서 파일").element() as HTMLInputElement;
    chooseFile(fileInput, new File(["pdf"], "새_이력서.pdf", { type: "application/pdf" }));

    await expect.element(screen.getByText("새_이력서.pdf")).toBeVisible();
    expect(mocks.createResume).toHaveBeenCalledOnce();
  });

  it("PDF가 아닌 파일은 오류를 보여주고 업로드하지 않는다", async () => {
    const screen = await renderResumeManager();

    const fileInput = screen.getByLabelText("새 이력서 파일").element() as HTMLInputElement;
    chooseFile(fileInput, new File(["text"], "resume.txt", { type: "text/plain" }));

    await expect.element(screen.getByRole("alert")).toHaveTextContent("PDF 파일만 올릴 수 있어요.");
    expect(mocks.createResume).not.toHaveBeenCalled();
  });

  it("삭제를 확인하면 이력서가 목록에서 사라진다", async () => {
    mocks.deleteResume.mockResolvedValue(sdkSuccess({}));
    const screen = await renderResumeManager();

    await screen.getByRole("button", { name: "든든한곰_이력서_커머스.pdf 삭제" }).click();

    await expect.element(screen.getByRole("alertdialog")).toBeVisible();

    mocks.resumes.mockResolvedValue(
      sdkSuccess({
        ...resumes,
        resumes: resumes.resumes.filter((resume) => resume.resumeId !== "resume-failed"),
      }),
    );
    await screen.getByRole("button", { name: "삭제하기" }).click();

    await expect.element(screen.getByText("든든한곰_이력서_커머스.pdf")).not.toBeInTheDocument();
    expect(mocks.deleteResume).toHaveBeenCalledWith(
      expect.objectContaining({ path: { resumeId: "resume-failed" } }),
    );
  });

  it("실패한 AI 요약을 다시 만들면 요약이 갱신된다", async () => {
    const retriedResume = {
      ...resumes.resumes[2],
      aiSummary: { status: "DONE", text: "커머스 주문·재고 프로젝트 중심" },
    };
    mocks.retryResumeSummary.mockResolvedValue(sdkSuccess(retriedResume));
    mocks.resumes.mockResolvedValue(
      sdkSuccess({
        ...resumes,
        resumes: resumes.resumes.map((resume) =>
          resume.resumeId === "resume-failed" ? retriedResume : resume,
        ),
      }),
    );
    const screen = await renderResumeManager();

    await screen
      .getByRole("button", { name: "든든한곰_이력서_커머스.pdf AI 요약 다시 만들기" })
      .click();

    await expect
      .element(screen.getByText("AI 요약 — 커머스 주문·재고 프로젝트 중심"))
      .toBeVisible();
    expect(mocks.retryResumeSummary).toHaveBeenCalledWith(
      expect.objectContaining({ path: { resumeId: "resume-failed" } }),
    );
  });

  it("보관 한도에 도달하면 업로드 버튼을 비활성화하고 안내한다", async () => {
    const screen = await renderResumeManager({
      resumeData: { ...resumes, maxCount: resumes.resumes.length },
    });

    await expect.element(screen.getByRole("button", { name: "이력서 업로드" })).toBeDisabled();
    await expect.element(screen.getByText(/최대 3개까지 보관할 수 있어요/)).toBeVisible();
  });

  it("보관 이력서가 없으면 빈 상태 안내를 보여준다", async () => {
    const screen = await renderResumeManager({ resumeData: { maxCount: 10, resumes: [] } });

    await expect.element(screen.getByText(/보관 중인 이력서가 아직 없어요/)).toBeVisible();
    await expect.element(screen.getByRole("button", { name: "이력서 업로드" })).toBeEnabled();
  });
});
