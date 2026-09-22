import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { ToastProvider } from "@/components/toast";
import { InterviewRoomContent } from "@/features/interview-room/interview-room-content";
import type { InterviewRoom, RoomParticipant } from "@/features/interview-room/participant-model";
import { MOCK_INTERVIEW_DETAIL_SCENARIOS } from "@/features/interview-detail/interview-detail-mock";
import { routerRefreshMock, routerReplaceMock } from "./mocks/next-navigation";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  room: vi.fn(),
  participants: vi.fn(),
  applications: vi.fn(),
  leave: vi.fn(),
}));
vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  roomDetailOptions: ({ path }: { path: { roomId: string } }) => ({
    queryKey: ["room", path.roomId],
    queryFn: mocks.room,
  }),
  roomDetailQueryKey: ({ path }: { path: { roomId: string } }) => ["room", path.roomId],
  roomParticipantsOptions: ({ path }: { path: { roomId: string } }) => ({
    queryKey: ["participants", path.roomId],
    queryFn: mocks.participants,
  }),
  roomParticipantsQueryKey: ({ path }: { path: { roomId: string } }) => [
    "participants",
    path.roomId,
  ],
  roomApplicationsOptions: ({ path }: { path: { roomId: string } }) => ({
    queryKey: ["applications", path.roomId],
    queryFn: mocks.applications,
  }),
  roomApplicationsQueryKey: ({ path }: { path: { roomId: string } }) => [
    "applications",
    path.roomId,
  ],
  getInterviewOverviewQueryKey: () => ["overview"],
  roomsQueryKey: () => ["rooms"],
  participationSlotsQueryKey: () => ["slots"],
  myRoomApplicationQueryKey: () => ["my-application"],
  memberMeQueryKey: () => ["me"],
  publicProfileOptions: () => ({ queryKey: ["profile"], queryFn: vi.fn() }),
  rejectReasonsOptions: () => ({ queryKey: ["reasons"], queryFn: vi.fn() }),
  acceptApplicationMutation: () => ({ mutationFn: vi.fn() }),
  rejectApplicationMutation: () => ({ mutationFn: vi.fn() }),
  roomLeaveMutation: () => ({ mutationFn: mocks.leave }),
}));

let room: InterviewRoom;
let participants: RoomParticipant[];
const roomId = "participant-room";
const error = (code: string, message: string) => ({ result: "ERROR", error: { code, message } });

async function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  const screen = await render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <Suspense fallback={<p>불러오는 중</p>}>
          <InterviewRoomContent roomId={roomId} currentMemberId="me" />
        </Suspense>
      </ToastProvider>
    </QueryClientProvider>,
  );
  return { client, screen };
}

beforeEach(async () => {
  vi.resetAllMocks();
  routerReplaceMock.mockImplementation(() => {});
  room = structuredClone(MOCK_INTERVIEW_DETAIL_SCENARIOS[0].room);
  room.roomId = roomId;
  room.status = "RECRUITING";
  room.resumePublic = false;
  room.viewer = { isHost: false, isParticipating: true };
  room.recruit = {
    current: 3,
    min: 2,
    max: 5,
    pendingApplicationCount: 1,
    recruitStatus: "RECRUITING",
    recruitStatusLabel: "모집 중",
  };
  participants = [
    {
      memberId: "host",
      nickname: "꼼꼼한 여우",
      isHost: true,
      jobRoles: [{ jobRoleId: 1, name: "백엔드 개발" }],
      activitySummary: null,
      aiSummary: { status: "DONE", text: "결제 정산 경험" },
      resumeSubmissionId: 1,
      canViewOriginal: false,
    },
    {
      memberId: "me",
      nickname: "든든한 곰",
      isHost: false,
      jobRoles: [],
      activitySummary: "공개 활동 정보",
      aiSummary: { status: "PROCESSING", text: null },
      resumeSubmissionId: 2,
      canViewOriginal: false,
    },
    {
      memberId: "other",
      nickname: "성실한 사슴",
      isHost: false,
      jobRoles: [],
      activitySummary: null,
      aiSummary: null,
      resumeSubmissionId: null,
      canViewOriginal: false,
    },
  ];
  mocks.room.mockImplementation(async () => ({ result: "SUCCESS", data: structuredClone(room) }));
  mocks.participants.mockImplementation(async () => ({
    result: "SUCCESS",
    data: { participants: structuredClone(participants) },
  }));
  mocks.applications.mockResolvedValue({ result: "SUCCESS", data: { applications: [] } });
  mocks.leave.mockResolvedValue({ result: "SUCCESS", data: null });
  await page.viewport(1440, 900);
});

describe("참여자 명부", () => {
  it("참여자는 명부에서 방장과 본인, 공개 정보와 AI 요약 상태를 확인한다", async () => {
    const { screen } = await setup();
    const roster = screen.getByRole("list", { name: "참여자 목록" });
    await expect.element(roster.getByText("방장", { exact: true })).toBeVisible();
    await expect.element(roster.getByText("나", { exact: true })).toBeVisible();
    await expect.element(roster.getByText("결제 정산 경험")).toBeVisible();
    await expect.element(roster.getByText("공개 활동 정보")).toBeVisible();
    await expect.element(roster.getByText("AI 요약을 준비 중이에요.")).toBeVisible();
    await expect.element(roster.getByText("제공된 AI 요약이 없어요.")).toBeVisible();
    await expect.element(screen.getByRole("tab", { name: /참여 신청/ })).not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("tab", { name: "참여자 3" }))
      .toHaveAttribute("aria-selected", "true");
    await expect.element(screen.getByRole("tab", { name: "댓글" })).not.toBeInTheDocument();
    expect(mocks.applications).not.toHaveBeenCalled();
    await expect
      .element(screen.getByText("이력서 원본은 공개하지 않는 면접이에요.", { exact: false }))
      .not.toBeInTheDocument();
    await expect.element(screen.getByRole("button", { name: /원본/ })).not.toBeInTheDocument();
  });

  it("방장은 신청 탭에서 참여자 탭으로 이동하고 자기 행의 방장·나 배지를 확인한다", async () => {
    room.viewer = { isHost: true, isParticipating: true };
    participants[0].memberId = "me";
    participants[1].memberId = "other-2";
    const { screen } = await setup();
    await expect.element(screen.getByText("아직 참여 신청이 없어요.")).toBeVisible();
    await expect.poll(() => mocks.participants.mock.calls.length).toBe(1);
    await screen.getByRole("tab", { name: "참여자 3" }).click();
    const profile = screen.getByRole("button", { name: "꼼꼼한 여우 공개 신뢰 카드 열기" });
    await expect.element(profile.getByText("방장", { exact: true })).toBeVisible();
    await expect.element(profile.getByText("나", { exact: true })).toBeVisible();
  });

  it("방장이 일반 참여자로 바뀌면 참여자 탭으로 전환하고 신청 패널을 제거한다", async () => {
    room.viewer = { isHost: true, isParticipating: true };
    const { screen, client } = await setup();
    await expect.element(screen.getByText("아직 참여 신청이 없어요.")).toBeVisible();
    room.viewer = { isHost: false, isParticipating: true };
    await client.invalidateQueries({ queryKey: ["room", roomId] });
    await expect
      .element(screen.getByRole("tab", { name: "참여자 3" }))
      .toHaveAttribute("aria-selected", "true");
    await expect.element(screen.getByRole("tab", { name: /참여 신청/ })).not.toBeInTheDocument();
    await expect.element(screen.getByText("아직 참여 신청이 없어요.")).not.toBeInTheDocument();
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
  });

  it("명부가 로딩 중일 때 요약 대신 로딩 안내를 표시한다", async () => {
    let finish!: (value: unknown) => void;
    mocks.participants.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const { screen } = await setup();
    await expect
      .element(screen.getByRole("region", { name: "참여자 목록 불러오는 중" }))
      .toBeVisible();
    await expect.element(screen.getByText("결제 정산 경험")).not.toBeInTheDocument();
    finish({ result: "SUCCESS", data: { participants } });
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
  });

  it.each([false, true])("상세 재조회만으로 화면을 이동하지 않는다: 방장=%s", async (isHost) => {
    room.viewer = { isHost, isParticipating: true };
    const { screen, client } = await setup();
    if (isHost) await screen.getByRole("tab", { name: "참여자 3" }).click();
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
    room.viewer = { isHost: false, isParticipating: false };
    await client.invalidateQueries({ queryKey: ["room", roomId] });
    expect(routerReplaceMock).not.toHaveBeenCalled();
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
    await expect.element(screen.getByText("아직 참여 신청이 없어요.")).not.toBeInTheDocument();
  });

  it("원본 공개 룸에서도 공개 안내 문구와 원본 접근을 표시하지 않는다", async () => {
    room.resumePublic = true;
    const { screen } = await setup();
    await expect
      .element(
        screen.getByText("이력서 원본은 진행 확정 이후 공개되는 면접이에요.", { exact: false }),
      )
      .not.toBeInTheDocument();
    await expect.element(screen.getByRole("link", { name: /원본/ })).not.toBeInTheDocument();
    await expect.element(screen.getByRole("checkbox")).not.toBeInTheDocument();
  });

  it("서버에서 허용한 참여자는 이동 없이 명부와 요약을 확인한다", async () => {
    const { screen } = await setup();
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
    expect(routerReplaceMock).not.toHaveBeenCalled();
  });

  it("명부 조회 실패 후 다시 불러와 명부를 확인한다", async () => {
    mocks.participants.mockRejectedValueOnce(new Error("offline"));
    const { screen } = await setup();
    await expect
      .element(screen.getByRole("heading", { name: "참여자 목록을 불러오지 못했어요" }))
      .toBeVisible();
    await screen.getByRole("button", { name: "다시 불러오기" }).click();
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
  });

  it("명부 재조회가 실패해도 기존 목록을 유지한다", async () => {
    const { screen, client } = await setup();
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
    mocks.participants.mockRejectedValue(error("E1419", "참여 권한 없음"));
    await client.invalidateQueries({ queryKey: ["participants", roomId] });
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
    await expect
      .element(screen.getByRole("heading", { name: "면접에 접근할 수 없어요" }))
      .not.toBeInTheDocument();
  });
});

describe("참여 취소", () => {
  it("확인 모달에서 돌아가면 참여를 취소하지 않는다", async () => {
    const { screen } = await setup();
    await screen.getByRole("button", { name: "참여 취소하기", exact: true }).click();
    await screen.getByRole("button", { name: "돌아가기", exact: true }).click();
    expect(mocks.leave).not.toHaveBeenCalled();
    await expect.element(screen.getByText("결제 정산 경험")).toBeVisible();
  });

  it.each([false, true])(
    "취소 성공 후 관련 쿼리를 무효화하고 내 면접으로 이동한다: 방장=%s",
    async (isHost) => {
      room.viewer = { isHost, isParticipating: true };
      const { screen, client } = await setup();
      if (isHost) await screen.getByRole("tab", { name: "참여자 3" }).click();
      for (const key of [["overview"], ["rooms"], ["slots"], ["my-application"], ["me"]])
        client.setQueryData(key, {});
      await screen.getByRole("button", { name: "참여 취소하기", exact: true }).click();
      if (isHost)
        await expect
          .element(screen.getByText("위임할 사람이 없으면 면접이 취소돼요.", { exact: false }))
          .toBeVisible();
      await screen.getByRole("button", { name: "취소하기", exact: true }).click();
      await expect.poll(() => routerReplaceMock.mock.calls.length).toBe(1);
      expect(routerReplaceMock).toHaveBeenCalledWith("/interviews/me");
      expect(routerRefreshMock).toHaveBeenCalledOnce();
      expect(mocks.leave).toHaveBeenCalledOnce();
      expect(client.getQueryState(["participants", roomId])?.isInvalidated).toBe(true);
      if (isHost) expect(client.getQueryState(["applications", roomId])?.isInvalidated).toBe(true);
      for (const key of [["overview"], ["rooms"], ["slots"], ["my-application"], ["me"]])
        expect(client.getQueryState(key)?.isInvalidated).toBe(true);
      await expect.element(screen.getByText("결제 정산 경험")).not.toBeInTheDocument();
    },
  );

  it("처리 중 반복 클릭과 모달 닫기를 막고 응답 전에는 성공을 표시하지 않는다", async () => {
    let resolve!: (value: unknown) => void;
    mocks.leave.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const { screen } = await setup();
    await screen.getByRole("button", { name: "참여 취소하기", exact: true }).click();
    const submit = screen.getByRole("button", { name: "취소하기", exact: true });
    await submit.click();
    await expect
      .element(screen.getByRole("button", { name: "취소 중...", exact: true }))
      .toBeDisabled();
    await expect
      .element(screen.getByRole("button", { name: "돌아가기", exact: true }))
      .toBeDisabled();
    (
      screen.getByRole("button", { name: "취소 중...", exact: true }).element() as HTMLButtonElement
    ).click();
    expect(mocks.leave).toHaveBeenCalledOnce();
    expect(routerReplaceMock).not.toHaveBeenCalled();
    resolve({ result: "SUCCESS" });
    await expect.poll(() => routerReplaceMock.mock.calls.length).toBe(1);
  });

  it.each(["IN_PROGRESS", "COMPLETED", "CANCELED", "UNKNOWN"])(
    "%s 상태는 참여 취소를 차단한다",
    async (status) => {
      room.status = status;
      const { screen } = await setup();
      await expect
        .element(screen.getByRole("button", { name: "참여 취소하기", exact: true }))
        .toBeDisabled();
      expect(mocks.leave).not.toHaveBeenCalled();
    },
  );

  it("확정된 면접의 최소 인원에서는 취소를 차단하고 사유를 보여준다", async () => {
    room.status = "CONFIRMED";
    room.recruit!.current = room.recruit!.min;
    const { screen } = await setup();
    await expect
      .element(screen.getByRole("button", { name: "참여 취소하기", exact: true }))
      .toBeDisabled();
    await expect.element(screen.getByText("최소 진행 인원이라", { exact: false })).toBeVisible();
  });

  it("확정 후 최소 인원보다 많으면 이탈 기록 안내 후 취소할 수 있다", async () => {
    room.status = "CONFIRMED";
    const { screen } = await setup();
    await screen.getByRole("button", { name: "참여 취소하기", exact: true }).click();
    await expect
      .element(screen.getByText("진행 확정 후 참여를 취소한 기록이 남아요."))
      .toBeVisible();
    await screen.getByRole("button", { name: "취소하기", exact: true }).click();
    await expect.poll(() => routerReplaceMock.mock.calls.length).toBe(1);
  });

  it.each(["E1423", "E1424"])(
    "%s 경합 실패 시 최신 상태와 제한을 반영하고 성공 이동하지 않는다",
    async (code) => {
      mocks.leave.mockImplementation(async () => {
        room.status = code === "E1423" ? "CONFIRMED" : "IN_PROGRESS";
        room.recruit!.current = room.recruit!.min;
        throw error(code, "변경된 면접 상태에서는 나갈 수 없습니다.");
      });
      const { screen } = await setup();
      await screen.getByRole("button", { name: "참여 취소하기", exact: true }).click();
      await screen.getByRole("button", { name: "취소하기", exact: true }).click();
      await expect.element(screen.getByRole("alert")).toBeVisible();
      await expect.poll(() => mocks.room.mock.calls.length).toBe(2);
      await expect
        .element(screen.getByRole("button", { name: "취소하기", exact: true }))
        .toBeDisabled();
      expect(routerReplaceMock).not.toHaveBeenCalled();
    },
  );

  it("일시적 취소 실패는 오류를 안내하고 다시 시도할 수 있다", async () => {
    mocks.leave.mockRejectedValueOnce(new Error("offline"));
    const { screen } = await setup();
    await screen.getByRole("button", { name: "참여 취소하기", exact: true }).click();
    await screen.getByRole("button", { name: "취소하기", exact: true }).click();
    await expect.element(screen.getByRole("alert")).toBeVisible();
    await expect
      .element(screen.getByRole("button", { name: "취소하기", exact: true }))
      .toBeEnabled();
    expect(routerReplaceMock).not.toHaveBeenCalled();
    await screen.getByRole("button", { name: "취소하기", exact: true }).click();
    await expect.poll(() => routerReplaceMock.mock.calls.length).toBe(1);
  });

  it("성공하지 않은 응답은 내 면접 이동이나 성공 알림으로 처리하지 않는다", async () => {
    mocks.leave.mockResolvedValue({ result: "ERROR", data: null });
    const { screen } = await setup();
    await screen.getByRole("button", { name: "참여 취소하기", exact: true }).click();
    await screen.getByRole("button", { name: "취소하기", exact: true }).click();
    await expect.element(screen.getByRole("alert")).toBeVisible();
    await expect
      .element(screen.getByRole("button", { name: "취소하기", exact: true }))
      .toBeEnabled();
    expect(routerReplaceMock).not.toHaveBeenCalled();
  });

  it("취소 권한 오류는 모달에 안내하고 성공으로 처리하지 않는다", async () => {
    mocks.leave.mockRejectedValue(error("E1419", "이미 나간 참여자"));
    const { screen } = await setup();
    await screen.getByRole("button", { name: "참여 취소하기", exact: true }).click();
    await screen.getByRole("button", { name: "취소하기", exact: true }).click();
    await expect.element(screen.getByRole("alert")).toHaveTextContent("이미 나간 참여자");
    await expect
      .element(screen.getByRole("button", { name: "돌아가기", exact: true }))
      .toBeEnabled();
    expect(routerReplaceMock).not.toHaveBeenCalled();
  });
});
