"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Toast } from "@base-ui/react/toast";
import { ChevronDown, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { InterviewRoomShell } from "./interview-room-shell";
import { mockApplicants, type MockApplicant, type MockInterview } from "./mock-data";
import { useMockFlow } from "./mock-flow-store";
import * as styles from "./mock-flow.css";
import { PublicTrustDialog } from "./public-trust-dialog";

type RejectFormValues = { reason: string };

const rejectionReasons = [
  "직무·면접 단계가 맞지 않아요",
  "정원을 다른 분들로 채웠어요",
  "설명한 준비 방향과 맞지 않아요",
  "사유 없이 반려할게요",
] as const;

function RejectApplicationDialog({
  applicant,
  roomId,
}: {
  applicant: MockApplicant;
  roomId: string;
}) {
  const { resolveApplication } = useMockFlow();
  const toastManager = Toast.useToastManager();
  const { control, handleSubmit, reset } = useForm<RejectFormValues>({
    defaultValues: { reason: rejectionReasons[0] },
  });

  return (
    <Dialog.Root onOpenChange={(open) => open && reset()}>
      <Dialog.Trigger render={<Button size="sm" variant="secondary" />}>반려</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.dialogBackdrop} />
        <Dialog.Viewport className={styles.dialogPositioner}>
          <Dialog.Popup className={styles.dialogPopup}>
            <div className={styles.dialogHead}>
              <div>
                <Dialog.Title className={styles.dialogTitle}>신청을 반려할게요</Dialog.Title>
                <Dialog.Description className={styles.dialogDescription}>
                  {applicant.nickname} 님에게 결과를 알려요. 사유는 골라도, 안 골라도 돼요.
                </Dialog.Description>
              </div>
              <Dialog.Close aria-label="반려 사유 닫기" className={styles.iconButton}>
                <X aria-hidden="true" size={18} />
              </Dialog.Close>
            </div>
            <Form
              onSubmit={handleSubmit(() => {
                resolveApplication(roomId, applicant.id, "rejected");
                toastManager.add({ title: `${applicant.nickname} 님의 신청을 반려했어요` });
              })}
            >
              <div className={styles.dialogBody}>
                <Controller
                  control={control}
                  name="reason"
                  render={({ field, fieldState }) => (
                    <Field.Root
                      dirty={fieldState.isDirty}
                      invalid={fieldState.invalid}
                      name={field.name}
                      touched={fieldState.isTouched}
                    >
                      <RadioGroup
                        aria-label="반려 사유"
                        className={styles.stack}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {rejectionReasons.map((reason, index) => (
                          <Radio.Root
                            className={styles.radioRow}
                            inputRef={index === 0 ? field.ref : undefined}
                            key={reason}
                            value={reason}
                          >
                            <Radio.Indicator className={styles.radioIndicator}>
                              <span className={styles.radioDot} />
                            </Radio.Indicator>
                            {reason}
                          </Radio.Root>
                        ))}
                      </RadioGroup>
                    </Field.Root>
                  )}
                />
              </div>
              <div className={styles.dialogFoot}>
                <Dialog.Close render={<Button type="button" variant="secondary" />}>
                  취소
                </Dialog.Close>
                <Dialog.Close render={<Button type="submit" />}>반려 보내기</Dialog.Close>
              </div>
            </Form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function RoomApplications({ interview }: { interview: MockInterview }) {
  const { resolveApplication, rooms } = useMockFlow();
  const toastManager = Toast.useToastManager();
  const room = rooms[interview.id];
  const applicants = mockApplicants.filter(
    (applicant) => room?.applications[applicant.id] === "pending",
  );
  const acceptedCount = Object.values(room?.applications ?? {}).filter(
    (status) => status === "accepted",
  ).length;
  const participantCount = interview.currentParticipants + acceptedCount;

  return (
    <InterviewRoomShell
      activeTab="applications"
      interview={interview}
      participantCount={participantCount}
      pendingCount={applicants.length}
    >
      <div className={styles.contentNarrow}>
        {applicants.length === 0 ? (
          <div className={styles.centeredState}>
            <h2 className={styles.sectionTitle}>대기 중인 참가 신청이 없어요</h2>
            <p className={styles.sectionCopy}>새 신청이 오면 이곳에서 확인할 수 있어요.</p>
          </div>
        ) : (
          <Accordion.Root className={styles.card} defaultValue={["deer"]}>
            {applicants.map((applicant) => (
              <Accordion.Item key={applicant.id} value={applicant.id}>
                <div className={styles.personRow}>
                  <span aria-hidden="true" className={styles.personAvatar}>
                    {applicant.initial}
                  </span>
                  <div className={styles.personMain}>
                    <PublicTrustDialog
                      person={applicant}
                      trigger={
                        <button className={styles.personNameButton} type="button">
                          {applicant.nickname}
                        </button>
                      }
                    />
                    <span className={styles.personMeta}>
                      {applicant.jobRole} · 완료 {applicant.completedInterviews}회 · 출석 100%
                    </span>
                    <span className={styles.personSummary}>{applicant.summary}</span>
                  </div>
                  <div className={styles.rowActions}>
                    <RejectApplicationDialog applicant={applicant} roomId={interview.id} />
                    <Button
                      onClick={() => {
                        resolveApplication(interview.id, applicant.id, "accepted");
                        toastManager.add({ title: `${applicant.nickname} 님의 참여를 수락했어요` });
                      }}
                      size="sm"
                    >
                      수락
                    </Button>
                    <Accordion.Header>
                      <Accordion.Trigger
                        aria-label={`${applicant.nickname} 신청 내용 펼치기`}
                        className={styles.iconButton}
                      >
                        <ChevronDown aria-hidden="true" size={18} />
                      </Accordion.Trigger>
                    </Accordion.Header>
                  </div>
                  <Accordion.Panel className={styles.disclosurePanel}>
                    <span className={styles.textLabel}>전할 말</span>
                    <p className={styles.sectionCopy}>{applicant.message}</p>
                    <span className={styles.textLabel}>AI 이력서 요약</span>
                    <p className={styles.sectionCopy}>
                      {applicant.summary}. 대규모 트래픽 경험은 제한적.
                    </p>
                    <span className={styles.personMeta}>
                      이력서 원본은 진행 확정 이후에 볼 수 있어요.
                    </span>
                  </Accordion.Panel>
                </div>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        )}
      </div>
    </InterviewRoomShell>
  );
}
