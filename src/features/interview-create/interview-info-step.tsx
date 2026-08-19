"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { isCancelledError, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown } from "lucide-react";
import { Fragment, useRef, useState, useTransition } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  searchJobPostingsOptions,
  searchJobPostingsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { JobRoleDialog } from "@/features/mypage/job-role-dialog";
import { jobRoleDialog } from "@/features/mypage/job-role-dialog-handle";
import * as jobRoleStyles from "@/features/mypage/job-role-field.css";
import type { JobRoleGroup } from "@/features/mypage/mypage-model";
import * as pillFieldStyles from "@/features/mypage/profile-pill-field.css";
import type {
  InterviewCreateFormValues,
  RoomFormOptions,
  SelectedJobPosting,
} from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

type InterviewInfoStepProps = {
  jobRoleGroups: JobRoleGroup[];
  options: RoomFormOptions;
};

type PostingComboboxProps = {
  name: string;
  onBlur: () => void;
  onChange: (value: SelectedJobPosting | null) => void;
  value: SelectedJobPosting | null;
};

function formatPosting(posting: SelectedJobPosting) {
  return posting.company?.name
    ? `[${posting.company.name}] ${posting.postingName}`
    : posting.postingName;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("error" in error)) {
    return fallback;
  }

  const detail = error.error;

  if (typeof detail !== "object" || detail === null || !("message" in detail)) {
    return fallback;
  }

  return typeof detail.message === "string" ? detail.message : fallback;
}

function mergePostings(results: SelectedJobPosting[], selected: SelectedJobPosting | null) {
  if (selected === null || results.some((item) => item.jobPostingId === selected.jobPostingId)) {
    return results;
  }

  return [selected, ...results];
}

function PostingCombobox({ name, onBlur, onChange, value }: PostingComboboxProps) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState(value === null ? "" : formatPosting(value));
  const [searchResults, setSearchResults] = useState<SelectedJobPosting[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedValueRef = useRef(value);
  const items = mergePostings(searchResults, value);
  const query = inputValue.trim();
  const selectedLabel = value === null ? "" : formatPosting(value);
  const status = isPending
    ? "채용 공고를 검색하고 있어요."
    : searchError ||
      (!query
        ? "회사명이나 공고명을 입력해 주세요."
        : searchResults.length === 0 && query !== selectedLabel
          ? `“${query}” 검색 결과가 없어요.`
          : null);

  return (
    <Combobox.Root<SelectedJobPosting>
      filter={null}
      inputValue={inputValue}
      isItemEqualToValue={(item, selected) => item.jobPostingId === selected.jobPostingId}
      itemToStringLabel={formatPosting}
      itemToStringValue={(posting) => String(posting.jobPostingId)}
      items={items}
      name={name}
      onInputValueChange={(nextInputValue, details) => {
        setInputValue(nextInputValue);

        if (details.reason === "item-press") {
          return;
        }

        void queryClient.cancelQueries({ queryKey: searchJobPostingsQueryKey() });
        const nextQuery = nextInputValue.trim();

        if (!nextQuery || nextQuery === selectedLabel) {
          setSearchResults([]);
          setSearchError(null);
          return;
        }

        startTransition(async () => {
          setSearchError(null);

          try {
            const result = await queryClient.fetchQuery(
              searchJobPostingsOptions({ query: { query: nextQuery } }),
            );

            startTransition(() => {
              setSearchResults(result.data?.jobPostings ?? []);
              setSearchError(null);
            });
          } catch (error) {
            if (!isCancelledError(error)) {
              startTransition(() => {
                setSearchResults([]);
                setSearchError(
                  getErrorMessage(error, "채용 공고 검색에 실패했어요. 다시 시도해 주세요."),
                );
              });
            }
          }
        });
      }}
      onOpenChangeComplete={(open) => {
        if (!open) {
          void queryClient.cancelQueries({ queryKey: searchJobPostingsQueryKey() });
          setInputValue(selectedValueRef.current ? formatPosting(selectedValueRef.current) : "");
          setSearchResults([]);
          setSearchError(null);
        }
      }}
      onValueChange={(nextValue) => {
        selectedValueRef.current = nextValue;
        onChange(nextValue);
        setInputValue(nextValue ? formatPosting(nextValue) : "");
        setSearchResults([]);
        setSearchError(null);
      }}
      value={value}
    >
      <Combobox.InputGroup className={styles.comboboxInputGroup}>
        <Combobox.Input
          aria-label="채용 공고"
          autoComplete="off"
          className={styles.comboboxInput}
          maxLength={50}
          onBlur={onBlur}
          placeholder="회사명이나 공고명을 검색해요"
          spellCheck={false}
        />
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner className={styles.comboboxPositioner} sideOffset={4}>
          <Combobox.Popup aria-busy={isPending || undefined} className={styles.comboboxPopup}>
            <Combobox.Status>
              {status ? <div className={styles.comboboxStatus}>{status}</div> : null}
            </Combobox.Status>
            <Combobox.Empty>
              {!isPending && !searchError && query && query !== selectedLabel ? (
                <div className={styles.comboboxEmpty}>다른 검색어를 입력해 보세요.</div>
              ) : null}
            </Combobox.Empty>
            <Combobox.List className={styles.comboboxList}>
              {(posting: SelectedJobPosting) => (
                <Combobox.Item
                  className={styles.comboboxItem}
                  key={posting.jobPostingId}
                  value={posting}
                >
                  <Combobox.ItemIndicator className={styles.comboboxIndicator}>
                    <Check aria-hidden="true" size={14} strokeWidth={2} />
                  </Combobox.ItemIndicator>
                  <span className={styles.postingCopy}>
                    <span className={styles.postingName}>{posting.postingName}</span>
                    {posting.company?.name ? (
                      <span className={styles.companyName}>{posting.company.name}</span>
                    ) : null}
                  </span>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

function FieldLabel({ children, optional }: { children: string; optional?: boolean }) {
  return (
    <Field.Label className={styles.fieldLabel}>
      <span>{children}</span>
      {optional ? <span className={styles.fieldRequirement}>선택</span> : null}
    </Field.Label>
  );
}

function ChoiceLabel({ children, optional }: { children: string; optional?: boolean }) {
  return (
    <div className={styles.fieldLabel}>
      <span>{children}</span>
      {optional ? <span className={styles.fieldRequirement}>선택</span> : null}
    </div>
  );
}

export function InterviewInfoStep({ jobRoleGroups, options }: InterviewInfoStepProps) {
  const { clearErrors, control } = useFormContext<InterviewCreateFormValues>();

  return (
    <div className={styles.formCard}>
      <Controller
        control={control}
        name="posting"
        rules={{ required: "채용 공고를 선택해 주세요." }}
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <FieldLabel>채용 공고</FieldLabel>
            <PostingCombobox
              name={field.name}
              onBlur={field.onBlur}
              onChange={(nextPosting) => {
                field.onChange(nextPosting);
                clearErrors("posting");
              }}
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
        name="jobRoleId"
        rules={{ validate: (value) => value !== null || "직무를 선택해 주세요." }}
        render={({ field, fieldState }) => {
          const selectedJobRole = jobRoleGroups
            .flatMap((group) => group.roles)
            .find((role) => role.jobRoleId === field.value);

          return (
            <Fragment>
              <Field.Root
                className={styles.field}
                dirty={fieldState.isDirty}
                invalid={fieldState.invalid}
                name={field.name}
                touched={fieldState.isTouched}
              >
                <FieldLabel>직무</FieldLabel>
                <div className={`${jobRoleStyles.fieldFrame} ${styles.jobRoleFrame}`}>
                  <Field.Control
                    className={jobRoleStyles.fieldTrigger}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    render={<Dialog.Trigger handle={jobRoleDialog} />}
                    type="button"
                    value={field.value === null ? "" : String(field.value)}
                  />
                  <div className={jobRoleStyles.fieldContent}>
                    {selectedJobRole ? (
                      <span className={styles.selectedJobRole}>{selectedJobRole.displayName}</span>
                    ) : (
                      <span className={pillFieldStyles.placeholder}>직무를 선택해 주세요.</span>
                    )}
                    <ChevronDown
                      aria-hidden="true"
                      className={jobRoleStyles.fieldChevron}
                      size={16}
                    />
                  </div>
                </div>
                <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
                  {fieldState.error?.message}
                </Field.Error>
              </Field.Root>
              <JobRoleDialog
                groups={jobRoleGroups}
                mode="single"
                onValueChange={(nextValue) => {
                  field.onChange(nextValue);
                  clearErrors("jobRoleId");
                }}
                value={field.value}
              />
            </Fragment>
          );
        }}
      />

      <Controller
        control={control}
        name="round"
        rules={{ required: "면접 차수를 선택해 주세요." }}
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <ChoiceLabel>면접 차수</ChoiceLabel>
            <RadioGroup
              aria-label="면접 차수"
              aria-required="true"
              className={styles.choiceGroup}
              inputRef={field.ref}
              name={field.name}
              onValueChange={(nextValue) => {
                field.onChange(nextValue);
                clearErrors("round");
              }}
              value={field.value}
            >
              {options.rounds.map((round) => (
                <Radio.Root
                  aria-label={round.label}
                  className={styles.choicePill}
                  key={round.code}
                  value={round.code}
                >
                  {round.label}
                </Radio.Root>
              ))}
            </RadioGroup>
            <Field.Error className={styles.fieldError} match={Boolean(fieldState.error)}>
              {fieldState.error?.message}
            </Field.Error>
          </Field.Root>
        )}
      />

      <Controller
        control={control}
        name="type"
        render={({ field, fieldState }) => (
          <Field.Root
            className={styles.field}
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <ChoiceLabel optional>면접 유형</ChoiceLabel>
            <ToggleGroup
              aria-label="면접 유형"
              className={styles.choiceGroup}
              onValueChange={(nextValue) => field.onChange(nextValue[0] ?? null)}
              value={field.value === null ? [] : [field.value]}
            >
              {options.types.map((type) => (
                <Toggle className={styles.choicePill} key={type.code} value={type.code}>
                  {type.label}
                </Toggle>
              ))}
            </ToggleGroup>
          </Field.Root>
        )}
      />
    </div>
  );
}
