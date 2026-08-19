"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { JobRoleGroup } from "@/features/mypage/mypage-model";
import type {
  InterviewCreateFormValues,
  Regions,
  Resumes,
  RoomFormOptions,
} from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

type EditableStep = "interview-info" | "introduction-and-resume" | "method-and-schedule";

type FinalReviewStepProps = {
  jobRoleGroups: JobRoleGroup[];
  onEdit: (step: EditableStep) => void;
  options: RoomFormOptions;
  regions: Regions;
  resumes: Resumes;
  submitError: string | null;
};

type SummaryRowProps = {
  label: string;
  onEdit: () => void;
  value: string;
};

function SummaryRow({ label, onEdit, value }: SummaryRowProps) {
  return (
    <div className={styles.reviewRow}>
      <span className={styles.reviewLabel}>{label}</span>
      <span className={styles.reviewValue}>{value}</span>
      <button className={styles.reviewEdit} onClick={onEdit} type="button">
        수정하기
      </button>
    </div>
  );
}

function formatSchedule({
  date,
  durationMinutes,
  startTime,
}: InterviewCreateFormValues["schedule"]) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = startTime.split(":").map(Number);
  const scheduleDate = new Date(year, month - 1, day, hour, minute);

  if (Number.isNaN(scheduleDate.getTime())) {
    return `${date} ${startTime} · ${durationMinutes}분`;
  }

  const dateLabel = new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "long",
    weekday: "short",
    year: "numeric",
  }).format(scheduleDate);
  const timeLabel = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
  }).format(scheduleDate);

  return `${dateLabel} ${timeLabel} · ${durationMinutes}분`;
}

export function FinalReviewStep({
  jobRoleGroups,
  onEdit,
  options,
  regions,
  resumes,
  submitError,
}: FinalReviewStepProps) {
  const { control, getValues } = useFormContext<InterviewCreateFormValues>();
  useWatch({ control });
  const values = getValues();
  const posting = values.posting;
  const jobRole = jobRoleGroups
    .flatMap((group) => group.roles)
    .find((role) => role.jobRoleId === values.jobRoleId);
  const round = options.rounds.find((item) => item.code === values.round);
  const type = options.types.find((item) => item.code === values.type);
  const method = options.methods.find((item) => item.code === values.method);
  const sigungu = regions.sidos
    .flatMap((sido) => sido.sigungus.map((item) => ({ ...item, sidoShortName: sido.shortName })))
    .find((item) => item.sigunguId === values.sigunguId);
  const resume = resumes.resumes.find((item) => item.resumeId === values.resumeId);
  const aiSummary =
    resume?.aiSummary?.status === "DONE" && resume.aiSummary.text
      ? resume.aiSummary.text
      : resume?.aiSummary?.status === "PROCESSING"
        ? "AI 요약을 만들고 있어요 — 잠깐이면 돼요."
        : resume?.aiSummary?.status === "FAILED"
          ? "AI 요약을 만들지 못했어요. 이력서는 그대로 사용할 수 있어요."
          : "AI 요약 정보가 아직 없어요. 이력서는 그대로 사용할 수 있어요.";
  const methodLabel =
    values.method === "OFFLINE" && sigungu
      ? `${method?.label ?? "오프라인"} · ${sigungu.sidoShortName} ${sigungu.name}`
      : (method?.label ?? values.method);

  return (
    <div className={styles.reviewStack}>
      <section className={styles.reviewCard}>
        <SummaryRow
          label="회사 · 공고"
          onEdit={() => onEdit("interview-info")}
          value={
            posting
              ? `[${posting.company?.name ?? "회사 정보 없음"}] ${posting.postingName}`
              : "선택되지 않음"
          }
        />
        <SummaryRow
          label="직무"
          onEdit={() => onEdit("interview-info")}
          value={jobRole?.displayName ?? "선택되지 않음"}
        />
        <SummaryRow
          label="면접"
          onEdit={() => onEdit("interview-info")}
          value={[round?.label, type?.label].filter(Boolean).join(" · ")}
        />
        <SummaryRow
          label="진행 방식"
          onEdit={() => onEdit("method-and-schedule")}
          value={methodLabel}
        />
        <SummaryRow
          label="모집 인원"
          onEdit={() => onEdit("method-and-schedule")}
          value={`최소 ${values.minParticipants}명 · 최대 ${values.maxParticipants}명`}
        />
        <SummaryRow
          label="진행 일정"
          onEdit={() => onEdit("method-and-schedule")}
          value={formatSchedule(values.schedule)}
        />
        <SummaryRow
          label="이력서 원본"
          onEdit={() => onEdit("introduction-and-resume")}
          value={values.resumePublic ? "참여가 확정된 사람끼리 공유" : "AI 요약만 공유"}
        />
        <div className={styles.reviewSummary}>
          <span className={styles.reviewSummaryLabel}>AI 요약 · 신청자에게 함께 보여요</span>
          <p className={styles.reviewSummaryText}>{aiSummary}</p>
        </div>
      </section>

      {submitError ? (
        <p className={styles.submitError} role="alert">
          {submitError}
        </p>
      ) : null}
    </div>
  );
}
