"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/button";
import { confirmRoomDialog } from "./confirm-room-dialog-handle";

export function ConfirmRoomTrigger() {
  return (
    <AlertDialog.Trigger handle={confirmRoomDialog} render={<Button />}>
      진행 확정하기
    </AlertDialog.Trigger>
  );
}
