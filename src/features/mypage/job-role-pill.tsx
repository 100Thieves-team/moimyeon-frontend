import { X } from "lucide-react";
import type { JobRoleOption } from "./mypage-model";
import * as styles from "./job-role-field.css";

type JobRolePillProps = {
  onRemove: () => void;
  role: JobRoleOption;
  variant: "field" | "footer";
};

export function JobRolePill({ onRemove, role, variant }: JobRolePillProps) {
  return (
    <span className={variant === "field" ? styles.fieldPill : styles.footerPill}>
      <span>{role.displayName}</span>
      <button
        aria-label={`${role.displayName} 삭제`}
        className={styles.pillRemove}
        onClick={onRemove}
        type="button"
      >
        <X aria-hidden="true" size={14} strokeWidth={2} />
      </button>
    </span>
  );
}
