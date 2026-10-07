"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { CalendarCheck, CalendarX } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useId } from "react";
import { Button } from "@/components/button";
import { iconSizes } from "@/styles/tokens";
import { getRoomRequestError, type ConfirmedRoomParticipant } from "./participant-model";
import * as styles from "./interview-room.css";

export type AttendanceStatus = "ATTENDED" | "ABSENT";
type AttendanceParticipant = ConfirmedRoomParticipant;
export type RoomAttendance = { memberId: string; status: AttendanceStatus };

export function CompleteRoomAttendanceForm({
  participants,
  currentMemberId,
  pending,
  onSubmit,
  onRosterMismatch,
}: {
  participants: AttendanceParticipant[];
  currentMemberId: string;
  pending: boolean;
  onSubmit: (attendances: RoomAttendance[]) => Promise<void>;
  onRosterMismatch: () => Promise<AttendanceParticipant[]>;
}) {
  const labelId = useId();
  const methods = useForm<{ attendances: Record<string, AttendanceStatus> }>({
    defaultValues: {
      attendances: Object.fromEntries(participants.map(({ memberId }) => [memberId, "ATTENDED"])),
    },
  });
  const submit = methods.handleSubmit(async ({ attendances }) => {
    if (pending) return;
    methods.clearErrors("root.serverError");
    try {
      await onSubmit(
        participants.map(({ memberId }) => ({ memberId, status: attendances[memberId] })),
      );
    } catch (error) {
      if (getRoomRequestError(error).code === "E1706") {
        try {
          const roster = await onRosterMismatch();
          methods.reset({
            attendances: Object.fromEntries(
              roster.map(({ memberId }) => [memberId, attendances[memberId] ?? "ATTENDED"]),
            ),
          });
          methods.setError("root.serverError", {
            type: "server",
            message: "참여자 명단이 변경됐어요. 출석을 확인하고 다시 제출해 주세요.",
          });
          return;
        } catch {
          methods.setError("root.serverError", {
            type: "server",
            message: "참여자 명단을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
          });
          return;
        }
      }
      methods.setError("root.serverError", {
        type: "server",
        message: "출석을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
    }
  });

  return (
    <Form method="post" onSubmit={submit}>
      <div className={styles.dialogBody}>
        <ul aria-label="확정 당시 참여자 출석" className={styles.attendanceRoster}>
          {participants.map(({ memberId, nickname }) => (
            <li key={memberId}>
              <Controller
                control={methods.control}
                name={`attendances.${memberId}`}
                render={({ field, fieldState }) => (
                  <Field.Root
                    className={styles.attendanceRow}
                    name={field.name}
                    dirty={fieldState.isDirty}
                    touched={fieldState.isTouched}
                    invalid={fieldState.invalid}
                  >
                    <Field.Label className={styles.attendanceParticipantName}>
                      {nickname}
                      {memberId === currentMemberId && <span className={styles.meBadge}>나</span>}
                    </Field.Label>
                    <RadioGroup
                      className={styles.attendanceChoices}
                      disabled={pending}
                      inputRef={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                      onValueChange={(value) => {
                        field.onChange(value);
                        methods.clearErrors("root.serverError");
                      }}
                      value={field.value}
                    >
                      {(
                        [
                          ["ATTENDED", "출석", CalendarCheck],
                          ["ABSENT", "불참", CalendarX],
                        ] as const
                      ).map(([value, label, Icon]) => (
                        <Radio.Root
                          key={value}
                          value={value}
                          aria-labelledby={`${labelId}-${memberId}-${value}`}
                          className={styles.attendanceChoice}
                          data-attendance={value}
                        >
                          <Icon aria-hidden="true" size={iconSizes.sm} strokeWidth={2} />
                          <span id={`${labelId}-${memberId}-${value}`}>{label}</span>
                        </Radio.Root>
                      ))}
                    </RadioGroup>
                    <Field.Error match={Boolean(fieldState.error)} className={styles.error}>
                      {fieldState.error?.message}
                    </Field.Error>
                  </Field.Root>
                )}
              />
            </li>
          ))}
        </ul>
        {methods.formState.errors.root?.serverError?.message && (
          <p className={styles.error} role="alert">
            {methods.formState.errors.root.serverError.message}
          </p>
        )}
      </div>
      <footer className={styles.dialogFooter}>
        <Dialog.Close render={<Button variant="secondary" type="button" disabled={pending} />}>
          취소
        </Dialog.Close>
        <Button type="submit" disabled={pending}>
          {pending ? "완료 중..." : "면접 완료"}
        </Button>
      </footer>
    </Form>
  );
}
