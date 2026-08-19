import type {
  ParticipationSlotsResponse,
  RegionsResponse,
  RoomFormOptionsResponse,
  SearchJobPostingsResponse,
} from "@/api";

export type ParticipationSlots = NonNullable<ParticipationSlotsResponse["data"]>;
export type Regions = NonNullable<RegionsResponse["data"]>;
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
  sido: string | null;
  sigunguId: number | null;
  title: string;
  type: string | null;
};

export function getInterviewCreateDefaultValues(
  options: RoomFormOptions,
): InterviewCreateFormValues {
  const minParticipants = options.participantConstraints?.min ?? 2;
  const participantLimit = options.participantConstraints?.max ?? 8;
  const defaultDuration = options.durations[0]?.minutes ?? 60;

  return {
    description: "",
    jobRoleId: null,
    maxParticipants: participantLimit,
    method: "",
    minParticipants,
    posting: null,
    resumeId: "",
    resumePublic: false,
    round: "",
    schedules: [{ date: "", durationMinutes: defaultDuration, startTime: "" }],
    sido: null,
    sigunguId: null,
    title: "",
    type: null,
  };
}
