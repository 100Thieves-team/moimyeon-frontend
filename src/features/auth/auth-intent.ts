export const LOGIN_RETURN_PATHS = ["/", "/interviews/new"] as const;

export type InterviewDetailReturnTo = `/interviews/${string}`;

export type LoginReturnTo = (typeof LOGIN_RETURN_PATHS)[number] | InterviewDetailReturnTo;

export type LoginIntent = {
  returnTo: LoginReturnTo;
};

export const DEFAULT_LOGIN_RETURN_TO: LoginReturnTo = "/";

const INTERVIEW_DETAIL_RETURN_TO_PATTERN =
  /^\/interviews\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isInterviewDetailReturnTo(value: unknown): value is InterviewDetailReturnTo {
  return typeof value === "string" && INTERVIEW_DETAIL_RETURN_TO_PATTERN.test(value);
}

export function normalizeLoginReturnTo(value: unknown): LoginReturnTo {
  return (
    LOGIN_RETURN_PATHS.find((path) => path === value) ??
    (isInterviewDetailReturnTo(value) ? value : DEFAULT_LOGIN_RETURN_TO)
  );
}
