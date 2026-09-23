"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/button";
import { leaveRoomDialog } from "./leave-room-dialog-handle";
import { getLeaveDisabledReason, type InterviewRoom } from "./participant-model";
import * as styles from "./interview-room.css";

export function LeaveRoomTrigger({
  room,
  variant = "compact",
}: {
  room: InterviewRoom;
  variant?: "compact" | "card";
}) {
  const reason = getLeaveDisabledReason(room);

  return (
    <div className={variant === "card" ? styles.cardLeaveAction : styles.leaveAction}>
      <AlertDialog.Trigger
        handle={leaveRoomDialog}
        disabled={reason !== null}
        render={
          <Button
            variant="secondary"
            size="sm"
            className={variant === "card" ? styles.cardLeaveButton : undefined}
          />
        }
      >
        참여 취소하기
      </AlertDialog.Trigger>
      {reason && <p className={styles.leaveReason}>{reason}</p>}
    </div>
  );
}
