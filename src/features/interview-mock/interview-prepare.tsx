"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Toast } from "@base-ui/react/toast";
import { FileText, LockKeyhole, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { InterviewRoomShell } from "./interview-room-shell";
import { mockParticipants, type MockInterview } from "./mock-data";
import * as styles from "./mock-flow.css";

type MockQuestion = { author: string; id: string; tails: string[]; text: string };
type QuestionFormValues = { question: string };

const initialQuestions: MockQuestion[] = [
  { author: "공통", id: "intro", tails: [], text: "간단히 자기소개해 주세요" },
  {
    author: "든든한 곰 21",
    id: "payment",
    tails: ["멱등키는 어디에 저장했나요?", "PG 재시도가 겹치면 어떻게 되나요?"],
    text: "결제 연동에서 이중 결제를 막기 위해 어떤 처리를 했나요?",
  },
  {
    author: "든든한 곰 21",
    id: "consistency",
    tails: ["정합성 검증 배치는 어떤 주기로 돌렸나요?"],
    text: "주문·결제 데이터 정합성이 깨졌을 때 어떻게 찾고 복구했나요?",
  },
  {
    author: "꼼꼼한 여우 12",
    id: "coupon",
    tails: ["재고 차감 정합성은 어떻게 지키나요?"],
    text: "선착순 쿠폰 발급 시스템을 설계해 주세요",
  },
];

const aiSeeds = [
  "배치 처리에서 대규모 트래픽을 가정한다면 무엇부터 바꾸시겠어요?",
  "결제 연동 장애가 배치 정산에 전파됐던 경험이 있나요?",
  "PostgreSQL에서 겪은 성능 문제와 해결 과정을 말해 주세요.",
];

function TailQuestionForm({ onAdd }: { onAdd: (value: string) => void }) {
  const { control, handleSubmit, reset } = useForm<QuestionFormValues>({
    defaultValues: { question: "" },
  });
  return (
    <Form
      className={styles.compactForm}
      onSubmit={handleSubmit(({ question }) => {
        onAdd(question.trim());
        reset();
      })}
    >
      <Controller
        control={control}
        name="question"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Field.Root invalid={fieldState.invalid} name={field.name}>
            <Field.Label className={styles.textLabel}>꼬리질문 추가</Field.Label>
            <Field.Control
              className={styles.input}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
              placeholder="꼬리질문을 이어서 남겨요"
              ref={field.ref}
              value={field.value}
            />
          </Field.Root>
        )}
      />
      <Button size="sm" type="submit" variant="secondary">
        추가
      </Button>
    </Form>
  );
}

function AiSuggestions({ onAdopt }: { onAdopt: (question: string) => void }) {
  const [suggestions, setSuggestions] = useState(aiSeeds);
  const [loading, setLoading] = useState(false);

  const regenerate = () => {
    setLoading(true);
    window.setTimeout(() => {
      setSuggestions(aiSeeds);
      setLoading(false);
    }, 700);
  };

  return (
    <section aria-label="AI 추천 질문" className={styles.aiPanel}>
      <div className={styles.questionHead}>
        <div>
          <span className={`${styles.badge} ${styles.accentBadge}`}>AI 제안</span>
          <h2 className={styles.sectionTitle}>이력서 AI 요약으로 만든 추천 질문 3개</h2>
        </div>
        <Button disabled={loading} onClick={regenerate} size="sm" variant="secondary">
          다시 생성
        </Button>
      </div>
      {loading ? (
        <div aria-label="AI 질문 생성 중" className={styles.stack}>
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
        </div>
      ) : suggestions.length > 0 ? (
        suggestions.map((suggestion) => (
          <div className={styles.aiSuggestion} key={suggestion}>
            <div className={styles.personMain}>
              <strong className={styles.questionTitle}>{suggestion}</strong>
              <span className={styles.questionMeta}>
                근거 · AI 요약 “결제 연동과 배치 처리 경험”
              </span>
            </div>
            <div className={styles.actions}>
              <Button
                onClick={() => {
                  onAdopt(suggestion);
                  setSuggestions((items) => items.filter((item) => item !== suggestion));
                }}
                size="sm"
              >
                채택
              </Button>
              <Button
                onClick={() =>
                  setSuggestions((items) => items.filter((item) => item !== suggestion))
                }
                size="sm"
                variant="ghost"
              >
                무시
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.sectionCopy}>모든 제안을 확인했어요. 다시 생성할 수 있어요.</p>
      )}
      <p className={styles.personMeta}>
        채택하면 내 카드셋 질문으로 추가돼요 · 이력서 원본은 사용하지 않아요.
      </p>
    </section>
  );
}

function AttendanceDialog({ interview }: { interview: MockInterview }) {
  const router = useRouter();
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(mockParticipants.map((person) => [person.id, true])),
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button />}>면접 진행하기</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.dialogBackdrop} />
        <Dialog.Viewport className={styles.dialogPositioner}>
          <Dialog.Popup className={styles.dialogPopup}>
            <div className={styles.dialogHead}>
              <div>
                <Dialog.Title className={styles.dialogTitle}>면접을 시작할게요</Dialog.Title>
                <Dialog.Description className={styles.dialogDescription}>
                  시작 전에 출석을 확인해 주세요. 전원 출석이 기본이에요.
                </Dialog.Description>
              </div>
              <Dialog.Close aria-label="출석 확인 닫기" className={styles.iconButton}>
                <X aria-hidden="true" size={18} />
              </Dialog.Close>
            </div>
            <div className={styles.dialogBody}>
              {mockParticipants.map((person) => (
                <div className={styles.personRow} key={person.id}>
                  <span aria-hidden="true" className={styles.personAvatar}>
                    {person.initial}
                  </span>
                  <div className={styles.personMain}>
                    <strong className={styles.questionTitle}>{person.nickname}</strong>
                    <span className={styles.personMeta}>
                      {person.isHost ? "방장 · 나" : "면접자"}
                    </span>
                  </div>
                  <div className={styles.rowActions}>
                    <Button
                      onClick={() => setAttendance((value) => ({ ...value, [person.id]: true }))}
                      size="sm"
                      variant={attendance[person.id] ? "primary" : "ghost"}
                    >
                      출석
                    </Button>
                    <Button
                      onClick={() => setAttendance((value) => ({ ...value, [person.id]: false }))}
                      size="sm"
                      variant={!attendance[person.id] ? "secondary" : "ghost"}
                    >
                      불참
                    </Button>
                  </div>
                </div>
              ))}
              <p className={styles.sectionCopy}>
                <strong className={styles.dangerBadge}>불참</strong>은 활동 이력에 남아요.
              </p>
            </div>
            <div className={styles.dialogFoot}>
              <Dialog.Close render={<Button variant="secondary" />}>돌아가기</Dialog.Close>
              <Dialog.Close
                render={
                  <Button
                    onClick={() =>
                      router.push(
                        `/interviews/${interview.id}/session?stage=interview&target=deer&onboarding=1`,
                      )
                    }
                  />
                }
              >
                면접 시작하기
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function InterviewPrepare({ interview }: { interview: MockInterview }) {
  const participantView = interview.relation === "participant";
  const [targetId, setTargetId] = useState("deer");
  const [questions, setQuestions] = useState(initialQuestions);
  const [showAi, setShowAi] = useState(participantView);
  const toastManager = Toast.useToastManager();
  const target = mockParticipants.find((person) => person.id === targetId) ?? mockParticipants[1];
  const locked = participantView && target.isMe;
  const { control, handleSubmit, reset } = useForm<QuestionFormValues>({
    defaultValues: { question: "" },
  });

  const addQuestion = (text: string, author = "나") => {
    if (!text) return;
    setQuestions((items) => [...items, { author, id: `question-${Date.now()}`, tails: [], text }]);
  };

  return (
    <InterviewRoomShell activeTab="prepare" interview={interview} phase="preparing">
      <div className={styles.content}>
        <div className={styles.split}>
          <section className={styles.stack}>
            <div className={styles.cardPadding}>
              <div className={styles.questionHead}>
                <div className={styles.inline}>
                  <span aria-hidden="true" className={styles.personAvatar}>
                    {target.initial}
                  </span>
                  <div className={styles.personMain}>
                    <h2 className={styles.sectionTitle}>
                      {target.nickname}
                      {participantView ? " — 면접자" : ""}
                    </h2>
                    <span className={styles.personMeta}>
                      질문 준비 {target.isMe ? "선택" : "필수"}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => toastManager.add({ title: target.resumeFileName })}
                  size="sm"
                  variant="secondary"
                >
                  <FileText aria-hidden="true" size={14} /> 이력서 원본
                </Button>
              </div>
              <div className={styles.blueCard}>
                <span className={`${styles.badge} ${styles.accentBadge}`}>AI 요약</span>
                <p className={styles.sectionCopy}>{target.summary}. 대규모 트래픽 경험은 제한적.</p>
              </div>
            </div>

            {locked ? (
              <div className={styles.locked}>
                <LockKeyhole aria-hidden="true" size={28} />
                <h2 className={styles.sectionTitle}>내 면접 질문은 볼 수 없어요</h2>
                <p className={styles.sectionCopy}>지금 2명이 내 질문을 준비하고 있어요.</p>
              </div>
            ) : (
              <>
                {showAi ? (
                  <AiSuggestions onAdopt={(question) => addQuestion(question, "AI 생성")} />
                ) : (
                  <Button onClick={() => setShowAi(true)} variant="secondary">
                    <Sparkles aria-hidden="true" size={16} /> AI 추천 질문 받기
                  </Button>
                )}
                {questions.map((question) => (
                  <article className={styles.questionCard} key={question.id}>
                    <div className={styles.questionHead}>
                      <div className={styles.personMain}>
                        <span className={styles.questionMeta}>{question.author}</span>
                        <h3 className={styles.questionTitle}>{question.text}</h3>
                      </div>
                      {question.author === "나" || question.author === "AI 생성" ? (
                        <Button
                          onClick={() =>
                            setQuestions((items) => items.filter((item) => item.id !== question.id))
                          }
                          size="sm"
                          variant="ghost"
                        >
                          삭제
                        </Button>
                      ) : null}
                    </div>
                    {question.tails.length > 0 ? (
                      <ul className={styles.tailList}>
                        {question.tails.map((tail) => (
                          <li key={tail}>{tail}</li>
                        ))}
                      </ul>
                    ) : null}
                    <TailQuestionForm
                      onAdd={(tail) =>
                        setQuestions((items) =>
                          items.map((item) =>
                            item.id === question.id
                              ? { ...item, tails: [...item.tails, tail] }
                              : item,
                          ),
                        )
                      }
                    />
                  </article>
                ))}
                <Form
                  className={styles.compactForm}
                  onSubmit={handleSubmit(({ question }) => {
                    addQuestion(question.trim());
                    reset();
                  })}
                >
                  <Controller
                    control={control}
                    name="question"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <Field.Root invalid={fieldState.invalid} name={field.name}>
                        <Field.Label className={styles.textLabel}>
                          {target.initial}슴에게 물어볼 새 질문
                        </Field.Label>
                        <Field.Control
                          className={styles.input}
                          onBlur={field.onBlur}
                          onValueChange={field.onChange}
                          placeholder="질문을 남겨요"
                          ref={field.ref}
                          value={field.value}
                        />
                      </Field.Root>
                    )}
                  />
                  <Button type="submit">질문 남기기</Button>
                </Form>
              </>
            )}
          </section>

          <aside className={styles.targetList}>
            <h2 className={styles.sectionTitle}>질문 대상</h2>
            {mockParticipants
              .filter((person) => !person.isHost)
              .map((person) => (
                <button
                  className={styles.targetButton}
                  data-active={targetId === person.id}
                  key={person.id}
                  onClick={() => setTargetId(person.id)}
                  type="button"
                >
                  <span aria-hidden="true" className={styles.personAvatar}>
                    {person.initial}
                  </span>
                  <span className={styles.targetCopy}>
                    <strong>{person.nickname}</strong>
                    <span className={styles.targetStatus}>
                      {person.isMe
                        ? "내 카드셋 · 열람 불가"
                        : person.id === "deer"
                          ? "질문 3 · 꼬리 5"
                          : "아직 없어요 · 필수"}
                    </span>
                  </span>
                </button>
              ))}
          </aside>
        </div>
      </div>
      {interview.relation === "host" ? (
        <div className={styles.fixedActionBar}>
          <span className={styles.actionCopy}>
            <strong className={styles.actionTitle}>
              {interview.id === "hanbit-host-today"
                ? "오늘 면접을 시작할 수 있어요"
                : "면접까지 D-3 — 7월 26일 (일) 오후 7:00"}
            </strong>
            <span className={styles.actionDescription}>
              {interview.id === "hanbit-host-today"
                ? "출석을 확인한 뒤 바로 시작해요."
                : "당일이 되면 시작할 수 있어요."}
            </span>
          </span>
          {interview.id === "hanbit-host-today" ? (
            <AttendanceDialog interview={interview} />
          ) : (
            <Button disabled>면접 진행하기</Button>
          )}
        </div>
      ) : null}
    </InterviewRoomShell>
  );
}
