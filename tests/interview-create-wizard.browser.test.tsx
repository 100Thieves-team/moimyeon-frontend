import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import type { Resumes, RoomFormOptions } from "@/features/interview-create/interview-create-model";
import { InterviewCreateWizard } from "@/features/interview-create/interview-create-wizard";
import type { JobRoleGroup } from "@/features/mypage/mypage-model";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  createResume: vi.fn(),
  resumes: vi.fn(),
  roomCreationLimit: vi.fn(),
  searchJobPostings: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  createResumeMutation: () => ({
    mutationFn: async (options: { body: { file: File } }) => {
      const result = await mocks.createResume({ ...options, throwOnError: true });
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
  roomCreationLimitOptions: (options: { query: { jobPostingId: string; jobRoleId: string } }) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.roomCreationLimit({ ...options, signal, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
    queryKey: ["roomCreationLimit", options.query.jobPostingId, options.query.jobRoleId],
  }),
  searchJobPostingsOptions: (options: { query?: { query?: string } }) => ({
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const result = await mocks.searchJobPostings({ ...options, signal, throwOnError: true });
      if (result.error) throw result.error;
      return result.data;
    },
    queryKey: ["searchJobPostings", options.query?.query],
  }),
  searchJobPostingsQueryKey: () => ["searchJobPostings"],
}));

const options: RoomFormOptions = {
  durations: [
    { label: "90분", minutes: 90 },
    { label: "60분", minutes: 60 },
  ],
  methods: [
    { code: "ONLINE", hint: "화상으로 진행해요", label: "온라인" },
    { code: "OFFLINE", hint: "정한 장소에서 만나요", label: "오프라인" },
  ],
  participantConstraints: { max: 8, min: 2 },
  rounds: [
    { code: "FIRST", label: "1차" },
    { code: "SECOND", label: "2차" },
    { code: "THIRD", label: "3차" },
    { code: "ETC", label: "기타" },
  ],
  types: [
    { code: "JOB", label: "직무 면접" },
    { code: "CULTURE_FIT", label: "컬쳐핏 면접" },
    { code: "EXECUTIVE", label: "임원 면접" },
    { code: "TECH_ASSIGNMENT", label: "기술 과제" },
  ],
};

const jobRoleGroups: JobRoleGroup[] = [
  {
    code: "DEVELOPMENT",
    displayName: "개발",
    roles: [
      { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
      { code: "BACKEND", displayName: "백엔드", jobRoleId: 20 },
    ],
  },
];

const regions = {
  sidos: [
    {
      name: "서울특별시",
      shortName: "서울",
      sigungus: [
        { name: "강남구", sigunguId: 1 },
        { name: "마포구", sigunguId: 2 },
      ],
    },
  ],
};

const participationSlots = { limit: 3, occupied: 0, remaining: 3 };

const resumes: Resumes = {
  maxCount: 10,
  resumes: [
    {
      aiSummary: {
        status: "DONE",
        text: "결제 도메인 3년 차 프론트엔드 개발자예요.",
      },
      file: {
        contentType: "application/pdf",
        originalName: "김민수_이력서.pdf",
        sizeBytes: 245_760,
      },
      isDefault: false,
      lastUsed: {
        roomId: "room-1",
        roomTitle: "달빛페이 면접",
        usedAt: "2026-07-12T14:00:00",
      },
      name: "김민수_이력서.pdf",
      registeredAt: "2026-07-01T12:00:00",
      resumeId: "resume-done",
    },
    {
      aiSummary: { status: "PROCESSING", text: null },
      file: {
        contentType: "application/pdf",
        originalName: "김민수_이력서_영문.pdf",
        sizeBytes: 202_752,
      },
      isDefault: true,
      name: "김민수_이력서_영문.pdf",
      registeredAt: "2026-08-01T12:00:00",
      resumeId: "resume-processing",
    },
    {
      aiSummary: { status: "FAILED", text: null },
      file: {
        contentType: "application/pdf",
        originalName: "포트폴리오_2026.pdf",
        sizeBytes: 3_250_586,
      },
      isDefault: false,
      name: "포트폴리오_2026.pdf",
      registeredAt: "2026-08-02T12:00:00",
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
  registeredAt: "2026-08-20T12:00:00",
  resumeId: "resume-uploaded",
};

function sdkSuccess(data: Record<string, unknown>) {
  return {
    data: { data, result: "SUCCESS" },
    error: undefined,
    response: new Response(null, { status: 200 }),
  };
}

function renderWizard({ resumeData = resumes, slots = participationSlots } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(["resumes"], { data: resumeData, result: "SUCCESS" });

  return render(
    <QueryClientProvider client={queryClient}>
      <InterviewCreateWizard
        jobRoleGroups={jobRoleGroups}
        options={options}
        participationSlots={slots}
        regions={regions}
      />
    </QueryClientProvider>,
  );
}

type RenderedWizard = Awaited<ReturnType<typeof renderWizard>>;

async function moveToMethodAndScheduleStep(screen: RenderedWizard) {
  await screen.getByRole("combobox", { name: "채용 공고" }).fill("달빛");
  await expect.poll(() => mocks.searchJobPostings.mock.calls.length).toBe(1);
  await screen.getByRole("option", { name: /프론트엔드 개발자/ }).click();
  await screen.getByRole("radio", { name: "1차" }).click();
  await screen.getByRole("button", { name: "다음" }).click();
  await expect
    .element(screen.getByRole("heading", { name: "진행 방식과 일정을 정해요" }))
    .toBeVisible();
  await expect.poll(() => mocks.roomCreationLimit.mock.calls.length).toBe(1);
}

async function renderIntroductionStep(renderOptions?: Parameters<typeof renderWizard>[0]) {
  window.history.replaceState(null, "", "/interviews/new?step=introduction-and-resume");
  const screen = await renderWizard(renderOptions);

  await expect
    .element(screen.getByRole("heading", { name: "참여할 사람들에게 면접을 소개해요" }))
    .toBeVisible();

  return screen;
}

function chooseFile(input: HTMLInputElement, file: File) {
  const transfer = new DataTransfer();
  transfer.items.add(file);
  Object.defineProperty(input, "files", { configurable: true, value: transfer.files });
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

beforeEach(async () => {
  vi.clearAllMocks();
  window.history.replaceState(null, "", "/interviews/new");
  mocks.searchJobPostings.mockResolvedValue(
    sdkSuccess({
      companies: [],
      jobPostings: [
        {
          company: { companyId: 1, name: "달빛페이" },
          jobPostingId: 101,
          jobRoleId: 10,
          jobRoleName: "프론트엔드",
          postingName: "프론트엔드 개발자",
          verified: true,
        },
      ],
    }),
  );
  mocks.roomCreationLimit.mockResolvedValue(
    sdkSuccess({ activeRoomCount: 0, limit: 3, remaining: 3 }),
  );
  mocks.resumes.mockResolvedValue(sdkSuccess(resumes));
  mocks.createResume.mockResolvedValue(sdkSuccess(uploadedResume));
  await page.viewport(1000, 900);
});

describe("InterviewCreateWizard", () => {
  it("면접 정보를 입력하지 않아도 진행 방식과 일정 단계로 이동한다", async () => {
    const screen = await renderWizard();

    await expect.poll(() => window.location.search).toBe("?step=interview-info");

    await expect.element(screen.getByText("질의응답")).not.toBeInTheDocument();
    await expect.element(screen.getByText("PT면접")).not.toBeInTheDocument();
    await expect.element(screen.getByText("토론면접")).not.toBeInTheDocument();

    await screen.getByRole("button", { name: "다음" }).click();

    await expect
      .element(screen.getByRole("heading", { name: "진행 방식과 일정을 정해요" }))
      .toBeVisible();
    expect(new URLSearchParams(window.location.search).get("step")).toBe("method-and-schedule");
    await expect.element(screen.getByRole("button", { name: "일정 추가" })).toBeDisabled();
    await expect
      .element(
        screen.getByText(
          "이전 단계에서 채용 공고와 직무를 선택하면 생성 가능한 일정 수를 확인할 수 있어요.",
        ),
      )
      .not.toBeInTheDocument();
    expect(mocks.roomCreationLimit).not.toHaveBeenCalled();
  });

  it("공고의 대표 직무를 반영하고 다음 단계에서 돌아와도 입력값을 보존한다", async () => {
    const screen = await renderWizard();

    await screen.getByRole("combobox", { name: "채용 공고" }).fill("달빛");
    await expect.poll(() => mocks.searchJobPostings.mock.calls.length).toBe(1);
    await screen.getByRole("option", { name: /프론트엔드 개발자/ }).click();

    await expect.element(screen.getByText("프론트엔드", { exact: true })).toBeVisible();
    await screen.getByRole("radio", { name: "1차" }).click();
    await screen.getByRole("button", { name: "다음" }).click();

    await expect
      .poll(() => new URLSearchParams(window.location.search).get("step"))
      .toBe("method-and-schedule");
    await expect
      .element(screen.getByRole("heading", { name: "진행 방식과 일정을 정해요" }))
      .toBeVisible();
    await screen.getByRole("button", { name: "이전" }).click();

    await expect
      .poll(() => new URLSearchParams(window.location.search).get("step"))
      .toBe("interview-info");
    await expect
      .element(screen.getByRole("combobox", { name: "채용 공고" }))
      .toHaveValue("[달빛페이] 프론트엔드 개발자");
    await expect.element(screen.getByText("프론트엔드", { exact: true })).toBeVisible();
    await expect.element(screen.getByRole("radio", { name: "1차" })).toBeChecked();
  });

  it("유효한 단계 URL로 직접 진입하면 해당 단계를 표시한다", async () => {
    window.history.replaceState(
      null,
      "",
      "/interviews/new?source=invite&step=method-and-schedule#schedule",
    );

    const screen = await renderWizard();

    await expect
      .element(screen.getByRole("heading", { name: "진행 방식과 일정을 정해요" }))
      .toBeVisible();
    expect(new URLSearchParams(window.location.search).get("source")).toBe("invite");
    expect(window.location.hash).toBe("#schedule");
  });

  it("단계 메뉴에서 입력 여부와 관계없이 모든 단계를 탐색한다", async () => {
    const screen = await renderWizard();

    await screen.getByRole("button", { name: /최종 확인/ }).click();

    await expect
      .element(screen.getByRole("heading", { name: "입력한 내용을 확인해 주세요" }))
      .toBeVisible();
    expect(new URLSearchParams(window.location.search).get("step")).toBe("final-review");

    await screen.getByRole("button", { name: /진행 방식과 일정/ }).click();
    await expect
      .element(screen.getByRole("heading", { name: "진행 방식과 일정을 정해요" }))
      .toBeVisible();
  });

  it("잘못된 단계 URL은 다른 파라미터를 보존하고 첫 단계로 보정한다", async () => {
    window.history.replaceState(null, "", "/interviews/new?source=invite&step=unknown#interview");

    const screen = await renderWizard();

    await expect
      .poll(() => new URLSearchParams(window.location.search).get("step"))
      .toBe("interview-info");
    await expect
      .element(screen.getByRole("heading", { name: "어떤 면접을 준비하나요?" }))
      .toBeVisible();
    expect(new URLSearchParams(window.location.search).get("source")).toBe("invite");
    expect(window.location.hash).toBe("#interview");
  });

  it("브라우저 뒤로가기와 앞으로가기로 방문한 단계를 오간다", async () => {
    const screen = await renderWizard();

    await screen.getByRole("combobox", { name: "채용 공고" }).fill("달빛");
    await expect.poll(() => mocks.searchJobPostings.mock.calls.length).toBe(1);
    await screen.getByRole("option", { name: /프론트엔드 개발자/ }).click();
    await screen.getByRole("radio", { name: "1차" }).click();
    await screen.getByRole("button", { name: "다음" }).click();
    await expect
      .element(screen.getByRole("heading", { name: "진행 방식과 일정을 정해요" }))
      .toBeVisible();

    window.history.back();

    await expect
      .element(screen.getByRole("heading", { name: "어떤 면접을 준비하나요?" }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("combobox", { name: "채용 공고" }))
      .toHaveValue("[달빛페이] 프론트엔드 개발자");

    window.history.forward();

    await expect
      .element(screen.getByRole("heading", { name: "진행 방식과 일정을 정해요" }))
      .toBeVisible();
  });

  it("온라인으로 전환하면 오프라인 지역을 제거한다", async () => {
    const screen = await renderWizard();

    await moveToMethodAndScheduleStep(screen);
    await screen.getByRole("radio", { name: "오프라인" }).click();
    await screen.getByRole("combobox", { name: "시도" }).click();
    await screen.getByRole("option", { name: "서울" }).click();
    await screen.getByRole("combobox", { name: "시군구" }).click();
    await screen.getByRole("option", { name: "강남구" }).click();

    await screen.getByRole("radio", { name: "온라인" }).click();

    await expect.element(screen.getByRole("combobox", { name: "시군구" })).not.toBeInTheDocument();
    await screen.getByRole("radio", { name: "오프라인" }).click();
    await expect.element(screen.getByRole("combobox", { name: "시군구" })).toBeDisabled();
  });

  it("다른 단계에 다녀와도 오프라인 지역 선택을 유지한다", async () => {
    const screen = await renderWizard();

    await moveToMethodAndScheduleStep(screen);
    await screen.getByRole("radio", { name: "오프라인" }).click();
    await screen.getByRole("combobox", { name: "시도" }).click();
    await screen.getByRole("option", { name: "서울" }).click();
    await screen.getByRole("combobox", { name: "시군구" }).click();
    await screen.getByRole("option", { name: "강남구" }).click();

    await screen.getByRole("button", { name: /면접 정보/ }).click();
    await screen.getByRole("button", { name: /진행 방식과 일정/ }).click();

    await expect.element(screen.getByRole("combobox", { name: "시도" })).toHaveTextContent("서울");
    await expect
      .element(screen.getByRole("combobox", { name: "시군구" }))
      .toHaveTextContent("강남구");
  });

  it("오프라인은 시군구를 선택해야 다음 단계로 이동한다", async () => {
    const screen = await renderWizard();

    await moveToMethodAndScheduleStep(screen);
    await screen.getByRole("radio", { name: "오프라인" }).click();
    await screen.getByLabelText("날짜 1").fill("2099-12-31");
    await screen.getByLabelText("시작 시간 1").fill("10:00");
    await screen.getByRole("button", { name: "다음" }).click();

    await expect.element(screen.getByText("시군구를 선택해 주세요.")).toBeVisible();
    expect(new URLSearchParams(window.location.search).get("step")).toBe("method-and-schedule");
  });

  it("모집 인원은 서버 허용 범위로 시작하고 슬라이더로 조정한다", async () => {
    const screen = await renderWizard();

    await moveToMethodAndScheduleStep(screen);

    await expect.element(screen.getByText("최소 2명 · 최대 8명")).toBeVisible();
    const minimumSlider = screen.getByRole("slider", { name: "최소 참여 인원" });
    minimumSlider.element().focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(screen.getByText("최소 3명 · 최대 8명")).toBeVisible();

    const maximumSlider = screen.getByRole("slider", { name: "최대 참여 인원" });
    maximumSlider.element().focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(screen.getByText("최소 3명 · 최대 7명")).toBeVisible();
    await expect
      .element(screen.getByRole("combobox", { name: "예상 소요 시간 1" }))
      .toHaveTextContent("90분");
  });

  it("일정은 서버 잔여 수와 관계없이 최대 3개까지만 추가한다", async () => {
    mocks.roomCreationLimit.mockResolvedValue(
      sdkSuccess({ activeRoomCount: 0, limit: 10, remaining: 10 }),
    );
    const screen = await renderWizard();

    await moveToMethodAndScheduleStep(screen);
    await screen.getByRole("button", { name: "일정 추가" }).click();
    await screen.getByRole("button", { name: "일정 추가" }).click();

    await expect.element(screen.getByLabelText("날짜 3")).toBeVisible();
    await expect
      .element(screen.getByText("현재 일정은 최대 3개까지 추가할 수 있어요."))
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: "일정 추가" })).toBeDisabled();

    await screen.getByRole("button", { name: "3번째 일정 삭제" }).click();
    await expect.element(screen.getByRole("button", { name: "일정 추가" })).toBeEnabled();
  });

  it("일정 상한은 생성 잔여와 참여 슬롯 잔여 중 더 작은 값을 따른다", async () => {
    mocks.roomCreationLimit.mockResolvedValue(
      sdkSuccess({ activeRoomCount: 1, limit: 3, remaining: 2 }),
    );
    const screen = await renderWizard({ slots: { limit: 3, occupied: 2, remaining: 1 } });

    await moveToMethodAndScheduleStep(screen);

    await expect
      .element(screen.getByText("현재 일정은 최대 1개까지 추가할 수 있어요."))
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: "일정 추가" })).toBeDisabled();
    await expect
      .element(screen.getByText("같은 공고와 직무로 진행 중인 면접이 1개 있어요."))
      .toBeVisible();
  });

  it("과거 일정과 같은 날짜·시간의 중복 일정을 허용하지 않는다", async () => {
    const screen = await renderWizard();

    await moveToMethodAndScheduleStep(screen);
    await screen.getByRole("radio", { name: "온라인" }).click();
    await screen.getByLabelText("날짜 1").fill("2000-01-01");
    await screen.getByLabelText("시작 시간 1").fill("10:00");
    await screen.getByRole("button", { name: "다음" }).click();
    await expect.element(screen.getByText("현재보다 이후 시간을 선택해 주세요.")).toBeVisible();

    await screen.getByLabelText("날짜 1").fill("2099-12-31");
    await screen.getByRole("button", { name: "일정 추가" }).click();
    await screen.getByLabelText("날짜 2").fill("2099-12-31");
    await screen.getByLabelText("시작 시간 2").fill("10:00");
    await screen.getByRole("button", { name: "다음" }).click();

    await expect
      .element(screen.getByText("같은 날짜와 시작 시간은 중복할 수 없어요."))
      .toBeVisible();
    expect(new URLSearchParams(window.location.search).get("step")).toBe("method-and-schedule");
  });

  it("기존 직무 Dialog에서 한 개의 직무만 선택한다", async () => {
    const screen = await renderWizard();

    await screen.getByRole("button", { name: "직무", exact: true }).click();
    await expect.element(screen.getByRole("dialog", { name: "직무 추가" })).toBeVisible();

    await screen.getByRole("tab", { name: "개발" }).click();
    await screen.getByRole("button", { name: "프론트엔드" }).click();
    await screen.getByRole("button", { name: "백엔드" }).click();
    await screen.getByRole("button", { name: "선택 완료" }).click();

    await expect.element(screen.getByText("백엔드", { exact: true })).toBeVisible();
    await expect.element(screen.getByText("프론트엔드", { exact: true })).not.toBeInTheDocument();
  });

  it("최근 사용 이력서와 원본 공개를 기본 선택한다", async () => {
    const screen = await renderIntroductionStep();

    await expect.element(screen.getByText("김민수_이력서.pdf", { exact: true })).toBeVisible();
    await expect
      .element(screen.getByText("결제 도메인 3년 차 프론트엔드 개발자예요."))
      .toBeVisible();
    await expect
      .element(screen.getByRole("switch", { name: "면접에서 이력서 원본을 공유해요" }))
      .toBeChecked();
  });

  it("제목과 이력서가 없으면 최종 확인 단계로 이동하지 않는다", async () => {
    const screen = await renderIntroductionStep({ resumeData: { maxCount: 10, resumes: [] } });

    await screen.getByRole("button", { name: "다음" }).click();

    await expect.element(screen.getByText("면접 제목을 입력해 주세요.")).toBeVisible();
    await expect.element(screen.getByText("이력서를 선택해 주세요.")).toBeVisible();
    expect(new URLSearchParams(window.location.search).get("step")).toBe("introduction-and-resume");
  });

  it("Dialog에서 취소한 선택은 버리고 확정한 실패 이력서는 그대로 사용한다", async () => {
    const screen = await renderIntroductionStep();
    await screen.getByRole("textbox", { name: "면접 제목" }).fill("달빛페이 실전 면접");

    await screen.getByRole("button", { name: "변경하기" }).click();
    await screen.getByRole("radio", { name: "포트폴리오_2026.pdf" }).click();
    await screen.getByRole("button", { name: "취소" }).click();
    await expect.element(screen.getByText("김민수_이력서.pdf", { exact: true })).toBeVisible();

    await screen.getByRole("button", { name: "변경하기" }).click();
    await screen.getByRole("radio", { name: "포트폴리오_2026.pdf" }).click();
    await screen.getByRole("button", { name: "이 이력서 쓰기" }).click();

    await expect.element(screen.getByText("포트폴리오_2026.pdf", { exact: true })).toBeVisible();
    await expect
      .element(screen.getByText("AI 요약을 만들지 못했어요. 이력서는 그대로 사용할 수 있어요."))
      .toBeVisible();

    await screen.getByRole("button", { name: "다음" }).click();
    await expect
      .element(screen.getByRole("heading", { name: "입력한 내용을 확인해 주세요" }))
      .toBeVisible();
  });

  it("요약 생성 중인 이력서는 목록 폴링 후 완성된 요약을 표시한다", async () => {
    const screen = await renderIntroductionStep();
    const initialRequestCount = mocks.resumes.mock.calls.length;
    mocks.resumes.mockResolvedValue(
      sdkSuccess({
        ...resumes,
        resumes: resumes.resumes.map((resume) =>
          resume.resumeId === "resume-processing"
            ? {
                ...resume,
                aiSummary: { status: "DONE", text: "영문 이력서 요약이 완성됐어요." },
              }
            : resume,
        ),
      }),
    );

    await screen.getByRole("button", { name: "변경하기" }).click();
    await screen.getByRole("radio", { name: "김민수_이력서_영문.pdf" }).click();
    await screen.getByRole("button", { name: "이 이력서 쓰기" }).click();

    await expect
      .poll(() => mocks.resumes.mock.calls.length, { timeout: 5_000 })
      .toBeGreaterThan(initialRequestCount);
    await expect.element(screen.getByText("영문 이력서 요약이 완성됐어요.")).toBeVisible();
  });

  it("PDF 제약을 확인하고 업로드한 이력서를 확정한다", async () => {
    const screen = await renderIntroductionStep();
    await screen.getByRole("button", { name: "변경하기" }).click();
    const fileInput = screen.getByLabelText("새 이력서 파일").element() as HTMLInputElement;

    chooseFile(fileInput, new File(["text"], "resume.txt", { type: "text/plain" }));
    await expect.element(screen.getByText("PDF 파일만 올릴 수 있어요.")).toBeVisible();
    expect(mocks.createResume).not.toHaveBeenCalled();

    chooseFile(
      fileInput,
      new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.pdf", {
        type: "application/pdf",
      }),
    );
    await expect
      .element(screen.getByText("이력서는 10MB 이하의 PDF 파일만 올릴 수 있어요."))
      .toBeVisible();
    expect(mocks.createResume).not.toHaveBeenCalled();

    mocks.resumes.mockResolvedValue(
      sdkSuccess({ maxCount: 10, resumes: [uploadedResume, ...resumes.resumes] }),
    );
    chooseFile(fileInput, new File(["pdf"], "새_이력서.pdf", { type: "application/pdf" }));

    await expect.poll(() => mocks.createResume.mock.calls.length).toBe(1);
    await expect.element(screen.getByRole("radio", { name: "새_이력서.pdf" })).toBeChecked();
    await screen.getByRole("button", { name: "이 이력서 쓰기" }).click();
    await expect.element(screen.getByText("새_이력서.pdf", { exact: true })).toBeVisible();
  });
});
