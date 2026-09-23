import { CommentDeleteProvider } from "@/features/interview-room/comment-delete-dialog";
import { getRoomCommentsInfiniteQueryKey } from "@/api/generated/@tanstack/react-query.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { delay, http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { RoomCommentsPanel } from "@/features/interview-room/room-comments-panel";
import { type RoomComment, type RoomComments } from "@/features/interview-room/room-comments-model";
import "@/styles/global.css";

vi.mock("@/api/hey-api", () => ({
  createClientConfig: () => ({ baseUrl: window.location.origin, throwOnError: true }),
}));

const roomId = "comments-room";
const endpoint = `*/v1/rooms/${roomId}/comments`;
const worker = setupWorker();
let data: RoomComments;
let client: QueryClient;
let getRequests: URL[];
let sent: string[];
let deleted: string[];

function comment(
  commentId: number,
  content: string,
  overrides: Partial<RoomComment> = {},
): RoomComment {
  return {
    commentId,
    content,
    createdAt: "2026-07-21T14:31:00",
    isDeleted: false,
    isMine: false,
    author: { memberId: "host", nickname: "꼼꼼한 여우 12", isHost: true, hasLeft: false },
    ...overrides,
  };
}
function apiError(code: string, status: number) {
  return HttpResponse.json(
    { result: "ERROR", data: null, error: { code, message: `요청 실패 ${code}`, data: null } },
    { status },
  );
}
async function setup() {
  const screen = await render(
    <QueryClientProvider client={client}>
      <CommentDeleteProvider roomId={roomId}>
        <RoomCommentsPanel roomId={roomId} />
      </CommentDeleteProvider>
    </QueryClientProvider>,
  );
  return screen;
}

beforeAll(async () => {
  await worker.start({ quiet: true, onUnhandledRequest: "error" });
});
afterAll(() => worker.stop());
beforeEach(() => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  data = {
    comments: [
      comment(2, "일정 안내"),
      comment(1, "내 댓글", {
        isMine: true,
        author: { memberId: "me", nickname: "든든한 곰 21", isHost: false, hasLeft: false },
      }),
    ],
    writable: true,
    nextCursor: null,
    readOnlyAt: null,
  };
  getRequests = [];
  sent = [];
  deleted = [];
  worker.use(
    http.get(endpoint, ({ request }) => {
      getRequests.push(new URL(request.url));
      return HttpResponse.json({ result: "SUCCESS", data });
    }),
    http.post(endpoint, async ({ request }) => {
      const { content } = (await request.json()) as { content: string };
      sent.push(content);
      const existing = data.comments.find((entry) => entry.isMine && entry.content === content);
      const created = existing ?? comment(3, content, { isMine: true });
      if (!existing) data.comments.unshift(created);
      return HttpResponse.json({
        result: "SUCCESS",
        data: { commentId: created.commentId, createdAt: created.createdAt },
      });
    }),
    http.delete(`${endpoint}/:commentId`, ({ params }) => {
      deleted.push(String(params.commentId));
      data.comments = data.comments.map((entry) =>
        String(entry.commentId) === params.commentId
          ? { ...entry, isDeleted: true, author: null, content: null, isMine: false }
          : entry,
      );
      return HttpResponse.json({ result: "SUCCESS" });
    }),
  );
});
afterEach(async () => {
  await expect.poll(() => client.isFetching()).toBe(0);
  client.clear();
  worker.resetHandlers();
});

describe("세션 댓글", () => {
  it("첫 조회부터 접근 권한이 없으면 댓글 대신 접근 제한을 표시한다", async () => {
    worker.use(http.get(endpoint, () => apiError("E1419", 403)));
    const screen = await setup();
    await expect.element(screen.getByText("현재 참여자만 댓글을 볼 수 있어요.")).toBeVisible();
    await expect.element(screen.getByRole("textbox")).not.toBeInTheDocument();
    await expect.element(screen.getByRole("list", { name: "댓글 목록" })).not.toBeInTheDocument();
  });

  it("최신순 댓글과 작성자 표시를 조회하고 내 댓글만 삭제할 수 있다", async () => {
    data.comments.push(
      comment(0, "지난 안내", {
        author: { nickname: "탈퇴한 회원", hasLeft: true, isHost: false },
      }),
    );
    const screen = await setup();
    await expect.element(screen.getByText("일정 안내", { exact: true })).toBeVisible();
    await expect.element(screen.getByText("탈퇴한 회원 (퇴장)")).toBeVisible();
    expect(screen.getByRole("button", { name: "삭제", exact: true }).elements()).toHaveLength(1);
    const rows = screen.getByRole("listitem").elements();
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining("일정 안내"),
      expect.stringContaining("내 댓글"),
      expect.stringContaining("지난 안내"),
    ]);
    expect(getRequests[0].searchParams.get("size")).toBe("20");
    expect(getRequests[0].searchParams.has("cursor")).toBe(false);
  });

  it("불투명 커서로 더 보고 중복 행 없이 마지막 페이지까지 표시한다", async () => {
    const cursor = "opaque+/cursor==";
    data.nextCursor = cursor;
    worker.use(
      http.get(endpoint, ({ request }) => {
        const url = new URL(request.url);
        getRequests.push(url);
        return HttpResponse.json({
          result: "SUCCESS",
          data: url.searchParams.has("cursor")
            ? { ...data, comments: [data.comments[1], comment(0, "이전 댓글")], nextCursor: null }
            : data,
        });
      }),
    );
    const screen = await setup();
    await screen.getByRole("button", { name: "더 보기", exact: true }).click();
    await expect.element(screen.getByText("이전 댓글", { exact: true })).toBeVisible();
    expect(getRequests[1].searchParams.get("cursor")).toBe(cursor);
    expect(screen.getByRole("listitem").elements()).toHaveLength(3);
    await expect
      .element(screen.getByRole("button", { name: "더 보기", exact: true }))
      .not.toBeInTheDocument();
  });

  it("빈 목록에서 trim한 댓글을 남기고 입력을 비우며 재전송도 중복 표시하지 않는다", async () => {
    data.comments = [];
    const screen = await setup();
    await expect
      .element(screen.getByText("아직 댓글이 없어요. 첫 댓글을 남겨 보세요."))
      .toBeVisible();
    const input = screen.getByRole("textbox", { name: "댓글 내용" });
    await input.fill("  첫 댓글\n준비해요  ");
    await screen.getByRole("button", { name: "남기기", exact: true }).click();
    await expect.element(input).toHaveValue("");
    await expect.element(screen.getByText("첫 댓글\n준비해요", { exact: true })).toBeVisible();
    await input.fill("첫 댓글\n준비해요");
    await screen.getByRole("button", { name: "남기기", exact: true }).click();
    await expect.element(input).toHaveValue("");
    expect(sent).toEqual(["첫 댓글\n준비해요", "첫 댓글\n준비해요"]);
    expect(screen.getByRole("listitem").elements()).toHaveLength(1);
  });

  it("공백과 1,001자는 거부하고 trim 후 1,000자는 전송한다", async () => {
    const screen = await setup();
    const input = screen.getByRole("textbox", { name: "댓글 내용" });
    const submit = screen.getByRole("button", { name: "남기기", exact: true });
    await input.fill("   ");
    await submit.click();
    await expect.element(screen.getByText("댓글을 입력해 주세요.")).toBeVisible();
    await input.fill("가".repeat(1001));
    await submit.click();
    await expect.element(screen.getByText("댓글은 1,000자까지 남길 수 있어요.")).toBeVisible();
    expect(sent).toHaveLength(0);
    await input.fill(` ${"가".repeat(1000)} `);
    await submit.click();
    await expect.element(input).toHaveValue("");
    expect(sent).toEqual(["가".repeat(1000)]);
  });

  it("전송 중 입력과 제출을 막고 실패하면 입력을 유지한다", async () => {
    let release!: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    worker.use(
      http.post(endpoint, async () => {
        await pending;
        return apiError("E500", 500);
      }),
    );
    const screen = await setup();
    const input = screen.getByRole("textbox", { name: "댓글 내용" });
    await input.fill("지우면 안 되는 초안");
    await screen.getByRole("button", { name: "남기기", exact: true }).click();
    await expect.element(screen.getByRole("button", { name: "남기는 중" })).toBeDisabled();
    await expect.element(input).toBeDisabled();
    release();
    await expect.element(screen.getByRole("alert")).toHaveTextContent("요청 실패 E500");
    await expect.element(input).toHaveValue("지우면 안 되는 초안");
    await expect.element(input).not.toBeDisabled();
  });

  it("작성 성공 뒤 재조회가 실패해도 입력은 비우고 조회 오류만 안내한다", async () => {
    const screen = await setup();
    await screen.getByRole("textbox", { name: "댓글 내용" }).fill("성공한 댓글");
    worker.use(http.get(endpoint, () => apiError("E500", 500)));
    await screen.getByRole("button", { name: "남기기", exact: true }).click();
    await expect.element(screen.getByRole("textbox")).toHaveValue("");
    await expect.element(screen.getByText("최신 댓글을 불러오지 못했어요.")).toBeVisible();
    expect(sent).toEqual(["성공한 댓글"]);
  });

  it("삭제 확인을 닫으면 요청하지 않고 초안을 유지하며 확인한 댓글만 삭제한다", async () => {
    const screen = await setup();
    await screen.getByRole("textbox").fill("보관할 초안");
    await screen.getByRole("button", { name: "삭제", exact: true }).click();
    await expect
      .element(screen.getByRole("alertdialog", { name: "댓글을 삭제할까요?" }))
      .toBeVisible();
    expect(deleted).toEqual([]);
    await screen.getByRole("button", { name: "돌아가기" }).click();
    expect(deleted).toEqual([]);
    await expect.element(screen.getByRole("textbox")).toHaveValue("보관할 초안");
    await screen.getByRole("button", { name: "삭제", exact: true }).click();
    await screen.getByRole("button", { name: "삭제하기", exact: true }).click();
    await expect.element(screen.getByText("삭제된 댓글입니다")).toBeVisible();
    expect(deleted).toEqual(["1"]);
    await expect.element(screen.getByRole("textbox")).toHaveValue("보관할 초안");
  });

  it("삭제 실패 시 모달에서 재시도하고 초안을 유지한다", async () => {
    worker.use(http.delete(`${endpoint}/:commentId`, () => apiError("E500", 500), { once: true }));
    const screen = await setup();
    await screen.getByRole("textbox").fill("실패해도 유지할 초안");
    await screen.getByRole("button", { name: "삭제", exact: true }).click();
    await screen.getByRole("button", { name: "삭제하기", exact: true }).click();
    await expect.element(screen.getByRole("alert")).toHaveTextContent("E500");
    await screen.getByRole("button", { name: "삭제하기", exact: true }).click();
    await expect.element(screen.getByText("삭제된 댓글입니다")).toBeVisible();
    await expect.element(screen.getByRole("textbox")).toHaveValue("실패해도 유지할 초안");
  });

  it("삭제 확인 중 대상이 삭제되면 요청 없이 모달을 닫는다", async () => {
    const screen = await setup();
    await screen.getByRole("button", { name: "삭제", exact: true }).click();
    data.comments[1] = {
      ...data.comments[1],
      isDeleted: true,
      content: null,
      author: null,
      isMine: false,
    };
    await client.invalidateQueries({
      queryKey: getRoomCommentsInfiniteQueryKey({ path: { roomId }, query: { size: "20" } }),
    });
    await expect.element(screen.getByRole("alertdialog")).not.toBeInTheDocument();
    expect(deleted).toEqual([]);
  });

  it("삭제 요청 중 행동을 막고 성공하면 작성자와 본문을 가린 행을 남긴다", async () => {
    worker.use(
      http.delete(`${endpoint}/:commentId`, async () => {
        await delay(150);
        data.comments[1] = {
          ...data.comments[1],
          isDeleted: true,
          author: null,
          content: null,
          isMine: false,
        };
        return HttpResponse.json({ result: "SUCCESS" });
      }),
    );
    const screen = await setup();
    await screen.getByRole("button", { name: "삭제", exact: true }).click();
    await screen.getByRole("button", { name: "삭제하기", exact: true }).click();
    await expect.element(screen.getByRole("button", { name: "삭제 중..." })).toBeDisabled();
    await expect.element(screen.getByText("삭제된 댓글입니다")).toBeVisible();
    await expect.element(screen.getByText("내 댓글", { exact: true })).not.toBeInTheDocument();
    await expect.element(screen.getByText("든든한 곰 21")).not.toBeInTheDocument();
    expect(screen.getByRole("listitem").elements()).toHaveLength(2);
  });

  it.each(["E2102", "E2103"])("삭제 %s 실패를 성공으로 표시하지 않는다", async (code) => {
    worker.use(
      http.delete(`${endpoint}/:commentId`, () => apiError(code, code === "E2103" ? 404 : 403)),
    );
    const screen = await setup();
    await screen.getByRole("button", { name: "삭제", exact: true }).click();
    await screen.getByRole("button", { name: "삭제하기", exact: true }).click();
    await expect.element(screen.getByRole("alert")).toHaveTextContent(code);
    await expect.element(screen.getByText("내 댓글", { exact: true })).toBeVisible();
    await expect.element(screen.getByText("삭제된 댓글입니다")).not.toBeInTheDocument();
  });

  it("읽기 전용 예고를 보여 주고 다음 조회에서 입력과 삭제를 차단한다", async () => {
    data.readOnlyAt = "2026-07-22T18:40:00";
    const screen = await setup();
    await expect
      .element(screen.getByText("7월 22일 오후 6:40부터 댓글이 읽기 전용으로 바뀌어요."))
      .toBeVisible();
    await expect.element(screen.getByRole("textbox")).toBeVisible();
    data.writable = false;
    await client.invalidateQueries({
      queryKey: getRoomCommentsInfiniteQueryKey({ path: { roomId }, query: { size: "20" } }),
    });
    await expect.element(screen.getByText(/읽기 전용이에요/)).toBeVisible();
    await expect.element(screen.getByRole("textbox")).not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "삭제", exact: true }))
      .not.toBeInTheDocument();
    await expect.element(screen.getByText("내 댓글", { exact: true })).toBeVisible();
  });

  it.each(["작성", "삭제"])(
    "%s 중 E2101을 받으면 재조회가 실패해도 읽기 전용으로 막는다",
    async (action) => {
      const handler = () => apiError("E2101", 409);
      worker.use(http.post(endpoint, handler), http.delete(`${endpoint}/:commentId`, handler));
      const screen = await setup();
      await screen.getByRole("textbox").fill("진행 중 초안");
      worker.use(http.get(endpoint, () => apiError("E500", 500)));
      await screen
        .getByRole("button", { name: action === "작성" ? "남기기" : "삭제", exact: true })
        .click();
      if (action === "삭제")
        await screen.getByRole("button", { name: "삭제하기", exact: true }).click();
      await expect.element(screen.getByText(/읽기 전용이에요/)).toBeVisible();
      await expect.element(screen.getByText("요청 실패 E2101")).toBeVisible();
      await expect.element(screen.getByRole("textbox")).not.toBeInTheDocument();
      await expect
        .element(screen.getByRole("button", { name: "삭제", exact: true }))
        .not.toBeInTheDocument();
    },
  );

  it.each(["조회", "작성", "삭제"])("캐시가 있어도 %s E1419 이후 댓글을 가린다", async (action) => {
    const screen = await setup();
    await expect.element(screen.getByText("내 댓글", { exact: true })).toBeVisible();
    worker.use(
      http.get(endpoint, () => apiError("E1419", 403)),
      http.post(endpoint, () => apiError("E1419", 403)),
      http.delete(`${endpoint}/:commentId`, () => apiError("E1419", 403)),
    );
    if (action === "조회")
      await client.invalidateQueries({
        queryKey: getRoomCommentsInfiniteQueryKey({ path: { roomId }, query: { size: "20" } }),
      });
    else if (action === "작성") {
      await screen.getByRole("textbox").fill("초안");
      await screen.getByRole("button", { name: "남기기", exact: true }).click();
    } else {
      await screen.getByRole("button", { name: "삭제", exact: true }).click();
      await screen.getByRole("button", { name: "삭제하기", exact: true }).click();
    }
    await expect.element(screen.getByText("현재 참여자만 댓글을 볼 수 있어요.")).toBeVisible();
    await expect.element(screen.getByText("내 댓글", { exact: true })).not.toBeInTheDocument();
    await expect.element(screen.getByRole("textbox")).not.toBeInTheDocument();
  });

  it("초기 조회 실패를 재시도하면 댓글을 볼 수 있다", async () => {
    worker.use(http.get(endpoint, () => apiError("E500", 500), { once: true }));
    const screen = await setup();
    await expect.element(screen.getByText("댓글을 불러오지 못했어요.")).toBeVisible();
    await screen.getByRole("button", { name: "다시 불러오기" }).click();
    await expect.element(screen.getByText("내 댓글", { exact: true })).toBeVisible();
  });

  it("더 보기 실패 시 기존 목록을 유지하고 같은 커서로 재시도한다", async () => {
    data.nextCursor = "next";
    let fail = true;
    worker.use(
      http.get(endpoint, ({ request }) => {
        const url = new URL(request.url);
        getRequests.push(url);
        if (!url.searchParams.has("cursor")) return HttpResponse.json({ result: "SUCCESS", data });
        if (fail) return apiError("E500", 500);
        return HttpResponse.json({
          result: "SUCCESS",
          data: { ...data, comments: [comment(0, "이전 댓글")], nextCursor: null, writable: false },
        });
      }),
    );
    const screen = await setup();
    await screen.getByRole("button", { name: "더 보기", exact: true }).click();
    await expect.element(screen.getByText("이전 댓글을 불러오지 못했어요.")).toBeVisible();
    await expect.element(screen.getByText("내 댓글", { exact: true })).toBeVisible();
    fail = false;
    await screen.getByRole("button", { name: "더 보기 다시 시도" }).click();
    await expect.element(screen.getByText("이전 댓글", { exact: true })).toBeVisible();
    expect(getRequests.slice(1).map((url) => url.searchParams.get("cursor"))).toEqual([
      "next",
      "next",
    ]);
    await expect.element(screen.getByText(/읽기 전용이에요/)).toBeVisible();
  });

  it("방장 위임과 퇴장 정보가 재조회에 반영되고 댓글 내용은 유지된다", async () => {
    const screen = await setup();
    await expect.element(screen.getByText("일정 안내", { exact: true })).toBeVisible();
    data.comments[0].author = { ...data.comments[0].author, isHost: false, hasLeft: true };
    data.comments[1].author = { ...data.comments[1].author, isHost: true };
    await client.invalidateQueries({
      queryKey: getRoomCommentsInfiniteQueryKey({ path: { roomId }, query: { size: "20" } }),
    });
    await expect.element(screen.getByText("꼼꼼한 여우 12 (퇴장)")).toBeVisible();
    const rows = screen.getByRole("listitem").elements();
    expect(rows[0].textContent).not.toContain("방장");
    expect(rows[1].textContent).toContain("방장");
    expect(rows[0].textContent).toContain("일정 안내");
  });
});
