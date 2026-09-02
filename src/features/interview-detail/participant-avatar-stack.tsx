import { Avatar } from "@base-ui/react/avatar";
import type { InterviewDetail } from "./interview-detail-model";
import * as styles from "./interview-detail.css";

const MAX_VISIBLE_PARTICIPANTS = 5;

type Participant = InterviewDetail["participants"][number] & {
  imageUrl?: string | null;
};

type ParticipantAvatarStackProps = {
  currentCount: number;
  hostMemberId: string;
  participants?: readonly Participant[];
};

export function ParticipantAvatarStack({
  currentCount,
  hostMemberId,
  participants,
}: ParticipantAvatarStackProps) {
  if (!participants?.length || participants.length !== currentCount) return null;

  const normalizedParticipants = participants.map((participant) => ({
    ...participant,
    memberId: participant.memberId.trim(),
    nickname: participant.nickname.trim(),
  }));
  const memberIds = new Set(normalizedParticipants.map(({ memberId }) => memberId));

  if (
    normalizedParticipants.some(({ memberId, nickname }) => !memberId || !nickname) ||
    memberIds.size !== normalizedParticipants.length
  ) {
    return null;
  }

  const hostIndex = normalizedParticipants.findIndex(({ memberId }) => memberId === hostMemberId);
  if (hostIndex < 0) return null;

  const host = normalizedParticipants[hostIndex];
  const orderedParticipants = [
    host,
    ...normalizedParticipants.filter((_, index) => index !== hostIndex),
  ];
  const visibleParticipants = orderedParticipants.slice(0, MAX_VISIBLE_PARTICIPANTS);
  const overflowCount = orderedParticipants.length - visibleParticipants.length;

  return (
    <ul
      aria-label={`현재 참여자 ${orderedParticipants.length}명`}
      className={styles.participantAvatarList}
    >
      {visibleParticipants.map((participant) => {
        const isHost = participant.memberId === hostMemberId;
        const accessibleName = isHost ? `${participant.nickname} (방장)` : participant.nickname;

        return (
          <li
            aria-label={accessibleName}
            className={styles.participantAvatarItem}
            key={participant.memberId}
          >
            <Avatar.Root
              aria-hidden
              className={isHost ? styles.hostParticipantAvatar : styles.participantAvatar}
              title={accessibleName}
            >
              {participant.imageUrl && (
                <Avatar.Image
                  alt=""
                  className={styles.participantAvatarImage}
                  src={participant.imageUrl}
                />
              )}
              <Avatar.Fallback className={styles.participantAvatarFallback}>
                {Array.from(participant.nickname)[0]}
              </Avatar.Fallback>
            </Avatar.Root>
          </li>
        );
      })}
      {overflowCount > 0 && (
        <li
          aria-label={`그 외 ${overflowCount}명`}
          className={`${styles.participantAvatarItem} ${styles.participantAvatarOverflow}`}
          title={`그 외 ${overflowCount}명`}
        >
          +{overflowCount}
        </li>
      )}
    </ul>
  );
}
