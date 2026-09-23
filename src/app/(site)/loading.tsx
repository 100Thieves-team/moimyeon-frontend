import { InterviewDiscoverySkeleton } from "@/features/interview-discovery/interview-discovery-skeleton";
import * as styles from "./page.css";

export default function Loading() {
  return (
    <main className={styles.page}>
      <InterviewDiscoverySkeleton />
    </main>
  );
}
