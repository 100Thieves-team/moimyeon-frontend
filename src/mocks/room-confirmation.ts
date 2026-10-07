import { http, HttpResponse } from "msw";
import type { CompleteRoomProgressData, MemberMeResponse } from "@/api";
import {
  MOCK_INTERVIEW_DETAIL_SCENARIOS,
  MOCK_INTERVIEW_HOST_ID,
} from "@/features/interview-detail/interview-detail-mock";
import type { InterviewRoom, RoomParticipant } from "@/features/interview-room/participant-model";
import { getConfirmationDisabledReason } from "@/mocks/room-confirmation-policy";

const base = MOCK_INTERVIEW_DETAIL_SCENARIOS.find(({ key }) => key === "host")!.room;
const scenarios: {
  id: string;
  label: string;
  description: string;
  current?: number;
  past?: boolean;
  status?: string;
  private?: boolean;
  participant?: boolean;
  attendance?: "ABSENT" | "NO_TARGET";
  leftParticipant?: boolean;
}[] = [
  {
    id: "201",
    label: "방장 · 진행 확정 가능",
    description: "확정 버튼을 누르면 참여자 탭으로 이동하고 원본 열람이 활성화됩니다.",
  },
  {
    id: "202",
    label: "방장 · 최소 인원 부족",
    description: "확정 버튼 비활성화와 부족한 인원 안내를 확인합니다.",
    current: 1,
  },
  {
    id: "203",
    label: "방장 · 일정 경과",
    description: "진행 일정이 지난 면접의 확정 제한을 확인합니다.",
    past: true,
  },
  {
    id: "204",
    label: "방장 · 확정 후 공개",
    description: "출석 확인 다이얼로그에서 면접을 완료하고 후기 화면으로 이동합니다.",
    status: "CONFIRMED",
  },
  {
    id: "205",
    label: "방장 · 확정 후 비공개",
    description: "원본 비공개 면접에서 원본 열람 버튼이 표시되지 않는 것을 확인합니다.",
    status: "CONFIRMED",
    private: true,
  },
  {
    id: "206",
    label: "참여자 · 확정 후 공개",
    description: "본인 표시와 참여자 관점의 원본 열람을 확인합니다.",
    status: "CONFIRMED",
    participant: true,
  },
  {
    id: "207",
    label: "방장 · 면접 완료",
    description: "완료 상태에서 후기 남기기·수정하기 버튼과 후기 페이지 이동을 확인합니다.",
    status: "COMPLETED",
  },
  {
    id: "208",
    label: "방장 · 확정 후 이탈자 포함",
    description: "현재 명부에서 나간 참여자도 출석 확인 명단에는 포함됩니다.",
    status: "CONFIRMED",
    leftParticipant: true,
  },
  {
    id: "209",
    label: "방장 · 불참으로 완료",
    description: "내 출석 결과가 불참이면 후기 버튼 없이 완료 정보를 표시합니다.",
    status: "COMPLETED",
    attendance: "ABSENT",
  },
  {
    id: "210",
    label: "방장 · 후기 대상 없음",
    description: "본인만 출석한 면접은 후기를 작성할 상대가 없습니다.",
    status: "COMPLETED",
    attendance: "NO_TARGET",
  },
  {
    id: "211",
    label: "참여자 · 자동 완료",
    description: "완료된 면접에 직접 진입해 출석 결과와 후기 진입을 확인합니다.",
    status: "COMPLETED",
    participant: true,
  },
];
export const MOCK_CONFIRMATION_SCENARIOS = scenarios.map((scenario) => ({
  ...scenario,
  room: {
    ...structuredClone(base),
    roomId: `00000000-0000-4000-8000-${scenario.id.padStart(12, "0")}`,
    hostMemberId: scenario.participant
      ? "00000000-0000-4000-8001-000000000001"
      : MOCK_INTERVIEW_HOST_ID,
    title: scenario.label,
    description: scenario.description,
    recruit: {
      ...base.recruit!,
      current: scenario.current ?? 3,
      min: 2,
      max: 5,
      pendingApplicationCount: scenario.status ? 0 : 1,
    },
    status: scenario.status ?? "RECRUITING",
    previouslyConfirmed: Boolean(scenario.status),
    resumePublic: !scenario.private,
    schedule: {
      ...base.schedule!,
      startAt: scenario.past ? "2020-09-01T19:00:00+09:00" : base.schedule!.startAt,
    },
    viewer: { ...base.viewer!, isHost: !scenario.participant, isParticipating: true },
  } satisfies InterviewRoom,
}));

const rooms = new Map<string, InterviewRoom>();
type Attendances = NonNullable<CompleteRoomProgressData["body"]>["attendances"];
const confirmedRosters = new Map<string, { memberId: string; nickname: string }[]>();
const recordedAttendances = new Map<string, Attendances>();
const completionCookiePrefix = "moimyeon_mock_completion_";

// Node MSW와 Service Worker가 같은 완료 결과를 사용하도록 개발용 상태만 공유한다.
export function restoreMockCompletion(cookieHeader: string) {
  for (const cookie of cookieHeader.split(";")) {
    const [name, value] = cookie.trim().split("=");
    if (!name.startsWith(completionCookiePrefix) || !value) continue;
    const roomId = name.slice(completionCookiePrefix.length);
    const room = rooms.get(roomId);
    const roster = confirmedRosters.get(roomId);
    if (!room || !roster) continue;
    try {
      const attendances: Attendances = JSON.parse(decodeURIComponent(value));
      if (
        !Array.isArray(attendances) ||
        attendances.length !== roster.length ||
        !roster.every(({ memberId }) =>
          attendances.some(
            (attendance) =>
              attendance?.memberId === memberId &&
              (attendance.status === "ATTENDED" || attendance.status === "ABSENT"),
          ),
        )
      )
        continue;
      room.status = "COMPLETED";
      recordedAttendances.set(roomId, attendances);
    } catch {
      // 오래되거나 손상된 개발용 쿠키는 초기 시나리오를 유지한다.
    }
  }
}
export function resetMockConfirmation() {
  rooms.clear();
  confirmedRosters.clear();
  recordedAttendances.clear();
  for (const scenario of MOCK_CONFIRMATION_SCENARIOS) {
    const room = structuredClone(scenario.room);
    rooms.set(room.roomId, room);
    if (room.status !== "CONFIRMED" && room.status !== "COMPLETED") continue;
    const roster = participants(room).map(({ memberId, nickname }) => ({ memberId, nickname }));
    if (scenario.leftParticipant)
      roster.push({
        memberId: "00000000-0000-4000-8001-000000000099",
        nickname: "확정 후 이탈한 사슴",
      });
    confirmedRosters.set(room.roomId, roster);
    if (room.status === "COMPLETED") {
      recordedAttendances.set(
        room.roomId,
        roster.map(({ memberId }) => ({
          memberId,
          status:
            (scenario.attendance === "ABSENT" && memberId === MOCK_INTERVIEW_HOST_ID) ||
            (scenario.attendance === "NO_TARGET" && memberId !== MOCK_INTERVIEW_HOST_ID)
              ? "ABSENT"
              : "ATTENDED",
        })),
      );
    }
  }
}

export function getMockConfirmationRooms() {
  return [...rooms.values()];
}

export function getMockRoomAttendance(roomId: string) {
  return recordedAttendances.get(roomId);
}

export function getMockConfirmedRoster(roomId: string) {
  return confirmedRosters.get(roomId) ?? [];
}

function participants(room: InterviewRoom): RoomParticipant[] {
  return ["꼼꼼한 여우 12", "든든한 곰 04", "성실한 사슴 06"]
    .slice(0, room.recruit!.current)
    .map((nickname, index) => ({
      memberId:
        index === 0
          ? room.hostMemberId
          : index === 1 && !room.viewer?.isHost
            ? MOCK_INTERVIEW_HOST_ID
            : `00000000-0000-4000-8001-${String(index).padStart(12, "0")}`,
      nickname,
      isHost: index === 0,
      jobRoles: [{ jobRoleId: 10, name: "프론트엔드 개발" }],
      activitySummary: null,
      aiSummary:
        index === 1
          ? { status: "PROCESSING", text: null }
          : {
              status: "DONE",
              text: "React와 TypeScript로 사용자 화면을 개발하고 팀 프로젝트를 진행했어요.",
            },
      resumeSubmissionId: index === 2 ? null : index + 1,
      canViewOriginal: room.status === "CONFIRMED" && room.resumePublic && index !== 2,
    }));
}
resetMockConfirmation();
if (typeof document !== "undefined") restoreMockCompletion(document.cookie);
function success(data: unknown) {
  return HttpResponse.json({ result: "SUCCESS", data });
}
function error(code: string, message: string, status = 400) {
  return HttpResponse.json({ result: "ERROR", error: { code, message } }, { status });
}

export const confirmationHandlers = [
  http.get("*/v1/members/me", () =>
    success({
      memberId: MOCK_INTERVIEW_HOST_ID,
      nickname: "꼼꼼한 여우 12",
      email: "preview@example.test",
      status: "ACTIVE",
      profile: {
        memberId: MOCK_INTERVIEW_HOST_ID,
        bio: "개발용 목 계정",
        interestCompanies: [],
        interestJobRoleIds: [10],
      },
    } satisfies NonNullable<MemberMeResponse["data"]>),
  ),
  http.get("*/v1/rooms/reject-reasons", () =>
    success({ reasons: [{ code: "OTHER", label: "기타" }] }),
  ),
  http.get("*/v1/rooms/:roomId", ({ params }) => {
    const room = rooms.get(String(params.roomId));
    if (!room) return;
    return success({
      ...room,
      participants: participants(room).map(({ memberId, nickname }) => ({ memberId, nickname })),
    });
  }),
  http.get("*/v1/rooms/:roomId/participants", ({ params }) => {
    const room = rooms.get(String(params.roomId));
    return room
      ? success({
          participants: participants(room),
          confirmedParticipants: getMockConfirmedRoster(room.roomId),
        })
      : undefined;
  }),
  http.post("*/v1/rooms/:roomId/complete", async ({ params, request }) => {
    const room = rooms.get(String(params.roomId));
    if (!room) return;
    if (!room.viewer?.isHost) return error("E1406", "방장만 면접을 완료할 수 있어요.", 403);
    const { attendances } = (await request.json()) as NonNullable<CompleteRoomProgressData["body"]>;
    const roster = getMockConfirmedRoster(room.roomId);
    if (
      !Array.isArray(attendances) ||
      attendances.length !== roster.length ||
      new Set(attendances.map(({ memberId }) => memberId)).size !== roster.length ||
      !roster.every(({ memberId }) =>
        attendances.some((attendance) => attendance.memberId === memberId),
      )
    )
      return error("E1706", "확정 당시 참여자 전원의 출석이 필요해요.");
    if (attendances.some(({ status }) => status !== "ATTENDED" && status !== "ABSENT"))
      return error("E400", "출석 상태를 확인해 주세요.");
    if (room.status === "COMPLETED") {
      if (
        !recordedAttendances
          .get(room.roomId)
          ?.every(({ memberId, status }) =>
            attendances.some(
              (attendance) => attendance.memberId === memberId && attendance.status === status,
            ),
          )
      )
        return error("E1708", "이미 출석이 확정됐어요.", 409);
    } else if (room.status === "CONFIRMED") {
      room.status = "COMPLETED";
      recordedAttendances.set(room.roomId, attendances);
    } else return error("E1707", "현재 면접을 완료할 수 없어요.", 409);
    if (typeof document !== "undefined") {
      document.cookie = `${completionCookiePrefix}${room.roomId}=${encodeURIComponent(JSON.stringify(attendances))}; Path=/; SameSite=Lax`;
    }
    return success({
      status: room.status,
      attendances: attendances.map((attendance) => ({
        ...attendance,
        nickname: roster.find(({ memberId }) => memberId === attendance.memberId)!.nickname,
      })),
    });
  }),
  http.get("*/v1/attendances/me", ({ request }) => {
    const roomId = new URL(request.url).searchParams.get("roomId") ?? "";
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.status !== "COMPLETED")
      return error("E1707", "면접 완료 후 출석을 확인할 수 있어요.", 409);
    const participant = getMockConfirmedRoster(roomId).find(
      ({ memberId }) => memberId === MOCK_INTERVIEW_HOST_ID,
    )!;
    const attendance = recordedAttendances
      .get(roomId)!
      .find(({ memberId }) => memberId === MOCK_INTERVIEW_HOST_ID)!;
    return success({ ...participant, status: attendance.status });
  }),
  http.get("*/v1/rooms/:roomId/applications", ({ params }) => {
    const room = rooms.get(String(params.roomId));
    return room
      ? success({
          applications: [
            {
              applicationId: 3001,
              appliedAt: "2026-09-30T10:00:00",
              status: room.status === "RECRUITING" ? "PENDING" : "ROOM_CONFIRMED",
              statusLabel: room.status === "RECRUITING" ? "대기 중" : "인원이 확정됐어요",
              note: "실전처럼 함께 연습하고 싶어요!",
              aiSummary: { status: "DONE", text: "결제 서비스 UI를 개발한 경험이 있어요." },
              applicant: {
                memberId: "00000000-0000-4000-8001-000000000003",
                nickname: "차분한 수달 02",
                jobRoles: [],
                activitySummary: null,
              },
            },
          ],
        })
      : undefined;
  }),
  http.get("*/v1/rooms/:roomId/comments", ({ params }) =>
    rooms.has(String(params.roomId))
      ? success({ comments: [], writable: false, nextCursor: null })
      : undefined,
  ),
  http.post("*/v1/rooms/:roomId/confirmation", ({ params }) => {
    const room = rooms.get(String(params.roomId));
    if (!room) return;
    const reason = getConfirmationDisabledReason(room);
    if (reason)
      return error(
        room.status !== "RECRUITING"
          ? "E1410"
          : room.recruit!.current < room.recruit!.min
            ? "E1421"
            : "E1422",
        reason,
      );
    room.status = "CONFIRMED";
    room.previouslyConfirmed = true;
    room.recruit!.pendingApplicationCount = 0;
    confirmedRosters.set(
      room.roomId,
      participants(room).map(({ memberId, nickname }) => ({ memberId, nickname })),
    );
    return success(null);
  }),
  http.get("*/v1/rooms/:roomId/resume-submissions/:resumeSubmissionId/view-url", ({ params }) => {
    const room = rooms.get(String(params.roomId));
    if (!room) return;
    if (
      !participants(room).some(
        (person) =>
          person.resumeSubmissionId === Number(params.resumeSubmissionId) && person.canViewOriginal,
      )
    )
      return error("E1429", "현재 원본을 열람할 수 없어요.", 403);
    return success({
      url: `${globalThis.location.origin}/mock-resume`,
      expiresAt: new Date(Date.now() + 300_000).toISOString(),
    });
  }),
];
