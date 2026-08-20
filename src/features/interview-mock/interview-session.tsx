"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Toast } from "@base-ui/react/toast";
import { Toggle } from "@base-ui/react/toggle";
import { Check, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { mockParticipants, type MockInterview } from "./mock-data";
import { useMockFlow } from "./mock-flow-store";
import * as styles from "./mock-flow.css";

type Note = { author: string; id: string; tag?: "good" | "improve"; text: string };
type SessionQuestion = { id: string; source: string; text: string };
type TextFormValues = { text: string };

const sessionQuestions: SessionQuestion[] = [
  { id: "intro", source: "공통", text: "간단히 자기소개해 주세요" },
  {
    id: "payment",
    source: "이력서 기반",
    text: "결제 연동에서 이중 결제를 막기 위해 어떤 처리를 했나요?",
  },
  {
    id: "consistency",
    source: "이력서 기반",
    text: "주문·결제 데이터 정합성이 깨졌을 때 어떻게 찾고 복구했나요?",
  },
  { id: "coupon", source: "시스템 설계", text: "선착순 쿠폰 발급 시스템을 설계해 주세요" },
  {
    id: "incident",
    source: "진행 중 추가",
    text: "PG 장애가 났을 때 주문 흐름을 어떻게 격리하나요?",
  },
];

const feedbackDraft =
  "결제 도메인 이해가 탄탄하고 설명 구조가 좋아요. 다만 복구·보상 이야기가 추상적이라, 실제 장애 사례 하나를 수치와 함께 준비하면 2차에서 설득력이 확 올라갈 거예요.";

function SessionRail({
  interview,
  stage,
  targetId,
}: {
  interview: MockInterview;
  stage: string;
  targetId: string;
}) {
  const router = useRouter();
  const move = (target: string, nextStage = stage) =>
    router.replace(`/interviews/${interview.id}/session?stage=${nextStage}&target=${target}`);
  return (
    <nav aria-label="면접 진행 단계" className={styles.progressRail}>
      {mockParticipants.slice(1).map((person) => (
        <button
          className={styles.progressButton}
          data-active={targetId === person.id}
          key={person.id}
          onClick={() => move(person.id)}
          type="button"
        >
          {person.nickname}
        </button>
      ))}
      <button
        className={styles.progressButton}
        data-active={targetId === "closing"}
        onClick={() => move("closing", "closing")}
        type="button"
      >
        클로징
      </button>
    </nav>
  );
}

function CoachMarks({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const copy = [
    ["질문은 카드로 남겨요", "준비해 온 카드에 이어, 떠오른 질문도 바로 카드가 돼요."],
    ["기록과 태그를 함께 남겨요", "들리는 대로 메모하고 좋았어요·아쉬워요 태그로 정리해요."],
    [
      "마지막에는 피드백을 정리해요",
      "질문별 기록을 확인하고 면접자에게 전할 최종 피드백을 남겨요.",
    ],
  ][step - 1];
  return (
    <>
      <div className={styles.coachBackdrop} />
      <div aria-hidden="true" className={styles.coachSpotlight} />
      <dialog aria-labelledby="coach-title" className={styles.coachCard} open>
        <span className={styles.questionMeta}>{step} / 3</span>
        <h2 className={styles.coachTitle} id="coach-title">
          {copy[0]}
        </h2>
        <p className={styles.coachCopy}>{copy[1]}</p>
        <div className={styles.actions}>
          <button className={styles.coachSkipButton} onClick={onClose} type="button">
            건너뛰기
          </button>
          <Button
            className={styles.coachNextButton}
            onClick={() => (step === 3 ? onClose() : setStep((value) => value + 1))}
            size="sm"
            variant="secondary"
          >
            {step === 3 ? "시작하기" : "다음"}
          </Button>
        </div>
      </dialog>
    </>
  );
}

function InterviewStage({ isMe }: { isMe: boolean }) {
  const toastManager = Toast.useToastManager();
  const [asked, setAsked] = useState(() => new Set(["intro", "payment"]));
  const [questions, setQuestions] = useState<SessionQuestion[]>([...sessionQuestions]);
  const [notes, setNotes] = useState<Note[]>([
    { author: "곰", id: "note-1", tag: "good", text: "장애 시나리오부터 짚고 시작 — 구조 좋음" },
    { author: "여", id: "note-2", text: "멱등키 저장 위치까지 설명 — 꼬리로 파볼 만해요" },
    {
      author: "곰",
      id: "note-3",
      tag: "improve",
      text: "보상 트랜잭션 설명이 추상적, 구체 사례 없음",
    },
  ]);
  const questionForm = useForm<TextFormValues>({ defaultValues: { text: "" } });
  const noteForm = useForm<TextFormValues>({ defaultValues: { text: "" } });

  if (isMe) {
    return (
      <div className={styles.centeredState}>
        <span className={`${styles.badge} ${styles.accentBadge}`}>내 차례</span>
        <h1 className={styles.centeredTitle}>지금은 내 면접 시간이에요</h1>
      </div>
    );
  }

  return (
    <div className={styles.sessionContent}>
      <section className={styles.sessionMain}>
        <Form
          className={styles.compactForm}
          onSubmit={questionForm.handleSubmit(({ text }) => {
            const value = text.trim();
            if (!value) return;
            setQuestions((items) => [
              ...items,
              { id: `live-${Date.now()}`, source: "진행 중 추가", text: value },
            ]);
            questionForm.reset();
          })}
        >
          <Controller
            control={questionForm.control}
            name="text"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Field.Root invalid={fieldState.invalid} name={field.name}>
                <Field.Label className={styles.textLabel}>
                  떠오른 질문을 바로 적어요 — 즉석 질문도 카드가 돼요
                </Field.Label>
                <Field.Control
                  className={styles.input}
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  placeholder="질문을 바로 적어요"
                  ref={field.ref}
                  value={field.value}
                />
              </Field.Root>
            )}
          />
          <Button type="submit">질문 추가</Button>
        </Form>
        {questions.map((question) => {
          const checked = asked.has(question.id);
          return (
            <article className={styles.questionCard} key={question.id}>
              <div className={styles.questionHead}>
                <div className={styles.inline}>
                  <Toggle
                    aria-label={`${question.text} 질문함`}
                    className={styles.ratingButton}
                    onPressedChange={(pressed) =>
                      setAsked((current) => {
                        const next = new Set(current);
                        if (pressed) next.add(question.id);
                        else next.delete(question.id);
                        return next;
                      })
                    }
                    pressed={checked}
                  >
                    {checked ? <Check aria-hidden="true" size={16} /> : null}
                  </Toggle>
                  <div className={styles.personMain}>
                    <span className={styles.questionMeta}>{question.source}</span>
                    <h2 className={styles.questionTitle}>{question.text}</h2>
                  </div>
                </div>
                <span className={styles.questionMeta}>
                  {checked ? "질문했어요" : "아직 안 했어요"}
                </span>
              </div>
              {question.id === "consistency" ? (
                <ul className={styles.tailList}>
                  <li>정합성 검증 배치는 어떤 주기로 돌렸나요? · 질문함</li>
                  <li>실시간 검증으로 바꾼다면 어디부터 손대나요?</li>
                </ul>
              ) : null}
            </article>
          );
        })}
      </section>
      <aside className={styles.recordPanel}>
        <h2 className={styles.sectionTitle}>기록</h2>
        <p className={styles.personMeta}>전원 공개 · 질문별 기록</p>
        {notes.map((note) => (
          <article className={styles.noteRow} key={note.id}>
            <div className={styles.inline}>
              <span aria-hidden="true" className={styles.personAvatar}>
                {note.author}
              </span>
              {note.tag ? (
                <span
                  className={`${styles.badge} ${note.tag === "good" ? styles.accentBadge : styles.hostBadge}`}
                >
                  {note.tag === "good" ? "좋았어요" : "아쉬워요"}
                </span>
              ) : null}
            </div>
            <p className={styles.sectionCopy}>{note.text}</p>
            <div className={styles.noteActions}>
              <button
                className={styles.textButton}
                onClick={() =>
                  setNotes((items) =>
                    items.map((item) => (item.id === note.id ? { ...item, tag: "good" } : item)),
                  )
                }
                type="button"
              >
                좋았어요
              </button>
              <button
                className={styles.textButton}
                onClick={() =>
                  setNotes((items) =>
                    items.map((item) => (item.id === note.id ? { ...item, tag: "improve" } : item)),
                  )
                }
                type="button"
              >
                아쉬워요
              </button>
              <button
                className={styles.textButton}
                onClick={() => setNotes((items) => items.filter((item) => item.id !== note.id))}
                type="button"
              >
                삭제
              </button>
            </div>
          </article>
        ))}
        <Form
          className={styles.stack}
          onSubmit={noteForm.handleSubmit(({ text }) => {
            const value = text.trim();
            if (!value) return;
            setNotes((items) => [
              ...items,
              { author: "곰", id: `note-${Date.now()}`, text: value },
            ]);
            noteForm.reset();
            toastManager.add({ title: "메모를 저장했어요" });
          })}
        >
          <Controller
            control={noteForm.control}
            name="text"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Field.Root invalid={fieldState.invalid} name={field.name}>
                <Field.Label className={styles.textLabel}>메모</Field.Label>
                <Field.Control
                  className={styles.input}
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  placeholder="들리는 대로 적어요"
                  ref={field.ref}
                  value={field.value}
                />
              </Field.Root>
            )}
          />
          <Button size="sm" type="submit">
            기록
          </Button>
        </Form>
      </aside>
    </div>
  );
}

function AiFeedbackPanel({ onUseDraft }: { onUseDraft: () => void }) {
  const [loading, setLoading] = useState(false);
  const regenerate = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 700);
  };
  return (
    <section className={styles.aiPanel}>
      <div className={styles.questionHead}>
        <div>
          <span className={`${styles.badge} ${styles.accentBadge}`}>AI 리포트</span>
          <h2 className={styles.sectionTitle}>AI가 정리한 이 라운드</h2>
        </div>
        <span className={styles.personMeta}>{loading ? "생성 중" : "생성 완료"}</span>
      </div>
      {loading ? (
        <div className={styles.stack}>
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
        </div>
      ) : (
        <>
          <p className={styles.sectionCopy}>{feedbackDraft}</p>
          <ul className={styles.stack}>
            <li className={styles.sectionCopy}>좋았어요 · 멱등키·상태머신 등 근거 있는 답변</li>
            <li className={styles.sectionCopy}>좋았어요 · 장애 시나리오부터 짚는 구조적 설명</li>
            <li className={styles.sectionCopy}>아쉬워요 · 보상 트랜잭션 설명이 추상적</li>
          </ul>
          <strong className={styles.questionTitle}>
            다음 액션 · 복구 사례 1개를 수치와 함께 STAR 구조로 준비하기
          </strong>
        </>
      )}
      <div className={styles.actions}>
        <Button disabled={loading} onClick={onUseDraft} size="sm" variant="secondary">
          <Sparkles aria-hidden="true" size={14} /> 내 질문 메모로 초안 쓰기
        </Button>
        <Button disabled={loading} onClick={regenerate} size="sm" variant="ghost">
          다시 생성
        </Button>
      </div>
    </section>
  );
}

function FeedbackAuthorStage() {
  const toastManager = Toast.useToastManager();
  const { control, handleSubmit, setValue } = useForm<TextFormValues>({
    defaultValues: { text: feedbackDraft },
  });
  return (
    <div className={styles.content}>
      <div className={styles.blueCard}>
        <strong className={styles.actionTitle}>
          📣 면접자에게 남길 최종 피드백을 작성해 주세요.
        </strong>
      </div>
      <div className={styles.feedbackGrid}>
        <div className={styles.stack}>
          {sessionQuestions.slice(0, 3).map((question, index) => (
            <article className={styles.feedbackQuestion} key={question.id}>
              <span className={styles.questionMeta}>Q{index + 1}</span>
              <h2 className={styles.questionTitle}>{question.text}</h2>
              <p className={styles.sectionCopy}>
                <span className={`${styles.badge} ${styles.accentBadge}`}>좋았어요</span> 장애
                시나리오부터 짚고 시작 — 구조 좋음
              </p>
              <p className={styles.sectionCopy}>
                <span className={`${styles.badge} ${styles.hostBadge}`}>메모</span> 대사 배치로
                승인-주문 비교, 불일치는 보상 트랜잭션
              </p>
            </article>
          ))}
        </div>
        <aside className={styles.stack}>
          <Form
            className={styles.cardPadding}
            onSubmit={handleSubmit(() => toastManager.add({ title: "최종 피드백을 저장했어요" }))}
          >
            <Controller
              control={control}
              name="text"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Field.Root invalid={fieldState.invalid} name={field.name}>
                  <Field.Label className={styles.sectionTitle}>최종 피드백</Field.Label>
                  <Field.Control
                    className={styles.textarea}
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                    ref={field.ref}
                    render={<textarea rows={6} />}
                    value={field.value}
                  />
                </Field.Root>
              )}
            />
            <Button type="submit">피드백 저장하기</Button>
          </Form>
          <AiFeedbackPanel
            onUseDraft={() => setValue("text", feedbackDraft, { shouldDirty: true })}
          />
        </aside>
      </div>
    </div>
  );
}

function RevealFeedbackDialog({ onReveal }: { onReveal: () => void }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button size="sm" variant="secondary" />}>열람하기</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.dialogBackdrop} />
        <Dialog.Viewport className={styles.dialogPositioner}>
          <Dialog.Popup className={styles.dialogPopup}>
            <div className={styles.dialogHead}>
              <div>
                <Dialog.Title className={styles.dialogTitle}>
                  성실한 사슴 03의 피드백을 열람할까요?
                </Dialog.Title>
                <Dialog.Description className={styles.dialogDescription}>
                  구두로 먼저 듣고 여는 걸 권해요.
                </Dialog.Description>
              </div>
              <Dialog.Close aria-label="피드백 열람 닫기" className={styles.iconButton}>
                <X aria-hidden="true" size={18} />
              </Dialog.Close>
            </div>
            <div className={styles.dialogFoot}>
              <Dialog.Close render={<Button variant="secondary" />}>취소</Dialog.Close>
              <Dialog.Close render={<Button onClick={onReveal} />}>열람하기</Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MyFeedbackStage() {
  const [revealed, setRevealed] = useState(false);
  const toastManager = Toast.useToastManager();
  const { control, handleSubmit } = useForm<TextFormValues>({ defaultValues: { text: "" } });
  return (
    <div className={styles.contentNarrow}>
      <h1 className={styles.centeredTitle}>함께한 참여자들이 남긴 피드백이에요</h1>
      <div className={styles.stack}>
        <article className={styles.cardPadding}>
          <strong className={styles.questionTitle}>꼼꼼한 여우 12 · 참여자</strong>
          <p className={styles.sectionCopy}>
            설계 문제에서 트레이드오프를 명확히 짚는 점이 좋았어요. 다만 수치 근거가 약해요.
          </p>
        </article>
        <article className={styles.revealCard}>
          <div className={revealed ? undefined : styles.blurred}>
            <strong className={styles.questionTitle}>성실한 사슴 03 · 참여자</strong>
            <p className={styles.sectionCopy}>
              질문 의도를 되묻고 시작하는 습관이 인상적이었어요. 결론을 먼저 말하면 더 좋아요.
            </p>
          </div>
          {!revealed ? <RevealFeedbackDialog onReveal={() => setRevealed(true)} /> : null}
        </article>
        <Form
          className={styles.cardPadding}
          onSubmit={handleSubmit(() => toastManager.add({ title: "셀프 피드백을 남겼어요" }))}
        >
          <Controller
            control={control}
            name="text"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Field.Root invalid={fieldState.invalid} name={field.name}>
                <Field.Label className={styles.sectionTitle}>셀프 피드백</Field.Label>
                <Field.Description className={styles.sectionCopy}>
                  스스로 가장 아쉬웠던 답변 하나를 남겨요.
                </Field.Description>
                <Field.Control
                  className={styles.textarea}
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  placeholder="아쉬웠던 답변을 남겨요"
                  ref={field.ref}
                  render={<textarea rows={3} />}
                  value={field.value}
                />
              </Field.Root>
            )}
          />
          <Button type="submit">남기기</Button>
        </Form>
      </div>
    </div>
  );
}

function ClosingStage({ interview }: { interview: MockInterview }) {
  const router = useRouter();
  const { completeRoom } = useMockFlow();
  const toastManager = Toast.useToastManager();
  const [ratings, setRatings] = useState<Record<string, "down" | "up">>({});
  return (
    <div className={styles.contentNarrow}>
      <h1 className={styles.centeredTitle}>오늘 면접, 어땠나요?</h1>
      <section className={styles.cardPadding}>
        <h2 className={styles.sectionTitle}>질문 평가</h2>
        {sessionQuestions.slice(1).map((question) => (
          <article className={styles.personRow} key={question.id}>
            <div className={styles.personMain}>
              <strong className={styles.questionTitle}>{question.text}</strong>
              <span className={styles.personMeta}>성실한 사슴 03 · {question.source}</span>
            </div>
            <div className={styles.rowActions}>
              <button
                aria-label={`${question.text} 좋아요`}
                className={styles.ratingButton}
                data-pressed={ratings[question.id] === "up" || undefined}
                onClick={() => setRatings((value) => ({ ...value, [question.id]: "up" }))}
                type="button"
              >
                <ThumbsUp aria-hidden="true" size={15} />
              </button>
              <button
                aria-label={`${question.text} 아쉬워요`}
                className={styles.ratingButton}
                data-pressed={ratings[question.id] === "down" || undefined}
                onClick={() => setRatings((value) => ({ ...value, [question.id]: "down" }))}
                type="button"
              >
                <ThumbsDown aria-hidden="true" size={15} />
              </button>
            </div>
          </article>
        ))}
        <div className={styles.actions}>
          <Button onClick={() => toastManager.add({ title: "질문 평가를 제출했어요" })}>
            제출하기
          </Button>
        </div>
      </section>
      <div className={styles.fixedActionBar}>
        <span className={styles.actionCopy}>
          <strong className={styles.actionTitle}>클로징이 끝나면 면접을 완료해 주세요</strong>
          <span className={styles.actionDescription}>
            완료 후 함께한 참여자의 후기를 남길 수 있어요.
          </span>
        </span>
        <Button
          onClick={() => {
            completeRoom(interview.id);
            router.push("/my-interviews?tab=completed");
          }}
        >
          면접 완료하기
        </Button>
      </div>
    </div>
  );
}

export function InterviewSession({ interview }: { interview: MockInterview }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stage = searchParams.get("stage") ?? "interview";
  const targetId = searchParams.get("target") ?? "deer";
  const [showOnboarding, setShowOnboarding] = useState(searchParams.get("onboarding") === "1");
  const target = mockParticipants.find((person) => person.id === targetId);
  const moveStage = (nextStage: "feedback" | "interview") =>
    router.replace(`/interviews/${interview.id}/session?stage=${nextStage}&target=${targetId}`);

  return (
    <main className={styles.sessionPage}>
      <SessionRail interview={interview} stage={stage} targetId={targetId} />
      {targetId !== "closing" ? (
        <div className={styles.roomTabs}>
          <button
            className={`${styles.roomTab} ${stage === "interview" ? styles.roomTabActive : ""}`}
            onClick={() => moveStage("interview")}
            type="button"
          >
            면접
          </button>
          <button
            className={`${styles.roomTab} ${stage === "feedback" ? styles.roomTabActive : ""}`}
            onClick={() => moveStage("feedback")}
            type="button"
          >
            피드백
          </button>
        </div>
      ) : null}
      {targetId === "closing" ? (
        <ClosingStage interview={interview} />
      ) : stage === "feedback" ? (
        target?.isMe ? (
          <MyFeedbackStage />
        ) : (
          <FeedbackAuthorStage />
        )
      ) : (
        <InterviewStage isMe={Boolean(target?.isMe)} />
      )}
      {showOnboarding ? <CoachMarks onClose={() => setShowOnboarding(false)} /> : null}
    </main>
  );
}
