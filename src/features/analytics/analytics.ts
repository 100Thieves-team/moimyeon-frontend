import posthogClient, { type CaptureResult, type PostHogConfig } from "posthog-js";
import {
  eventPropertyKeys,
  getFailureProperties,
  normalizePagePath,
  type AnalyticsEvents,
  type CoreAction,
  type ActorRole,
} from "./analytics-contract";

let enabled = false;
let environment: "dev" | "live" = "dev";
let memberId: string | null = null;
let visitPath: string | undefined;
const entries = new Map<string, string>();
const commonKeys = [
  "event_version",
  "environment",
  "page_path",
  "is_authenticated",
  "event_source",
];
const sdkKeys = [
  "token",
  "distinct_id",
  "$anon_distinct_id",
  "$user_id",
  "$device_id",
  "$is_identified",
  "$process_person_profile",
  "$session_id",
  "$window_id",
  "$lib",
  "$lib_version",
  "$browser",
  "$browser_version",
  "$os",
  "$os_version",
  "$device_type",
  "$screen_height",
  "$screen_width",
  "$host",
];
const urlKeys = ["$current_url", "$referrer", "$initial_current_url", "$initial_referrer"];

function sanitizeUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return `${url.origin}${normalizePagePath(url.pathname)}`;
  } catch {
    return undefined;
  }
}

// Final SDK boundary: even automatically attached attribution/person properties are restricted.
export function sanitizeCapture(event: CaptureResult | null): CaptureResult | null {
  if (!event) return null;
  const keys =
    event.event === "$identify" ? [] : eventPropertyKeys[event.event as keyof AnalyticsEvents];
  if (!keys) return null;
  const original = event.properties;
  const properties: Record<string, unknown> = {};
  for (const key of [...sdkKeys, ...commonKeys, ...keys]) {
    if (original[key] !== undefined) properties[key] = original[key];
  }
  for (const key of urlKeys) {
    const url = sanitizeUrl(original[key]);
    if (url) properties[key] = url;
  }
  if (typeof original.$pathname === "string") {
    properties.$pathname = normalizePagePath(original.$pathname);
  }
  if (typeof properties.page_path === "string") {
    properties.page_path = normalizePagePath(properties.page_path);
  }
  // Never forward $set/$set_once, campaign parameters, search keywords, or raw URLs.
  return { uuid: event.uuid, event: event.event, properties, timestamp: event.timestamp };
}

export const analyticsConfig = {
  autocapture: false,
  capture_pageview: false,
  capture_pageleave: false,
  capture_dead_clicks: false,
  rageclick: false,
  disable_session_recording: true,
  capture_performance: false,
  capture_exceptions: false,
  disable_surveys: true,
  disable_product_tours: true,
  disable_web_experiments: true,
  disable_capture_url_hashes: true,
  advanced_disable_flags: true,
  enable_heatmaps: false,
  save_referrer: false,
  store_google: false,
  custom_campaign_params: [],
  person_profiles: "identified_only",
  before_send: sanitizeCapture,
} satisfies Partial<PostHogConfig>;

export function initializeAnalytics(
  config = {
    enabled: process.env.NEXT_PUBLIC_POSTHOG_ENABLED,
    projectToken: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    environment: process.env.NEXT_PUBLIC_POSTHOG_ENVIRONMENT,
    nodeEnv: process.env.NODE_ENV as string | undefined,
  },
) {
  const token = config.projectToken?.trim();
  const host = config.host?.trim();
  const deployment = config.environment;
  if (
    config.enabled !== "true" ||
    !token ||
    !host ||
    (deployment !== "dev" && deployment !== "live") ||
    config.nodeEnv === "test"
  )
    return;
  try {
    environment = deployment;
    posthogClient.init(token, { ...analyticsConfig, api_host: host });
    enabled = true;
    memberId = posthogClient.get_property("$user_id") ?? null;
  } catch {
    // Analytics must never prevent app startup or a business action.
  }
}

export function captureEvent<E extends keyof AnalyticsEvents>(
  event: E,
  properties: AnalyticsEvents[E],
) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const allowed: Record<string, unknown> = {};
    for (const key of eventPropertyKeys[event]) {
      if (key in properties) allowed[key] = (properties as Record<string, unknown>)[key];
    }
    posthogClient.capture(event, {
      ...allowed,
      event_version: 1,
      environment,
      page_path: normalizePagePath(window.location.pathname),
      is_authenticated: memberId !== null,
      event_source: "frontend",
    });
  } catch {
    // SDK errors are not API failures.
  }
}

export function syncAnalyticsMember(nextMemberId: string | null) {
  if (!enabled) return;
  try {
    const previous = memberId ?? posthogClient.get_property("$user_id");
    if (previous && previous !== nextMemberId) posthogClient.reset();
    if (nextMemberId && previous !== nextMemberId) posthogClient.identify(nextMemberId);
    memberId = nextMemberId;
  } catch {
    memberId = nextMemberId;
  }
}

export function resetAnalyticsMember() {
  memberId = null;
  if (!enabled) return;
  try {
    posthogClient.reset();
  } catch {
    /* Preserve logout even if the SDK fails. */
  }
}

function ensureVisit(pathname: string) {
  if (visitPath === pathname) return;
  visitPath = pathname;
  entries.clear();
}

export function capturePageview(pathname: string) {
  if (!enabled) return;
  ensureVisit(pathname);
  if (entries.has("$pageview")) return;
  entries.set("$pageview", pathname);
  captureEvent("$pageview", {});
}

export type EntryEvent =
  | "interview_detail_viewed"
  | "interview_create_started"
  | "interview_create_step_viewed"
  | "interview_apply_started"
  | "review_started";

export function captureEntry<E extends EntryEvent>(event: E, properties: AnalyticsEvents[E]) {
  if (!enabled || typeof window === "undefined") return;
  ensureVisit(window.location.pathname);
  const key = JSON.stringify(properties);
  // Role changes/query refreshes don't create a new screen entry. Step transitions do.
  const entryKey = event === "interview_create_step_viewed" ? key : "entered";
  if (entries.get(event) === entryKey) return;
  entries.set(event, entryKey);
  captureEvent(event, properties);
}

export function captureActionFailure(
  action: CoreAction,
  error: unknown,
  room?: { room_id: string; actor_role?: ActorRole },
) {
  captureEvent("core_action_failed", { action, ...room, ...getFailureProperties(error) });
}

export function getActorRole(
  viewer: { isHost?: boolean | null; isParticipating?: boolean | null } | undefined | null,
): ActorRole | undefined {
  if (!viewer) return undefined;
  if (viewer.isHost === true) return "host";
  if (viewer.isParticipating === true) return "participant";
  if (viewer.isHost === false && viewer.isParticipating === false) return "visitor";
  return undefined;
}
