import Link from "next/link";
import type { ReactNode } from "react";
import type { MockInterview } from "./mock-data";
import * as styles from "./mock-flow.css";

type RoomTab = "applications" | "comments" | "info" | "participants" | "prepare";

type InterviewRoomShellProps = {
  activeTab: RoomTab;
  children: ReactNode;
  interview: MockInterview;
  participantCount?: number;
  pendingCount?: number;
  phase?: "confirmed" | "preparing" | "recruiting";
};

export function InterviewRoomShell({
  activeTab,
  children,
  interview,
  participantCount = interview.currentParticipants,
  pendingCount = 0,
  phase = "recruiting",
}: InterviewRoomShellProps) {
  const confirmed = phase !== "recruiting";
  const tabs = [
    { href: `/interviews/${interview.id}`, label: "면접 정보", value: "info" },
    ...(interview.relation === "host" && !confirmed
      ? [
          {
            href: `/interviews/${interview.id}/applications`,
            label: `참가 신청${pendingCount > 0 ? ` ${pendingCount}` : ""}`,
            value: "applications",
          } as const,
        ]
      : []),
    {
      href: `/interviews/${interview.id}/participants`,
      label: `참여자 ${participantCount}`,
      value: "participants",
    },
    { href: `/interviews/${interview.id}/comments`, label: "댓글", value: "comments" },
    ...(confirmed
      ? [
          {
            href: `/interviews/${interview.id}/prepare`,
            label: "진행 준비",
            value: "prepare",
          } as const,
        ]
      : []),
  ];

  return (
    <main className={styles.page}>
      <header className={styles.roomHeader}>
        <div className={styles.statusLine}>
          <span className={styles.badge}>{confirmed ? "진행 확정" : "모집 중"}</span>
          {confirmed ? (
            <span className={`${styles.badge} ${styles.accentBadge}`}>참여 중</span>
          ) : null}
          <span>
            {participantCount} / {interview.maxParticipants}명
            {pendingCount > 0 ? ` · 신청 ${pendingCount}건 대기` : ""} · {interview.dateLabel}{" "}
            {interview.timeLabel}
          </span>
        </div>
        <h1 className={styles.roomTitle}>{interview.title}</h1>
      </header>
      <nav aria-label="면접 메뉴" className={styles.roomTabs}>
        {tabs.map((tab) => (
          <Link
            aria-current={activeTab === tab.value ? "page" : undefined}
            className={`${styles.roomTab} ${activeTab === tab.value ? styles.roomTabActive : ""}`}
            href={tab.href}
            key={tab.value}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
