"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import type { ReactNode } from "react";
import { Button } from "@/components/button";
import { DialogCloseButton } from "@/components/dialog-close-button";
import * as styles from "./confirm-action.css";

export function ConfirmActionPopup({
  title,
  description,
  confirmLabel,
  pendingLabel,
  pending,
  error,
  onConfirm,
}: {
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  pending: boolean;
  error?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Backdrop className={styles.backdrop} />
      <AlertDialog.Popup className={styles.popup}>
        <AlertDialog.Close aria-label="닫기" disabled={pending} render={<DialogCloseButton />} />
        <div className={styles.body}>
          <AlertDialog.Title className={styles.title}>{title}</AlertDialog.Title>
          {description && (
            <AlertDialog.Description className={styles.description}>
              {description}
            </AlertDialog.Description>
          )}
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
        </div>
        <div className={styles.footer}>
          <AlertDialog.Close render={<Button variant="secondary" disabled={pending} />}>
            돌아가기
          </AlertDialog.Close>
          <Button disabled={pending} onClick={onConfirm}>
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </div>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  );
}
