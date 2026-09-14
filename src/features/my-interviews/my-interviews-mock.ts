import type { GetInterviewOverviewResponse, RoomDetailResponse } from "@/api/generated";
import { MOCK_INTERVIEW_DETAIL_SCENARIOS } from "@/features/interview-detail/interview-detail-mock";
import {
  getMockReviewOverview,
  getMockReviewRoomDetail,
  MOCK_REVIEW_ROOM_ID,
} from "@/features/review/review-mock";

type Overview = NonNullable<GetInterviewOverviewResponse["data"]>;
type Detail = NonNullable<RoomDetailResponse["data"]>;

function summary(room: Detail): Overview["participatingRooms"][number]["room"] {
  return {
    roomId: room.roomId,
    title: room.title,
    jobPostingId: 101,
    jobRoleId: 10,
    interviewStage: room.round,
    interviewStageLabel: room.roundLabel,
    meetingType: room.method,
    meetingTypeLabel: room.methodLabel,
    maxParticipants: room.recruit?.max ?? 5,
    participantCount: room.recruit?.current ?? 4,
    roomStatus: room.status,
    durationMinutes: room.schedule?.durationMinutes ?? 90,
    startAt: room.schedule?.startAt ?? "2026-09-20T19:00:00+09:00",
    region: room.region,
  };
}

const pendingRoom = MOCK_INTERVIEW_DETAIL_SCENARIOS.find(({ key }) => key === "pending")!.room;
const participatingRoom = MOCK_INTERVIEW_DETAIL_SCENARIOS.find(
  ({ key }) => key === "participant",
)!.room;
export const MOCK_PENDING_ROOM_ID = pendingRoom.roomId;
let withdrawn = false;

export function resetMockMyInterviews() {
  withdrawn = false;
}

export function withdrawMockMyInterview(roomId: string) {
  if (roomId !== MOCK_PENDING_ROOM_ID) return false;
  withdrawn = true;
  return true;
}

export function getMockMyInterviews(): GetInterviewOverviewResponse {
  const reviewRoom = getMockReviewRoomDetail(MOCK_REVIEW_ROOM_ID)!.data!;
  const reviewOverview = getMockReviewOverview(MOCK_REVIEW_ROOM_ID)!.data!;

  return {
    result: "SUCCESS",
    data: {
      pendingApplications: withdrawn
        ? []
        : [
            {
              applicationId: 507,
              appliedAt: "2026-09-14T12:00:00+09:00",
              resumeOriginalName: "든든한곰_이력서.pdf",
              room: summary(pendingRoom),
            },
          ],
      participatingRooms: [{ room: summary(participatingRoom) }],
      completedRooms: [
        {
          room: summary(reviewRoom),
          reviewStatus: reviewOverview.targets.some(({ status }) => status === "WRITABLE")
            ? "WRITABLE"
            : "WRITTEN",
        },
      ],
    },
  };
}
