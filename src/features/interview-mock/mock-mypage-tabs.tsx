"use client";

import { Toast } from "@base-ui/react/toast";
import { FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { useMockFlow } from "./mock-flow-store";
import * as styles from "./mock-flow.css";

const receivedReviews = [
  {
    id: "review-1",
    message: "꼬리질문이 날카로워서 실전 같았어요. 덕분에 약점을 정확히 알았어요.",
    tag: "피드백이 구체적이에요",
  },
  {
    id: "review-2",
    message: "핵심을 먼저 설명해 주셔서 질문의 의도를 빠르게 이해했어요.",
    tag: "설명이 명확해요",
  },
  { id: "review-3", message: "긴장을 풀어주는 진행이 좋았어요.", tag: "분위기를 편하게 해요" },
  {
    id: "review-4",
    message: "시간 배분이 정확해서 실제 면접처럼 집중할 수 있었어요.",
    tag: "시간을 잘 지켜요",
  },
  {
    id: "review-5",
    message: "답변을 끝까지 듣고 필요한 부분만 되물어 봐주셨어요.",
    tag: "소통이 원활해요",
  },
  {
    id: "review-6",
    message: "실제 장애 사례를 묻는 질문이 특히 도움이 됐어요.",
    tag: "질문이 날카로워요",
  },
  {
    id: "review-7",
    message: "메모를 근거로 피드백해 주셔서 이해하기 쉬웠어요.",
    tag: "피드백이 구체적이에요",
  },
  { id: "review-8", message: "면접 순서를 자연스럽게 이끌어 주셨어요.", tag: "진행이 매끄러워요" },
  {
    id: "review-9",
    message: "답변의 장점과 보완점을 균형 있게 알려주셨어요.",
    tag: "설명이 명확해요",
  },
  { id: "review-10", message: "준비한 질문이 모두 실전적이었어요.", tag: "준비가 성실해요" },
  {
    id: "review-11",
    message: "다음에 연습할 방향까지 제안해 주셨어요.",
    tag: "피드백이 구체적이에요",
  },
] as const;

export function MockResumeManager() {
  const { addResume, completeResumeSummary, deleteResume, resumes, setDefaultResume } =
    useMockFlow();
  const toastManager = Toast.useToastManager();

  const upload = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > 10 * 1024 * 1024) {
      toastManager.add({ title: "10MB 이하의 PDF 파일만 올릴 수 있어요" });
      return;
    }
    const id = `resume-${Date.now()}`;
    addResume({
      fileName: file.name,
      id,
      isDefault: false,
      meta: `방금 올림 · ${Math.max(1, Math.round(file.size / 1024))}KB`,
      status: "processing",
      summary: "AI 요약을 만들고 있어요 — 잠깐이면 돼요",
    });
    window.setTimeout(() => {
      completeResumeSummary(
        id,
        "프로젝트 성과와 기술 선택의 근거가 잘 드러나는 백엔드 이력서예요.",
      );
    }, 1200);
  };

  return (
    <section className={styles.stack}>
      <div className={styles.resumeTable}>
        {resumes.map((resume) => (
          <article
            className={`${styles.resumeMockRow} ${resume.status === "processing" ? styles.processingRow : ""}`}
            key={resume.id}
          >
            <div className={styles.inline}>
              <FileText aria-hidden="true" size={18} />
              <span className={styles.resumeCopy}>
                <strong className={styles.questionTitle}>{resume.fileName}</strong>
                <span className={styles.personMeta}>{resume.meta}</span>
              </span>
              {resume.isDefault ? (
                <span className={`${styles.badge} ${styles.accentBadge}`}>기본</span>
              ) : null}
            </div>
            <p className={styles.resumeSummary}>AI 요약 — {resume.summary}</p>
            <div className={styles.actions}>
              {!resume.isDefault ? (
                <Button
                  disabled={resume.status === "processing"}
                  onClick={() => setDefaultResume(resume.id)}
                  size="sm"
                  variant="secondary"
                >
                  기본으로 지정
                </Button>
              ) : null}
              <Button
                disabled={resume.isDefault}
                onClick={() => {
                  deleteResume(resume.id);
                  toastManager.add({ title: "이력서를 삭제했어요" });
                }}
                size="sm"
                variant="ghost"
              >
                삭제
              </Button>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.actions}>
        <label className={styles.uploadLabel}>
          이력서 업로드
          <input
            accept="application/pdf,.pdf"
            className={styles.uploadInput}
            onChange={(event) => {
              upload(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
            type="file"
          />
        </label>
      </div>
      <p className={styles.personMeta}>
        최대 5개 · PDF 10MB · 삭제해도 이미 보낸 신청에는 영향이 없어요.
      </p>
    </section>
  );
}

export function MockActivityReviews() {
  const { reportReview, reportedReviewIds } = useMockFlow();
  const [expanded, setExpanded] = useState(false);
  const visibleReviews = expanded ? receivedReviews : receivedReviews.slice(0, 3);

  return (
    <section className={styles.stack}>
      <div className={styles.inline}>
        <span className={`${styles.badge} ${styles.accentBadge}`}>피드백이 구체적이에요 7</span>
        <span className={`${styles.badge} ${styles.accentBadge}`}>소통이 원활해요 5</span>
        <span className={`${styles.badge} ${styles.accentBadge}`}>시간을 잘 지켜요 4</span>
      </div>
      <div className={styles.resumeTable}>
        <header className={styles.resumeMockRow}>
          <h2 className={styles.sectionTitle}>받은 후기</h2>
          <strong>11개</strong>
        </header>
        {visibleReviews.map((review) => {
          const reported = reportedReviewIds.includes(review.id);
          return (
            <article className={styles.reviewMockRow} key={review.id}>
              <span className={`${styles.badge} ${styles.hostBadge}`}>{review.tag}</span>
              <p className={styles.sectionCopy}>{review.message}</p>
              <button
                className={styles.textButton}
                disabled={reported}
                onClick={() => reportReview(review.id)}
                type="button"
              >
                {reported ? "신고됨" : "신고"}
              </button>
            </article>
          );
        })}
        {!expanded ? (
          <Button onClick={() => setExpanded(true)} variant="ghost">
            후기 8개 더 보기
          </Button>
        ) : null}
      </div>
      <p className={styles.personMeta}>
        후기 작성자는 공개하지 않으며 새 후기는 3시간 뒤 반영돼요.
      </p>
    </section>
  );
}
