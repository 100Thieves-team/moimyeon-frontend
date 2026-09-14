import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import type { GetInterviewOverviewResponse } from "@/api/generated";
import { ToastProvider } from "@/components/toast";
import { MyInterviewsContent } from "@/features/my-interviews/my-interviews-content";
import {
  getMockMyInterviews,
  resetMockMyInterviews,
} from "@/features/my-interviews/my-interviews-mock";
import { MyInterviewsSkeleton } from "@/features/my-interviews/my-interviews-skeleton";
import MyInterviewsError from "@/app/(site)/interviews/me/error";
import { CreateReviewForm } from "@/features/review/create-review-form";
import { EditReviewForm } from "@/features/review/edit-review-form";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  overview: vi.fn(),
  withdraw: vi.fn(),
  submitReview: vi.fn(),
  deleteReview: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  getInterviewOverviewOptions: () => ({ queryKey: ["overview"], queryFn: () => mocks.overview() }),
  getInterviewOverviewQueryKey: () => ["overview"],
  roomDetailQueryKey: ({ path }: { path: { roomId: string } }) => ["room", path.roomId],
  myRoomApplicationQueryKey: ({ path }: { path: { roomId: string } }) => [
    "application",
    path.roomId,
  ],
  roomsQueryKey: () => ["rooms"],
  withdrawRoomApplicationMutation: () => ({ mutationFn: mocks.withdraw }),
  submitReviewMutation: () => ({ mutationFn: mocks.submitReview }),
  deleteReviewMutation: () => ({ mutationFn: mocks.deleteReview }),
  updateReviewMutation: () => ({ mutationFn: vi.fn() }),
  getReviewOverviewQueryKey: () => ["review"],
  getReviewOverviewOptions: () => ({
    queryKey: ["review"],
    queryFn: async () => ({
      data: {
        reviews: [
          {
            reviewId: 1,
            targetMemberId: "member",
            anonymous: true,
            tags: [],
            content: "함께 연습하기 좋았어요.",
          },
        ],
      },
    }),
  }),
}));

let overview: NonNullable<GetInterviewOverviewResponse["data"]>;

function renderList(children = <MyInterviewsContent />) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <ErrorBoundary FallbackComponent={MyInterviewsError}>
          <Suspense fallback={<MyInterviewsSkeleton />}>{children}</Suspense>
        </ErrorBoundary>
      </ToastProvider>
    </QueryClientProvider>,
  );
}

beforeEach(async () => {
  vi.resetAllMocks();
  resetMockMyInterviews();
  overview = structuredClone(getMockMyInterviews().data!);
  mocks.overview.mockImplementation(async () => ({
    result: "SUCCESS",
    data: structuredClone(overview),
  }));
  mocks.withdraw.mockImplementation(async () => {
    overview.pendingApplications = [];
    return { result: "SUCCESS" };
  });
  await page.viewport(1100, 850);
});

describe("내 면접", () => {
  it("예정 탭으로 시작하고 탭을 바꿔도 추가 조회 없이 개수와 목록을 보여준다", async () => {
    const upcoming = overview.participatingRooms[0].room;
    // 현재 시각과 룸 상태로 예정 목록을 재분류하지 않는다.
    upcoming.roomStatus = "IN_PROGRESS";
    upcoming.startAt = "2020-01-01T19:00:00+09:00";
    const screen = await renderList();
    await expect
      .element(screen.getByRole("tab", { name: "예정 1" }))
      .toHaveAttribute("aria-selected", "true");
    await expect.element(screen.getByRole("tab", { name: "전체" })).not.toBeInTheDocument();
    await expect.element(screen.getByRole("heading", { name: upcoming.title })).toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "댓글 열기" }))
      .toHaveAttribute("href", `/interviews/${upcoming.roomId}/room`);
    await screen.getByRole("tab", { name: "신청 중 1" }).click();
    await expect.element(screen.getByText("방장 확인 중")).toBeVisible();
    await expect.element(screen.getByText(/든든한곰_이력서.pdf/)).not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("link", { name: "면접 정보" }))
      .toHaveAttribute("href", `/interviews/${overview.pendingApplications[0].room.roomId}`);
    await screen.getByRole("tab", { name: "완료 1" }).click();
    await expect
      .element(screen.getByRole("link", { name: "후기 남기기" }))
      .toHaveAttribute("href", `/interviews/${overview.completedRooms[0].room.roomId}/review`);
    expect(mocks.overview).toHaveBeenCalledTimes(1);
  });

  it("서버가 정한 순서와 오프라인 지역, 완료 출석 인원을 표시한다", async () => {
    const first = overview.participatingRooms[0].room;
    first.title = "서버 첫 번째 면접";
    first.meetingType = "OFFLINE";
    first.meetingTypeLabel = "오프라인";
    first.region = { label: "서울 강남구" };
    overview.participatingRooms.push({
      room: {
        ...first,
        roomId: "second",
        title: "서버 두 번째 면접",
        startAt: "2000-01-01T19:00:00+09:00",
      },
    });
    const screen = await renderList();
    await expect.element(screen.getByRole("heading").nth(0)).toHaveTextContent(first.title);
    await expect.element(screen.getByRole("heading").nth(1)).toHaveTextContent("서버 두 번째 면접");
    await expect.element(screen.getByText(/오프라인 · 서울 강남구/).first()).toBeVisible();
    await screen.getByRole("tab", { name: "완료 1" }).click();
    await expect
      .element(
        screen.getByText(new RegExp(`${overview.completedRooms[0].room.participantCount}명 참여`)),
      )
      .toBeVisible();
  });

  it("예정이 비어 있어도 다른 탭으로 바꾸지 않고 각 빈 상태를 보여준다", async () => {
    overview.participatingRooms = [];
    overview.completedRooms = [];
    const screen = await renderList();
    await expect
      .element(screen.getByRole("tab", { name: "예정 0" }))
      .toHaveAttribute("aria-selected", "true");
    await expect.element(screen.getByText("예정된 면접이 없어요.")).toBeVisible();
    await screen.getByRole("tab", { name: "신청 중 1" }).click();
    await screen.getByRole("button", { name: "신청 취소", exact: true }).click();
    await expect.element(screen.getByText("신청 중인 면접이 없어요.")).toBeVisible();
    await expect
      .element(screen.getByRole("tab", { name: "신청 중 0" }))
      .toHaveAttribute("aria-selected", "true");
    await screen.getByRole("tab", { name: "완료 0" }).click();
    await expect.element(screen.getByText("완료된 면접이 없어요.")).toBeVisible();
  });

  it("신청 취소가 진행 중이면 중복 요청을 막고 성공하면 카드와 개수를 갱신한다", async () => {
    let finish!: () => void;
    mocks.withdraw.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = () => {
            overview.pendingApplications = [];
            resolve({ result: "SUCCESS" });
          };
        }),
    );
    const roomId = overview.pendingApplications[0].room.roomId;
    const screen = await renderList();
    await screen.getByRole("tab", { name: "신청 중 1" }).click();
    await screen.getByRole("button", { name: "신청 취소", exact: true }).click();
    await expect.element(screen.getByRole("button", { name: "취소 중..." })).toBeDisabled();
    await screen.getByRole("tab", { name: "예정 1" }).click();
    await screen.getByRole("tab", { name: "신청 중 1" }).click();
    await expect.element(screen.getByRole("button", { name: "취소 중..." })).toBeDisabled();
    expect(mocks.withdraw).toHaveBeenCalledTimes(1);
    expect(mocks.withdraw.mock.calls[0][0]).toEqual({ path: { roomId } });
    finish();
    await expect.element(screen.getByRole("tab", { name: "신청 중 0" })).toBeVisible();
    await expect.element(screen.getByText("신청 중인 면접이 없어요.")).toBeVisible();
  });

  it("취소 요청이 실패해도 목록을 다시 조회하고 신청이 남아 있으면 재시도할 수 있다", async () => {
    mocks.withdraw.mockRejectedValueOnce(new Error("offline"));
    const screen = await renderList();
    await screen.getByRole("tab", { name: "신청 중 1" }).click();
    await screen.getByRole("button", { name: "신청 취소", exact: true }).click();
    await expect.element(screen.getByRole("alert")).toHaveTextContent("신청을 취소하지 못했어요.");
    await expect
      .element(screen.getByRole("button", { name: "신청 취소", exact: true }))
      .toBeEnabled();
    expect(mocks.overview).toHaveBeenCalledTimes(2);
    await screen.getByRole("button", { name: "신청 취소", exact: true }).click();
    await expect.element(screen.getByText("신청 중인 면접이 없어요.")).toBeVisible();
  });

  it.each(["E1408", "E1409"])(
    "%s로 취소가 거절되면 최신 신청 상태를 다시 보여준다",
    async (code) => {
      mocks.withdraw.mockImplementation(async () => {
        overview.pendingApplications = [];
        throw { error: { code } };
      });
      const screen = await renderList();
      await screen.getByRole("tab", { name: "신청 중 1" }).click();
      await screen.getByRole("button", { name: "신청 취소", exact: true }).click();
      await expect
        .element(screen.getByText("신청 상태가 변경됐어요. 최신 목록을 확인해 주세요."))
        .toBeVisible();
      await expect.element(screen.getByText("신청 중인 면접이 없어요.")).toBeVisible();
    },
  );

  it.each(["WRITTEN", "NOT_ELIGIBLE_ABSENT", "NOT_ELIGIBLE_NO_TARGET", "UNKNOWN"])(
    "완료 면접의 %s 상태에 맞는 후기 행동만 제공한다",
    async (status) => {
      overview.completedRooms[0].reviewStatus = status;
      const screen = await renderList();
      await screen.getByRole("tab", { name: "완료 1" }).click();
      await expect
        .element(screen.getByRole("link", { name: "후기 남기기" }))
        .not.toBeInTheDocument();
      const written = screen.getByRole("link", { name: "남긴 후기 보기" });
      if (status === "WRITTEN") await expect.element(written).toBeVisible();
      else await expect.element(written).not.toBeInTheDocument();
    },
  );

  it("조회가 실패하면 오류 안내를 표시한다", async () => {
    mocks.overview.mockRejectedValueOnce(new Error("offline"));
    const screen = await renderList();
    await expect
      .element(screen.getByRole("heading", { name: "내 면접을 불러오지 못했어요" }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("button", { name: "다시 시도하기" }))
      .not.toBeInTheDocument();
  });

  it("필수 data가 없는 응답을 빈 목록 대신 오류로 표시한다", async () => {
    mocks.overview.mockResolvedValueOnce({ result: "SUCCESS" });
    const screen = await renderList();
    await expect
      .element(screen.getByRole("heading", { name: "내 면접을 불러오지 못했어요" }))
      .toBeVisible();
  });

  it("후기를 제출하거나 삭제한 뒤 내 면접으로 돌아오면 후기 행동이 갱신된다", async () => {
    const roomId = overview.completedRooms[0].room.roomId;
    mocks.submitReview.mockImplementation(async () => {
      overview.completedRooms[0].reviewStatus = "WRITTEN";
      return { result: "SUCCESS" };
    });
    mocks.deleteReview.mockImplementation(async () => {
      overview.completedRooms[0].reviewStatus = "WRITABLE";
      return { result: "SUCCESS" };
    });
    function Flow() {
      const [review, setReview] = useState(false);
      const target = { memberId: "member", nickname: "든든한 곰", status: "WRITABLE" };
      if (review)
        return (
          <>
            <button onClick={() => setReview(false)}>내 면접으로 돌아가기</button>
            {overview.completedRooms[0].reviewStatus === "WRITTEN" ? (
              <EditReviewForm roomId={roomId} target={target} onCompleted={() => {}} />
            ) : (
              <CreateReviewForm roomId={roomId} target={target} onCompleted={() => {}} />
            )}
          </>
        );
      return (
        <div
          onClickCapture={(event) => {
            if (
              event.target instanceof Element &&
              event.target.closest(`a[href="/interviews/${roomId}/review"]`)
            ) {
              event.preventDefault();
              setReview(true);
            }
          }}
        >
          <MyInterviewsContent />
        </div>
      );
    }
    const screen = await renderList(<Flow />);
    await screen.getByRole("tab", { name: "완료 1" }).click();
    await screen.getByRole("link", { name: "후기 남기기" }).click();
    await screen.getByRole("textbox", { name: "한 줄 후기" }).fill("함께 연습하기 좋았어요.");
    await screen.getByRole("button", { name: "후기 제출하기" }).click();
    await expect.element(screen.getByText("든든한 곰 님에게 후기를 남겼어요")).toBeVisible();
    await screen.getByRole("button", { name: "내 면접으로 돌아가기" }).click();
    await screen.getByRole("tab", { name: "완료 1" }).click();
    await screen.getByRole("link", { name: "남긴 후기 보기" }).click();
    await screen.getByRole("button", { name: "후기 삭제하기" }).click();
    await screen.getByRole("button", { name: "삭제하기", exact: true }).click();
    await expect
      .element(screen.getByText("후기를 삭제했어요. 다시 작성할 수 있어요"))
      .toBeVisible();
    await screen.getByRole("button", { name: "내 면접으로 돌아가기" }).click();
    await screen.getByRole("tab", { name: "완료 1" }).click();
    await expect.element(screen.getByRole("link", { name: "후기 남기기" })).toBeVisible();
  });
});
