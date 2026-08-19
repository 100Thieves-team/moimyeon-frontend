"use client";

import { Field } from "@base-ui/react/field";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Select } from "@base-ui/react/select";
import { Slider } from "@base-ui/react/slider";
import { Check, ChevronDown } from "lucide-react";
import { useMemo, type Ref } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type {
  InterviewCreateFormValues,
  ParticipationSlots,
  Regions,
  RoomFormOptions,
} from "./interview-create-model";
import { validateInterviewSchedule, validateParticipantRange } from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

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

type MethodAndScheduleStepProps = {
  creationLimit?: { activeRoomCount: number; remaining: number };
  creationLimitIsError: boolean;
  creationLimitIsPending: boolean;
  hasCreationLimitParams: boolean;
  options: RoomFormOptions;
  participationSlots: ParticipationSlots;
  regions: Regions;
};

export function MethodAndScheduleStep({
  creationLimit,
  creationLimitIsError,
  creationLimitIsPending,
  hasCreationLimitParams,
  options,
  participationSlots,
  regions,
}: MethodAndScheduleStepProps) {
  const { clearErrors, control, setValue } = useFormContext<InterviewCreateFormValues>();
  const method = useWatch({ control, name: "method" });
  const sido = useWatch({ control, name: "sido" });
  const canCreateRoom =
    creationLimit !== undefined && creationLimit.remaining > 0 && participationSlots.remaining > 0;
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
  const today = formatLocalDate(new Date());
  const scheduleLimitMessage = !hasCreationLimitParams
    ? null
    : creationLimitIsPending
      ? "면접을 만들 수 있는지 확인하고 있어요."
      : creationLimitIsError
        ? "면접 생성 가능 여부를 확인하지 못했어요. 잠시 후 다시 시도해 주세요."
        : !canCreateRoom
          ? "현재는 새 면접을 만들 수 없어요."
          : null;

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
              validate: (_, formValues) => validateParticipantRange(formValues, options),
            }}
            render={({ field: minField, fieldState: minFieldState }) => (
              <Controller
                control={control}
                name="maxParticipants"
                rules={{
                  validate: (_, formValues) => validateParticipantRange(formValues, options),
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
          </div>

          <div className={styles.scheduleRow}>
            <Controller
              control={control}
              name="schedule.date"
              rules={{ required: "날짜를 선택해 주세요." }}
              render={({ field, fieldState }) => (
                <Field.Root
                  className={styles.scheduleField}
                  dirty={fieldState.isDirty}
                  invalid={fieldState.invalid}
                  name={field.name}
                  touched={fieldState.isTouched}
                >
                  <Field.Label className={styles.scheduleFieldLabel}>날짜</Field.Label>
                  <Field.Control
                    className={styles.nativeInput}
                    min={today}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
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
              name="schedule.startTime"
              rules={{
                validate: (_, formValues) =>
                  validateInterviewSchedule(formValues.schedule, options),
              }}
              render={({ field, fieldState }) => (
                <Field.Root
                  className={styles.scheduleField}
                  dirty={fieldState.isDirty}
                  invalid={fieldState.invalid}
                  name={field.name}
                  touched={fieldState.isTouched}
                >
                  <Field.Label className={styles.scheduleFieldLabel}>시작 시간</Field.Label>
                  <Field.Control
                    className={styles.nativeInput}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
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
              name="schedule.durationMinutes"
              rules={{ required: "예상 소요 시간을 선택해 주세요." }}
              render={({ field, fieldState }) => (
                <Field.Root
                  className={styles.scheduleField}
                  dirty={fieldState.isDirty}
                  invalid={fieldState.invalid}
                  name={field.name}
                  touched={fieldState.isTouched}
                >
                  <Field.Label className={styles.scheduleFieldLabel}>예상 소요 시간</Field.Label>
                  <SelectControl
                    ariaLabel="예상 소요 시간"
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
          </div>

          {scheduleLimitMessage ? (
            <output className={styles.limitNotice}>{scheduleLimitMessage}</output>
          ) : null}
        </section>
      </section>
    </div>
  );
}
