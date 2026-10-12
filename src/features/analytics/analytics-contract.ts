export type ActorRole = "host" | "participant" | "visitor";
export type CreationStep =
  | "interview-info"
  | "method-and-schedule"
  | "introduction-and-resume"
  | "final-review";

type RoomProperties = { room_id: string; actor_role?: ActorRole };
export type CoreAction =
  | "login"
  | "interview_create"
  | "interview_apply"
  | "interview_application_accept"
  | "interview_application_reject"
  | "interview_confirm"
  | "interview_complete"
  | "review_create";
export type FailureProperties = {
  failure_type: "api" | "network";
  error_code?: string;
};
export type AnalyticsEvents = {
  $pageview: Record<string, never>;
  login_started: Record<string, never>;
  login_completed: Record<string, never>;
  interview_detail_viewed: RoomProperties;
  interview_create_started: { actor_role?: ActorRole };
  interview_create_step_viewed: { step: CreationStep; actor_role?: ActorRole };
  interview_created: RoomProperties;
  interview_apply_started: RoomProperties;
  interview_applied: RoomProperties;
  interview_application_accepted: RoomProperties;
  interview_application_rejected: RoomProperties;
  interview_confirmed: RoomProperties;
  interview_completed: RoomProperties;
  review_started: RoomProperties;
  review_created: RoomProperties;
  core_action_failed: FailureProperties & {
    action: CoreAction;
    room_id?: string;
    actor_role?: ActorRole;
  };
};

export const eventPropertyKeys = {
  $pageview: [],
  login_started: [],
  login_completed: [],
  interview_detail_viewed: ["room_id", "actor_role"],
  interview_create_started: ["actor_role"],
  interview_create_step_viewed: ["step", "actor_role"],
  interview_created: ["room_id", "actor_role"],
  interview_apply_started: ["room_id", "actor_role"],
  interview_applied: ["room_id", "actor_role"],
  interview_application_accepted: ["room_id", "actor_role"],
  interview_application_rejected: ["room_id", "actor_role"],
  interview_confirmed: ["room_id", "actor_role"],
  interview_completed: ["room_id", "actor_role"],
  review_started: ["room_id", "actor_role"],
  review_created: ["room_id", "actor_role"],
  core_action_failed: ["action", "room_id", "actor_role", "error_code", "failure_type"],
} as const satisfies { [E in keyof AnalyticsEvents]: readonly (keyof AnalyticsEvents[E])[] };

// Generated SDK throws the server envelope for HTTP failures and Error for network failures.
export function getFailureProperties(error: unknown): FailureProperties {
  if (typeof error === "object" && error !== null && "error" in error) {
    const detail = error.error;
    const code =
      typeof detail === "object" &&
      detail !== null &&
      "code" in detail &&
      typeof detail.code === "string"
        ? detail.code
        : undefined;
    return { failure_type: "api", ...(code ? { error_code: code } : {}) };
  }
  if (typeof error === "object" && error !== null && "result" in error) {
    return { failure_type: "api" };
  }
  return { failure_type: error instanceof Error ? "network" : "api" };
}

// Only known route shapes survive. Unknown paths may contain user-supplied text.
export function normalizePagePath(value: string): string {
  const path = new URL(value, "https://moimyeon.invalid").pathname.replace(/\/$/, "") || "/";
  if (/^\/interviews\/(new|me|mock)$/.test(path)) return path;
  if (/^\/interviews\/[^/]+(?:\/(apply|review))?$/.test(path)) {
    return path.replace(/^\/interviews\/[^/]+/, "/interviews/[roomId]");
  }
  if (/^\/terms\/[^/]+$/.test(path)) return "/terms/[type]";
  if (["/", "/mypage", "/about", "/design-system", "/error-preview"].includes(path)) return path;
  return "/[unknown]";
}
