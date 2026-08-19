"use client";

import { Field } from "@base-ui/react/field";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Select } from "@base-ui/react/select";
import { Slider } from "@base-ui/react/slider";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, type Ref } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
  type FieldError,
} from "react-hook-form";
import { roomCreationLimitOptions } from "@/api/generated/@tanstack/react-query.gen";
import type {
  InterviewCreateFormValues,
  InterviewSchedule,
  ParticipationSlots,
  Regions,
  RoomFormOptions,
} from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

const SCHEDULE_HARD_LIMIT = 3;

type SelectItem<Value extends number | string> = {
  label: string;
  value: Value;
};

type SelectControlProps<Value extends number | string> = {
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  items: SelectItem<Value>[];
  name: string;
  onBlur?: () => void;
  onChange: (value: Value) => void;
  placeholder: string;
  value: Value | null;
};

function SelectControl<Value extends number | string>({
  ariaLabel,
  className,
  disabled,
  inputRef,
  items,
  name,
  onBlur,
  onChange,
  placeholder,
  value,
}: SelectControlProps<Value>) {
  return (
    <Select.Root
      disabled={disabled}
      inputRef={inputRef}
      items={items}
      name={name}
      onValueChange={(nextValue) => {
        if (nextValue !== null) {
          onChange(nextValue);
        }
      }}
      value={value}
    >
      <Select.Trigger
        aria-label={ariaLabel}
        className={`${styles.selectTrigger} ${className ?? ""}`}
        onBlur={onBlur}
      >
        <Select.Value className={styles.selectValue} placeholder={placeholder} />
        <Select.Icon className={styles.selectIcon}>
          <ChevronDown aria-hidden="true" size={16} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className={styles.selectPositioner} sideOffset={4}>
          <Select.Popup className={styles.selectPopup}>
            <Select.List className={styles.selectList}>
              {items.map((item) => (
                <Select.Item className={styles.selectItem} key={item.value} value={item.value}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator className={styles.selectIndicator}>
                    <Check aria-hidden="true" size={14} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <Field.Label className={styles.fieldLabel}>{children}</Field.Label>;
}

function ChoiceLabel({ children }: { children: string }) {
  return <div className={styles.fieldLabel}>{children}</div>;
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getScheduleTimestamp(schedule: InterviewSchedule) {
  const [year, month, day] = schedule.date.split("-").map(Number);
  const [hour, minute] = schedule.startTime.split(":").map(Number);

  if ([year, month, day, hour, minute].some((value) => !Number.isInteger(value))) {
    return null;
  }

  const date = new Date(year, month - 1, day, hour, minute);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

  return date.getTime();
}

function getScheduleKey(schedule: InterviewSchedule) {
  return schedule.date && schedule.startTime ? `${schedule.date}T${schedule.startTime}` : null;
}

type MethodAndScheduleStepProps = {
  options: RoomFormOptions;
  participationSlots: ParticipationSlots;
  regions: Regions;
};

export function MethodAndScheduleStep({
  options,
  participationSlots,
  regions,
}: MethodAndScheduleStepProps) {
  const {
    clearErrors,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useFormContext<InterviewCreateFormValues>();
  const posting = useWatch({ control, name: "posting" });
  const jobRoleId = useWatch({ control, name: "jobRoleId" });
  const method = useWatch({ control, name: "method" });
  const sido = useWatch({ control, name: "sido" });
  const hasCreationLimitParams = posting !== null && jobRoleId !== null;
  const creationLimitQuery = useQuery({
    ...roomCreationLimitOptions({
      query: {
        jobPostingId: String(posting?.jobPostingId ?? ""),
        jobRoleId: String(jobRoleId ?? ""),
      },
    }),
    enabled: hasCreationLimitParams,
  });
  const creationLimit = creationLimitQuery.data?.data;
  const scheduleLimit = creationLimit
    ? Math.min(creationLimit.remaining, participationSlots.remaining, SCHEDULE_HARD_LIMIT)
    : null;
  const defaultDuration = options.durations[0]?.minutes ?? 60;
  const selectedSido = regions.sidos.find((region) => region.name === sido) ?? null;
  const participantMinimum = options.participantConstraints?.min ?? 2;
  const participantMaximum = options.participantConstraints?.max ?? 8;
  const participantValues = useMemo(
    () =>
      Array.from(
        { length: participantMaximum - participantMinimum + 1 },
        (_, index) => participantMinimum + index,
      ),
    [participantMaximum, participantMinimum],
  );
  const durationItems = options.durations.map((duration) => ({
    label: duration.label,
    value: duration.minutes,
  }));
  const sidoItems = regions.sidos.map((region) => ({
    label: region.shortName,
    value: region.name,
  }));
  const { append, fields, remove } = useFieldArray({
    control,
    name: "schedules",
    rules: {
      minLength: { message: "일정을 한 개 이상 입력해 주세요.", value: 1 },
      validate: {
        duplicate: (schedules) => {
          const keys = schedules.map(getScheduleKey).filter((key): key is string => key !== null);
          return new Set(keys).size === keys.length || "같은 날짜와 시작 시간은 중복할 수 없어요.";
        },
        limit: (schedules) => {
          if (!hasCreationLimitParams) {
            return "이전 단계에서 채용 공고와 직무를 먼저 선택해 주세요.";
          }

          if (creationLimitQuery.isPending) {
            return "생성 가능한 일정 수를 확인하고 있어요.";
          }

          if (creationLimitQuery.isError || scheduleLimit === null) {
            return "생성 가능한 일정 수를 확인하지 못했어요. 다시 시도해 주세요.";
          }

          return (
            schedules.length <= scheduleLimit ||
            `일정은 최대 ${scheduleLimit}개까지 추가할 수 있어요.`
          );
        },
      },
    },
  });
  const scheduleRootError = errors.schedules?.root as FieldError | undefined;
  const hasScheduleRootError = Boolean(scheduleRootError);
  const today = formatLocalDate(new Date());
  const canAddSchedule = scheduleLimit !== null && fields.length < scheduleLimit;
  const scheduleLimitMessage = !hasCreationLimitParams
    ? null
    : creationLimitQuery.isPending
      ? "생성 가능한 일정 수를 확인하고 있어요."
      : creationLimitQuery.isError || scheduleLimit === null
        ? "생성 가능한 일정 수를 확인하지 못했어요. 잠시 후 다시 시도해 주세요."
        : scheduleLimit === 0
          ? "현재는 새 면접 일정을 만들 수 없어요."
          : scheduleLimit < SCHEDULE_HARD_LIMIT || fields.length >= scheduleLimit
            ? `현재 일정은 최대 ${scheduleLimit}개까지 추가할 수 있어요.`
            : null;

  useEffect(() => {
    if (hasScheduleRootError) {
      void trigger("schedules");
    }
  }, [
    scheduleLimit,
    creationLimitQuery.isError,
    creationLimitQuery.isPending,
    hasScheduleRootError,
    trigger,
  ]);

  const revalidateSchedules = () => {
    queueMicrotask(() => void trigger("schedules"));
  };

  return (
    <div className={styles.methodScheduleStack}>
      <section className={styles.formCard}>
        <Controller
          control={control}
          name="method"
          rules={{ required: "진행 방식을 선택해 주세요." }}
          render={({ field, fieldState }) => (
            <Field.Root
              className={styles.field}
              dirty={fieldState.isDirty}
              invalid={fieldState.invalid}
              name={field.name}
              touched={fieldState.isTouched}
            >
              <ChoiceLabel>진행 방식</ChoiceLabel>
              <RadioGroup
                aria-label="진행 방식"
                aria-required="true"
                className={styles.methodChoiceGroup}
                inputRef={field.ref}
                name={field.name}
                onValueChange={(nextValue) => {
                  field.onChange(nextValue);
                  clearErrors("method");

                  if (nextValue === "ONLINE") {
                    setValue("sido", null, { shouldDirty: true, shouldValidate: false });
                    setValue("sigunguId", null, { shouldDirty: true, shouldValidate: false });
                    clearErrors(["sido", "sigunguId"]);
                  }
                }}
                value={field.value}
              >
                {options.methods.map((methodOption) => (
                  <Radio.Root
                    aria-label={methodOption.label}
                    className={styles.methodChoice}
                    key={methodOption.code}
                    value={methodOption.code}
                  >
                    <span className={styles.methodChoiceLabel}>{methodOption.label}</span>
                  </Radio.Root>
                ))}
              </RadioGroup>
              <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
                {fieldState.error?.message}
              </Field.Error>
            </Field.Root>
          )}
        />

        {method === "OFFLINE" ? (
          <div className={styles.regionFields}>
            <Controller
              control={control}
              name="sido"
              render={({ field, fieldState }) => (
                <Field.Root
                  className={styles.field}
                  dirty={fieldState.isDirty}
                  invalid={fieldState.invalid}
                  name={field.name}
                  touched={fieldState.isTouched}
                >
                  <FieldLabel>시도</FieldLabel>
                  <SelectControl
                    ariaLabel="시도"
                    inputRef={field.ref}
                    items={sidoItems}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(nextValue) => {
                      field.onChange(nextValue);
                      setValue("sigunguId", null, { shouldDirty: true, shouldValidate: true });
                    }}
                    placeholder="시도를 선택해 주세요"
                    value={field.value}
                  />
                  <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
                    {fieldState.error?.message}
                  </Field.Error>
                </Field.Root>
              )}
            />
            <Controller
              control={control}
              name="sigunguId"
              rules={{
                validate: (value, formValues) =>
                  formValues.method !== "OFFLINE" || value !== null || "시군구를 선택해 주세요.",
              }}
              render={({ field, fieldState }) => (
                <Field.Root
                  className={styles.field}
                  dirty={fieldState.isDirty}
                  invalid={fieldState.invalid}
                  name={field.name}
                  touched={fieldState.isTouched}
                >
                  <FieldLabel>시군구</FieldLabel>
                  <SelectControl
                    ariaLabel="시군구"
                    disabled={selectedSido === null}
                    inputRef={field.ref}
                    items={(selectedSido?.sigungus ?? []).map((sigungu) => ({
                      label: sigungu.name,
                      value: sigungu.sigunguId,
                    }))}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(nextValue) => {
                      field.onChange(nextValue);
                      clearErrors("sigunguId");
                    }}
                    placeholder={
                      selectedSido ? "시군구를 선택해 주세요" : "시도를 먼저 선택해 주세요"
                    }
                    value={field.value}
                  />
                  <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
                    {fieldState.error?.message}
                  </Field.Error>
                </Field.Root>
              )}
            />
          </div>
        ) : null}

        <div className={styles.participantSection}>
          <Controller
            control={control}
            name="minParticipants"
            rules={{
              validate: (value) =>
                (value >= participantMinimum && value <= participantMaximum) ||
                `${participantMinimum}명부터 ${participantMaximum}명까지 선택해 주세요.`,
            }}
            render={({ field: minField, fieldState: minFieldState }) => (
              <Controller
                control={control}
                name="maxParticipants"
                rules={{
                  validate: (value, formValues) =>
                    (value >= participantMinimum &&
                      value <= participantMaximum &&
                      value >= formValues.minParticipants) ||
                    `${participantMinimum}명부터 ${participantMaximum}명까지 선택해 주세요.`,
                }}
                render={({ field: maxField, fieldState: maxFieldState }) => (
                  <div className={styles.participantSliderField}>
                    <Slider.Root
                      className={styles.participantSlider}
                      max={participantMaximum}
                      min={participantMinimum}
                      minStepsBetweenValues={0}
                      onValueChange={([nextMinimum, nextMaximum]) => {
                        minField.onChange(nextMinimum);
                        maxField.onChange(nextMaximum);
                        clearErrors(["minParticipants", "maxParticipants"]);
                      }}
                      step={1}
                      thumbCollisionBehavior="none"
                      value={[minField.value, maxField.value]}
                    >
                      <div className={styles.participantHeading}>
                        <Slider.Label className={styles.fieldLabel}>모집 인원</Slider.Label>
                        <Slider.Value className={styles.participantValue}>
                          {(_, values) => `최소 ${values[0]}명 · 최대 ${values[1]}명`}
                        </Slider.Value>
                      </div>
                      <div className={styles.sliderBody}>
                        <Slider.Control className={styles.sliderControl}>
                          <Slider.Track className={styles.sliderTrack}>
                            <Slider.Indicator className={styles.sliderIndicator} />
                          </Slider.Track>
                          <Slider.Thumb
                            className={styles.sliderThumb}
                            getAriaLabel={() => "최소 참여 인원"}
                            getAriaValueText={(_, value) => `${value}명`}
                            index={0}
                            inputRef={minField.ref}
                            onBlur={minField.onBlur}
                          />
                          <Slider.Thumb
                            className={styles.sliderThumb}
                            getAriaLabel={() => "최대 참여 인원"}
                            getAriaValueText={(_, value) => `${value}명`}
                            index={1}
                            inputRef={maxField.ref}
                            onBlur={maxField.onBlur}
                          />
                        </Slider.Control>
                        <div aria-hidden="true" className={styles.sliderTicks}>
                          {participantValues.map((value) => (
                            <span key={value}>{value}</span>
                          ))}
                        </div>
                      </div>
                    </Slider.Root>
                    {minFieldState.error?.message ? (
                      <p className={styles.fieldError} role="alert">
                        {minFieldState.error.message}
                      </p>
                    ) : null}
                    {maxFieldState.error?.message ? (
                      <p className={styles.fieldError} role="alert">
                        {maxFieldState.error.message}
                      </p>
                    ) : null}
                  </div>
                )}
              />
            )}
          />
        </div>

        <section className={styles.scheduleSection}>
          <h2 className={styles.fieldLabel}>진행 일정</h2>

          {creationLimit && creationLimit.activeRoomCount > 0 ? (
            <p className={styles.warningNotice}>
              같은 공고와 직무로 진행 중인 면접이 {creationLimit.activeRoomCount}개 있어요.
            </p>
          ) : null}

          <div aria-hidden="true" className={styles.scheduleColumnHeader}>
            <span>날짜</span>
            <span>시작 시각</span>
            <span>예상 시간</span>
            <span />
          </div>

          <div className={styles.scheduleList}>
            {fields.map((scheduleField, index) => (
              <div className={styles.scheduleRow} key={scheduleField.id}>
                <Controller
                  control={control}
                  name={`schedules.${index}.date`}
                  rules={{ required: "날짜를 선택해 주세요." }}
                  render={({ field, fieldState }) => (
                    <Field.Root
                      className={styles.scheduleField}
                      dirty={fieldState.isDirty}
                      invalid={fieldState.invalid}
                      name={field.name}
                      touched={fieldState.isTouched}
                    >
                      <Field.Label
                        className={styles.scheduleFieldLabel}
                      >{`날짜 ${index + 1}`}</Field.Label>
                      <Field.Control
                        className={styles.nativeInput}
                        min={today}
                        onBlur={field.onBlur}
                        onChange={(event) => {
                          field.onChange(event);
                          revalidateSchedules();
                        }}
                        ref={field.ref}
                        type="date"
                        value={field.value}
                      />
                      <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
                        {fieldState.error?.message}
                      </Field.Error>
                    </Field.Root>
                  )}
                />
                <Controller
                  control={control}
                  name={`schedules.${index}.startTime`}
                  rules={{
                    required: "시작 시간을 선택해 주세요.",
                    validate: (value, formValues) => {
                      const schedule = formValues.schedules[index];

                      if (!schedule.date || !value) {
                        return true;
                      }

                      const timestamp = getScheduleTimestamp(schedule);
                      return (
                        (timestamp !== null && timestamp > Date.now()) ||
                        "현재보다 이후 시간을 선택해 주세요."
                      );
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Field.Root
                      className={styles.scheduleField}
                      dirty={fieldState.isDirty}
                      invalid={fieldState.invalid}
                      name={field.name}
                      touched={fieldState.isTouched}
                    >
                      <Field.Label
                        className={styles.scheduleFieldLabel}
                      >{`시작 시간 ${index + 1}`}</Field.Label>
                      <Field.Control
                        className={styles.nativeInput}
                        onBlur={field.onBlur}
                        onChange={(event) => {
                          field.onChange(event);
                          revalidateSchedules();
                        }}
                        ref={field.ref}
                        type="time"
                        value={field.value}
                      />
                      <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
                        {fieldState.error?.message}
                      </Field.Error>
                    </Field.Root>
                  )}
                />
                <Controller
                  control={control}
                  name={`schedules.${index}.durationMinutes`}
                  rules={{ required: "예상 소요 시간을 선택해 주세요." }}
                  render={({ field, fieldState }) => (
                    <Field.Root
                      className={styles.scheduleField}
                      dirty={fieldState.isDirty}
                      invalid={fieldState.invalid}
                      name={field.name}
                      touched={fieldState.isTouched}
                    >
                      <Field.Label
                        className={styles.scheduleFieldLabel}
                      >{`예상 소요 시간 ${index + 1}`}</Field.Label>
                      <SelectControl
                        ariaLabel={`예상 소요 시간 ${index + 1}`}
                        className={styles.scheduleControl}
                        inputRef={field.ref}
                        items={durationItems}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        placeholder="소요 시간"
                        value={field.value}
                      />
                      <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
                        {fieldState.error?.message}
                      </Field.Error>
                    </Field.Root>
                  )}
                />
                {fields.length > 1 ? (
                  <button
                    aria-label={`${index + 1}번째 일정 삭제`}
                    className={styles.scheduleRemoveButton}
                    onClick={() => {
                      remove(index);
                      revalidateSchedules();
                    }}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={17} />
                  </button>
                ) : (
                  <span aria-hidden="true" className={styles.scheduleRemovePlaceholder} />
                )}
              </div>
            ))}
          </div>

          <button
            className={styles.scheduleAddButton}
            disabled={!canAddSchedule}
            onClick={() => {
              append({ date: "", durationMinutes: defaultDuration, startTime: "" });
              revalidateSchedules();
            }}
            type="button"
          >
            <Plus aria-hidden="true" size={16} />
            일정 추가
          </button>

          {scheduleLimitMessage ? (
            <output className={styles.limitNotice}>{scheduleLimitMessage}</output>
          ) : null}

          {scheduleRootError?.message ? (
            <p className={styles.fieldError} role="alert">
              {scheduleRootError.message}
            </p>
          ) : null}
        </section>
      </section>
    </div>
  );
}
