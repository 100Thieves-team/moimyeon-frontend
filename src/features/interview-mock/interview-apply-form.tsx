"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { SessionSummary } from "./interview-card";
import type { MockInterview } from "./mock-data";
import { mockResumes } from "./mock-data";
import * as styles from "./interview-mock.css";

type ApplyFormValues = {
  message: string;
  resumeId: string;
};

function safeReturnTo(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export function InterviewApplyForm({ interview }: { interview: MockInterview }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo") ?? "/");
  const { control, handleSubmit } = useForm<ApplyFormValues>({
    defaultValues: { message: "", resumeId: mockResumes[0].id },
  });

  const submit = handleSubmit(() => {
    const params = new URLSearchParams({
      application: "pending",
      returnTo,
      tab: "pending",
    });
    router.push(`/my-interviews?${params.toString()}`);
  });

  return (
    <main className={styles.narrowPage}>
      <div className={styles.formColumn}>
        <header className={styles.pageHeading}>
          <h1 className={styles.pageTitle}>참가 신청을 보내요</h1>
          <p className={styles.pageDescription}>
            방장이 확인할 이력서와 간단한 메시지를 선택해 주세요.
          </p>
        </header>

        <SessionSummary
          interview={interview}
          trailing={
            <Link
              className={styles.textLink}
              href={`/interviews/${interview.id}?returnTo=${encodeURIComponent(returnTo)}`}
            >
              상세 보기
            </Link>
          }
        />

        <Form className={styles.formCard} onSubmit={submit}>
          <Controller
            control={control}
            name="resumeId"
            rules={{ required: "이력서를 선택해 주세요." }}
            render={({ field, fieldState }) => {
              const selectedResume = mockResumes.find((resume) => resume.id === field.value);

              return (
                <Field.Root
                  className={styles.field}
                  dirty={fieldState.isDirty}
                  invalid={fieldState.invalid}
                  name={field.name}
                  touched={fieldState.isTouched}
                >
                  <Field.Label className={styles.fieldLabel}>신청 이력서</Field.Label>
                  <Dialog.Root>
                    <div className={styles.resumeRow}>
                      <span className={styles.resumeFile}>
                        <strong className={styles.resumeName}>
                          {selectedResume?.fileName ?? "이력서를 선택해 주세요"}
                        </strong>
                        <span className={styles.resumeStatus}>저장된 이력서 · AI 요약 완료</span>
                      </span>
                      <Dialog.Trigger
                        render={
                          <Button ref={field.ref} size="sm" type="button" variant="secondary" />
                        }
                      >
                        변경하기
                      </Dialog.Trigger>
                    </div>

                    {selectedResume ? (
                      <p className={styles.summaryBox}>{selectedResume.summary}</p>
                    ) : null}

                    <Dialog.Portal>
                      <Dialog.Backdrop className={styles.dialogBackdrop} />
                      <Dialog.Popup className={styles.dialogPopup}>
                        <Dialog.Title className={styles.dialogTitle}>
                          이력서를 선택해 주세요
                        </Dialog.Title>
                        <RadioGroup
                          aria-label="신청 이력서"
                          className={styles.resumeOptions}
                          name={field.name}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          {mockResumes.map((resume) => (
                            <Radio.Root
                              className={styles.resumeOption}
                              key={resume.id}
                              value={resume.id}
                            >
                              <Radio.Indicator className={styles.radioIndicator} keepMounted>
                                <span className={styles.radioDot} />
                              </Radio.Indicator>
                              <span className={styles.resumeFile}>
                                <strong className={styles.resumeName}>{resume.fileName}</strong>
                                <span className={styles.resumeStatus}>{resume.summary}</span>
                              </span>
                            </Radio.Root>
                          ))}
                        </RadioGroup>
                        <div className={styles.formActions}>
                          <Dialog.Close render={<Button type="button" />}>
                            이 이력서 쓰기
                          </Dialog.Close>
                        </div>
                      </Dialog.Popup>
                    </Dialog.Portal>
                  </Dialog.Root>
                  <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
                    {fieldState.error?.message}
                  </Field.Error>
                </Field.Root>
              );
            }}
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
                  방장에게 전할 말 <span className={styles.optional}>선택</span>
                </Field.Label>
                <Field.Control
                  className={styles.textarea}
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  placeholder="함께 준비하고 싶은 내용을 간단히 남겨요."
                  ref={field.ref}
                  render={<textarea rows={4} />}
                  value={field.value}
                />
              </Field.Root>
            )}
          />

          <div className={styles.formActions}>
            <Button type="submit">신청 보내기</Button>
          </div>
        </Form>

        <Link
          className={styles.backLink}
          href={`/interviews/${interview.id}?returnTo=${encodeURIComponent(returnTo)}`}
        >
          ← 상세로
        </Link>
      </div>
    </main>
  );
}
