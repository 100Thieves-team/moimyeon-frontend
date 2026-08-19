import type {
  CreateRoomData,
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
  schedule: InterviewSchedule;
  sido: string | null;
  sigunguId: number | null;
  title: string;
  type: string | null;
};

export type CreateRoomBody = NonNullable<CreateRoomData["body"]>;

export function getScheduleTimestamp(schedule: InterviewSchedule) {
  const [year, month, day] = schedule.date.split("-").map(Number);
  const [hour, minute] = schedule.startTime.split(":").map(Number);

  if ([year, month, day, hour, minute].some((value) => !Number.isInteger(value))) {
    return null;
  }

  const date = new Date(year, month - 1, day, hour, minute);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

  return date.getTime();
}

export function validateParticipantRange(
  values: Pick<InterviewCreateFormValues, "maxParticipants" | "minParticipants">,
  options: RoomFormOptions,
) {
  const minimum = options.participantConstraints?.min ?? 2;
  const maximum = options.participantConstraints?.max ?? 8;

  return (
    (values.minParticipants >= minimum &&
      values.maxParticipants <= maximum &&
      values.maxParticipants >= values.minParticipants) ||
    `${minimum}명부터 ${maximum}명까지 선택해 주세요.`
  );
}

export function validateInterviewSchedule(
  schedule: InterviewSchedule,
  options: RoomFormOptions,
  now = Date.now(),
) {
  if (!schedule.date) return "날짜를 선택해 주세요.";
  if (!schedule.startTime) return "시작 시간을 선택해 주세요.";
  if (!options.durations.some((duration) => duration.minutes === schedule.durationMinutes)) {
    return "예상 소요 시간을 선택해 주세요.";
  }

  const timestamp = getScheduleTimestamp(schedule);
  return (timestamp !== null && timestamp > now) || "현재보다 이후 시간을 선택해 주세요.";
}

export function isInterviewInfoStepComplete(
  values: InterviewCreateFormValues,
  options: RoomFormOptions,
  validJobRoleIds: ReadonlySet<number>,
) {
  return (
    values.posting !== null &&
    values.jobRoleId !== null &&
    validJobRoleIds.has(values.jobRoleId) &&
    options.rounds.some((round) => round.code === values.round) &&
    (values.type === null || options.types.some((type) => type.code === values.type))
  );
}

export function isMethodAndScheduleStepComplete(
  values: InterviewCreateFormValues,
  options: RoomFormOptions,
  regions: Regions,
  canCreateRoom: boolean,
) {
  const hasValidMethod = options.methods.some((method) => method.code === values.method);
  const hasValidRegion =
    values.method !== "OFFLINE" ||
    regions.sidos.some((sido) =>
      sido.sigungus.some((sigungu) => sigungu.sigunguId === values.sigunguId),
    );

  return (
    hasValidMethod &&
    hasValidRegion &&
    validateParticipantRange(values, options) === true &&
    validateInterviewSchedule(values.schedule, options) === true &&
    canCreateRoom
  );
}

export function isIntroductionAndResumeStepComplete(
  values: InterviewCreateFormValues,
  resumes: Resumes,
) {
  return (
    values.title.trim().length > 0 &&
    values.title.length <= 60 &&
    values.description.length <= 1_000 &&
    resumes.resumes.some((resume) => resume.resumeId === values.resumeId) &&
    typeof values.resumePublic === "boolean"
  );
}

export function toCreateRoomBody(values: InterviewCreateFormValues): CreateRoomBody {
  if (values.posting === null || values.jobRoleId === null) {
    throw new Error("Interview information is incomplete.");
  }

  return {
    description: values.description.trim() || null,
    jobRoleId: values.jobRoleId,
    maxParticipants: values.maxParticipants,
    method: values.method,
    minParticipants: values.minParticipants,
    postingId: values.posting.jobPostingId,
    resumeId: values.resumeId,
    resumePublic: values.resumePublic,
    round: values.round,
    schedule: values.schedule,
    sigunguId: values.method === "OFFLINE" ? values.sigunguId : null,
    title: values.title.trim(),
    type: values.type,
  };
}

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
    schedule: { date: "", durationMinutes: defaultDuration, startTime: "" },
    sido: null,
    sigunguId: null,
    title: "",
    type: null,
  };
}
