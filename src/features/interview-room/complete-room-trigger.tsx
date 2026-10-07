"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/button";
import { completeRoomDialog } from "./complete-room-dialog-handle";

export function CompleteRoomTrigger() {
  return (
    <Dialog.Trigger handle={completeRoomDialog} render={<Button />}>
      면접 완료하기
    </Dialog.Trigger>
  );
}
