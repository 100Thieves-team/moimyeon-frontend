import { X } from "lucide-react";
import type { ComponentProps } from "react";
import * as styles from "./dialog-close-button.css";

export function DialogCloseButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={[styles.closeButton, className].filter(Boolean).join(" ")}
    >
      <X aria-hidden="true" size={20} strokeWidth={1.75} />
    </button>
  );
}
