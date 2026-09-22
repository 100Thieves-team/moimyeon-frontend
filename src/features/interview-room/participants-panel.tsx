"use client";

import type { RoomLeaveResponse } from "@/api/generated";

import { useSuspenseQuery } from "@tanstack/react-query";
import { roomParticipantsOptions } from "@/api/generated/@tanstack/react-query.gen";
import { TrustCardPopover } from "@/features/trust-card/trust-card-popover";
import { getParticipantSummary, type InterviewRoom } from "./participant-model";
import { LeaveRoomDialog } from "./leave-room-dialog";
import * as styles from "./interview-room.css";

export function ParticipantsPanel({
  room,
  currentMemberId,
  onLeave,
  isPending,
}: {
  room: InterviewRoom;
  currentMemberId: string;
  onLeave: () => Promise<RoomLeaveResponse>;
  isPending: boolean;
}) {
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
                  <TrustCardPopover
                    memberId={participant.memberId}
                    isHost={participant.isHost}
                    triggerLabel={participant.nickname}
                    trigger={
                      <>
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
                      </>
                    }
                  />
                </div>
                <p className={styles.participantSummary}>{getParticipantSummary(participant)}</p>
              </li>
            );
          })}
        </ul>
      )}
      <footer className={styles.participantsFooter}>
        <LeaveRoomDialog room={room} onLeave={onLeave} isPending={isPending} />
      </footer>
    </>
  );
}
