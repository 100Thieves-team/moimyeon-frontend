"use client";

import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Search } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import {
  roomFormOptionsOptions,
  searchJobPostingsOptions,
  searchJobRolesOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import {
  interviewCreateDefaultValues,
  type InterviewCreateFormValues,
  type SelectedJobRole,
  type SelectedPosting,
} from "./interview-create-model";
import { JobPostingLinkDialog } from "./job-posting-link-dialog";
import * as styles from "./interview-create-wizard.css";

const steps = ["면접 정보", "진행 방식과 일정", "소개와 이력서", "최종 확인"] as const;

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("error" in error)) return fallback;
  const detail = error.error;
  if (typeof detail !== "object" || detail === null || !("message" in detail)) return fallback;
  return typeof detail.message === "string" ? detail.message : fallback;
}

function PostingSearch() {
  const { control, setValue } = useFormContext<InterviewCreateFormValues>();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SelectedPosting[]>([]);
  const [message, setMessage] = useState("회사명이나 공고명을 입력해 주세요.");
  const [isPending, startTransition] = useTransition();

  const search = (nextQuery: string) => {
    setQuery(nextQuery);
    const trimmed = nextQuery.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setMessage("두 글자 이상 입력해 주세요.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await queryClient.fetchQuery(
          searchJobPostingsOptions({ query: { query: trimmed } }),
        );
        if (response.data?.query !== trimmed) return;
        const nextResults = (response.data.jobPostings ?? []).map((posting) => ({
          companyId: posting.company?.companyId ?? 0,
          companyName: posting.company?.name ?? "회사 정보 없음",
          jobPostingId: posting.jobPostingId,
          postingName: posting.postingName,
          jobRoleId: posting.jobRoleId,
          jobRoleName: posting.jobRoleName,
        }));
        setResults(nextResults);
        setMessage(nextResults.length === 0 ? "검색 결과가 없어요." : "");
      } catch (error) {
        setResults([]);
        setMessage(getErrorMessage(error, "공고 검색에 실패했어요."));
      }
    });
  };

  return (
    <Controller
      control={control}
      name="posting"
      rules={{ required: "채용 공고를 선택해 주세요." }}
      render={({ field, fieldState }) => (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="posting-search">
            채용 공고 <span className={styles.required}>필수</span>
          </label>
          {field.value ? (
            <button
              className={styles.selectedValue}
              onClick={() => field.onChange(null)}
              type="button"
            >
              <span>
                [{field.value.companyName}] {field.value.postingName}
              </span>
              <span>변경</span>
            </button>
          ) : (
            <>
              <div className={styles.searchInputWrap}>
                <Search aria-hidden="true" size={16} />
                <input
                  aria-describedby={fieldState.error ? "posting-error" : "posting-help"}
                  aria-invalid={Boolean(fieldState.error)}
                  autoComplete="off"
                  className={styles.input}
                  id="posting-search"
                  maxLength={50}
                  onBlur={field.onBlur}
                  onChange={(event) => search(event.target.value)}
                  placeholder="회사명 또는 공고명 검색"
                  value={query}
                />
              </div>
              <div aria-busy={isPending || undefined} className={styles.searchResults}>
                {results.map((posting) => (
                  <button
                    className={styles.searchResult}
                    key={posting.jobPostingId}
                    onClick={() => {
                      field.onChange(posting);
                      if (posting.jobRoleId && posting.jobRoleName) {
                        setValue(
                          "jobRole",
                          { displayName: posting.jobRoleName, jobRoleId: posting.jobRoleId },
                          { shouldValidate: true },
                        );
                      }
                    }}
                    type="button"
                  >
                    <strong>{posting.companyName}</strong>
                    <span>{posting.postingName}</span>
                  </button>
                ))}
                {message ? <p className={styles.searchMessage}>{message}</p> : null}
              </div>
            </>
          )}
          <p className={styles.help} id="posting-help">
            찾는 공고가 없나요? <JobPostingLinkDialog onCreated={field.onChange} />
          </p>
          {fieldState.error ? (
            <p className={styles.error} id="posting-error">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}

function JobRoleSearch() {
  const { control } = useFormContext<InterviewCreateFormValues>();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SelectedJobRole[]>([]);
  const [isPending, startTransition] = useTransition();

  return (
    <Controller
      control={control}
      name="jobRole"
      rules={{ required: "직무를 선택해 주세요." }}
      render={({ field, fieldState }) => (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="job-role-search">
            직무 <span className={styles.required}>필수</span>
          </label>
          {field.value ? (
            <button
              className={styles.selectedValue}
              onClick={() => field.onChange(null)}
              type="button"
            >
              <span>{field.value.displayName}</span>
              <span>변경</span>
            </button>
          ) : (
            <>
              <input
                aria-invalid={Boolean(fieldState.error)}
                autoComplete="off"
                className={styles.inputStandalone}
                id="job-role-search"
                maxLength={50}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  if (!nextQuery.trim()) return setResults([]);
                  startTransition(async () => {
                    try {
                      const response = await queryClient.fetchQuery(
                        searchJobRolesOptions({ query: { query: nextQuery.trim() } }),
                      );
                      setResults(response.data?.jobRoles ?? []);
                    } catch {
                      setResults([]);
                    }
                  });
                }}
                placeholder="직무 검색"
                value={query}
              />
              <div aria-busy={isPending || undefined} className={styles.searchResults}>
                {results.map((jobRole) => (
                  <button
                    className={styles.searchResult}
                    key={jobRole.jobRoleId}
                    onClick={() => field.onChange(jobRole)}
                    type="button"
                  >
                    {jobRole.displayName}
                  </button>
                ))}
              </div>
            </>
          )}
          {fieldState.error ? <p className={styles.error}>{fieldState.error.message}</p> : null}
        </div>
      )}
    />
  );
}

function ChoiceField({
  label,
  name,
  options,
  required = true,
}: {
  label: string;
  name: "round" | "type";
  options: { code: string; label: string }[];
  required?: boolean;
}) {
  const { control } = useFormContext<InterviewCreateFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: `${label}을 선택해 주세요.` } : undefined}
      render={({ field, fieldState }) => (
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>
            {label} <span className={styles.required}>{required ? "필수" : "선택"}</span>
          </legend>
          <div className={styles.choiceList}>
            {options.map((option) => (
              <label
                className={styles.choice}
                data-selected={field.value === option.code}
                key={option.code}
              >
                <input
                  checked={field.value === option.code}
                  className={styles.visuallyHidden}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={() => field.onChange(option.code)}
                  type="radio"
                  value={option.code}
                />
                {field.value === option.code ? <Check aria-hidden="true" size={13} /> : null}
                {option.label}
              </label>
            ))}
          </div>
          {fieldState.error ? <p className={styles.error}>{fieldState.error.message}</p> : null}
        </fieldset>
      )}
    />
  );
}

function InformationStep() {
  const { data } = useSuspenseQuery(roomFormOptionsOptions());
  const options = data.data;
  return (
    <>
      <h1 className={styles.title}>어떤 면접을 준비하나요?</h1>
      <section className={styles.card}>
        <PostingSearch />
        <JobRoleSearch />
        <ChoiceField label="면접 차수" name="round" options={options?.rounds ?? []} />
        <ChoiceField
          label="면접 유형"
          name="type"
          options={options?.types ?? []}
          required={false}
        />
      </section>
    </>
  );
}

export function InterviewCreateWizard() {
  const methods = useForm<InterviewCreateFormValues>({
    defaultValues: interviewCreateDefaultValues,
    mode: "onBlur",
    shouldUnregister: false,
  });
  const [step, setStep] = useState(0);

  const goNext = async () => {
    const valid = await methods.trigger(["posting", "jobRole", "round"]);
    if (valid) setStep(1);
  };

  return (
    <FormProvider {...methods}>
      <main className={styles.page}>
        <div className={styles.layout}>
          <nav aria-label="면접 생성 단계" className={styles.steps}>
            <p className={styles.eyebrow}>면접 만들기</p>
            <ol className={styles.stepList}>
              {steps.map((label, index) => (
                <li
                  className={styles.stepItem}
                  data-active={step === index}
                  data-complete={step > index}
                  key={label}
                >
                  <button
                    className={styles.stepButton}
                    disabled={index > step}
                    onClick={() => index < step && setStep(index)}
                    type="button"
                  >
                    <span>{step > index ? "✓" : String(index + 1).padStart(2, "0")}</span>
                    {label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <form className={styles.main} onSubmit={(event) => event.preventDefault()}>
            {step === 0 ? (
              <InformationStep />
            ) : (
              <>
                <h1 className={styles.title}>다음 단계가 이어질 예정이에요</h1>
                <section className={styles.card}>현재 PR은 면접 정보 단계까지 포함합니다.</section>
              </>
            )}
            <div className={styles.actions}>
              <Button
                onClick={() => (step === 0 ? history.back() : setStep(step - 1))}
                type="button"
                variant="ghost"
              >
                <ArrowLeft aria-hidden="true" size={16} /> {step === 0 ? "나가기" : "이전"}
              </Button>
              {step === 0 ? (
                <Button onClick={goNext} type="button">
                  다음 <ArrowRight aria-hidden="true" size={16} />
                </Button>
              ) : null}
            </div>
          </form>
        </div>
      </main>
    </FormProvider>
  );
}
