import type {
  ParticipationSlotsResponse,
  RegionsResponse,
  ResumesResponse,
  RoomFormOptionsResponse,
  SearchJobPostingsResponse,
} from "@/api";

export type ParticipationSlots = NonNullable<ParticipationSlotsResponse["data"]>;
export type Regions = NonNullable<RegionsResponse["data"]>;
export type RoomFormOptions = NonNullable<RoomFormOptionsResponse["data"]>;
export type Resumes = NonNullable<ResumesResponse["data"]>;
export type ResumeItem = Resumes["resumes"][number];
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

export function getResumesData(response: ResumesResponse): Resumes {
  if (response.data === undefined) {
    throw new Error("Failed to load resumes");
  }

  return response.data;
}

export function getInterviewCreateDefaultValues(
  options: RoomFormOptions,
  resumes: Resumes,
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
    resumeId: resumes.resumes[0]?.resumeId ?? "",
    resumePublic: true,
    round: "",
    schedules: [{ date: "", durationMinutes: defaultDuration, startTime: "" }],
    sido: null,
    sigunguId: null,
    title: "",
    type: null,
  };
}
