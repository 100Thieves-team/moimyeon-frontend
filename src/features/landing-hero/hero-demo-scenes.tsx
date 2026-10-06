import {
  CalendarDays,
  Check,
  DoorOpen,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { iconSizes } from "@/styles/tokens";
import type { Frame } from "./hero-demo-timing";
import * as styles from "./hero-demo.css";

const DEMO_ROOM = {
  title: "삼성전자 SW개발 1차 직무면접 대비",
  place: "오프라인 · 서울 강남구",
  schedule: "10월 12일 (일) 14:00 · 90분",
  people: "3/4명",
};

const DEMO_PEER = {
  name: "차분한 라쿤",
  initial: "라",
  summary: "백엔드 3년차, 사내 플랫폼 API 개발",
};

const REVIEW_TAGS = [
  "질문이 날카로워요",
  "시간을 잘 지켜요",
  "준비가 성실해요",
  "피드백이 구체적이에요",
];

type SceneProps = { frame: Frame };

function Appear({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.appear} ${className ?? ""}`}>{children}</div>;
}

function MiniRoomCard({
  focused,
  people,
  place,
  title,
}: {
  focused?: boolean;
  people: string;
  place: string;
  title: string;
}) {
  return (
    <div className={styles.miniCard} data-focused={focused || undefined}>
      <span className={styles.miniMeta}>
        <MapPin size={iconSizes.sm} strokeWidth={1.75} />
        {place}
      </span>
      <span className={styles.miniTitle}>{title}</span>
      <span className={styles.miniMeta}>
        <Users size={iconSizes.sm} strokeWidth={1.75} />
        {people}
      </span>
    </div>
  );
}

function FindScene({ frame }: SceneProps) {
  return (
    <div className={styles.scene}>
      <div className={styles.searchBar}>
        <Search size={iconSizes.sm} strokeWidth={1.75} />
        {frame >= 1 ? "삼성" : "회사명 또는 공고명"}
      </div>
      <div className={styles.chipRow}>
        <span className={styles.chip} data-selected={frame >= 1 || undefined}>
          서버·백엔드
        </span>
        <span className={styles.chip}>1차</span>
        <span className={styles.chip}>오프라인</span>
      </div>
      <span className={styles.resultCount}>면접 {frame >= 1 ? 2 : 9}</span>
      <div className={styles.cardStack}>
        <MiniRoomCard
          focused={frame >= 2}
          people={DEMO_ROOM.people}
          place={DEMO_ROOM.place}
          title={DEMO_ROOM.title}
        />
        <div className={styles.wideOnly}>
          <MiniRoomCard people="2/5명" place="온라인" title="삼성SDS 백엔드 직무면접 연습" />
        </div>
      </div>
      {frame >= 3 ? (
        <Appear className={`${styles.hint} ${styles.wideOnly}`}>면접 상세로 이동 →</Appear>
      ) : null}
    </div>
  );
}

function ApplyScene({ frame }: SceneProps) {
  const status = frame >= 3 ? "confirmed" : frame >= 2 ? "pending" : "idle";

  return (
    <div className={styles.scene}>
      <span className={styles.miniMeta}>
        <MapPin size={iconSizes.sm} strokeWidth={1.75} />
        {DEMO_ROOM.place}
      </span>
      <span className={styles.sceneTitle}>{DEMO_ROOM.title}</span>
      <span className={styles.miniMeta}>
        <CalendarDays size={iconSizes.sm} strokeWidth={1.75} />
        {DEMO_ROOM.schedule} · {DEMO_ROOM.people}
      </span>
      <p className={`${styles.notice} ${styles.wideOnly}`}>
        신청할 땐 본인의 이력서를 첨부해야 해요.
      </p>
      {frame >= 1 ? (
        <Appear className={styles.fileRow}>
          <FileText size={iconSizes.sm} strokeWidth={1.75} />
          <span className={styles.fileName}>백엔드_이력서.pdf</span>
          <span className={styles.fileDone}>
            <Check size={iconSizes.sm} strokeWidth={2} />
            첨부됨
          </span>
        </Appear>
      ) : null}
      <span className={styles.applyButton} data-status={status}>
        {status === "confirmed" ? (
          <>
            <Check size={iconSizes.sm} strokeWidth={2} />
            참여 확정
          </>
        ) : status === "pending" ? (
          "수락 대기"
        ) : (
          "참가 신청하기"
        )}
      </span>
      {frame >= 3 ? <Appear className={styles.toast}>방장이 참가 신청을 수락했어요.</Appear> : null}
    </div>
  );
}

function RoomScene({ frame }: SceneProps) {
  return (
    <div className={styles.scene}>
      <div className={styles.roomHeader}>
        <span className={styles.miniMeta}>
          <DoorOpen size={iconSizes.sm} strokeWidth={1.75} />
          면접 룸 · 참여 확정 3명
        </span>
        <span className={styles.avatarStack}>
          <span className={styles.avatar}>{DEMO_PEER.initial}</span>
          <span className={styles.avatar}>수</span>
          <span className={styles.avatar}>나</span>
        </span>
      </div>
      {frame >= 1 ? (
        <Appear className={styles.personRow}>
          <span className={styles.avatar}>{DEMO_PEER.initial}</span>
          <span className={styles.personText}>
            <span className={styles.personName}>{DEMO_PEER.name}</span>
            <span className={styles.personSummary}>이력서 요약 · {DEMO_PEER.summary}</span>
          </span>
        </Appear>
      ) : null}
      {frame >= 2 ? (
        <Appear className={styles.comment}>
          <span className={styles.personName}>방장</span>
          일요일 2시, 강남역 스터디룸에서 봬요!
        </Appear>
      ) : null}
      {frame >= 3 ? (
        <Appear className={styles.myComment}>네! 1분 자기소개 준비해 갈게요.</Appear>
      ) : null}
    </div>
  );
}

function ReviewScene({ frame }: SceneProps) {
  return (
    <div className={styles.scene}>
      <span className={styles.sceneTitle}>면접이 끝났어요</span>
      <span className={styles.notice}>{DEMO_PEER.name}님은 어땠나요?</span>
      <div className={styles.chipRow}>
        {REVIEW_TAGS.map((tag, index) => (
          <span className={styles.chip} data-selected={frame > index || undefined} key={tag}>
            {tag}
          </span>
        ))}
      </div>
      {frame >= 3 ? (
        <Appear className={styles.trustCard}>
          <span className={styles.miniMeta}>
            <ShieldCheck size={iconSizes.sm} strokeWidth={1.75} />
            {DEMO_PEER.name}님의 신뢰 정보
          </span>
          <div className={styles.chipRow}>
            <span className={styles.trustChip}>최근 3회 모두 출석</span>
            <span className={styles.trustChip}>활동률 상위 12%</span>
          </div>
        </Appear>
      ) : null}
    </div>
  );
}

export const SCENE_COMPONENTS = {
  find: FindScene,
  apply: ApplyScene,
  room: RoomScene,
  review: ReviewScene,
} satisfies Record<string, (props: SceneProps) => ReactNode>;

export type SceneKey = keyof typeof SCENE_COMPONENTS;
