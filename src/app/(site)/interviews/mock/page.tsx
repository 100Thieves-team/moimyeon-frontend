import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MOCK_INTERVIEW_DETAIL_SCENARIOS,
  type MockInterviewDetailCategory,
} from "@/features/interview-detail/interview-detail-mock";
import { MOCK_REVIEW_ROOM_ID } from "@/features/review/review-mock";
import * as styles from "./page.css";

export const metadata: Metadata = {
  title: "면접 상세 UI 상태",
};

const categories: MockInterviewDetailCategory[] = [
  "신청 CTA",
  "나와의 관계",
  "면접 상태",
  "신청 제한",
  "응답 이상",
];

export default function InterviewDetailMockPage() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.NEXT_PUBLIC_MOCK_INTERVIEW_DISCOVERY !== "true"
  ) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Development only</p>
        <h1 className={styles.title}>면접 상세 UI 상태</h1>
        <p className={styles.description}>
          서버가 내려주는 조회자 사실과 면접 상태를 조합한 UI 변형입니다. 항목을 선택하면 실제 면접
          상세 화면에서 확인할 수 있습니다.
        </p>
      </header>

      <div className={styles.sections}>
        {categories.map((category) => (
          <section className={styles.section} key={category}>
            <h2 className={styles.sectionTitle}>{category}</h2>
            <ul className={styles.grid}>
              {MOCK_INTERVIEW_DETAIL_SCENARIOS.filter(
                (scenario) => scenario.category === category,
              ).map((scenario) => (
                <li key={scenario.key}>
                  <Link className={styles.card} href={`/interviews/${scenario.room.roomId}`}>
                    <strong className={styles.cardTitle}>{scenario.label}</strong>
                    <span className={styles.cardDescription}>{scenario.description}</span>
                    <span className={styles.cardAction}>상세 화면 보기</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>후기 화면</h2>
          <ul className={styles.grid}>
            <li>
              <Link className={styles.card} href={`/interviews/${MOCK_REVIEW_ROOM_ID}/review`}>
                <strong className={styles.cardTitle}>기존 후기 수정과 신규 작성</strong>
                <span className={styles.cardDescription}>
                  제출한 후기 2건의 프리필과 작성 가능한 대상 2명, 공개 신뢰 카드를 함께 확인할 수
                  있습니다.
                </span>
                <span className={styles.cardAction}>후기 화면 보기</span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
