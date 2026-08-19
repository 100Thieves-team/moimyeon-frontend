import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import type { RoomFormOptions } from "@/features/interview-create/interview-create-model";
import { InterviewCreateWizard } from "@/features/interview-create/interview-create-wizard";
import type { JobRoleGroup } from "@/features/mypage/mypage-model";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  searchJobPostings: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
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
  durations: [{ label: "60분", minutes: 60 }],
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

function sdkSuccess(data: Record<string, unknown>) {
  return {
    data: { data, result: "SUCCESS" },
    error: undefined,
    response: new Response(null, { status: 200 }),
  };
}

function renderWizard() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <InterviewCreateWizard jobRoleGroups={jobRoleGroups} options={options} />
    </QueryClientProvider>,
  );
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
  await page.viewport(1000, 900);
});

describe("InterviewCreateWizard", () => {
  it("필수 면접 정보가 없으면 첫 단계에 오류를 표시한다", async () => {
    const screen = await renderWizard();

    await expect.poll(() => window.location.search).toBe("?step=interview-info");

    await expect.element(screen.getByText("질의응답")).not.toBeInTheDocument();
    await expect.element(screen.getByText("PT면접")).not.toBeInTheDocument();
    await expect.element(screen.getByText("토론면접")).not.toBeInTheDocument();

    await screen.getByRole("button", { name: "다음" }).click();

    await expect.element(screen.getByText("채용 공고를 선택해 주세요.")).toBeVisible();
    await expect
      .element(screen.getByText("직무를 선택해 주세요.", { exact: true }).nth(1))
      .toBeVisible();
    await expect.element(screen.getByText("면접 차수를 선택해 주세요.")).toBeVisible();
    await expect
      .element(screen.getByRole("heading", { name: "어떤 면접을 준비하나요?" }))
      .toBeVisible();
    expect(new URLSearchParams(window.location.search).get("step")).toBe("interview-info");
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
});
