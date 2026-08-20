"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, LinkButton } from "@/components/button";
import type { MockInterview } from "./mock-data";
import * as styles from "./interview-mock.css";

function safeReturnTo(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export function InterviewDetail({ interview }: { interview: MockInterview }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo") ?? "/");
  const isPending =
    searchParams.get("application") === "pending" || interview.relation === "pending";
  const progress = Math.min(
    100,
    Math.round((interview.currentParticipants / interview.maxParticipants) * 100),
  );
  const applyHref = `/interviews/${interview.id}/apply?returnTo=${encodeURIComponent(returnTo)}`;

  const cancelApplication = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("application", "withdrawn");
    router.replace(`/interviews/${interview.id}?${next.toString()}`);
  };

  return (
    <main className={styles.detailPage}>
      <article className={styles.detail}>
        <Link className={styles.backLink} href={returnTo}>
          <ArrowLeft aria-hidden="true" size={16} /> 면접 탐색으로
        </Link>

        <header className={styles.detailHero}>
          <span className={`${styles.statusBadge} ${styles.leadingStatusBadge}`}>모집 중</span>
          <h1 className={styles.detailTitle}>{interview.title}</h1>
          <p className={styles.detailSubcopy}>
            {interview.company} · {interview.jobRoleLabel} · {interview.jobPosting}
          </p>
          <div
            aria-label={`${interview.currentParticipants}명 참여 중`}
            className={styles.avatarStack}
          >
            {Array.from({ length: interview.currentParticipants }, (_, index) => (
              <span aria-hidden="true" className={styles.smallAvatar} key={index}>
                {["여", "곰", "사", "수", "고"][index]}
              </span>
            ))}
          </div>
        </header>

        <section aria-label="면접 정보" className={styles.informationGrid}>
          <div className={styles.informationItem}>
            <span className={styles.informationLabel}>일정 · 소요 시간</span>
            <strong className={styles.informationValue}>
              {interview.dateLabel} {interview.timeLabel} · {interview.duration}
            </strong>
          </div>
          <div className={styles.informationItem}>
            <span className={styles.informationLabel}>진행 방식</span>
            <strong className={styles.informationValue}>
              {interview.methodLabel} · {interview.region}
            </strong>
          </div>
          <div className={styles.informationItem}>
            <span className={styles.informationLabel}>모집 현황</span>
            <strong className={styles.informationValue}>
              {interview.currentParticipants} / {interview.maxParticipants}명 · 최소{" "}
              {interview.minParticipants}명
            </strong>
            <span aria-hidden="true" className={styles.progressTrack}>
              <span className={styles.progressValue} style={{ width: `${progress}%` }} />
            </span>
          </div>
        </section>

        <div className={styles.detailColumns}>
          <div className={styles.detailBody}>
            <section className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>면접 소개</h2>
              <p className={styles.detailCopy}>{interview.introduction}</p>
            </section>
            <section className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>참여 전 확인해 주세요</h2>
              <ul className={styles.noteList}>
                {interview.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside aria-label="방장 정보" className={styles.hostCard}>
            <div className={styles.hostHead}>
              <span aria-hidden="true" className={styles.hostAvatar}>
                여
              </span>
              <span className={styles.hostName}>
                {interview.host.nickname}
                <span className={styles.hostStat}>
                  완료한 면접 {interview.host.completedInterviews}회 · 방장
                </span>
              </span>
            </div>
            <p className={styles.detailCopy}>{interview.host.bio}</p>
            <div aria-label="받은 후기" className={styles.reviewTags}>
              {interview.host.reviewTags.map((tag) => (
                <span className={styles.reviewTag} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </article>

      <div className={styles.actionBar}>
        {isPending ? (
          <>
            <span className={styles.actionCopy}>
              <strong className={styles.actionTitle}>방장의 수락을 기다리고 있어요</strong>
              <span className={styles.actionDescription}>
                수락되면 알림을 보내고 댓글에 들어갈 수 있어요.
              </span>
            </span>
            <Button onClick={cancelApplication} variant="secondary">
              신청 취소하기
            </Button>
          </>
        ) : interview.relation === "participant" ? (
          <>
            <span className={styles.actionCopy}>
              <strong className={styles.actionTitle}>참여가 확정된 면접이에요</strong>
              <span className={styles.actionDescription}>
                댓글에서 일정과 준비 사항을 확인해 보세요.
              </span>
            </span>
            <LinkButton href={`/interviews/${interview.id}/comments`}>댓글 열기</LinkButton>
          </>
        ) : interview.relation === "host" ? (
          <>
            <span className={styles.actionCopy}>
              <strong className={styles.actionTitle}>내가 만든 면접이에요</strong>
              <span className={styles.actionDescription}>
                내 면접에서 참여 상태를 확인할 수 있어요.
              </span>
            </span>
            <LinkButton href="/my-interviews">내 면접 보기</LinkButton>
          </>
        ) : (
          <>
            <span className={styles.actionCopy}>
              <strong className={styles.actionTitle}>
                {interview.maxParticipants - interview.currentParticipants}자리 남았어요
              </strong>
              <span className={styles.actionDescription}>
                방장이 신청 내용을 확인한 뒤 참여를 확정해요.
              </span>
            </span>
            <LinkButton href={applyHref}>참가 신청하기</LinkButton>
          </>
        )}
      </div>
    </main>
  );
}
