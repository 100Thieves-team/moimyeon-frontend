import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { ToastProvider } from "@/components/toast";
import { LoginDialog } from "@/features/auth/login-dialog";
import { InterviewDetailContent } from "@/features/interview-detail/interview-detail-content";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  publicProfile: vi.fn(),
  roomDetail: vi.fn(),
  withdrawRoomApplication: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  issueDevSessionMutation: () => ({ mutationFn: vi.fn() }),
  myRoomApplicationQueryKey: ({ path }: { path: { roomId: string } }) => [
    "myRoomApplication",
    path.roomId,
  ],
  publicProfileOptions: ({ path }: { path: { memberId: string } }) => ({
    queryFn: () => mocks.publicProfile(path.memberId),
    queryKey: ["publicProfile", path.memberId],
  }),
  roomDetailOptions: ({ path }: { path: { roomId: string } }) => ({
    queryFn: () => mocks.roomDetail(path.roomId),
    queryKey: ["roomDetail", path.roomId],
  }),
  roomDetailQueryKey: ({ path }: { path: { roomId: string } }) => ["roomDetail", path.roomId],
  roomsQueryKey: () => ["rooms"],
  withdrawRoomApplicationMutation: () => ({
    mutationFn: ({ path }: { path: { roomId: string } }) =>
      mocks.withdrawRoomApplication(path.roomId),
  }),
}));

const roomId = "019db000-0000-7000-8000-000000002001";

type Viewer = {
  hasRemovalHistory: boolean;
  isHost: boolean;
  isParticipating: boolean;
  latestApplicationStatus: string | null;
  member: {
    isActive: boolean;
    participationSlots: { limit: number; occupied: number };
    pendingApplicationQuota: { limit: number; occupied: number };
  };
};

const eligibleViewer: Viewer = {
  hasRemovalHistory: false,
  isHost: false,
  isParticipating: false,
  latestApplicationStatus: null,
  member: {
    isActive: true,
    participationSlots: { limit: 3, occupied: 0 },
    pendingApplicationQuota: { limit: 3, occupied: 0 },
  },
};

type RoomOptions = {
  recruit?: Partial<{
    current: number;
    max: number;
    min: number;
    pendingApplicationCount: number;
    recruitStatus: string;
    recruitStatusLabel: string;
  }>;
  schedule?: { durationMinutes: number; startAt: string } | null;
  status?: string;
  viewer?: Viewer | null;
};

function createRoom(options: RoomOptions = {}) {
  return {
    company: { companyId: 1, name: "한빛커머스" },
    confirmation: { blockReason: null, ready: false },
    description: "실제 면접처럼 시스템 설계 위주로 진행해요.",
    hostMemberId: "019db000-0000-7000-8000-000000001001",
    jobPosting: { jobPostingId: 11, postingName: "백엔드 개발자" },
    jobPostingId: 11,
    jobRole: { code: "BACKEND", displayName: "서버·백엔드", jobRoleId: 10 },
    jobRoleId: 10,
    method: "OFFLINE",
    methodLabel: "오프라인",
    recruit: {
      current: 3,
      max: 5,
      min: 3,
      pendingApplicationCount: 0,
      recruitStatus: "RECRUITING",
      recruitStatusLabel: "모집 중",
      ...options.recruit,
    },
    region: { label: "서울 강남구", sigunguId: 1 },
    resumePublic: true,
    roomId,
    round: "SECOND",
    roundLabel: "2차",
    schedule: options.schedule ?? { durationMinutes: 90, startAt: "2099-09-01T19:00:00+09:00" },
    sigunguId: 1,
    status: options.status ?? "RECRUITING",
    title: "한빛커머스 백엔드 2차 같이 준비해요",
    type: "JOB",
    typeLabel: "직무 면접",
    viewer: options.viewer === undefined ? eligibleViewer : options.viewer,
  };
}

const publicProfileResponse = {
  data: {
    bio: "구체적인 피드백을 중요하게 생각해요.",
    interestJobRoles: [{ code: "BACKEND", displayName: "서버·백엔드", jobRoleId: 10 }],
    memberId: "019db000-0000-7000-8000-000000001001",
    nickname: "꼼꼼한 여우 12",
    trust: {
      activityTopPercent: 10,
      noShowCount: 0,
      recentAttendances: ["ATTENDED", "ATTENDED", "ABSENT"],
      representativeTags: [{ count: 4, label: "피드백이 구체적이에요" }],
    },
  },
  result: "SUCCESS",
};

function roomResponse(room: ReturnType<typeof createRoom>) {
  return { data: room, result: "SUCCESS" };
}

async function renderDetail() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
    },
  });

  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <LoginDialog />
        <Suspense fallback={<p>불러오는 중</p>}>
          <InterviewDetailContent roomId={roomId} />
        </Suspense>
      </ToastProvider>
    </QueryClientProvider>,
  );

  return { queryClient, screen };
}

beforeEach(async () => {
  vi.resetAllMocks();
  await page.viewport(1440, 900);
  window.history.replaceState(null, "", `/interviews/${roomId}`);
  mocks.roomDetail.mockResolvedValue(roomResponse(createRoom()));
  mocks.publicProfile.mockResolvedValue(publicProfileResponse);
  mocks.withdrawRoomApplication.mockResolvedValue({ result: "SUCCESS" });
});

describe("InterviewDetailContent", () => {
  it("직접 진입해 공개 상세와 방장 공개 프로필을 확인한다", async () => {
    const { screen } = await renderDetail();

    await expect
      .element(screen.getByRole("heading", { name: "한빛커머스 백엔드 2차 같이 준비해요" }))
      .toBeVisible();
    await expect
      .element(screen.getByText("한빛커머스 · 백엔드 개발자 · 서버·백엔드 · 2차 면접 · 직무 면접"))
      .toBeVisible();
    await expect.element(screen.getByText("오프라인 · 서울 강남구")).toBeVisible();
    await expect.element(screen.getByText("최소 3 · 최대 5명")).toBeVisible();
    await expect.element(screen.getByText("3 / 5명")).toBeVisible();
    await expect.element(screen.getByText("2자리 남았어요")).toBeVisible();
    await expect
      .element(screen.getByRole("complementary", { name: "면접 참가 신청" }).getByText("최소 3명"))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByText("실제 면접처럼 시스템 설계 위주로 진행해요."))
      .toBeVisible();
    await expect
      .element(screen.getByRole("complementary", { name: "방장 공개 프로필" }))
      .toBeVisible();
    await expect.element(screen.getByRole("heading", { name: "꼼꼼한 여우 12" })).toBeVisible();
    await expect
      .element(screen.getByText("활동률 상위 10% · 최근 출석 2/3회 · 누적 불참 0회"))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "참가 신청하기" }))
      .toHaveAttribute("href", `/interviews/${roomId}/apply`);
  });

  it("방장 프로필 조회 실패를 상세 전체 오류와 분리한다", async () => {
    mocks.publicProfile.mockRejectedValue(new Error("profile failed"));
    const { screen } = await renderDetail();

    await expect
      .element(screen.getByRole("heading", { name: "한빛커머스 백엔드 2차 같이 준비해요" }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("방장 프로필을 불러오지 못했어요.");
    await expect.element(screen.getByRole("button", { name: "다시 불러오기" })).toBeVisible();
  });

  it("비로그인 사용자가 신청하면 현재 상세 경로로 복귀하는 로그인 Dialog를 연다", async () => {
    mocks.roomDetail.mockResolvedValue(roomResponse(createRoom({ viewer: null })));
    const { screen } = await renderDetail();

    await screen.getByRole("button", { name: "참가 신청하기" }).click();

    await expect
      .element(screen.getByRole("dialog", { name: "로그인하고 면접에 참가하세요" }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "Google로 계속하기" }))
      .toHaveAttribute(
        "href",
        `/auth/google/start?returnTo=${encodeURIComponent(`/interviews/${roomId}`)}`,
      );
    await screen.getByRole("button", { name: "로그인 창 닫기" }).click();
  });

  it("정원이 찬 면접에서는 대기 신청 링크를 표시한다", async () => {
    mocks.roomDetail.mockResolvedValue(
      roomResponse(
        createRoom({
          recruit: {
            current: 5,
            max: 5,
            recruitStatus: "CLOSED",
            recruitStatusLabel: "모집 마감",
          },
        }),
      ),
    );
    const { screen } = await renderDetail();

    await expect
      .element(screen.getByRole("link", { name: "대기 신청하기" }))
      .toHaveAttribute("href", `/interviews/${roomId}/apply`);
  });

  it("비로그인 사용자가 대기 신청하면 현재 상세 경로로 복귀하는 로그인 Dialog를 연다", async () => {
    mocks.roomDetail.mockResolvedValue(
      roomResponse(
        createRoom({
          recruit: {
            current: 5,
            max: 5,
            recruitStatus: "CLOSED",
            recruitStatusLabel: "모집 마감",
          },
          viewer: null,
        }),
      ),
    );
    const { screen } = await renderDetail();

    await screen.getByRole("button", { name: "대기 신청하기" }).click();

    await expect
      .element(screen.getByRole("dialog", { name: "로그인하고 면접에 참가하세요" }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "Google로 계속하기" }))
      .toHaveAttribute(
        "href",
        `/auth/google/start?returnTo=${encodeURIComponent(`/interviews/${roomId}`)}`,
      );
    await screen.getByRole("button", { name: "로그인 창 닫기" }).click();
  });

  it.each([
    [
      "참여자",
      { ...eligibleViewer, isParticipating: true, latestApplicationStatus: "ACCEPTED" },
      "내 면접 보기",
    ],
    ["방장", { ...eligibleViewer, isHost: true, isParticipating: true }, "면접 관리하기"],
  ])("%s에게 알맞은 면접 진입 링크를 표시한다", async (_name, viewer, label) => {
    mocks.roomDetail.mockResolvedValue(roomResponse(createRoom({ viewer })));
    const { screen } = await renderDetail();

    await expect
      .element(screen.getByRole("link", { name: label }))
      .toHaveAttribute("href", `/interviews/${roomId}/room`);
  });

  it("일정이 지나면 소개를 유지하고 비활성 버튼으로 안내한다", async () => {
    mocks.roomDetail.mockResolvedValue(
      roomResponse(
        createRoom({ schedule: { durationMinutes: 90, startAt: "2020-09-01T19:00:00+09:00" } }),
      ),
    );
    const { screen } = await renderDetail();

    await expect
      .element(screen.getByText("실제 면접처럼 시스템 설계 위주로 진행해요."))
      .toBeVisible();
    await expect
      .element(screen.getByRole("button", { name: "이미 일정이 지난 면접이에요" }))
      .toBeDisabled();
  });

  it.each([
    ["취소", "CANCELED", "취소된 면접이에요"],
    ["종료", "COMPLETED", "종료된 면접이에요"],
    ["확정", "CONFIRMED", "참여자가 확정된 면접이에요"],
    ["진행 중", "IN_PROGRESS", "진행 중인 면접이에요"],
  ])("%s된 면접은 소개를 유지하고 비활성 버튼으로 안내한다", async (_name, status, message) => {
    mocks.roomDetail.mockResolvedValue(roomResponse(createRoom({ status })));
    const { screen } = await renderDetail();

    await expect
      .element(screen.getByText("실제 면접처럼 시스템 설계 위주로 진행해요."))
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: message })).toBeDisabled();
  });

  it.each([
    [
      "신청 반려",
      { ...eligibleViewer, latestApplicationStatus: "REJECTED" },
      "참가 신청이 반려됐어요",
    ],
    ["퇴장 이력", { ...eligibleViewer, hasRemovalHistory: true }, "면접에서 퇴장 처리됐어요"],
    [
      "계정 제한",
      { ...eligibleViewer, member: { ...eligibleViewer.member, isActive: false } },
      "이용이 제한된 계정이에요",
    ],
    [
      "참여 한도",
      {
        ...eligibleViewer,
        member: {
          ...eligibleViewer.member,
          participationSlots: { limit: 3, occupied: 3 },
        },
      },
      "참여 면접 한도에 도달했어요",
    ],
    [
      "신청 한도",
      {
        ...eligibleViewer,
        member: {
          ...eligibleViewer.member,
          pendingApplicationQuota: { limit: 3, occupied: 3 },
        },
      },
      "대기 신청 한도에 도달했어요",
    ],
  ])("%s 상태는 비활성 버튼으로 안내한다", async (_name, viewer, message) => {
    mocks.roomDetail.mockResolvedValue(roomResponse(createRoom({ viewer })));
    const { screen } = await renderDetail();

    await expect.element(screen.getByRole("button", { name: message })).toBeDisabled();
  });

  it("조회자 정보가 없으면 비활성 버튼으로 안내한다", async () => {
    mocks.roomDetail.mockResolvedValue({
      data: { ...createRoom(), viewer: undefined },
      result: "SUCCESS",
    });
    const { screen } = await renderDetail();

    await expect
      .element(screen.getByRole("button", { name: "신청 가능 여부를 확인할 수 없어요" }))
      .toBeDisabled();
  });

  it("알 수 없는 신청 상태면 비활성 버튼으로 안내한다", async () => {
    mocks.roomDetail.mockResolvedValue(
      roomResponse(
        createRoom({ viewer: { ...eligibleViewer, latestApplicationStatus: "UNKNOWN" } }),
      ),
    );
    const { screen } = await renderDetail();

    await expect
      .element(screen.getByRole("button", { name: "신청 상태를 확인할 수 없어요" }))
      .toBeDisabled();
  });

  it("수락 대기 신청을 취소하면 상세를 갱신해 재신청 행동을 표시한다", async () => {
    let currentRoom = createRoom({
      viewer: { ...eligibleViewer, latestApplicationStatus: "PENDING" },
    });
    mocks.roomDetail.mockImplementation(() => Promise.resolve(roomResponse(currentRoom)));
    mocks.withdrawRoomApplication.mockImplementation(async () => {
      currentRoom = createRoom();
      return { result: "SUCCESS" };
    });
    const { screen } = await renderDetail();

    await expect.element(screen.getByText("방장의 수락을 기다리고 있어요")).toBeVisible();
    await expect
      .element(screen.getByText("수락되면 알림을 보내고 채팅방에 들어가요"))
      .not.toBeInTheDocument();
    await screen.getByRole("button", { name: "신청 취소하기" }).click();

    await expect
      .element(screen.getByRole("dialog", { name: "참가 신청을 취소했어요." }))
      .toBeVisible();
    await expect.element(screen.getByRole("link", { name: "참가 신청하기" })).toBeVisible();
    expect(mocks.withdrawRoomApplication).toHaveBeenCalledWith(roomId);
  });

  it("신청 취소에 실패하면 수락 대기 상태와 오류 안내를 유지한다", async () => {
    mocks.roomDetail.mockResolvedValue(
      roomResponse(
        createRoom({ viewer: { ...eligibleViewer, latestApplicationStatus: "PENDING" } }),
      ),
    );
    mocks.withdrawRoomApplication.mockRejectedValue(new Error("withdraw failed"));
    const { screen } = await renderDetail();

    await screen.getByRole("button", { name: "신청 취소하기" }).click();

    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("신청을 취소하지 못했어요. 잠시 후 다시 시도해 주세요.");
    await expect.element(screen.getByText("방장의 수락을 기다리고 있어요")).toBeVisible();
  });
});
