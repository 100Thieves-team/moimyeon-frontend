export type SelectedPosting = {
  companyId: number;
  companyName: string;
  jobPostingId: number;
  postingName: string;
  jobRoleId?: number | null;
  jobRoleName?: string | null;
};

export type SelectedJobRole = {
  displayName: string;
  jobRoleId: number;
};

export type InterviewSchedule = {
  date: string;
  durationMinutes: number;
  startTime: string;
};

export type InterviewCreateFormValues = {
  description: string;
  jobRole: SelectedJobRole | null;
  method: string;
  minParticipants: number;
  maxParticipants: number;
  posting: SelectedPosting | null;
  resumeId: string;
  resumePublic: boolean;
  round: string;
  schedules: InterviewSchedule[];
  sigunguId: number | null;
  title: string;
  type: string;
};

export const interviewCreateDefaultValues: InterviewCreateFormValues = {
  description: "",
  jobRole: null,
  method: "",
  minParticipants: 2,
  maxParticipants: 4,
  posting: null,
  resumeId: "",
  resumePublic: true,
  round: "",
  schedules: [{ date: "", durationMinutes: 60, startTime: "" }],
  sigunguId: null,
  title: "",
  type: "",
};

export const scheduleKey = (schedule: InterviewSchedule) =>
  `${schedule.date}|${schedule.startTime}`;

export function buildRoomBody(values: InterviewCreateFormValues, schedule: InterviewSchedule) {
  if (!values.posting || !values.jobRole) {
    throw new Error("면접 정보가 완성되지 않았어요.");
  }

  return {
    description: values.description.trim() || null,
    jobRoleId: values.jobRole.jobRoleId,
    maxParticipants: values.maxParticipants,
    method: values.method,
    minParticipants: values.minParticipants,
    postingId: values.posting.jobPostingId,
    resumeId: values.resumeId,
    resumePublic: values.resumePublic,
    round: values.round,
    schedule,
    sigunguId: values.method === "OFFLINE" ? values.sigunguId : null,
    title: values.title.trim(),
    type: values.type || null,
  };
}
