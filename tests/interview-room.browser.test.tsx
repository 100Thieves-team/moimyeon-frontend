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
  confirm: vi.fn(),
  overview: vi.fn(),
}));
vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  confirmRoomMutation: () => ({ mutationFn: mocks.confirm }),
  resumeSubmissionViewUrlOptions: () => ({ queryKey: ["original"], queryFn: vi.fn() }),
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
  getInterviewOverviewOptions: () => ({ queryKey: ["overview"], queryFn: mocks.overview }),
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
  mocks.overview.mockResolvedValue({ result: "SUCCESS", data: { completedRooms: [] } });
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
  it("참여 신청 탭에서 URL 변경 없이 신청 목록을 확인한다", async () => {
    const screen = await renderRoom(false);
    const url = window.location.href;
    await screen.getByRole("tab", { name: "참여 신청 1" }).click();
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

const dialog = () => page.getByRole("alertdialog", { name: "면접 진행을 확정할까요?" });

describe("방장 진행 확정", () => {
  const settleConfirmation = () => {
    room.status = "CONFIRMED";
    room.previouslyConfirmed = true;
    room.recruit!.pendingApplicationCount = 0;
    applications = applications.map((application) => ({
      ...application,
      status: "ROOM_CONFIRMED",
      statusLabel: "종료",
    }));
    return { result: "SUCCESS", data: null };
  };

  it("카드에서 확정 결과를 확인하고 돌아가면 면접은 모집 중으로 유지된다", async () => {
    const screen = await renderRoom(false);
    await expect
      .element(screen.getByRole("button", { name: "참여 신청 확인하기" }))
      .not.toBeInTheDocument();
    await screen.getByRole("button", { name: "진행 확정하기" }).click();
    await expect.element(dialog().getByText("4명 · 최소 2명")).toBeVisible();
    await expect
      .element(dialog().getByText("확정하면 대기 중인 신청 1건은 자동으로 마감돼요."))
      .toBeVisible();
    await dialog().getByRole("button", { name: "돌아가기" }).click();
    expect(mocks.confirm).not.toHaveBeenCalled();
    expect(room.status).toBe("RECRUITING");
    await expect
      .element(screen.getByRole("tab", { name: "면접 정보" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it("확정 성공 후 참여자 탭으로 이동하고 새로 조회한 확정 상태와 종료된 신청을 표시한다", async () => {
    mocks.confirm.mockImplementation(async () => settleConfirmation());
    const screen = await renderRoom(false);
    await screen.getByRole("button", { name: "진행 확정하기" }).click();
    await dialog().getByRole("button", { name: "진행 확정하기" }).click();
    await expect
      .element(screen.getByRole("tab", { name: "참여자 4" }))
      .toHaveAttribute("aria-selected", "true");
    expect(mocks.confirm).toHaveBeenCalledOnce();
    expect(mocks.confirm.mock.calls[0][0]).toEqual({ path: { roomId } });
    await screen.getByRole("tab", { name: "참여 신청 0" }).click();
    await expect.element(screen.getByText("진행 확정으로 종료", { exact: true })).toBeVisible();
    await expect
      .element(screen.getByRole("button", { name: "수락", exact: true }))
      .not.toBeInTheDocument();
    await screen.getByRole("tab", { name: "면접 정보" }).click();
    await expect.element(screen.getByText("진행 확정", { exact: true })).toBeVisible();
    await expect.element(screen.getByRole("button", { name: "면접 완료하기" })).toBeDisabled();
    await expect.element(screen.getByText("준비 중", { exact: true })).not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "진행 확정하기" }))
      .not.toBeInTheDocument();
  });

  it("처리 중에는 반복 확정과 모달 닫기를 막는다", async () => {
    let finish!: (value: unknown) => void;
    mocks.confirm.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const screen = await renderRoom(false);
    await screen.getByRole("button", { name: "진행 확정하기" }).click();
    await dialog().getByRole("button", { name: "진행 확정하기" }).click();
    await expect.element(dialog().getByRole("button", { name: "확정 중..." })).toBeDisabled();
    await expect.element(dialog().getByRole("button", { name: "돌아가기" })).toBeDisabled();
    await expect.element(dialog().getByRole("button", { name: "진행 확정 닫기" })).toBeDisabled();
    expect(mocks.confirm).toHaveBeenCalledOnce();
    finish(settleConfirmation());
    await expect.element(dialog()).not.toBeInTheDocument();
  });

  it.each(["E1421", "E1422", "E1410"])(
    "%s 경합 오류를 안내하고 최신 조건에 따라 확정을 차단한다",
    async (code) => {
      mocks.confirm.mockImplementation(async () => {
        if (code === "E1421") room.recruit!.current = 1;
        if (code === "E1422") room.schedule!.startAt = "2020-01-01T19:00:00+09:00";
        if (code === "E1410") room.status = "CONFIRMED";
        throw error(code, "조건이 변경됐어요.");
      });
      const screen = await renderRoom(false);
      await screen.getByRole("button", { name: "진행 확정하기" }).click();
      await dialog().getByRole("button", { name: "진행 확정하기" }).click();
      await expect.element(dialog().getByRole("alert")).toBeVisible();
      await expect.element(dialog().getByRole("button", { name: "진행 확정하기" })).toBeDisabled();
      await dialog().getByRole("button", { name: "돌아가기" }).click();
      await expect
        .element(screen.getByRole("tab", { name: "면접 정보" }))
        .toHaveAttribute("aria-selected", "true");
    },
  );

  it("일시적 확정 실패는 모달에 안내하고 다시 시도할 수 있다", async () => {
    mocks.confirm
      .mockRejectedValueOnce(new Error("offline"))
      .mockImplementationOnce(async () => settleConfirmation());
    const screen = await renderRoom(false);
    await screen.getByRole("button", { name: "진행 확정하기" }).click();
    await dialog().getByRole("button", { name: "진행 확정하기" }).click();
    await expect.element(dialog().getByRole("alert")).toBeVisible();
    await expect.element(dialog().getByRole("button", { name: "진행 확정하기" })).toBeEnabled();
    await dialog().getByRole("button", { name: "진행 확정하기" }).click();
    await expect.element(dialog()).not.toBeInTheDocument();
    expect(mocks.confirm).toHaveBeenCalledTimes(2);
  });

  it("원본 비공개 룸의 확정 모달에서는 공개를 약속하지 않는다", async () => {
    room.resumePublic = false;
    const screen = await renderRoom(false);
    await screen.getByRole("button", { name: "진행 확정하기" }).click();
    await expect
      .element(dialog().getByText("이력서 원본은 공개되지 않고 AI 요약만 볼 수 있어요."))
      .toBeVisible();
    await dialog().getByRole("button", { name: "돌아가기" }).click();
  });

  it("최소 인원 미달은 카드에 사유를 표시하고 확정할 수 없다", async () => {
    room.recruit!.current = 1;
    const screen = await renderRoom(false);
    await expect.element(screen.getByRole("button", { name: "진행 확정하기" })).toBeDisabled();
    await expect.element(screen.getByText("진행 확정에는 최소 2명이 필요해요")).toBeVisible();
    expect(mocks.confirm).not.toHaveBeenCalled();
  });

  it("화면을 열어 둔 채 시작 시각이 되면 확정 버튼이 비활성화된다", async () => {
    room.schedule!.startAt = new Date(Date.now() + 1000).toISOString();
    const screen = await renderRoom(false);
    await expect.element(screen.getByRole("button", { name: "진행 확정하기" })).toBeDisabled();
    await expect.element(screen.getByText("진행 일정이 지나 확정할 수 없어요")).toBeVisible();
  });

  it("과거 확정 이력이 있는 방장은 일정이 지나도 다시 확정할 수 있다", async () => {
    room.previouslyConfirmed = true;
    room.schedule!.startAt = "2020-01-01T19:00:00+09:00";
    const screen = await renderRoom(false);
    await expect.element(screen.getByRole("button", { name: "진행 확정하기" })).toBeEnabled();
  });

  it("확정된 룸에 직접 진입해도 확정 상태와 비활성화된 완료 버튼을 표시한다", async () => {
    room.status = "CONFIRMED";
    const screen = await renderRoom(false);
    await expect
      .element(screen.getByRole("tab", { name: "면접 정보" }))
      .toHaveAttribute("aria-selected", "true");
    await expect.element(screen.getByText("진행 확정", { exact: true }).first()).toBeVisible();
    await expect.element(screen.getByRole("button", { name: "면접 완료하기" })).toBeDisabled();
  });
});

describe("완료 면접 후기 액션", () => {
  it.each([
    { isHost: true, reviewStatus: "WRITABLE", label: "후기 남기기" },
    { isHost: false, reviewStatus: "WRITABLE", label: "후기 남기기" },
    { isHost: true, reviewStatus: "WRITTEN", label: "후기 수정하기" },
  ])(
    "방장 여부 $isHost, $reviewStatus 상태에서 $label 링크를 표시한다",
    async ({ isHost, reviewStatus, label }) => {
      room.status = "COMPLETED";
      room.viewer!.isHost = isHost;
      room.viewer!.isParticipating = true;
      mocks.overview.mockResolvedValue({
        result: "SUCCESS",
        data: { completedRooms: [{ room: { roomId }, reviewStatus }] },
      });
      const screen = await renderRoom(false);
      await expect
        .element(screen.getByRole("link", { name: label }))
        .toHaveAttribute("href", `/interviews/${roomId}/review`);
    },
  );

  it.each(["NOT_ELIGIBLE_ABSENT", "NOT_ELIGIBLE_NO_TARGET"])(
    "%s 상태에서는 후기 버튼을 표시하지 않는다",
    async (reviewStatus) => {
      room.status = "COMPLETED";
      mocks.overview.mockResolvedValue({
        result: "SUCCESS",
        data: { completedRooms: [{ room: { roomId }, reviewStatus }] },
      });
      const screen = await renderRoom(false);
      await expect.element(screen.getByRole("heading", { name: room.title })).toBeVisible();
      await expect
        .element(screen.getByRole("link", { name: /후기 남기기|후기 수정하기/ }))
        .not.toBeInTheDocument();
    },
  );
});
