"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarCheck, CalendarX } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  completeRoomProgressMutation,
  getInterviewOverviewQueryKey,
  getMyAttendanceQueryKey,
  getReviewOverviewQueryKey,
  participationSlotsQueryKey,
  roomDetailQueryKey,
  roomParticipantsOptions,
  roomParticipantsQueryKey,
  roomsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { iconSizes } from "@/styles/tokens";
import { getRoomRequestError } from "./participant-model";
import * as styles from "./interview-room.css";

export type AttendanceStatus = "ATTENDED" | "ABSENT";

export const completeRoomMutationKey = (roomId: string) =>
  ["completeRoomProgress", roomId] as const;

export function CompleteRoomAttendanceForm({
  roomId,
  currentMemberId,
  onClose,
}: {
  roomId: string;
  currentMemberId: string;
  onClose: () => void;
}) {
  const client = useQueryClient();
  const router = useRouter();
  const toast = Toast.useToastManager();
  const path = { roomId };
  const options = roomParticipantsOptions({ path });
  const { data: response } = useSuspenseQuery(options);
  const participants = response.data!.confirmedParticipants;
  const methods = useForm<{ attendances: Record<string, AttendanceStatus> }>({
    defaultValues: {
      attendances: Object.fromEntries(participants.map(({ memberId }) => [memberId, "ATTENDED"])),
    },
  });
  const refresh = () =>
    Promise.allSettled(
      [
        roomDetailQueryKey({ path }),
        roomParticipantsQueryKey({ path }),
        roomsQueryKey(),
        getInterviewOverviewQueryKey(),
        participationSlotsQueryKey(),
        getMyAttendanceQueryKey({ query: { roomId } }),
        getReviewOverviewQueryKey({ path }),
      ].map((queryKey) => client.invalidateQueries({ queryKey })),
    );
  const mutation = useMutation({
    ...completeRoomProgressMutation(),
    mutationKey: completeRoomMutationKey(roomId),
    onSuccess: () => {
      void refresh();
      onClose();
      toast.add({ title: "면접을 완료했어요." });
      router.push(`/interviews/${roomId}/review`);
    },
    onError: (error) => {
      const { code } = getRoomRequestError(error);
      if (code !== "E1707" && code !== "E1708" && code !== "E1406") return;
      void refresh();
      onClose();
      toast.add({ title: "면접을 완료할 수 없어요. 최신 정보를 확인해 주세요." });
    },
  });
  const pending = mutation.isPending;
  const submit = methods.handleSubmit(async ({ attendances }) => {
    if (pending) return;
    methods.clearErrors("root.serverError");
    try {
      await mutation.mutateAsync({
        path,
        body: {
          attendances: participants.map(({ memberId }) => ({
            memberId,
            status: attendances[memberId],
          })),
        },
      });
    } catch (error) {
      if (getRoomRequestError(error).code === "E1706") {
        try {
          await client.invalidateQueries({ queryKey: roomDetailQueryKey({ path }) });
          await client.invalidateQueries({ queryKey: options.queryKey }, { throwOnError: true });
          const latest = client.getQueryData(options.queryKey);
          if (!latest?.data)
            throw new Error("Failed to refresh confirmed participants", { cause: error });
          methods.reset({
            attendances: Object.fromEntries(
              latest.data.confirmedParticipants.map(({ memberId }) => [
                memberId,
                attendances[memberId] ?? "ATTENDED",
              ]),
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
                          aria-labelledby={`${memberId}-${value}`}
                          className={styles.attendanceChoice}
                          data-attendance={value}
                        >
                          <Icon aria-hidden="true" size={iconSizes.sm} strokeWidth={2} />
                          <span id={`${memberId}-${value}`}>{label}</span>
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
