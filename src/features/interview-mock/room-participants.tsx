"use client";

import { Toast } from "@base-ui/react/toast";
import { FileText } from "lucide-react";
import { Button } from "@/components/button";
import { InterviewRoomShell } from "./interview-room-shell";
import { mockParticipants, type MockInterview } from "./mock-data";
import { useMockFlow } from "./mock-flow-store";
import * as styles from "./mock-flow.css";
import { PublicTrustDialog } from "./public-trust-dialog";

export function RoomParticipants({ interview }: { interview: MockInterview }) {
  const { rooms } = useMockFlow();
  const toastManager = Toast.useToastManager();
  const room = rooms[interview.id];
  const confirmed = room?.phase !== "recruiting";
  const acceptedCount = Object.values(room?.applications ?? {}).filter(
    (status) => status === "accepted",
  ).length;
  const count = Math.min(mockParticipants.length, interview.currentParticipants + acceptedCount);
  const people = mockParticipants.slice(0, count);

  return (
    <InterviewRoomShell
      activeTab="participants"
      interview={interview}
      participantCount={count}
      phase={confirmed ? "confirmed" : "recruiting"}
    >
      <div className={styles.contentNarrow}>
        {confirmed ? (
          <div className={styles.blueCard}>
            <strong className={styles.actionTitle}>진행이 확정됐어요</strong>
            <p className={styles.sectionCopy}>
              참여자와 일정이 고정됐어요. 이제 이력서 원본을 서로 볼 수 있어요.
            </p>
          </div>
        ) : null}
        <section aria-label="참여자 목록" className={styles.card}>
          {people.map((person) => (
            <article className={styles.personRow} key={person.id}>
              <span
                aria-hidden="true"
                className={`${styles.personAvatar} ${person.isMe ? styles.personAvatarMe : ""}`}
              >
                {person.initial}
              </span>
              <div className={styles.personMain}>
                <div className={styles.inline}>
                  <PublicTrustDialog
                    person={person}
                    trigger={
                      <button className={styles.personNameButton} type="button">
                        {person.nickname}
                      </button>
                    }
                  />
                  {person.isHost ? (
                    <span className={`${styles.badge} ${styles.hostBadge}`}>방장</span>
                  ) : null}
                  {person.isMe ? (
                    <span className={`${styles.badge} ${styles.accentBadge}`}>나</span>
                  ) : null}
                </div>
                <span className={styles.personMeta}>
                  {person.jobRole} · 완료 {person.completedInterviews}회 · ★ {person.rating}
                </span>
                <span className={styles.personSummary}>{person.summary}</span>
              </div>
              {confirmed ? (
                <Button
                  onClick={() => toastManager.add({ title: person.resumeFileName })}
                  size="sm"
                  variant="secondary"
                >
                  <FileText aria-hidden="true" size={14} /> 이력서 원본
                </Button>
              ) : null}
            </article>
          ))}
          <p className={styles.mutedCard}>
            {confirmed
              ? "이력서 원본은 진행 확정 이후 참여자에게 공개돼요."
              : "이 면접은 AI 요약을 서로 공개하고, 원본은 진행 확정 이후 공개해요 — 방장이 정한 설정"}
          </p>
        </section>
        {interview.relation === "participant" ? (
          <div className={styles.actions}>
            <Button
              onClick={() =>
                toastManager.add({
                  title: confirmed ? "확정 후 취소는 이력에 남아요" : "참여를 취소했어요",
                })
              }
              variant="secondary"
            >
              참여 취소하기
            </Button>
          </div>
        ) : null}
      </div>
    </InterviewRoomShell>
  );
}
