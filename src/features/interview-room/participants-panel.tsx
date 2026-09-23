"use client";

import { Popover } from "@base-ui/react/popover";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { roomParticipantsOptions } from "@/api/generated/@tanstack/react-query.gen";
import { TrustCardPopover, type TrustCardPayload } from "@/features/trust-card/trust-card-popover";
import * as trustCardStyles from "@/features/trust-card/trust-card.css";
import { getParticipantSummary, type InterviewRoom } from "./participant-model";
import { LeaveRoomTrigger } from "./leave-room-trigger";
import * as styles from "./interview-room.css";

export function ParticipantsPanel({
  room,
  currentMemberId,
}: {
  room: InterviewRoom;
  currentMemberId: string;
}) {
  const [profileHandle] = useState(() => Popover.createHandle<TrustCardPayload>());
  const query = useSuspenseQuery({
    ...roomParticipantsOptions({ path: { roomId: room.roomId } }),
    retry: false,
  });
  const data = query.data.data;
  if (!data) throw new Error("Failed to load room participants");

  return (
    <>
      {data.participants.length === 0 ? (
        <p className={styles.empty}>참여자가 없어요.</p>
      ) : (
        <ul aria-label="참여자 목록" className={styles.roster}>
          {data.participants.map((participant) => {
            const isMe = participant.memberId === currentMemberId;
            return (
              <li
                key={participant.memberId}
                className={styles.participantRow}
                data-me={isMe || undefined}
              >
                <div className={styles.participantProfile}>
                  <Popover.Trigger
                    handle={profileHandle}
                    payload={{ memberId: participant.memberId, isHost: participant.isHost }}
                    aria-label={`${participant.nickname} 공개 신뢰 카드 열기`}
                    className={trustCardStyles.trigger}
                    openOnHover
                    delay={300}
                    closeDelay={150}
                  >
                    <span className={styles.participantAvatar} aria-hidden="true">
                      {Array.from(participant.nickname.trim())[0] ?? "?"}
                    </span>
                    <span className={styles.participantIdentity}>
                      <span className={styles.participantName}>
                        <span className={styles.nickname}>{participant.nickname}</span>
                        {participant.isHost && <span className={styles.hostBadge}>방장</span>}
                        {isMe && <span className={styles.meBadge}>나</span>}
                      </span>
                      {participant.jobRoles.length > 0 && (
                        <span className={styles.meta}>
                          {participant.jobRoles.map((role) => role.name).join(" · ")}
                        </span>
                      )}
                      {participant.activitySummary && (
                        <span className={styles.meta}>{participant.activitySummary}</span>
                      )}
                    </span>
                  </Popover.Trigger>
                </div>
                <p className={styles.participantSummary}>{getParticipantSummary(participant)}</p>
              </li>
            );
          })}
        </ul>
      )}
      <TrustCardPopover handle={profileHandle} />
      <footer className={styles.participantsFooter}>
        <LeaveRoomTrigger room={room} />
      </footer>
    </>
  );
}
