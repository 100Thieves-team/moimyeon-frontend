export const LOGIN_RETURN_PATHS = ["/", "/interviews/new"] as const;

export type LoginReturnTo = (typeof LOGIN_RETURN_PATHS)[number];

export type LoginIntent = {
  returnTo: LoginReturnTo;
};

export const DEFAULT_LOGIN_RETURN_TO: LoginReturnTo = "/";

export function normalizeLoginReturnTo(value: unknown): LoginReturnTo {
  return LOGIN_RETURN_PATHS.find((path) => path === value) ?? DEFAULT_LOGIN_RETURN_TO;
}
