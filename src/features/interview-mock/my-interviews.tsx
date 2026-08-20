"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, LinkButton } from "@/components/button";
import { mockInterviews, mockScenarioInterviews, type MockInterview } from "./mock-data";
import { useMockFlow } from "./mock-flow-store";
import * as styles from "./interview-mock.css";

type InterviewTab = "all" | "completed" | "pending" | "upcoming";

const tabItems: { label: string; value: InterviewTab }[] = [
  { label: "전체", value: "all" },
  { label: "신청 중 1", value: "pending" },
  { label: "예정 1", value: "upcoming" },
  { label: "완료 2", value: "completed" },
];

function isInterviewTab(value: string | null): value is InterviewTab {
  return tabItems.some((item) => item.value === value);
}

function InterviewRow({
  actions,
  badge,
  badgeClassName,
  interview,
  meta,
}: {
  actions: React.ReactNode;
  badge: string;
  badgeClassName?: string;
  interview: MockInterview;
  meta: string;
}) {
  return (
    <article className={styles.myInterviewCard}>
      <span className={`${styles.stateBadge} ${badgeClassName ?? ""}`}>{badge}</span>
      <div className={styles.myInterviewMain}>
        <h3 className={styles.summaryTitle}>{interview.title}</h3>
        <p className={styles.inlineMeta}>
          {interview.dateLabel} {interview.timeLabel} · {meta}
        </p>
      </div>
      <div className={styles.myInterviewActions}>{actions}</div>
    </article>
  );
}

export function MyInterviews() {
  const { rooms } = useMockFlow();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = isInterviewTab(tabParam) ? tabParam : "all";
  const application = searchParams.get("application") ?? "pending";
  const review = searchParams.get("review");
  const pendingInterview = mockInterviews[0];
  const upcomingInterview = mockScenarioInterviews.confirmedParticipant;
  const completedInterview = mockScenarioInterviews.completed;
  const reviewedInterview = mockInterviews[3];
  const showPending = application !== "withdrawn";
  const currentPage = `/my-interviews${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`;

  const replaceParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set(key, value);
    router.replace(`/my-interviews?${next.toString()}`);
  };

  const groups = {
    pending: showPending ? (
      <section className={styles.interviewGroup}>
        <h2 className={styles.groupTitle}>신청 중</h2>
        <InterviewRow
          actions={
            <>
              <Button
                onClick={() => replaceParam("application", "withdrawn")}
                size="sm"
                variant="ghost"
              >
                신청 취소
              </Button>
              <LinkButton
                href={`/interviews/${pendingInterview.id}?application=pending&returnTo=${encodeURIComponent(currentPage)}`}
                size="sm"
                variant="secondary"
              >
                면접 정보
              </LinkButton>
            </>
          }
          badge="방장 확인 중"
          interview={pendingInterview}
          meta="든든한곰_이력서.pdf"
        />
      </section>
    ) : (
      <div className={styles.emptyGroup}>신청 중인 면접이 없어요.</div>
    ),
    upcoming: (
      <section className={styles.interviewGroup}>
        <h2 className={styles.groupTitle}>예정 · 운영 중</h2>
        <InterviewRow
          actions={
            <>
              <LinkButton
                href={`/interviews/${mockScenarioInterviews.hostRecruiting.id}/applications`}
                size="sm"
                variant="secondary"
              >
                신청 관리
              </LinkButton>
              <LinkButton
                href={`/interviews/${mockScenarioInterviews.hostRecruiting.id}`}
                size="sm"
              >
                면접 정보
              </LinkButton>
            </>
          }
          badge={
            rooms[mockScenarioInterviews.hostRecruiting.id]?.phase === "confirmed"
              ? "진행 확정"
              : "내가 만든 면접"
          }
          badgeClassName={styles.confirmedBadge}
          interview={mockScenarioInterviews.hostRecruiting}
          meta="참가 신청 2건 · 4 / 5명"
        />
        <InterviewRow
          actions={
            <LinkButton
              href={`/interviews/${mockScenarioInterviews.hostShortStaffed.id}`}
              size="sm"
              variant="secondary"
            >
              면접 정보
            </LinkButton>
          }
          badge="인원 확인 필요"
          interview={mockScenarioInterviews.hostShortStaffed}
          meta="2 / 5명 · 최소 3명"
        />
        <InterviewRow
          actions={
            <>
              <LinkButton
                href={`/interviews/${upcomingInterview.id}/participants`}
                size="sm"
                variant="secondary"
              >
                참여자
              </LinkButton>
              <LinkButton href={`/interviews/${upcomingInterview.id}/prepare`} size="sm">
                진행 준비
              </LinkButton>
            </>
          }
          badge="참여 확정 · D-3"
          badgeClassName={styles.confirmedBadge}
          interview={upcomingInterview}
          meta="참여자 4명 · 질문 준비 중"
        />
        <InterviewRow
          actions={
            <LinkButton
              href={`/interviews/${mockScenarioInterviews.hostToday.id}/prepare`}
              size="sm"
            >
              면접 시작 준비
            </LinkButton>
          }
          badge="오늘 진행"
          badgeClassName={styles.confirmedBadge}
          interview={mockScenarioInterviews.hostToday}
          meta="오늘 오후 7:00 · 방장"
        />
      </section>
    ),
    completed: (
      <section className={styles.interviewGroup}>
        <h2 className={styles.groupTitle}>완료</h2>
        <InterviewRow
          actions={
            <LinkButton
              href={`/interviews/${completedInterview.id}/reviews${review === "submitted" ? "?review=submitted" : ""}`}
              size="sm"
              variant={review === "submitted" ? "secondary" : "primary"}
            >
              {review === "submitted" ? "남긴 후기 보기" : "후기 남기기"}
            </LinkButton>
          }
          badge="완료"
          badgeClassName={styles.completedBadge}
          interview={completedInterview}
          meta="7월 29일 완료"
        />
        <InterviewRow
          actions={
            <LinkButton
              href={`/interviews/${reviewedInterview.id}/reviews?review=submitted`}
              size="sm"
              variant="secondary"
            >
              남긴 후기 보기
            </LinkButton>
          }
          badge="완료"
          badgeClassName={styles.completedBadge}
          interview={reviewedInterview}
          meta="8월 1일 완료"
        />
      </section>
    ),
  };

  return (
    <main className={styles.narrowPage}>
      <div className={styles.myInterviewColumn}>
        <header className={styles.pageHeading}>
          <h1 className={styles.pageTitle}>내 면접</h1>
          <p className={styles.pageDescription}>신청한 면접과 앞으로의 일정을 한곳에서 확인해요.</p>
        </header>

        <Tabs.Root
          onValueChange={(nextValue) => replaceParam("tab", String(nextValue))}
          value={tab}
        >
          <Tabs.List aria-label="내 면접 상태" className={styles.tabsList}>
            {tabItems.map((item) => (
              <Tabs.Tab className={styles.tab} key={item.value} value={item.value}>
                {item.value === "pending" ? `신청 중 ${showPending ? 1 : 0}` : item.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <Tabs.Panel className={styles.tabPanel} value="all">
            {groups.pending}
            {groups.upcoming}
            {groups.completed}
          </Tabs.Panel>
          <Tabs.Panel className={styles.tabPanel} value="pending">
            {groups.pending}
          </Tabs.Panel>
          <Tabs.Panel className={styles.tabPanel} value="upcoming">
            {groups.upcoming}
          </Tabs.Panel>
          <Tabs.Panel className={styles.tabPanel} value="completed">
            {groups.completed}
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </main>
  );
}
