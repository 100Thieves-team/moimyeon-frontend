import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { RoomsResponse } from "@/api";
import * as styles from "./interview-discovery.css";

export type InterviewRoom = NonNullable<RoomsResponse["data"]>["rooms"][number];

function formatSchedule(schedule: InterviewRoom["schedule"]) {
  if (schedule === undefined) return "일정 정보 없음";

  const date = new Date(`${schedule.date}T00:00:00`);
  const dateLabel = Number.isNaN(date.getTime())
    ? schedule.date
    : new Intl.DateTimeFormat("ko-KR", {
        day: "numeric",
        month: "long",
        weekday: "short",
      }).format(date);

  return `${dateLabel} ${schedule.startTime} · ${schedule.durationMinutes}분`;
}

function getCompanyRoleLabel(room: InterviewRoom) {
  const labels = [room.company?.name, room.jobRole?.displayName].filter((label): label is string =>
    Boolean(label),
  );

  return labels.length > 0 ? labels.join(" · ") : "회사·직무 정보 없음";
}

export function InterviewCard({ room }: { room: InterviewRoom }) {
  const regionLabel = room.region?.label;

  return (
    <Link className={styles.card} href={`/interviews/${room.roomId}`}>
      <div className={styles.cardBadgeRow}>
        <div className={styles.cardMetaBadge}>
          {room.method === "OFFLINE" ? (
            <MapPin aria-hidden="true" size={13} strokeWidth={1.75} />
          ) : null}
          <span>{[room.methodLabel, regionLabel].filter(Boolean).join(" · ")}</span>
        </div>
        <div className={styles.cardBadges}>
          {room.recruit ? (
            <span
              className={
                room.recruit.recruitStatus === "RECRUITING"
                  ? styles.recruitingBadge
                  : styles.closedBadge
              }
            >
              {room.recruit.recruitStatusLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.cardMain}>
        <h3 className={styles.cardTitle}>{room.title}</h3>
        <p className={styles.cardDescription}>{getCompanyRoleLabel(room)}</p>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.cardFooterItem}>
          <CalendarDays aria-hidden="true" size={15} strokeWidth={1.75} />
          {formatSchedule(room.schedule)}
        </span>
        {room.recruit ? (
          <span className={styles.cardFooterItem}>
            <Users aria-hidden="true" size={15} strokeWidth={1.75} />
            {room.recruit.current}/{room.recruit.max}명
          </span>
        ) : null}
      </div>
    </Link>
  );
}
