import { describe, expect, it } from "vitest";
import {
  buildRoomBody,
  scheduleKey,
  type InterviewCreateFormValues,
} from "@/features/interview-create/interview-create-model";

const values: InterviewCreateFormValues = {
  description: "  함께 연습해요  ",
  jobRole: { displayName: "프론트엔드 개발", jobRoleId: 2 },
  maxParticipants: 6,
  method: "ONLINE",
  minParticipants: 3,
  posting: {
    companyId: 1,
    companyName: "달빛페이",
    jobPostingId: 10,
    postingName: "프론트엔드 개발자",
  },
  resumeId: "resume-1",
  resumePublic: true,
  round: "FIRST",
  schedules: [{ date: "2026-09-01", durationMinutes: 90, startTime: "14:00" }],
  sigunguId: 25,
  title: "  실전처럼 봐요  ",
  type: "JOB",
};

describe("면접 생성 요청", () => {
  it("일정별 요청을 만들고 온라인 면접의 지역을 제거한다", () => {
    expect(buildRoomBody(values, values.schedules[0])).toMatchObject({
      title: "실전처럼 봐요",
      description: "함께 연습해요",
      postingId: 10,
      jobRoleId: 2,
      sigunguId: null,
      schedule: values.schedules[0],
    });
  });

  it("날짜와 시각으로 재시도 대상을 구분한다", () => {
    expect(scheduleKey(values.schedules[0])).toBe("2026-09-01|14:00");
  });
});
