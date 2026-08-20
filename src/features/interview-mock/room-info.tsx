"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Toast } from "@base-ui/react/toast";
import { X } from "lucide-react";
import { Button, LinkButton } from "@/components/button";
import { InterviewRoomShell } from "./interview-room-shell";
import { mockParticipants, type MockInterview } from "./mock-data";
import { useMockFlow } from "./mock-flow-store";
import * as styles from "./mock-flow.css";

function ConfirmRoomDialog({ interview }: { interview: MockInterview }) {
  const { confirmRoom } = useMockFlow();
  const toastManager = Toast.useToastManager();

  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button />}>진행 확정하기</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.dialogBackdrop} />
        <Dialog.Viewport className={styles.dialogPositioner}>
          <Dialog.Popup className={styles.dialogPopup}>
            <div className={styles.dialogHead}>
              <div>
                <Dialog.Title className={styles.dialogTitle}>진행을 확정할게요</Dialog.Title>
                <Dialog.Description className={styles.dialogDescription}>
                  한빛커머스 백엔드 2차 · 확정하면 되돌릴 수 없어요.
                </Dialog.Description>
              </div>
              <Dialog.Close aria-label="진행 확정 닫기" className={styles.iconButton}>
                <X aria-hidden="true" size={18} />
              </Dialog.Close>
            </div>
            <div className={styles.dialogBody}>
              <dl className={styles.stack}>
                <div className={styles.inline}>
                  <dt className={styles.textLabel}>진행 일정</dt>
                  <dd>
                    {interview.dateLabel} {interview.timeLabel} · {interview.duration}
                  </dd>
                </div>
                <div className={styles.inline}>
                  <dt className={styles.textLabel}>진행 방식</dt>
                  <dd>{interview.methodLabel}</dd>
                </div>
                <div className={styles.inline}>
                  <dt className={styles.textLabel}>참여 인원</dt>
                  <dd>
                    {interview.currentParticipants}명 · 최소 {interview.minParticipants}명
                  </dd>
                </div>
              </dl>
              <div className={styles.separator} />
              <strong className={styles.sectionTitle}>확정하면</strong>
              <ul className={styles.stack}>
                <li className={styles.sectionCopy}>
                  참여자와 인원이 고정돼요 — 새 신청은 받지 않아요.
                </li>
                <li className={styles.sectionCopy}>이력서 원본이 참여자 간 공개돼요.</li>
                <li className={styles.sectionCopy}>
                  대기 중인 신청은 자동 반려하고 신청자에게 알려요.
                </li>
                <li className={styles.sectionCopy}>확정 후 취소는 이력에 남을 수 있어요.</li>
              </ul>
            </div>
            <div className={styles.dialogFoot}>
              <Dialog.Close render={<Button variant="secondary" />}>취소</Dialog.Close>
              <Dialog.Close
                render={
                  <Button
                    onClick={() => {
                      confirmRoom(interview.id);
                      toastManager.add({ title: "면접 진행을 확정했어요" });
                    }}
                  />
                }
              >
                진행 확정하기
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function RoomInfo({ interview }: { interview: MockInterview }) {
  const { rooms } = useMockFlow();
  const room = rooms[interview.id];
  const confirmed = room?.phase !== "recruiting";
  const isShortStaffed = interview.id === "hanbit-host-short";

  return (
    <InterviewRoomShell
      activeTab="info"
      interview={interview}
      phase={confirmed ? "confirmed" : "recruiting"}
    >
      <div className={styles.contentNarrow}>
        {confirmed ? (
          <div className={styles.blueCard}>
            <strong className={styles.actionTitle}>진행이 확정됐어요</strong>
            <p className={styles.sectionCopy}>
              참여자와 일정이 고정됐어요. 진행 준비에서 질문을 남겨보세요.
            </p>
          </div>
        ) : null}
        <section className={styles.card}>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.textLabel}>진행 일정</span>
              <strong>
                {interview.dateLabel} {interview.timeLabel} · {interview.duration}
              </strong>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.textLabel}>진행 방식</span>
              <strong>{interview.methodLabel}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.textLabel}>모집 현황</span>
              <strong>
                {interview.currentParticipants} / {interview.maxParticipants}명 · 최소{" "}
                {interview.minParticipants}명
              </strong>
            </div>
          </div>
          <div className={styles.cardPadding}>
            <h2 className={styles.sectionTitle}>면접 소개</h2>
            <p className={styles.sectionCopy}>
              실제 2차 면접처럼 시스템 설계 위주로 진행해요. 한 명씩 모의면접을 보고, 끝나면 함께
              피드백을 나눠요.
            </p>
            <div className={styles.separator} />
            <h2 className={styles.sectionTitle}>참여자</h2>
            <div className={styles.inline}>
              {mockParticipants.slice(0, interview.currentParticipants).map((person) => (
                <span aria-hidden="true" className={styles.personAvatar} key={person.id}>
                  {person.initial}
                </span>
              ))}
              <span className={styles.personMeta}>
                나(방장) · 성실한 사슴 03 · 든든한 곰 21 · 수줍은 수달 21
              </span>
            </div>
          </div>
        </section>
      </div>
      {interview.relation === "host" ? (
        <div className={styles.fixedActionBar}>
          <span className={styles.actionCopy}>
            <strong className={styles.actionTitle}>
              {confirmed
                ? "면접 진행을 준비해 주세요"
                : isShortStaffed
                  ? "아직 확정할 수 없어요 — 인원 2 / 5명 (최소 3명)"
                  : "지금 확정할 수 있어요 — 인원 4/5 (최소 3) · 일정 유효"}
            </strong>
            <span className={styles.actionDescription}>
              {confirmed
                ? "참여자별 질문을 준비하고 당일 출석을 확인해요."
                : isShortStaffed
                  ? "1명 더 모이면 확정할 수 있어요 · 모집 글을 공유해 보세요."
                  : "확정하면 인원·일정 고정 · 이력서 원본 공개 · 되돌릴 수 없어요."}
            </span>
          </span>
          {confirmed ? (
            <LinkButton href={`/interviews/${interview.id}/prepare`}>진행 준비하기</LinkButton>
          ) : (
            <ConfirmRoomDialog interview={interview} />
          )}
        </div>
      ) : null}
    </InterviewRoomShell>
  );
}
