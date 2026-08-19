"use client";

import { Toast } from "@base-ui/react/toast";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  createRoomMutation,
  getInterviewOverviewQueryKey,
  participationSlotsOptions,
  participationSlotsQueryKey,
  regionsOptions,
  roomCreationLimitOptions,
  roomCreationLimitQueryKey,
  roomFormOptionsOptions,
  roomsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import {
  buildRoomBody,
  scheduleKey,
  type InterviewCreateFormValues,
} from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

export function InterviewReviewStep({ onEdit }: { onEdit: (step: number) => void }) {
  const { getValues } = useFormContext<InterviewCreateFormValues>();
  const values = getValues();
  const { data: formOptions } = useSuspenseQuery(roomFormOptionsOptions());
  const { data: regions } = useSuspenseQuery(regionsOptions());
  const createRoom = useMutation(createRoomMutation());
  const queryClient = useQueryClient();
  const toastManager = Toast.useToastManager();
  const router = useRouter();
  const submittingRef = useRef(false);
  const [successfulKeys, setSuccessfulKeys] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const roundLabel =
    formOptions.data?.rounds.find((item) => item.code === values.round)?.label ?? values.round;
  const typeLabel = formOptions.data?.types.find((item) => item.code === values.type)?.label;
  const methodLabel =
    formOptions.data?.methods.find((item) => item.code === values.method)?.label ?? values.method;
  const regionLabel = regions.data?.sidos
    .flatMap((sido) =>
      sido.sigungus.map((item) => ({
        id: item.sigunguId,
        label: `${sido.shortName} ${item.name}`,
      })),
    )
    .find((item) => item.id === values.sigunguId)?.label;

  const submit = async () => {
    if (submittingRef.current || !values.posting || !values.jobRole) return;
    submittingRef.current = true;
    setSubmitError(null);
    try {
      const pendingSchedules = values.schedules.filter(
        (schedule) => !successfulKeys.has(scheduleKey(schedule)),
      );
      const limitOptions = roomCreationLimitOptions({
        query: {
          jobPostingId: String(values.posting.jobPostingId),
          jobRoleId: String(values.jobRole.jobRoleId),
        },
      });
      const [creationLimit, slots] = await Promise.all([
        queryClient.fetchQuery({ ...limitOptions, staleTime: 0 }),
        queryClient.fetchQuery({ ...participationSlotsOptions(), staleTime: 0 }),
      ]);
      const allowed = Math.min(creationLimit.data?.remaining ?? 0, slots.data?.remaining ?? 0, 3);
      if (pendingSchedules.length > allowed) {
        setSubmitError(
          allowed === 0
            ? "현재는 면접을 더 만들 수 없어요. 생성 제한을 확인해 주세요."
            : `현재는 일정 ${allowed}개까지만 만들 수 있어요.`,
        );
        return;
      }
      const results = await Promise.allSettled(
        pendingSchedules.map((schedule) =>
          createRoom.mutateAsync({ body: buildRoomBody(values, schedule) }),
        ),
      );
      const nextSuccessful = new Set(successfulKeys);
      results.forEach((result, index) => {
        if (result.status === "fulfilled") nextSuccessful.add(scheduleKey(pendingSchedules[index]));
      });
      setSuccessfulKeys(nextSuccessful);
      const failedCount = results.filter((result) => result.status === "rejected").length;
      if (failedCount > 0) {
        setSubmitError(
          `${nextSuccessful.size}개 일정은 만들었고 ${failedCount}개 일정은 실패했어요. 실패한 일정만 다시 시도할 수 있어요.`,
        );
        return;
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getInterviewOverviewQueryKey() }),
        queryClient.invalidateQueries({
          queryKey: roomCreationLimitQueryKey({
            query: {
              jobPostingId: String(values.posting.jobPostingId),
              jobRoleId: String(values.jobRole.jobRoleId),
            },
          }),
        }),
        queryClient.invalidateQueries({ queryKey: participationSlotsQueryKey() }),
      ]);
      toastManager.add({ title: `${values.schedules.length}개의 면접을 만들었어요` });
      router.replace("/");
      router.refresh();
    } finally {
      submittingRef.current = false;
    }
  };

  const rows = [
    ["회사 · 공고", `[${values.posting?.companyName}] ${values.posting?.postingName}`, 0],
    ["직무", values.jobRole?.displayName ?? "", 0],
    ["면접", `${roundLabel}${typeLabel ? ` · ${typeLabel}` : ""}`, 0],
    ["진행 방식", `${methodLabel}${regionLabel ? ` · ${regionLabel}` : ""}`, 1],
    ["모집 인원", `최소 ${values.minParticipants}명 · 최대 ${values.maxParticipants}명`, 1],
    [
      "진행 일정",
      values.schedules
        .map((schedule) => `${schedule.date} ${schedule.startTime} · ${schedule.durationMinutes}분`)
        .join("\n"),
      1,
    ],
    ["이력서 원본", values.resumePublic ? "참여가 확정된 사람에게 공유" : "공유하지 않음", 2],
  ] as const;

  return (
    <>
      <h1 className={styles.title}>만들기 전에 같이 확인해요</h1>
      <section className={styles.reviewCard}>
        {rows.map(([label, value, editStep]) => (
          <div className={styles.summaryRow} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <button
              disabled={successfulKeys.size > 0}
              onClick={() => onEdit(editStep)}
              type="button"
            >
              수정하기
            </button>
          </div>
        ))}
        <div className={styles.reviewDescription}>
          <strong>{values.title}</strong>
          {values.description ? <p>{values.description}</p> : null}
        </div>
      </section>
      {submitError ? <p className={styles.submitError}>{submitError}</p> : null}
      <div className={styles.finalAction}>
        <Button disabled={createRoom.isPending} onClick={() => void submit()} type="button">
          {createRoom.isPending
            ? "면접 만드는 중..."
            : successfulKeys.size > 0
              ? "실패한 일정 다시 시도"
              : "이대로 면접 만들기"}
        </Button>
      </div>
    </>
  );
}
