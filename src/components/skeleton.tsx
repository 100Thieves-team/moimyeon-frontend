import type { CSSProperties } from "react";
import * as styles from "./skeleton.css";

type SkeletonProps = {
  className?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  circle?: boolean;
};

export function Skeleton({ className, width, height, circle = false }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.skeleton, circle && styles.circle, className].filter(Boolean).join(" ")}
      style={{ width, height }}
    />
  );
}
