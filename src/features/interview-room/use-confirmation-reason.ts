"use client";

import { useEffect, useState } from "react";
import type { InterviewRoom } from "./participant-model";
import { getConfirmationDisabledReason, getConfirmationStartAt } from "./confirmation-model";

export function useConfirmationReason(room: InterviewRoom) {
  const [now, setNow] = useState(Date.now);
  const startAt = getConfirmationStartAt(room);
  useEffect(() => {
    if (!Number.isFinite(startAt) || room.previouslyConfirmed) return;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const time = Date.now();
      setNow(time);
      if (startAt > time) timer = setTimeout(update, Math.min(startAt - time, 2_147_483_647));
    };
    update();
    return () => clearTimeout(timer);
  }, [startAt, room.previouslyConfirmed]);
  return getConfirmationDisabledReason(room, now);
}
