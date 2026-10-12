import type { UseMutationOptions } from "@tanstack/react-query";
import { captureActionFailure, captureEvent } from "./analytics";
import type { ActorRole, AnalyticsEvents, CoreAction } from "./analytics-contract";

type SuccessEvent =
  | "interview_created"
  | "interview_applied"
  | "interview_application_accepted"
  | "interview_application_rejected"
  | "interview_confirmed"
  | "interview_completed"
  | "review_created";

// Capture at the API boundary, before UI callbacks and cache refreshes can fail.
export function trackMutation<Data, Error, Variables, Context, E extends SuccessEvent>(
  options: UseMutationOptions<Data, Error, Variables, Context>,
  tracking: {
    action: CoreAction;
    event: E;
    properties: (data: Data, variables: Variables) => AnalyticsEvents[E] | null;
    failureProperties?: { room_id: string; actor_role?: ActorRole };
  },
): UseMutationOptions<Data, Error, Variables, Context> {
  const execute = options.mutationFn!;
  return {
    ...options,
    mutationFn: async (variables, context) => {
      let data: Data;
      try {
        data = await execute(variables, context);
      } catch (error) {
        captureActionFailure(tracking.action, error, tracking.failureProperties);
        throw error;
      }
      try {
        const properties = tracking.properties(data, variables);
        if (properties) captureEvent(tracking.event, properties);
      } catch {
        /* Property extraction must also preserve API success. */
      }
      return data;
    },
  };
}
