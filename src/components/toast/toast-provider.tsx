"use client";

import { Toast } from "@base-ui/react/toast";
import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import * as styles from "./toast.css";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider>
      {children}
      <Toast.Portal>
        <Toast.Viewport className={styles.viewport}>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root
      className={styles.root}
      key={toast.id}
      swipeDirection={["up", "right"]}
      toast={toast}
    >
      <Toast.Content className={styles.content}>
        <Check aria-hidden="true" className={styles.icon} size={18} strokeWidth={2} />
        <div className={styles.text}>
          <Toast.Title className={styles.title} />
          {toast.description && <Toast.Description className={styles.description} />}
        </div>
        <Toast.Close aria-label="알림 닫기" className={styles.close}>
          <X aria-hidden="true" size={16} strokeWidth={2} />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
