"use client";

import { useEffect } from "react";
import { captureEntry, type EntryEvent } from "./analytics";
import type { ActorRole, CreationStep } from "./analytics-contract";

type ScreenEntry = Exclude<EntryEvent, "interview_create_step_viewed" | "interview_create_started">;

export function useRoomEntry(event: ScreenEntry, roomId: string, actorRole?: ActorRole) {
  useEffect(() => {
    captureEntry(event, { room_id: roomId, ...(actorRole ? { actor_role: actorRole } : {}) });
  }, [event, roomId, actorRole]);
}

export function useCreationEntry(step: CreationStep) {
  useEffect(() => {
    captureEntry("interview_create_started", {});
    captureEntry("interview_create_step_viewed", { step });
  }, [step]);
}
