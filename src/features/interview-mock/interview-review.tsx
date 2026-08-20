"use client";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button, LinkButton } from "@/components/button";
import { SessionSummary } from "./interview-card";
import type { MockInterview } from "./mock-data";
import * as styles from "./interview-mock.css";

const reviewChoices = [
  "시간을 잘 지켜요",
  "준비가 성실해요",
  "질문이 날카로워요",
  "피드백이 구체적이에요",
  "소통이 원활해요",
] as const;

type ReviewFormValues = {
  message: string;
  tags: string[];
};

function SubmittedPerson({ name, summary }: { name: string; summary: string }) {
  return (
    <div className={styles.reviewRow}>
      <div className={styles.reviewPerson}>
        <span aria-hidden="true" className={styles.hostAvatar}>
          {name.includes("여우") ? "여" : "사"}
        </span>
        <span className={styles.reviewPersonCopy}>
          <strong className={styles.commentAuthor}>{name}</strong>
          <span className={styles.reviewSummary}>{summary}</span>
        </span>
        <span className={styles.reviewSubmitted}>
          <Check aria-hidden="true" size={14} /> 제출함
        </span>
      </div>
    </div>
  );
}

export function InterviewReview({ interview }: { interview: MockInterview }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitted = searchParams.get("review") === "submitted";
  const { control, handleSubmit } = useForm<ReviewFormValues>({
    defaultValues: { message: "", tags: ["시간을 잘 지켜요", "질문이 날카로워요"] },
  });

  const complete = (review: "skipped" | "submitted") => {
    router.push(`/my-interviews?tab=completed&review=${review}`);
  };

  return (
    <main className={styles.narrowPage}>
      <div className={styles.formColumn}>
        <header className={styles.pageHeading}>
          <h1 className={styles.pageTitle}>함께한 분들의 후기를 남겨요</h1>
        </header>

        <SessionSummary
          interview={interview}
          trailing={
            <span className={styles.inlineMeta}>{submitted ? "2 / 2 작성함" : "1 / 2 작성함"}</span>
          }
        />

        <section aria-label="참여자 후기" className={styles.reviewList}>
          <SubmittedPerson name="꼼꼼한 여우 12" summary="#시간을 지켜요  #피드백이 구체적이에요" />

          {submitted ? (
            <SubmittedPerson
              name="성실한 사슴 03"
              summary="#시간을 잘 지켜요  #질문이 날카로워요"
            />
          ) : (
            <div className={styles.reviewRow}>
              <div className={styles.reviewPerson}>
                <span aria-hidden="true" className={styles.commentAvatar}>
                  사
                </span>
                <span className={styles.reviewPersonCopy}>
                  <strong className={styles.commentAuthor}>성실한 사슴 03</strong>
                  <span className={styles.reviewSummary}>백엔드 개발 · 작성 중</span>
                </span>
              </div>

              <Form
                className={styles.reviewForm}
                onSubmit={handleSubmit(() => complete("submitted"))}
              >
                <Controller
                  control={control}
                  name="tags"
                  render={({ field, fieldState }) => (
                    <Field.Root
                      className={styles.field}
                      dirty={fieldState.isDirty}
                      invalid={fieldState.invalid}
                      name={field.name}
                      touched={fieldState.isTouched}
                    >
                      <Field.Label className={styles.fieldLabel}>
                        이런 점이 좋았어요 <span className={styles.optional}>선택</span>
                      </Field.Label>
                      <ToggleGroup
                        aria-label="좋았던 점"
                        className={styles.choiceGroup}
                        multiple
                        onBlur={field.onBlur}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {reviewChoices.map((choice, index) => (
                          <Toggle
                            className={`${styles.choicePill} ${styles.reviewChoice}`}
                            key={choice}
                            ref={index === 0 ? field.ref : undefined}
                            value={choice}
                          >
                            {choice}
                          </Toggle>
                        ))}
                      </ToggleGroup>
                    </Field.Root>
                  )}
                />

                <Controller
                  control={control}
                  name="message"
                  render={({ field, fieldState }) => (
                    <Field.Root
                      className={styles.field}
                      dirty={fieldState.isDirty}
                      invalid={fieldState.invalid}
                      name={field.name}
                      touched={fieldState.isTouched}
                    >
                      <Field.Label className={styles.fieldLabel}>
                        한 줄 후기 <span className={styles.optional}>선택</span>
                      </Field.Label>
                      <Field.Control
                        className={styles.textarea}
                        onBlur={field.onBlur}
                        onValueChange={field.onChange}
                        placeholder="어땠는지 한 줄이면 충분해요. 후기 원문은 상대에게만 보여요."
                        ref={field.ref}
                        render={<textarea rows={2} />}
                        value={field.value}
                      />
                    </Field.Root>
                  )}
                />

                <div className={`${styles.formActions} ${styles.formActionsSplit}`}>
                  <Button onClick={() => complete("skipped")} type="button" variant="ghost">
                    건너뛰기
                  </Button>
                  <Button type="submit">후기 제출하기</Button>
                </div>
              </Form>
            </div>
          )}
        </section>

        {submitted ? (
          <LinkButton href="/my-interviews?tab=completed&review=submitted" variant="secondary">
            내 면접으로
          </LinkButton>
        ) : null}
      </div>
    </main>
  );
}
