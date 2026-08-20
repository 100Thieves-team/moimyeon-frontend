"use client";

import { Field } from "@base-ui/react/field";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { RotateCcw, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { LinkButton } from "@/components/button";
import { InterviewCard, MockSelect } from "./interview-card";
import {
  mockInterviews,
  type MockInterview,
  type MockInterviewMethod,
  type MockInterviewRole,
  type MockInterviewRound,
} from "./mock-data";
import * as styles from "./interview-mock.css";

const roles: { label: string; value: MockInterviewRole }[] = [
  { label: "백엔드 개발", value: "backend" },
  { label: "프론트엔드", value: "frontend" },
  { label: "데이터", value: "data" },
  { label: "PM", value: "pm" },
];

const rounds: { label: string; value: MockInterviewRound }[] = [
  { label: "서류", value: "documents" },
  { label: "1차", value: "first" },
  { label: "2차", value: "second" },
  { label: "기타", value: "other" },
];

const methods: { label: string; value: "all" | MockInterviewMethod }[] = [
  { label: "전체", value: "all" },
  { label: "온라인", value: "online" },
  { label: "오프라인", value: "offline" },
];

const regionItems = [
  { label: "전체 지역", value: "all" },
  { label: "서울", value: "서울" },
  { label: "판교", value: "판교" },
  { label: "부산", value: "부산" },
  { label: "온라인", value: "온라인" },
] as const;

const dateItems = [
  { label: "전체 일정", value: "all" },
  { label: "이번 주", value: "this-week" },
  { label: "다음 주", value: "next-week" },
  { label: "주말", value: "weekend" },
] as const;

const sortItems = [
  { label: "일정 빠른 순", value: "soon" },
  { label: "최근 생성순", value: "newest" },
  { label: "마감 임박순", value: "closing" },
] as const;

type RegionValue = (typeof regionItems)[number]["value"];
type DateValue = (typeof dateItems)[number]["value"];
type SortValue = (typeof sortItems)[number]["value"];

function isOneOf<Value extends string>(
  value: string | null,
  values: readonly Value[],
): value is Value {
  return value !== null && values.includes(value as Value);
}

function withQuery(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function interviewHref(interview: MockInterview, returnTo: string) {
  return `/interviews/${interview.id}?returnTo=${encodeURIComponent(returnTo)}`;
}

export function InterviewExplore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const company = searchParams.get("company") ?? "";
  const selectedRoles = searchParams.getAll("role").filter((value): value is MockInterviewRole =>
    isOneOf(
      value,
      roles.map((item) => item.value),
    ),
  );
  const selectedRounds = searchParams.getAll("round").filter((value): value is MockInterviewRound =>
    isOneOf(
      value,
      rounds.map((item) => item.value),
    ),
  );
  const methodValue = searchParams.get("method");
  const method = isOneOf(methodValue, ["online", "offline"] as const) ? methodValue : "all";
  const regionValue = searchParams.get("region");
  const region = isOneOf(
    regionValue,
    regionItems.map((item) => item.value),
  )
    ? regionValue
    : "all";
  const dateValue = searchParams.get("date");
  const date = isOneOf(
    dateValue,
    dateItems.map((item) => item.value),
  )
    ? dateValue
    : "all";
  const sortValue = searchParams.get("sort");
  const sort = isOneOf(
    sortValue,
    sortItems.map((item) => item.value),
  )
    ? sortValue
    : "soon";
  const [companyDraft, setCompanyDraft] = useState(company);

  useEffect(() => setCompanyDraft(company), [company]);

  const replaceParams = (update: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchString);
    update(next);
    router.replace(withQuery(next));
  };

  const setRepeatedValues = (key: string, values: string[]) => {
    replaceParams((params) => {
      params.delete(key);
      values.forEach((value) => params.append(key, value));
    });
  };

  const filteredInterviews = useMemo(() => {
    const query = company.trim().toLocaleLowerCase("ko-KR");
    const filtered = mockInterviews.filter((interview) => {
      const matchesCompany =
        !query ||
        interview.company.toLocaleLowerCase("ko-KR").includes(query) ||
        interview.title.toLocaleLowerCase("ko-KR").includes(query);
      const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(interview.jobRole);
      const matchesRound = selectedRounds.length === 0 || selectedRounds.includes(interview.round);
      const matchesMethod = method === "all" || interview.method === method;
      const matchesRegion = region === "all" || interview.region === region;
      const matchesDate = date === "all" || interview.dateGroup === date;

      return (
        matchesCompany &&
        matchesRole &&
        matchesRound &&
        matchesMethod &&
        matchesRegion &&
        matchesDate
      );
    });

    if (sort === "newest") return filtered.toReversed();
    if (sort === "closing") {
      return filtered.toSorted(
        (a, b) => Number(b.status === "closing") - Number(a.status === "closing"),
      );
    }
    return filtered;
  }, [company, date, method, region, selectedRoles, selectedRounds, sort]);

  const returnTo = withQuery(new URLSearchParams(searchString));
  const appliedFilters: { key: string; label: string; remove: () => void }[] = [];

  if (company) {
    appliedFilters.push({
      key: "company",
      label: `회사 ${company}`,
      remove: () => replaceParams((params) => params.delete("company")),
    });
  }
  selectedRoles.forEach((value) => {
    appliedFilters.push({
      key: `role-${value}`,
      label: roles.find((item) => item.value === value)?.label ?? value,
      remove: () =>
        setRepeatedValues(
          "role",
          selectedRoles.filter((role) => role !== value),
        ),
    });
  });
  selectedRounds.forEach((value) => {
    appliedFilters.push({
      key: `round-${value}`,
      label: rounds.find((item) => item.value === value)?.label ?? value,
      remove: () =>
        setRepeatedValues(
          "round",
          selectedRounds.filter((round) => round !== value),
        ),
    });
  });
  if (method !== "all") {
    appliedFilters.push({
      key: "method",
      label: methods.find((item) => item.value === method)?.label ?? method,
      remove: () => replaceParams((params) => params.delete("method")),
    });
  }
  if (region !== "all") {
    appliedFilters.push({
      key: "region",
      label: region,
      remove: () => replaceParams((params) => params.delete("region")),
    });
  }
  if (date !== "all") {
    appliedFilters.push({
      key: "date",
      label: dateItems.find((item) => item.value === date)?.label ?? date,
      remove: () => replaceParams((params) => params.delete("date")),
    });
  }

  const submitCompany = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    replaceParams((params) => {
      const value = companyDraft.trim();
      if (value) params.set("company", value);
      else params.delete("company");
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.exploreLayout}>
        <aside aria-label="면접 필터" className={styles.sidebar}>
          <Field.Root className={styles.filterSection} name="company">
            <Field.Label className={styles.filterLabel}>회사</Field.Label>
            <form className={styles.companyForm} onSubmit={submitCompany}>
              <Field.Control
                className={styles.searchInput}
                onValueChange={setCompanyDraft}
                placeholder="회사명을 검색해요"
                value={companyDraft}
              />
              <button aria-label="회사 검색" className={styles.searchButton} type="submit">
                <Search aria-hidden="true" size={16} />
              </button>
            </form>
          </Field.Root>

          <fieldset className={styles.filterSection}>
            <legend className={styles.filterLabel}>직무</legend>
            <ToggleGroup
              aria-label="직무"
              className={styles.choiceGroup}
              multiple
              onValueChange={(values) => setRepeatedValues("role", values)}
              value={selectedRoles}
            >
              {roles.map((item) => (
                <Toggle className={styles.choicePill} key={item.value} value={item.value}>
                  {item.label}
                </Toggle>
              ))}
            </ToggleGroup>
          </fieldset>

          <fieldset className={styles.filterSection}>
            <legend className={styles.filterLabel}>면접 차수</legend>
            <ToggleGroup
              aria-label="면접 차수"
              className={styles.choiceGroup}
              multiple
              onValueChange={(values) => setRepeatedValues("round", values)}
              value={selectedRounds}
            >
              {rounds.map((item) => (
                <Toggle className={styles.choicePill} key={item.value} value={item.value}>
                  {item.label}
                </Toggle>
              ))}
            </ToggleGroup>
          </fieldset>

          <fieldset className={styles.filterSection}>
            <legend className={styles.filterLabel}>진행 방식</legend>
            <ToggleGroup
              aria-label="진행 방식"
              className={styles.methodGroup}
              onValueChange={(values) => {
                const value = values[0] ?? "all";
                replaceParams((params) => {
                  if (value === "all") params.delete("method");
                  else params.set("method", value);
                });
              }}
              value={[method]}
            >
              {methods.map((item) => (
                <Toggle className={styles.methodChoice} key={item.value} value={item.value}>
                  {item.label}
                </Toggle>
              ))}
            </ToggleGroup>
          </fieldset>

          <div className={styles.filterSection}>
            <span className={styles.filterLabel}>지역</span>
            <MockSelect<RegionValue>
              ariaLabel="지역"
              items={[...regionItems]}
              onValueChange={(value) =>
                replaceParams((params) => {
                  if (value === "all") params.delete("region");
                  else params.set("region", value);
                })
              }
              value={region}
            />
          </div>

          <div className={styles.filterSection}>
            <span className={styles.filterLabel}>참여 일정</span>
            <MockSelect<DateValue>
              ariaLabel="참여 일정"
              items={[...dateItems]}
              onValueChange={(value) =>
                replaceParams((params) => {
                  if (value === "all") params.delete("date");
                  else params.set("date", value);
                })
              }
              value={date}
            />
          </div>

          <button className={styles.resetFilters} onClick={() => router.replace("/")} type="button">
            <RotateCcw aria-hidden="true" size={14} /> 전체 초기화
          </button>
        </aside>

        <section aria-labelledby="explore-title" className={styles.results}>
          <div className={styles.resultsHead}>
            <h1 className={styles.resultsTitle} id="explore-title">
              면접 탐색 <span className={styles.resultCount}>{filteredInterviews.length}개</span>
            </h1>
            <MockSelect<SortValue>
              ariaLabel="정렬"
              className={styles.sortSelect}
              items={[...sortItems]}
              onValueChange={(value) =>
                replaceParams((params) => {
                  if (value === "soon") params.delete("sort");
                  else params.set("sort", value);
                })
              }
              value={sort}
            />
          </div>

          {appliedFilters.length > 0 ? (
            <div aria-label="적용된 필터" className={styles.appliedFilters}>
              {appliedFilters.map((filter) => (
                <button
                  className={styles.appliedFilter}
                  key={filter.key}
                  onClick={filter.remove}
                  type="button"
                >
                  {filter.label} <X aria-hidden="true" size={12} />
                </button>
              ))}
            </div>
          ) : null}

          {filteredInterviews.length > 0 ? (
            <div className={styles.cardGrid}>
              {filteredInterviews.map((interview) => (
                <InterviewCard
                  href={interviewHref(interview, returnTo)}
                  interview={interview}
                  key={interview.id}
                />
              ))}
            </div>
          ) : (
            <>
              <div className={styles.emptyState}>
                <h2 className={styles.emptyTitle}>조건에 딱 맞는 면접이 아직 없어요</h2>
                <p className={styles.emptyDescription}>
                  필터를 조금 넓히거나 같은 조건으로 면접을 만들어 보세요.
                </p>
                <div className={styles.emptyActions}>
                  <LinkButton href="/" variant="secondary">
                    필터 전체 초기화
                  </LinkButton>
                  <LinkButton href={`/interviews/new${searchString ? `?${searchString}` : ""}`}>
                    이 조건으로 면접 만들기
                  </LinkButton>
                </div>
              </div>
              <section className={styles.recommendation}>
                <h2 className={styles.sectionTitle}>이런 면접은 어떠세요?</h2>
                <div className={styles.cardGrid}>
                  {mockInterviews.slice(0, 3).map((interview) => (
                    <InterviewCard
                      href={interviewHref(interview, returnTo)}
                      interview={interview}
                      key={interview.id}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
