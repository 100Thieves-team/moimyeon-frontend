"use client";

import { Slider } from "@base-ui/react/slider";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  participationSlotsOptions,
  regionsOptions,
  roomCreationLimitOptions,
  roomFormOptionsOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import type { InterviewCreateFormValues } from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

function futureDate(value: string) {
  if (!value) return "날짜를 선택해 주세요.";
  const selected = new Date(`${value}T23:59:59`);
  return selected > new Date() || "오늘 이후 날짜를 선택해 주세요.";
}

export function InterviewScheduleStep() {
  const { control, setValue, getValues } = useFormContext<InterviewCreateFormValues>();
  const { data: formOptionsResponse } = useSuspenseQuery(roomFormOptionsOptions());
  const { data: regionsResponse } = useSuspenseQuery(regionsOptions());
  const { data: slotsResponse } = useSuspenseQuery(participationSlotsOptions());
  const posting = useWatch({ control, name: "posting" });
  const jobRole = useWatch({ control, name: "jobRole" });
  const method = useWatch({ control, name: "method" });
  const { data: creationLimitResponse } = useQuery({
    ...roomCreationLimitOptions({
      query: {
        jobPostingId: String(posting?.jobPostingId ?? 0),
        jobRoleId: String(jobRole?.jobRoleId ?? 0),
      },
    }),
    enabled: Boolean(posting && jobRole),
  });
  const { fields, append, remove } = useFieldArray({ control, name: "schedules" });
  const options = formOptionsResponse.data;
  const constraints = options?.participantConstraints ?? { min: 2, max: 8 };
  const maxSchedules = Math.min(
    creationLimitResponse?.data?.remaining ?? 3,
    slotsResponse.data?.remaining ?? 3,
    3,
  );
  const limitReason =
    maxSchedules === 0
      ? (slotsResponse.data?.remaining ?? 0) === 0
        ? "참여 가능한 면접 슬롯이 남아 있지 않아요."
        : "같은 공고와 직무로 면접을 더 만들 수 없어요."
      : fields.length >= maxSchedules
        ? `현재 조건에서는 일정을 최대 ${maxSchedules}개까지 만들 수 있어요.`
        : null;

  return (
    <>
      <h1 className={styles.title}>언제, 어디서, 몇 명이 모일까요?</h1>
      <section className={styles.card}>
        <Controller
          control={control}
          name="method"
          rules={{ required: "진행 방식을 선택해 주세요." }}
          render={({ field, fieldState }) => (
            <fieldset className={styles.fieldset}>
              <legend className={styles.label}>
                진행 방식 <span className={styles.required}>필수</span>
              </legend>
              <div className={styles.segmented}>
                {(options?.methods ?? []).map((item) => (
                  <label
                    className={styles.segment}
                    data-selected={field.value === item.code}
                    key={item.code}
                  >
                    <input
                      checked={field.value === item.code}
                      className={styles.visuallyHidden}
                      name={field.name}
                      onChange={() => {
                        field.onChange(item.code);
                        if (item.code === "ONLINE") setValue("sigunguId", null);
                      }}
                      type="radio"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
              {fieldState.error ? <p className={styles.error}>{fieldState.error.message}</p> : null}
            </fieldset>
          )}
        />
        {method === "OFFLINE" ? (
          <Controller
            control={control}
            name="sigunguId"
            rules={{ required: "오프라인 면접 지역을 선택해 주세요." }}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="region">
                  지역 <span className={styles.required}>필수</span>
                </label>
                <select
                  className={styles.inputStandalone}
                  id="region"
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(Number(event.target.value) || null)}
                  value={field.value ?? ""}
                >
                  <option value="">시군구 선택</option>
                  {(regionsResponse.data?.sidos ?? []).flatMap((sido) =>
                    sido.sigungus.map((sigungu) => (
                      <option key={sigungu.sigunguId} value={sigungu.sigunguId}>
                        {sido.shortName} · {sigungu.name}
                      </option>
                    )),
                  )}
                </select>
                {fieldState.error ? (
                  <p className={styles.error}>{fieldState.error.message}</p>
                ) : null}
              </div>
            )}
          />
        ) : null}
        <Controller
          control={control}
          name="minParticipants"
          render={({ field: minField }) => (
            <Controller
              control={control}
              name="maxParticipants"
              render={({ field: maxField }) => (
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <span className={styles.label}>모집 인원</span>
                    <span>
                      최소 {minField.value}명 · 최대 {maxField.value}명
                    </span>
                  </div>
                  <Slider.Root
                    min={constraints.min}
                    max={constraints.max}
                    onValueChange={(value) => {
                      minField.onChange(value[0]);
                      maxField.onChange(value[1]);
                    }}
                    step={1}
                    value={[minField.value, maxField.value]}
                  >
                    <Slider.Control className={styles.sliderControl}>
                      <Slider.Track className={styles.sliderTrack}>
                        <Slider.Indicator className={styles.sliderIndicator} />
                      </Slider.Track>
                      <Slider.Thumb
                        aria-label="최소 인원"
                        className={styles.sliderThumb}
                        index={0}
                      />
                      <Slider.Thumb
                        aria-label="최대 인원"
                        className={styles.sliderThumb}
                        index={1}
                      />
                    </Slider.Control>
                  </Slider.Root>
                </div>
              )}
            />
          )}
        />
        <div className={styles.field}>
          <span className={styles.label}>
            진행 일정 <span className={styles.required}>필수</span>
          </span>
          <div className={styles.scheduleList}>
            {fields.map((field, index) => (
              <div className={styles.scheduleRow} key={field.id}>
                <Controller
                  control={control}
                  name={`schedules.${index}.date`}
                  rules={{ validate: futureDate }}
                  render={({ field: dateField, fieldState }) => (
                    <div>
                      <input
                        aria-label={`${index + 1}번째 날짜`}
                        className={styles.inputStandalone}
                        min={new Date().toISOString().slice(0, 10)}
                        type="date"
                        {...dateField}
                      />
                      {fieldState.error ? (
                        <p className={styles.error}>{fieldState.error.message}</p>
                      ) : null}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name={`schedules.${index}.startTime`}
                  rules={{
                    required: "시작 시간을 선택해 주세요.",
                    validate: (value) => {
                      const schedules = getValues("schedules");
                      return (
                        schedules.filter(
                          (item) =>
                            item.date === schedules[index]?.date && item.startTime === value,
                        ).length <= 1 || "같은 날짜와 시간이 이미 있어요."
                      );
                    },
                  }}
                  render={({ field: timeField, fieldState }) => (
                    <div>
                      <input
                        aria-label={`${index + 1}번째 시작 시간`}
                        className={styles.inputStandalone}
                        type="time"
                        {...timeField}
                      />
                      {fieldState.error ? (
                        <p className={styles.error}>{fieldState.error.message}</p>
                      ) : null}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name={`schedules.${index}.durationMinutes`}
                  render={({ field: durationField }) => (
                    <select
                      aria-label={`${index + 1}번째 예상 시간`}
                      className={styles.inputStandalone}
                      onChange={(event) => durationField.onChange(Number(event.target.value))}
                      value={durationField.value}
                    >
                      {(options?.durations ?? []).map((duration) => (
                        <option key={duration.minutes} value={duration.minutes}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <button
                  aria-label={`${index + 1}번째 일정 삭제`}
                  className={styles.iconButton}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </div>
            ))}
          </div>
          <Button
            disabled={fields.length >= maxSchedules}
            onClick={() =>
              append({
                date: "",
                durationMinutes: options?.durations[0]?.minutes ?? 60,
                startTime: "",
              })
            }
            type="button"
            variant="secondary"
          >
            <Plus aria-hidden="true" size={15} /> 일정 추가
          </Button>
          {limitReason ? <p className={styles.help}>{limitReason}</p> : null}
        </div>
      </section>
    </>
  );
}
