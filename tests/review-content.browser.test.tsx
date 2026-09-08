import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { ToastProvider } from "@/components/toast";
import { ReviewContent } from "@/features/review/review-content";
import "@/styles/global.css";

const mocks = vi.hoisted(() => ({
  deleteReview: vi.fn(),
  getReviewOverview: vi.fn(),
  publicProfile: vi.fn(),
  roomDetail: vi.fn(),
  submitReview: vi.fn(),
  updateReview: vi.fn(),
}));

vi.mock("@/api/generated/@tanstack/react-query.gen", () => ({
  deleteReviewMutation: () => ({ mutationFn: (options: unknown) => mocks.deleteReview(options) }),
  getReviewOverviewOptions: ({ path }: { path: { roomId: string } }) => ({
    queryFn: () => mocks.getReviewOverview(path.roomId),
    queryKey: ["getReviewOverview", path.roomId],
  }),
  getReviewOverviewQueryKey: ({ path }: { path: { roomId: string } }) => [
    "getReviewOverview",
    path.roomId,
  ],
  publicProfileOptions: ({ path }: { path: { memberId: string } }) => ({
    queryFn: () => mocks.publicProfile(path.memberId),
    queryKey: ["publicProfile", path.memberId],
  }),
  publicProfileQueryKey: ({ path }: { path: { memberId: string } }) => [
    "publicProfile",
    path.memberId,
  ],
  roomDetailOptions: ({ path }: { path: { roomId: string } }) => ({
    queryFn: () => mocks.roomDetail(path.roomId),
    queryKey: ["roomDetail", path.roomId],
  }),
  submitReviewMutation: () => ({ mutationFn: (options: unknown) => mocks.submitReview(options) }),
  updateReviewMutation: () => ({ mutationFn: (options: unknown) => mocks.updateReview(options) }),
}));

const roomId = "019db000-0000-7000-8000-000000002001";
const hostMemberId = "019db000-0000-7000-8000-000000001001";
const submittedMemberId = "019db000-0000-7000-8000-000000001002";
const secondSubmittedMemberId = "019db000-0000-7000-8000-000000001003";

const roomResponse = {
  data: {
    hostMemberId,
    roomId,
    schedule: { durationMinutes: 90, startAt: "2026-09-01T19:00:00+09:00" },
    title: "한빛커머스 백엔드 2차 같이 준비해요",
  },
  result: "SUCCESS",
};

const overviewResponse = {
  data: {
    reviews: [
      {
        anonymous: true,
        content: "구체적으로 피드백해 주셨어요.",
        reviewId: 101,
        tags: ["피드백이 구체적이에요"],
        targetMemberId: submittedMemberId,
      },
      {
        anonymous: false,
        content: "질문이 명확했어요.",
        reviewId: 102,
        tags: ["질문이 날카로워요"],
        targetMemberId: secondSubmittedMemberId,
      },
    ],
    submittedCount: 2,
    targets: [
      {
        memberId: submittedMemberId,
        nickname: "꼼꼼한 수달",
        status: "SUBMITTED",
      },
      {
        memberId: secondSubmittedMemberId,
        nickname: "명쾌한 여우",
        status: "SUBMITTED",
      },
      {
        memberId: hostMemberId,
        nickname: "차분한 고래",
        status: "WRITABLE",
      },
    ],
    totalCount: 3,
  },
  result: "SUCCESS",
};

const publicProfileResponse = {
  data: {
    bio: null,
    interestJobRoles: [],
    memberId: submittedMemberId,
    nickname: "꼼꼼한 수달",
    trust: {
      activityTopPercent: null,
      noShowCount: 0,
      recentAttendances: [],
      representativeTags: [],
    },
  },
  result: "SUCCESS",
};

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
    },
  });
}

async function renderReviewContent() {
  const queryClient = createQueryClient();
  queryClient.setQueryData(["roomDetail", roomId], roomResponse);

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Suspense fallback={<p>후기 화면을 불러오는 중이에요.</p>}>
          <ReviewContent roomId={roomId} />
        </Suspense>
      </ToastProvider>
    </QueryClientProvider>,
  );
}

beforeEach(async () => {
  vi.clearAllMocks();
  mocks.roomDetail.mockResolvedValue(roomResponse);
  mocks.getReviewOverview.mockResolvedValue(overviewResponse);
  mocks.publicProfile.mockResolvedValue(publicProfileResponse);
  mocks.deleteReview.mockResolvedValue({ result: "SUCCESS" });
  mocks.submitReview.mockResolvedValue({ result: "SUCCESS" });
  mocks.updateReview.mockResolvedValue({ result: "SUCCESS" });
  await page.viewport(1000, 900);
});

describe("ReviewContent", () => {
  it("행을 펼치기 전에 제출된 모든 후기를 불러오고 기존 값으로 폼을 채운다", async () => {
    const screen = await renderReviewContent();

    await expect.poll(() => mocks.getReviewOverview.mock.calls.length).toBe(1);

    await screen.getByRole("button", { name: "꼼꼼한 수달 후기 수정 펼치기" }).click();

    await expect
      .element(screen.getByRole("textbox", { name: "한 줄 후기" }))
      .toHaveValue("구체적으로 피드백해 주셨어요.");
    await expect
      .element(screen.getByRole("button", { name: "피드백이 구체적이에요" }))
      .toHaveAttribute("data-pressed", "");
    expect(mocks.getReviewOverview).toHaveBeenCalledTimes(1);
    await expect
      .element(screen.getByText("이전에 남긴 내용은 불러오지 못해요."))
      .not.toBeInTheDocument();
  });

  it("프리필된 후기를 수정할 때 익명 여부를 제외한 값만 보낸다", async () => {
    const screen = await renderReviewContent();
    await expect.poll(() => mocks.getReviewOverview.mock.calls.length).toBe(1);
    await screen.getByRole("button", { name: "꼼꼼한 수달 후기 수정 펼치기" }).click();
    await screen.getByRole("textbox", { name: "한 줄 후기" }).fill("함께 연습하기 좋았어요.");

    await screen.getByRole("button", { name: "후기 수정하기" }).click();

    await expect.poll(() => mocks.updateReview.mock.calls.length).toBe(1);
    expect(mocks.updateReview).toHaveBeenCalledWith({
      body: {
        content: "함께 연습하기 좋았어요.",
        tags: ["피드백이 구체적이에요"],
      },
      path: { reviewId: "101" },
    });
    await expect.poll(() => mocks.getReviewOverview.mock.calls.length).toBe(2);
  });

  it("작성 가능한 대상에게 새 후기를 제출한다", async () => {
    const screen = await renderReviewContent();
    await screen.getByRole("button", { name: "차분한 고래 후기 작성 펼치기" }).click();
    await expect.element(screen.getByRole("button", { name: "건너뛰기" })).not.toBeInTheDocument();
    await screen.getByRole("button", { name: "준비가 성실해요" }).click();
    await screen.getByRole("textbox", { name: "한 줄 후기" }).fill("함께 연습하기 좋았어요.");

    await screen.getByRole("button", { name: "후기 제출하기" }).click();

    await expect.poll(() => mocks.submitReview.mock.calls.length).toBe(1);
    expect(mocks.submitReview).toHaveBeenCalledWith({
      body: {
        anonymous: true,
        content: "함께 연습하기 좋았어요.",
        tags: ["준비가 성실해요"],
        targetMemberId: hostMemberId,
      },
      path: { roomId },
    });
    await expect.poll(() => mocks.getReviewOverview.mock.calls.length).toBe(2);
  });

  it("제출한 후기를 삭제하고 후기 개요를 다시 불러온다", async () => {
    const screen = await renderReviewContent();
    await expect.poll(() => mocks.getReviewOverview.mock.calls.length).toBe(1);

    await screen.getByRole("button", { name: "꼼꼼한 수달 후기 수정 펼치기" }).click();
    await screen.getByRole("button", { name: "후기 삭제하기" }).click();
    await screen.getByRole("button", { name: "삭제하기" }).click();

    await expect.poll(() => mocks.deleteReview.mock.calls.length).toBe(1);
    expect(mocks.deleteReview).toHaveBeenCalledWith({ path: { reviewId: "101" } });
    await expect.poll(() => mocks.getReviewOverview.mock.calls.length).toBe(2);
  });

  it("공개 신뢰 카드 조회 실패를 팝오버 안에서 재시도한다", async () => {
    mocks.publicProfile.mockRejectedValueOnce(new Error("network"));
    const screen = await renderReviewContent();
    await expect.poll(() => mocks.getReviewOverview.mock.calls.length).toBe(1);

    await screen.getByRole("button", { name: "꼼꼼한 수달 공개 신뢰 카드 열기" }).click();
    await expect
      .element(screen.getByRole("alert"))
      .toHaveTextContent("공개 신뢰 카드를 불러오지 못했어요.");

    await screen.getByRole("button", { name: "다시 불러오기" }).click();

    await expect
      .element(screen.getByRole("article", { name: "꼼꼼한 수달 공개 신뢰 카드" }))
      .toBeVisible();
    expect(mocks.publicProfile).toHaveBeenCalledTimes(2);
  });
});
