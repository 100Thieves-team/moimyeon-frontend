"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/button";
import type { InterviewRoom } from "./participant-model";
import { confirmRoomDialog } from "./confirm-room-dialog-handle";
import { getConfirmationDisabledReason } from "./confirmation-model";
import { useConfirmationReason } from "./use-confirmation-reason";
import * as styles from "@/features/interview-detail/interview-detail.css";

export function ConfirmRoomTrigger({ room }: { room: InterviewRoom }) {
  const reason = useConfirmationReason(room);
  return (
    <>
      <AlertDialog.Trigger
        handle={confirmRoomDialog}
        disabled={reason !== null}
        onClick={(event) => {
          if (getConfirmationDisabledReason(room)) event.preventBaseUIHandler();
        }}
        render={<Button />}
      >
        진행 확정하기
      </AlertDialog.Trigger>
      {reason && <p className={styles.actionMessage}>{reason}</p>}
    </>
  );
}
