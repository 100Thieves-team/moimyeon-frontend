import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { InterviewApplyContent } from "@/features/interview-apply/interview-apply-content";
import type { Resumes } from "@/features/resume/resume-model";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  createResume: vi.fn(),
  resumes: vi.fn(),
  roomDetail: vi.fn(),
  submitRoomApplication: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  createResumeMutation: () => ({
    mutationFn: async (options: { body: { file: File } }) => {
      const result = await mocks.createResume({ ...options, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
  myRoomApplicationQueryKey: ({ path }: { path: { roomId: string } }) => [
    "myRoomApplication",
    path.roomId,
  ],
  resumesOptions: () => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.resumes({ signal, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
    queryKey: ["resumes"],
  }),
  resumesQueryKey: () => ["resumes"],
  roomDetailOptions: ({ path }: { path: { roomId: string } }) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.roomDetail({ path, signal, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
    queryKey: ["roomDetail", path.roomId],
  }),
  roomDetailQueryKey: ({ path }: { path: { roomId: string } }) => ["roomDetail", path.roomId],
  roomsQueryKey: () => ["rooms"],
  submitRoomApplicationMutation: () => ({
    mutationFn: async (options: {
      body: { note: string; resumeId: string };
      path: { roomId: string };
    }) => {
      const result = await mocks.submitRoomApplication({ ...options, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
  }),
}));

const roomId = "019db000-0000-7000-8000-000000002001";

const room = {
  company: { companyId: 1, name: "한빛커머스" },
  hostMemberId: "019db000-0000-7000-8000-000000001001",
  method: "ONLINE",
  methodLabel: "온라인",
  recruit: {
    current: 3,
    max: 5,
    min: 3,
    pendingApplicationCount: 0,
    recruitStatus: "RECRUITING",
    recruitStatusLabel: "모집 중",
  },
  region: null,
  resumePublic: true,
  roomId,
  round: "SECOND",
  roundLabel: "2차",
  schedule: { durationMinutes: 90, startAt: "2099-09-01T19:00:00+09:00" },
  status: "RECRUITING",
  title: "한빛커머스 백엔드 2차 같이 준비해요",
  viewer: {
    hasRemovalHistory: false,
    isHost: false,
    isParticipating: false,
    latestApplicationStatus: null,
    member: {
      isActive: true,
      participationSlots: { limit: 3, occupied: 0 },
      pendingApplicationQuota: { limit: 3, occupied: 0 },
    },
  },
};

const resumes: Resumes = {
  maxCount: 10,
  resumes: [
    {
      aiSummary: { status: "DONE", text: "최근 사용 이력서의 요약이에요." },
      file: {
        contentType: "application/pdf",
        originalName: "최근_이력서.pdf",
        sizeBytes: 212_000,
      },
      isDefault: false,
      lastUsed: {
        roomId: "room-recent",
        roomTitle: "최근 면접",
        usedAt: "2026-08-30T12:00:00",
      },
      name: "최근_이력서.pdf",
      registeredAt: "2026-08-30T12:00:00",
      resumeId: "resume-recent",
    },
    {
      aiSummary: { status: "PROCESSING", text: null },
      file: {
        contentType: "application/pdf",
        originalName: "기본_이력서.pdf",
        sizeBytes: 245_760,
      },
      isDefault: true,
      name: "기본_이력서.pdf",
      registeredAt: "2026-08-20T12:00:00",
      resumeId: "resume-default",
    },
    {
      aiSummary: { status: "FAILED", text: null },
      file: {
        contentType: "application/pdf",
        originalName: "실패_이력서.pdf",
        sizeBytes: 1_024_000,
      },
      isDefault: false,
      name: "실패_이력서.pdf",
      registeredAt: "2026-08-10T12:00:00",
      resumeId: "resume-failed",
    },
  ],
};

const uploadedResume: Resumes["resumes"][number] = {
  aiSummary: { status: "FAILED", text: null },
  file: {
    contentType: "application/pdf",
    originalName: "새_이력서.pdf",
    sizeBytes: 1_024,
  },
  isDefault: false,
  name: "새_이력서.pdf",
  registeredAt: "2026-09-02T12:00:00",
  resumeId: "resume-uploaded",
};

function sdkSuccess(data: Record<string, unknown>, status = 200) {
  return {
    data: { data, result: "SUCCESS" },
    error: undefined,
    response: new Response(null, { status }),
  };
}

function sdkFailure(code: string, message: string, status = 400) {
  return {
    data: undefined,
    error: { error: { code, data: null, message }, result: "ERROR" },
    response: new Response(null, { status }),
  };
}

function renderApply(resumeData: Resumes = resumes) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Number.POSITIVE_INFINITY } },
  });
  queryClient.setQueryData(["roomDetail", roomId], { data: room, result: "SUCCESS" });
  queryClient.setQueryData(["resumes"], { data: resumeData, result: "SUCCESS" });

  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<p>불러오는 중</p>}>
        <InterviewApplyContent roomId={roomId} />
      </Suspense>
    </QueryClientProvider>,
  );
}

function chooseFile(input: HTMLInputElement, file: File) {
  const transfer = new DataTransfer();
  transfer.items.add(file);
  Object.defineProperty(input, "files", { configurable: true, value: transfer.files });
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

beforeEach(async () => {
  vi.clearAllMocks();
  window.history.replaceState(null, "", `/interviews/${roomId}/apply`);
  mocks.roomDetail.mockResolvedValue(sdkSuccess(room));
  mocks.resumes.mockResolvedValue(sdkSuccess(resumes));
  mocks.createResume.mockResolvedValue(sdkSuccess(uploadedResume, 201));
  mocks.submitRoomApplication.mockResolvedValue(
    sdkSuccess({ applicationId: 10, status: "PENDING", statusLabel: "대기 중" }, 201),
  );
  await page.viewport(1000, 900);
});

describe("InterviewApplyContent", () => {
  it("면접 요약과 목록 순서와 무관한 기본 이력서를 표시한다", async () => {
    const screen = await renderApply();

    await expect.element(screen.getByRole("heading", { name: "참가 신청" })).toBeVisible();
    await expect.element(screen.getByText("한빛커머스 백엔드 2차 같이 준비해요")).toBeVisible();
    await expect.element(screen.getByText(/온라인 · 3 \/ 5명/)).toBeVisible();
    await expect.element(screen.getByText("기본_이력서.pdf", { exact: true })).toBeVisible();
    await expect.element(screen.getByText("AI 요약을 만들고 있어요")).toBeVisible();
    await expect.element(screen.getByRole("button", { name: "참가 신청하기" })).toBeEnabled();
    await expect
      .element(screen.getByRole("link", { name: "상세 보기" }))
      .toHaveAttribute("href", `/interviews/${roomId}`);
  });

  it("실패한 AI 요약 이력서를 선택해 전달 사항과 함께 신청한다", async () => {
    const screen = await renderApply();

    await screen.getByRole("button", { name: "변경하기" }).click();
    await screen.getByRole("radio", { name: "실패_이력서.pdf" }).click();
    await screen.getByRole("button", { name: "선택하기" }).click();
    await expect.element(screen.getByText("AI 요약을 만들지 못했어요.")).toBeVisible();
    await screen.getByRole("textbox", { name: "방장에게 전할 말" }).fill("함께 준비하고 싶어요.");
    await screen.getByRole("button", { name: "참가 신청하기" }).click();

    await expect.poll(() => mocks.submitRoomApplication.mock.calls.length).toBe(1);
    expect(mocks.submitRoomApplication).toHaveBeenCalledWith({
      body: { note: "함께 준비하고 싶어요.", resumeId: "resume-failed" },
      path: { roomId },
      throwOnError: true,
    });
    await expect.poll(() => window.location.pathname).toBe(`/interviews/${roomId}`);
  });

  it("포인터로 다른 이력서를 선택하면 이전 선택에 포커스 링을 남기지 않는다", async () => {
    const screen = await renderApply();

    await screen.getByRole("button", { name: "변경하기" }).click();
    const previousResume = screen.getByRole("radio", { name: "기본_이력서.pdf" }).element();
    await screen.getByRole("radio", { name: "실패_이력서.pdf" }).click();

    expect(getComputedStyle(previousResume).outlineStyle).toBe("none");
  });

  it("새 PDF를 업로드해 선택할 수 있다", async () => {
    mocks.resumes.mockResolvedValue(
      sdkSuccess({ ...resumes, resumes: [uploadedResume, ...resumes.resumes] }),
    );
    const screen = await renderApply();

    await screen.getByRole("button", { name: "변경하기" }).click();
    const fileInput = screen.getByLabelText("새 이력서 파일").element() as HTMLInputElement;
    chooseFile(fileInput, new File(["pdf"], "새_이력서.pdf", { type: "application/pdf" }));

    await expect.poll(() => mocks.createResume.mock.calls.length).toBe(1);
    await expect.element(screen.getByRole("radio", { name: "새_이력서.pdf" })).toBeChecked();
    await screen.getByRole("button", { name: "선택하기" }).click();
    await expect.element(screen.getByText("새_이력서.pdf", { exact: true })).toBeVisible();
  });

  it("이력서를 선택하지 않으면 요청하지 않고 필드 오류로 표시한다", async () => {
    const screen = await renderApply({ maxCount: 10, resumes: [] });

    await screen.getByRole("button", { name: "참가 신청하기" }).click();

    await expect.element(screen.getByText("이력서를 선택해 주세요.")).toBeVisible();
    expect(mocks.submitRoomApplication).not.toHaveBeenCalled();
  });

  it("전달 사항이 300자를 초과하면 요청하지 않고 필드 오류로 표시한다", async () => {
    const screen = await renderApply();
    await screen.getByRole("textbox", { name: "방장에게 전할 말" }).fill("가".repeat(301));

    await screen.getByRole("button", { name: "참가 신청하기" }).click();

    await expect.element(screen.getByText("전달 사항은 300자까지 입력할 수 있어요.")).toBeVisible();
    expect(mocks.submitRoomApplication).not.toHaveBeenCalled();
  });

  it("서버에서 이력서를 찾지 못하면 목록을 갱신하고 필드 오류를 표시한다", async () => {
    mocks.submitRoomApplication.mockResolvedValue(
      sdkFailure("E1010", "이력서를 찾을 수 없습니다.", 404),
    );
    mocks.resumes.mockResolvedValue(sdkSuccess({ ...resumes, resumes: [] }));
    const screen = await renderApply();
    await screen.getByRole("textbox", { name: "방장에게 전할 말" }).fill("입력은 유지해 주세요.");

    await screen.getByRole("button", { name: "참가 신청하기" }).click();

    await expect
      .element(screen.getByText("선택한 이력서를 찾을 수 없어요. 다시 선택해 주세요."))
      .toBeVisible();
    await expect
      .element(screen.getByRole("textbox", { name: "방장에게 전할 말" }))
      .toHaveValue("입력은 유지해 주세요.");
    expect(mocks.resumes).toHaveBeenCalled();
  });

  it("신청 자격 오류는 입력을 유지하고 다시 제출할 수 있다", async () => {
    mocks.submitRoomApplication.mockResolvedValueOnce(
      sdkFailure("E1416", "대기 중인 신청이 너무 많아요."),
    );
    const screen = await renderApply();
    const note = screen.getByRole("textbox", { name: "방장에게 전할 말" });
    await note.fill("꼭 참여하고 싶어요.");

    await screen.getByRole("button", { name: "참가 신청하기" }).click();

    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("대기 중인 신청이 너무 많아요.");
    await expect.element(note).toHaveValue("꼭 참여하고 싶어요.");
    await expect.element(screen.getByText("기본_이력서.pdf", { exact: true })).toBeVisible();

    mocks.submitRoomApplication.mockResolvedValue(
      sdkSuccess({ applicationId: 11, status: "PENDING", statusLabel: "대기 중" }, 201),
    );
    await screen.getByRole("button", { name: "참가 신청하기" }).click();
    await expect.poll(() => mocks.submitRoomApplication.mock.calls.length).toBe(2);
    await expect.poll(() => window.location.pathname).toBe(`/interviews/${roomId}`);
  });

  it("제출 중 연속 클릭해도 신청 요청은 한 번만 보낸다", async () => {
    let resolveRequest: ((value: ReturnType<typeof sdkSuccess>) => void) | undefined;
    mocks.submitRoomApplication.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const screen = await renderApply();
    const submitButton = screen.getByRole("button", { name: "참가 신청하기" });

    await submitButton.click();
    await expect.element(screen.getByRole("button", { name: "신청 중..." })).toBeDisabled();
    await screen.getByRole("button", { name: "신청 중..." }).click({ force: true });
    expect(mocks.submitRoomApplication).toHaveBeenCalledTimes(1);

    resolveRequest?.(
      sdkSuccess({ applicationId: 12, status: "PENDING", statusLabel: "대기 중" }, 201),
    );
    await expect.poll(() => window.location.pathname).toBe(`/interviews/${roomId}`);
  });
});
