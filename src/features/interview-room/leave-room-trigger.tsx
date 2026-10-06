"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/button";
import { leaveRoomDialog } from "./leave-room-dialog-handle";
import * as styles from "./interview-room.css";

export function LeaveRoomTrigger({ variant = "compact" }: { variant?: "compact" | "card" }) {
  return (
    <div className={variant === "card" ? styles.cardLeaveAction : styles.leaveAction}>
      <AlertDialog.Trigger
        handle={leaveRoomDialog}
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
    </div>
  );
}
