import type { RoomsData, RoomsResponse } from "@/api";
import { roomsInfiniteOptions } from "@/api/generated/@tanstack/react-query.gen";
import { skipToken } from "@tanstack/react-query";
import { z } from "zod";

export const DISCOVERY_SORTS = ["SCHEDULE", "RECENT"] as const;
export const DISCOVERY_ROUNDS = ["FIRST", "SECOND", "THIRD", "ETC"] as const;
export const DISCOVERY_METHODS = ["ONLINE", "OFFLINE"] as const;

export type DiscoverySort = (typeof DISCOVERY_SORTS)[number];
export type DiscoveryRound = (typeof DISCOVERY_ROUNDS)[number];
export type DiscoveryMethod = (typeof DISCOVERY_METHODS)[number];

export type CompanyTarget = {
  companyId: string;
  kind: "company";
  label: string;
};

export type JobPostingTarget = {
  jobPostingId: string;
  kind: "jobPosting";
  label: string;
};

export type DiscoveryTarget = CompanyTarget | JobPostingTarget;

export const DISCOVERY_FILTER_KEYS = [
  "companyId",
  "jobPostingId",
  "jobRoleId",
  "round",
  "method",
  "sigunguId",
  "sort",
  "targetLabel",
] as const;

const positiveIntegerPattern = /^[1-9]\d*$/;

const firstSearchParamValue = (value: unknown) => (Array.isArray(value) ? value[0] : value);

const nullableIdSchema = z.preprocess(
  firstSearchParamValue,
  z.string().regex(positiveIntegerPattern).nullable().catch(null),
);

export const interviewDiscoveryFiltersSchema = z
  .object({
    companyId: nullableIdSchema,
    jobPostingId: nullableIdSchema,
    jobRoleId: nullableIdSchema,
    method: z.preprocess(firstSearchParamValue, z.enum(DISCOVERY_METHODS).nullable().catch(null)),
    round: z.preprocess(firstSearchParamValue, z.enum(DISCOVERY_ROUNDS).nullable().catch(null)),
    sigunguId: nullableIdSchema,
    sort: z.preprocess(firstSearchParamValue, z.enum(DISCOVERY_SORTS).catch("SCHEDULE")),
  })
  .transform(({ companyId, jobPostingId, ...filters }) => ({
    ...filters,
    companyId: jobPostingId === null ? companyId : null,
    jobPostingId,
  }));

export type InterviewDiscoveryFilters = z.output<typeof interviewDiscoveryFiltersSchema>;

export const DEFAULT_DISCOVERY_FILTERS: InterviewDiscoveryFilters = {
  companyId: null,
  jobPostingId: null,
  jobRoleId: null,
  method: null,
  round: null,
  sigunguId: null,
  sort: "SCHEDULE",
};

export function toRoomsQuery(filters: InterviewDiscoveryFilters): NonNullable<RoomsData["query"]> {
  return {
    ...(filters.companyId === null ? {} : { companyId: filters.companyId }),
    ...(filters.jobPostingId === null ? {} : { jobPostingId: filters.jobPostingId }),
    ...(filters.jobRoleId === null ? {} : { jobRoleId: filters.jobRoleId }),
    ...(filters.round === null ? {} : { round: filters.round }),
    ...(filters.method === null ? {} : { method: filters.method }),
    ...(filters.sigunguId === null ? {} : { sigunguId: filters.sigunguId }),
    sort: filters.sort,
    size: "20",
  };
}

type GeneratedRoomsOptions = NonNullable<Parameters<typeof roomsInfiniteOptions>[0]>;

export function interviewRoomsInfiniteOptions(
  filters: InterviewDiscoveryFilters,
  options: Omit<GeneratedRoomsOptions, "query"> = {},
) {
  const generatedOptions = roomsInfiniteOptions({ ...options, query: toRoomsQuery(filters) });

  if (generatedOptions.queryFn === undefined || generatedOptions.queryFn === skipToken) {
    throw new Error("Rooms infinite query function is unavailable");
  }

  return {
    ...generatedOptions,
    queryFn: generatedOptions.queryFn,
    getNextPageParam: (lastPage: RoomsResponse) => lastPage.data?.nextCursor ?? undefined,
    initialPageParam: { query: {} },
  };
}

export function writeInterviewDiscoveryFilters(
  currentSearchParams: URLSearchParams,
  filters: InterviewDiscoveryFilters,
) {
  const nextSearchParams = new URLSearchParams(currentSearchParams);

  DISCOVERY_FILTER_KEYS.forEach((key) => nextSearchParams.delete(key));

  if (filters.companyId !== null) nextSearchParams.set("companyId", filters.companyId);
  if (filters.jobPostingId !== null) nextSearchParams.set("jobPostingId", filters.jobPostingId);
  if (filters.jobRoleId !== null) nextSearchParams.set("jobRoleId", filters.jobRoleId);
  if (filters.round !== null) nextSearchParams.set("round", filters.round);
  if (filters.method !== null) nextSearchParams.set("method", filters.method);
  if (filters.sigunguId !== null) nextSearchParams.set("sigunguId", filters.sigunguId);
  nextSearchParams.set("sort", filters.sort);

  return nextSearchParams;
}

export function applyTargetToFilters(
  filters: InterviewDiscoveryFilters,
  target: DiscoveryTarget | null,
): InterviewDiscoveryFilters {
  return {
    ...filters,
    companyId: target?.kind === "company" ? target.companyId : null,
    jobPostingId: target?.kind === "jobPosting" ? target.jobPostingId : null,
  };
}
