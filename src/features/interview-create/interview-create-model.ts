import type { RoomFormOptionsResponse, SearchJobPostingsResponse } from "@/api";

export type RoomFormOptions = NonNullable<RoomFormOptionsResponse["data"]>;
export type SelectedJobPosting = NonNullable<
  SearchJobPostingsResponse["data"]
>["jobPostings"][number];

export type InterviewSchedule = {
  date: string;
  durationMinutes: number;
  startTime: string;
};

export type InterviewCreateFormValues = {
  description: string;
  jobRoleId: number | null;
  maxParticipants: number;
  method: string;
  minParticipants: number;
  posting: SelectedJobPosting | null;
  resumeId: string;
  resumePublic: boolean;
  round: string;
  schedules: InterviewSchedule[];
  sigunguId: number | null;
  title: string;
  type: string | null;
};

export function getInterviewCreateDefaultValues(
  options: RoomFormOptions,
): InterviewCreateFormValues {
  const minParticipants = options.participantConstraints?.min ?? 2;
  const participantLimit = options.participantConstraints?.max ?? 8;
  const defaultDuration =
    options.durations.find((duration) => duration.minutes === 60)?.minutes ??
    options.durations[0]?.minutes ??
    60;

  return {
    description: "",
    jobRoleId: null,
    maxParticipants: Math.min(Math.max(4, minParticipants), participantLimit),
    method: "",
    minParticipants,
    posting: null,
    resumeId: "",
    resumePublic: false,
    round: "",
    schedules: [{ date: "", durationMinutes: defaultDuration, startTime: "" }],
    sigunguId: null,
    title: "",
    type: null,
  };
}
