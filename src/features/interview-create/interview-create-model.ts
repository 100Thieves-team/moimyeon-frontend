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
