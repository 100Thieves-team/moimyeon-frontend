import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import type { RoomDetailResponse } from "@/api/generated";
import InterviewDetailError from "@/app/(site)/interviews/[roomId]/error";
import { ToastProvider } from "@/components/toast";
import { InterviewRoomContent } from "@/features/interview-room/interview-room-content";
import type { RoomApplication } from "@/features/interview-room/interview-room-model";
import {
  MOCK_INTERVIEW_DETAIL_SCENARIOS,
  getMockInterviewHostProfile,
  MOCK_INTERVIEW_HOST_ID,
} from "@/features/interview-detail/interview-detail-mock";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  room: vi.fn(),
  applications: vi.fn(),
  participants: vi.fn(),
  profile: vi.fn(),
  hostProfile: vi.fn(),
  reasons: vi.fn(),
  accept: vi.fn(),
  reject: vi.fn(),
}));
vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  getRoomCommentsInfiniteQueryKey: ({ path }: { path: { roomId: string } }) => [
    "comments",
    path.roomId,
  ],
  getRoomCommentsInfiniteOptions: ({ path }: { path: { roomId: string } }) => ({
    queryKey: ["comments", path.roomId],
    queryFn: async () => ({
      result: "SUCCESS",
      data: { comments: [], writable: true, nextCursor: null, readOnlyAt: null },
    }),
  }),
  createRoomCommentMutation: () => ({ mutationFn: vi.fn() }),
  deleteRoomCommentMutation: () => ({ mutationFn: vi.fn() }),
  issueDevSessionMutation: () => ({ mutationFn: vi.fn() }),
  withdrawRoomApplicationMutation: () => ({ mutationFn: vi.fn() }),
  roomDetailOptions: ({ path }: { path: { roomId: string } }) => ({
    queryKey: ["room", path.roomId],
    queryFn: mocks.room,
  }),
  roomDetailQueryKey: ({ path }: { path: { roomId: string } }) => ["room", path.roomId],
  roomApplicationsOptions: ({ path }: { path: { roomId: string } }) => ({
    queryKey: ["applications", path.roomId],
    queryFn: mocks.applications,
  }),
  roomApplicationsQueryKey: ({ path }: { path: { roomId: string } }) => [
    "applications",
    path.roomId,
  ],
  rejectReasonsOptions: () => ({ queryKey: ["reasons"], queryFn: mocks.reasons }),
  publicProfileOptions: ({ path }: { path: { memberId: string } }) => ({
    queryKey: ["profile", path.memberId],
    queryFn: path.memberId === MOCK_INTERVIEW_HOST_ID ? mocks.hostProfile : mocks.profile,
  }),
  roomParticipantsQueryKey: ({ path }: { path: { roomId: string } }) => [
    "participants",
    path.roomId,
  ],
  roomsQueryKey: () => ["rooms"],
  getInterviewOverviewOptions: () => ({ queryKey: ["overview"], queryFn: vi.fn() }),
  getInterviewOverviewQueryKey: () => ["overview"],
  roomParticipantsOptions: () => ({
    queryKey: ["participants", "room-1"],
    queryFn: mocks.participants,
  }),
  roomLeaveMutation: () => ({ mutationFn: vi.fn() }),
  participationSlotsQueryKey: () => ["slots"],
  myRoomApplicationQueryKey: () => ["my-application"],
  memberMeQueryKey: () => ["me"],
  acceptApplicationMutation: () => ({ mutationFn: mocks.accept }),
  rejectApplicationMutation: () => ({ mutationFn: mocks.reject }),
}));

const roomId = "room-1";
let room: NonNullable<RoomDetailResponse["data"]>;
let applications: RoomApplication[];
const reasonList = [
  { code: "ROLE_MISMATCH", label: "직무·면접 단계가 맞지 않아요" },
  { code: "CAPACITY_FILLED", label: "정원을 다른 분들로 채웠어요" },
  { code: "DIRECTION_MISMATCH", label: "설명한 준비 방향과 맞지 않아요" },
];

function error(code: string, message: string) {
  return { result: "ERROR", error: { code, message } };
}
function settle(status: string, statusLabel: string) {
  applications[0] = { ...applications[0], status, statusLabel };
  room.recruit = { ...room.recruit!, pendingApplicationCount: 0 };
  if (status === "ACCEPTED") {
    room.recruit = {
      ...room.recruit,
      current: 5,
      recruitStatus: "CLOSED",
      recruitStatusLabel: "모집 마감",
    };
    const { memberId, nickname } = applications[0].applicant!;
    room.participants.push({ memberId, nickname });
  }
  return {
    result: "SUCCESS",
    data: { applicationId: 3001, status, statusLabel, recruit: room.recruit },
  };
}

async function renderRoom(openApplications = true) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  const screen = await render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <InterviewDetailError reset={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<p>참여 신청을 불러오는 중이에요.</p>}>
            <InterviewRoomContent roomId={roomId} currentMemberId={MOCK_INTERVIEW_HOST_ID} />
          </Suspense>
        </ErrorBoundary>
      </ToastProvider>
    </QueryClientProvider>,
  );
  if (openApplications) await screen.getByRole("tab", { name: /참여 신청/ }).click();
  return screen;
}

beforeEach(async () => {
  vi.resetAllMocks();
  room = structuredClone(
    MOCK_INTERVIEW_DETAIL_SCENARIOS.find((scenario) => scenario.room.viewer?.isHost)!.room,
  );
  room.roomId = roomId;
  room.title = "한빛커머스 백엔드 2차 같이 준비해요";
  room.recruit = {
    current: 4,
    max: 5,
    min: 2,
    pendingApplicationCount: 1,
    recruitStatus: "RECRUITING",
    recruitStatusLabel: "모집 중",
  };
  applications = [
    {
      applicationId: 3001,
      appliedAt: "2026-09-18T10:00:00",
      status: "PENDING",
      statusLabel: "대기 중",
      note: "실전처럼 연습하고 싶어요.\n잘 부탁드려요!",
      aiSummary: { status: "DONE", text: "Kotlin과 Spring으로 결제 정산 배치를 개발했어요." },
      applicant: {
        memberId: "new-participant",
        nickname: "성실한 사슴 03",
        jobRoles: [{ jobRoleId: 10, name: "백엔드 개발" }],
        activitySummary: null,
      },
    },
  ];
  mocks.room.mockImplementation(async () => ({ result: "SUCCESS", data: structuredClone(room) }));
  mocks.applications.mockImplementation(async () => ({
    result: "SUCCESS",
    data: { applications: structuredClone(applications) },
  }));
  mocks.participants.mockImplementation(async () => ({
    result: "SUCCESS",
    data: {
      participants: applications
        .filter((application) => application.status === "ACCEPTED")
        .map((application) => ({
          ...application.applicant!,
          isHost: false,
          aiSummary: application.aiSummary,
        })),
    },
  }));
  mocks.profile.mockResolvedValue(getMockInterviewHostProfile(MOCK_INTERVIEW_HOST_ID));
  mocks.hostProfile.mockResolvedValue(getMockInterviewHostProfile(MOCK_INTERVIEW_HOST_ID));
  mocks.reasons.mockResolvedValue({ result: "SUCCESS", data: { reasons: reasonList } });
  mocks.accept.mockImplementation(async () => settle("ACCEPTED", "수락"));
  mocks.reject.mockImplementation(async () => settle("REJECTED", "반려"));
  await page.viewport(1440, 900);
});

describe("방장 참여 신청 관리", () => {
  it("모집 현황 카드의 관리 버튼으로 URL 변경 없이 참여 신청 탭을 연다", async () => {
    const screen = await renderRoom(false);
    const url = window.location.href;
    await screen.getByRole("button", { name: "참여 신청 확인하기" }).click();
    await expect
      .element(screen.getByRole("tab", { name: "참여 신청 1" }))
      .toHaveAttribute("aria-selected", "true");
    expect(window.location.href).toBe(url);
    await expect
      .element(screen.getByRole("button", { name: "성실한 사슴 03 신청 내용" }))
      .toBeVisible();
  });

  it("면접 정보와 참여자 탭을 왕복해도 신청 내용의 펼침 상태를 유지한다", async () => {
    const screen = await renderRoom(false);
    await expect
      .element(screen.getByRole("tab", { name: "면접 정보" }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { name: room.title }).elements()).toHaveLength(1);
    const header = screen.getByRole("heading", { name: room.title }).element().parentElement!;
    expect(header.textContent).not.toContain("모집 중");
    expect(header.textContent).not.toContain("내가 만든 면접");
    expect(header.textContent).not.toContain("4 / 5명");
    await screen.getByRole("tab", { name: /참여 신청/ }).click();
    await expect
      .element(screen.getByRole("tab", { name: "참여 신청 1" }))
      .toHaveAttribute("aria-selected", "true");
    await expect.poll(() => mocks.participants.mock.calls.length).toBe(1);
    await screen.getByRole("button", { name: "성실한 사슴 03 신청 내용" }).click();
    await expect.element(screen.getByRole("heading", { name: "전할 말" })).toBeVisible();
    expect(
      screen
        .getByRole("tab")
        .elements()
        .map((tab) => tab.textContent),
    ).toEqual(["면접 정보", "참여 신청 1", "참여자 4", "댓글"]);
    const url = window.location.href;
    await screen.getByRole("tab", { name: "면접 정보" }).click();
    const info = screen.getByRole("tabpanel", { name: "면접 정보" });
    await expect.element(screen.getByRole("heading", { name: room.title })).toBeVisible();
    await expect.element(info.getByRole("heading", { name: "면접 소개" })).toBeVisible();
    expect(window.location.href).toBe(url);
    await screen.getByRole("tab", { name: "참여자 4" }).click();
    await expect.element(screen.getByText("참여자가 없어요.")).toBeVisible();
    expect(mocks.participants).toHaveBeenCalledOnce();
    await expect.element(screen.getByText("전할 말", { exact: true })).not.toBeVisible();
    await screen.getByRole("tab", { name: "참여 신청 1" }).click();
    await expect.element(screen.getByRole("heading", { name: "전할 말" })).toBeVisible();
  });

  it("면접 정보를 방문한 뒤 신청을 수락하면 모집 현황과 참여자 아바타가 갱신된다", async () => {
    room.participants = [
      { memberId: room.hostMemberId, nickname: "꼼꼼한 여우 12" },
      { memberId: "participant-1", nickname: "성실한 수달" },
      { memberId: "participant-2", nickname: "차분한 라쿤" },
      { memberId: "participant-3", nickname: "든든한 곰" },
    ];
    const screen = await renderRoom();
    await screen.getByRole("tab", { name: "면접 정보" }).click();
    const info = screen.getByRole("tabpanel", { name: "면접 정보" });
    await expect.element(info.getByRole("progressbar", { name: "모집 현황 4/5명" })).toBeVisible();
    await expect.element(info.getByRole("list", { name: "현재 참여자 4명" })).toBeVisible();
    await screen.getByRole("tab", { name: "참여 신청 1" }).click();
    await screen.getByRole("button", { name: "수락", exact: true }).click();
    await expect.element(screen.getByRole("tab", { name: "참여 신청 0" })).toBeVisible();
    await screen.getByRole("tab", { name: "면접 정보" }).click();
    await expect.element(info.getByRole("progressbar", { name: "모집 현황 5/5명" })).toBeVisible();
    await expect
      .element(
        info
          .getByRole("list", { name: "현재 참여자 5명" })
          .getByRole("listitem", { name: "성실한 사슴 03" }),
      )
      .toBeVisible();
  });

  it("참여자 탭을 방문한 뒤 신청을 수락하면 다시 연 명단에 반영된다", async () => {
    const screen = await renderRoom();
    await screen.getByRole("tab", { name: "참여자 4" }).click();
    await expect.element(screen.getByText("참여자가 없어요.")).toBeVisible();
    await screen.getByRole("tab", { name: "참여 신청 1" }).click();
    await screen.getByRole("button", { name: "수락", exact: true }).click();
    await expect.element(screen.getByRole("tab", { name: "참여 신청 0" })).toBeVisible();
    await screen.getByRole("tab", { name: "참여자 5" }).click();
    await expect
      .element(screen.getByRole("list", { name: "참여자 목록" }).getByText("성실한 사슴 03"))
      .toBeVisible();
    expect(mocks.participants.mock.calls.length).toBeGreaterThan(1);
  });

  it.each(["성", "성실한 사슴 03", "백엔드 개발"])(
    "프로필의 %s 부분을 클릭해 공개 신뢰 카드를 확인한다",
    async (target) => {
      const screen = await renderRoom();
      await screen
        .getByRole("button", { name: "성실한 사슴 03 공개 신뢰 카드 열기" })
        .getByText(target, { exact: true })
        .click();
      const card = screen.getByRole("article", { name: "꼼꼼한 여우 12 공개 신뢰 카드" });
      await expect.element(card).toBeVisible();
      await expect
        .element(card.getByText("활동률 상위 10% · 최근 출석 2/3회 · 누적 불참 0회"))
        .toBeVisible();
      await expect.element(card.getByText("피드백이 구체적이에요")).toBeVisible();
    },
  );

  it("활동 정보를 기다리는 동안에도 신청 내용을 확인하고 수락할 수 있다", async () => {
    let resolveProfile!: (value: ReturnType<typeof getMockInterviewHostProfile>) => void;
    mocks.profile.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        }),
    );
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "성실한 사슴 03 공개 신뢰 카드 열기" }).click();
    await expect.element(screen.getByRole("region", { name: "프로필 불러오는 중" })).toBeVisible();
    await screen.getByRole("button", { name: "성실한 사슴 03 신청 내용" }).click();
    await expect.element(screen.getByRole("heading", { name: "전할 말" })).toBeVisible();
    await screen.getByRole("button", { name: "수락", exact: true }).click();
    await expect
      .element(
        page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 수락했어요."),
      )
      .toBeVisible();
    resolveProfile(getMockInterviewHostProfile(MOCK_INTERVIEW_HOST_ID));
    await expect
      .element(
        screen
          .getByRole("tabpanel", { name: /참여 신청/ })
          .getByText("활동률 상위 10% · 최근 출석 2/3회 · 누적 불참 0회"),
      )
      .not.toBeInTheDocument();
  });

  it.each(["request", "empty"])(
    "공개 신뢰 카드 조회 실패(%s)가 신청 처리를 막지 않는다",
    async (failure) => {
      if (failure === "request") mocks.profile.mockRejectedValueOnce(new Error("offline"));
      else mocks.profile.mockResolvedValueOnce({ result: "SUCCESS", data: null });
      const screen = await renderRoom();
      await screen.getByRole("button", { name: "성실한 사슴 03 공개 신뢰 카드 열기" }).click();
      await expect
        .element(screen.getByText("공개 신뢰 카드를 불러오지 못했어요.", { exact: false }))
        .toBeVisible();
      await expect.element(screen.getByRole("button", { name: "수락", exact: true })).toBeEnabled();
      await expect.element(screen.getByRole("button", { name: "반려", exact: true })).toBeEnabled();
      await screen.getByRole("button", { name: "성실한 사슴 03 신청 내용" }).click();
      await screen.getByRole("button", { name: "수락", exact: true }).click();
      await expect
        .element(
          page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 수락했어요."),
        )
        .toBeVisible();
    },
  );

  it("신청 행에는 활동 요약 없이 이력서 요약을 표시하고 펼치면 전달 사항을 확인한다", async () => {
    const screen = await renderRoom();
    await expect
      .element(
        screen
          .getByRole("tabpanel", { name: /참여 신청/ })
          .getByText("활동률 상위 10% · 최근 출석 2/3회 · 누적 불참 0회"),
      )
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByText("실전처럼 연습하고 싶어요.", { exact: false }))
      .not.toBeInTheDocument();
    await screen.getByRole("button", { name: "성실한 사슴 03 신청 내용" }).click();
    await expect
      .element(screen.getByText("실전처럼 연습하고 싶어요.", { exact: false }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("heading", { name: "AI 이력서 요약" }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByText("Kotlin과 Spring으로 결제 정산 배치를 개발했어요."))
      .toBeVisible();
    await expect.element(screen.getByRole("tab", { name: "참여자 4" })).toBeEnabled();
    await expect.element(screen.getByRole("tab", { name: "댓글" })).toBeVisible();
    await expect.element(screen.getByRole("tab", { name: "면접 정보" })).toBeEnabled();
    await expect.element(screen.getByText(/완료 \d+회|출석 \d+%/)).not.toBeInTheDocument();
  });

  it("요약 준비 중인 신청도 검토하며 처리 상태와 서버 목록 순서를 유지한다", async () => {
    applications[0].aiSummary = { status: "PROCESSING", text: null };
    applications.push({
      ...applications[0],
      applicationId: 1,
      status: "REJECTED",
      statusLabel: "반려",
      applicant: { ...applications[0].applicant!, nickname: "두 번째 신청자" },
    });
    const screen = await renderRoom();
    await expect.element(screen.getByText("AI 요약을 준비 중이에요.").first()).toBeVisible();
    const names = screen.getByRole("button", { name: /공개 신뢰 카드 열기$/ });
    await expect.element(names.first()).toHaveTextContent("성실한 사슴 03");
    await expect.element(names.last()).toHaveTextContent("두 번째 신청자");
    await expect.element(screen.getByRole("button", { name: "수락", exact: true })).toBeEnabled();
    expect(screen.getByRole("button", { name: "수락", exact: true }).elements()).toHaveLength(1);
  });

  it("수락하면 대기 건수와 참여 인원 및 모집 상태를 갱신한다", async () => {
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "수락", exact: true }).click();
    await expect.element(screen.getByRole("tab", { name: "참여 신청 0" })).toBeVisible();
    await expect.element(screen.getByRole("tab", { name: "참여자 5" })).toBeVisible();
    await screen.getByRole("tab", { name: "면접 정보" }).click();
    const card = screen.getByRole("complementary", { name: "면접 참가 신청" });
    await expect.element(card.getByText("5 / 5명")).toBeVisible();
    await expect.element(card.getByText("방장", { exact: true })).toBeVisible();
    await expect.element(card.getByText(/신청 .*건 대기/)).not.toBeInTheDocument();
    await expect.element(screen.getByText("모집 마감", { exact: true })).toBeVisible();
    await expect
      .element(
        page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 수락했어요."),
      )
      .toBeVisible();
    expect(mocks.accept).toHaveBeenCalledOnce();
    expect(mocks.accept.mock.calls[0][0]).toEqual({
      path: { roomId, applicationId: "3001" },
    });
    await screen.getByRole("tab", { name: "참여 신청 0" }).click();
    await expect
      .element(screen.getByRole("button", { name: "수락", exact: true }))
      .not.toBeInTheDocument();
  });

  it("HTTP 성공이어도 참여 슬롯 초과이면 수락 완료로 표시하지 않는다", async () => {
    mocks.accept.mockImplementation(async () => settle("SLOT_EXCEEDED", "참여 슬롯 초과"));
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "수락", exact: true }).click();
    await expect
      .element(screen.getByText("신청자의 참여 슬롯이 가득 차 수락되지 않았어요."))
      .toBeVisible();
    await expect.element(screen.getByRole("tab", { name: "참여자 4" })).toBeVisible();
    await expect.element(screen.getByRole("tab", { name: "참여 신청 0" })).toBeVisible();
    await expect
      .element(
        page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 수락했어요."),
      )
      .not.toBeInTheDocument();
  });

  it.each([null, "CAPACITY_FILLED"])(
    "반려 사유 %s를 전송하고 신청 상태를 갱신한다",
    async (reason) => {
      const screen = await renderRoom();
      await screen.getByRole("button", { name: "반려", exact: true }).click();
      await expect
        .element(screen.getByRole("radio", { name: "사유 없이 반려할게요" }))
        .toBeChecked();
      if (reason) await screen.getByRole("radio", { name: "정원을 다른 분들로 채웠어요" }).click();
      await screen.getByRole("button", { name: "반려하기" }).click();
      await expect
        .element(screen.getByRole("dialog", { name: "신청을 반려할게요" }))
        .not.toBeInTheDocument();
      await expect
        .element(
          page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 반려했어요."),
        )
        .toBeVisible();
      expect(mocks.reject).toHaveBeenCalledOnce();
      expect(mocks.reject.mock.calls[0][0]).toEqual({
        path: { roomId, applicationId: "3001" },
        body: { reason },
      });
      await expect.element(screen.getByRole("tab", { name: "참여자 4" })).toBeVisible();
      await expect.element(screen.getByRole("tab", { name: "참여 신청 0" })).toBeVisible();
      await expect
        .element(screen.getByRole("button", { name: "반려", exact: true }))
        .not.toBeInTheDocument();
    },
  );

  it("취소는 반려하지 않으며 다시 열면 사유 없음으로 시작한다", async () => {
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "반려", exact: true }).click();
    await screen.getByRole("radio", { name: "정원을 다른 분들로 채웠어요" }).click();
    await screen.getByRole("button", { name: "취소", exact: true }).click();
    expect(mocks.reject).not.toHaveBeenCalled();
    await screen.getByRole("button", { name: "반려", exact: true }).click();
    await expect.element(screen.getByRole("radio", { name: "사유 없이 반려할게요" })).toBeChecked();
  });

  it("반려 실패 시 선택을 유지하고 같은 사유로 다시 제출한다", async () => {
    mocks.reject.mockRejectedValueOnce(error("E500", "일시적인 오류예요."));
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "반려", exact: true }).click();
    await screen.getByRole("radio", { name: "직무·면접 단계가 맞지 않아요" }).click();
    await screen.getByRole("button", { name: "반려하기" }).click();
    await expect.element(screen.getByRole("alert")).toHaveTextContent("일시적인 오류예요.");
    await expect
      .element(screen.getByRole("radio", { name: "직무·면접 단계가 맞지 않아요" }))
      .toBeChecked();
    await screen.getByRole("button", { name: "반려하기" }).click();
    await expect
      .element(screen.getByRole("dialog", { name: "신청을 반려할게요" }))
      .not.toBeInTheDocument();
    expect(mocks.reject).toHaveBeenCalledTimes(2);
    expect(mocks.reject.mock.calls[1][0].body.reason).toBe("ROLE_MISMATCH");
  });

  it("연속 수락 요청과 같은 신청의 반려를 처리 중 차단한다", async () => {
    let finish!: () => void;
    mocks.accept.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = () => resolve(settle("ACCEPTED", "수락"));
        }),
    );
    const screen = await renderRoom();
    await expect.element(screen.getByRole("button", { name: "수락", exact: true })).toBeVisible();
    const button = screen
      .getByRole("button", { name: "수락", exact: true })
      .element() as HTMLButtonElement;
    await screen.getByRole("button", { name: "수락", exact: true }).click();
    await expect.element(screen.getByRole("button", { name: "수락 중..." })).toBeDisabled();
    await expect.element(screen.getByRole("button", { name: "반려", exact: true })).toBeDisabled();
    button.click();
    expect(mocks.accept).toHaveBeenCalledOnce();
    finish();
    await expect
      .element(
        page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 수락했어요."),
      )
      .toBeVisible();
  });

  it("반려 성공 후 목록 갱신이 끝날 때까지 제출과 닫기를 막는다", async () => {
    let finishRefresh!: () => void;
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "반려", exact: true }).click();
    mocks.applications.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishRefresh = () =>
            resolve({ result: "SUCCESS", data: { applications: structuredClone(applications) } });
        }),
    );
    await screen.getByRole("button", { name: "반려하기" }).click();
    await expect.poll(() => mocks.applications.mock.calls.length).toBe(2);
    await expect.element(screen.getByRole("button", { name: "반려 중..." })).toBeDisabled();
    await expect.element(screen.getByRole("button", { name: "반려 사유 닫기" })).toBeDisabled();
    await expect.element(page.getByText("참여 신청을 반려했어요.")).not.toBeInTheDocument();
    finishRefresh();
    await expect.element(page.getByText("참여 신청을 반려했어요.")).toBeVisible();
    await expect
      .element(screen.getByRole("dialog", { name: "신청을 반려할게요" }))
      .not.toBeInTheDocument();
  });

  it("반려 제출 중 중복 제출과 닫기를 막는다", async () => {
    let finish!: () => void;
    mocks.reject.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = () => resolve(settle("REJECTED", "반려"));
        }),
    );
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "반려", exact: true }).click();
    await screen.getByRole("button", { name: "반려하기" }).click();
    await expect.element(screen.getByRole("button", { name: "반려 중..." })).toBeDisabled();
    await expect.element(screen.getByRole("button", { name: "취소", exact: true })).toBeDisabled();
    await expect.element(screen.getByRole("button", { name: "반려 사유 닫기" })).toBeDisabled();
    expect(mocks.reject).toHaveBeenCalledOnce();
    finish();
    await expect
      .element(screen.getByRole("dialog", { name: "신청을 반려할게요" }))
      .not.toBeInTheDocument();
  });

  it.each(["E1409", "E1411"])(
    "상태 충돌 %s에서는 최신 상태를 조회하고 성공을 표시하지 않는다",
    async (code) => {
      mocks.accept.mockImplementation(async () => {
        settle("REJECTED", "반려");
        throw error(code, "신청 상태가 변경됐어요.");
      });
      const screen = await renderRoom();
      await screen.getByRole("button", { name: "수락", exact: true }).click();
      await expect.element(screen.getByText("신청 상태가 변경됐어요.")).toBeVisible();
      await expect
        .element(screen.getByRole("button", { name: "수락", exact: true }))
        .not.toBeInTheDocument();
      await expect
        .element(
          page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 수락했어요."),
        )
        .not.toBeInTheDocument();
      expect(mocks.applications).toHaveBeenCalledTimes(2);
    },
  );

  it("처리는 성공하고 재조회만 실패하면 목록을 다시 불러와 처리 결과를 확인한다", async () => {
    mocks.accept.mockImplementation(async () => {
      const result = settle("ACCEPTED", "수락");
      mocks.applications.mockRejectedValueOnce(new Error("offline"));
      return result;
    });
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "수락", exact: true }).click();
    await expect
      .element(
        page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 수락했어요."),
      )
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: "목록 다시 불러오기" })).toBeVisible();
    await expect.element(screen.getByRole("button", { name: "수락", exact: true })).toBeEnabled();
    await screen.getByRole("button", { name: "목록 다시 불러오기" }).click();
    await expect
      .element(screen.getByRole("button", { name: "목록 다시 불러오기" }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "수락", exact: true }))
      .not.toBeInTheDocument();
    expect(mocks.accept).toHaveBeenCalledOnce();
  });

  it("반려 사유 로딩 중 제목과 취소 버튼을 유지하고 조회 후 제출을 허용한다", async () => {
    let finish!: () => void;
    mocks.reasons.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = () => resolve({ result: "SUCCESS", data: { reasons: reasonList } });
        }),
    );
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "반려", exact: true }).click();
    await expect.element(screen.getByRole("heading", { name: "신청을 반려할게요" })).toBeVisible();
    await expect
      .element(screen.getByRole("region", { name: "반려 사유 불러오는 중" }))
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: "취소", exact: true })).toBeEnabled();
    await expect.element(screen.getByRole("button", { name: "반려하기" })).toBeDisabled();
    finish();
    await expect.element(screen.getByRole("radio", { name: "사유 없이 반려할게요" })).toBeChecked();
    await expect.element(screen.getByRole("button", { name: "반려하기" })).toBeEnabled();
  });

  it("반려 사유 조회 실패 후 재시도할 수 있다", async () => {
    mocks.reasons.mockRejectedValueOnce(new Error("offline"));
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "반려", exact: true }).click();
    await expect.element(screen.getByRole("button", { name: "반려하기" })).toBeDisabled();
    await screen.getByRole("button", { name: "사유 다시 불러오기" }).click();
    await expect.element(screen.getByRole("radio", { name: "사유 없이 반려할게요" })).toBeChecked();
    await expect.element(screen.getByRole("button", { name: "반려하기" })).toBeEnabled();
  });

  it("목록이 비어 있으면 빈 상태를 보여준다", async () => {
    applications = [];
    const screen = await renderRoom();
    await expect.element(screen.getByText("아직 참여 신청이 없어요.")).toBeVisible();
    expect(mocks.profile).not.toHaveBeenCalled();
  });

  it("반려 중 다른 곳에서 처리된 신청은 선택값을 유지하되 다시 제출하지 못한다", async () => {
    mocks.reject.mockImplementation(async () => {
      settle("ACCEPTED", "수락");
      throw error("E1409", "이미 처리된 신청이에요.");
    });
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "반려", exact: true }).click();
    await screen.getByRole("radio", { name: "직무·면접 단계가 맞지 않아요" }).click();
    await screen.getByRole("button", { name: "반려하기" }).click();
    await expect.element(screen.getByRole("alert")).toHaveTextContent("이미 처리된 신청이에요.");
    await expect
      .element(screen.getByRole("radio", { name: "직무·면접 단계가 맞지 않아요" }))
      .toBeChecked();
    await expect.element(screen.getByRole("button", { name: "반려하기" })).toBeDisabled();
    await screen.getByRole("button", { name: "취소", exact: true }).click();
    expect(mocks.reject).toHaveBeenCalledOnce();
  });

  it("수락 결과가 비어 있으면 성공을 표시하지 않고 최신 목록을 확인한다", async () => {
    mocks.accept.mockResolvedValue({ result: "SUCCESS", data: null });
    const screen = await renderRoom();
    await screen.getByRole("button", { name: "수락", exact: true }).click();
    await expect.poll(() => mocks.applications.mock.calls.length).toBe(2);
    await expect.element(screen.getByRole("alert")).not.toBeInTheDocument();
    await expect
      .element(
        page.getByRole("region", { name: "Notifications" }).getByText("참여 신청을 수락했어요."),
      )
      .not.toBeInTheDocument();
    expect(mocks.applications).toHaveBeenCalledTimes(2);
  });

  it("신청을 조회하는 동안 로딩 안내 후 목록을 표시한다", async () => {
    let finish!: () => void;
    mocks.applications.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = () => resolve({ result: "SUCCESS", data: { applications } });
        }),
    );
    const screen = await renderRoom();
    await expect
      .element(screen.getByRole("region", { name: "참여 신청 불러오는 중" }))
      .toBeVisible();
    finish();
    await expect
      .element(screen.getByRole("button", { name: "성실한 사슴 03 공개 신뢰 카드 열기" }))
      .toBeVisible();
  });

  it("신청 목록 조회 실패를 오류 화면으로 표시한다", async () => {
    mocks.applications.mockRejectedValue(new Error("offline"));
    const screen = await renderRoom();
    await expect
      .element(screen.getByRole("heading", { name: "참여 신청을 불러오지 못했어요" }))
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: "다시 불러오기" })).toBeVisible();
  });
});
