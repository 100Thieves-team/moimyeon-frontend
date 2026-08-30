"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Dialog } from "@base-ui/react/dialog";
import { Select } from "@base-ui/react/select";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { isCancelledError, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Filter, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  searchJobPostingsOptions,
  searchJobPostingsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { JobRoleDialog } from "@/features/mypage/job-role-dialog";
import type { JobRoleGroup } from "@/features/mypage/mypage-model";
import {
  DEFAULT_DISCOVERY_FILTERS,
  type DiscoveryMethod,
  type DiscoveryRound,
  type DiscoveryTarget,
  type InterviewDiscoveryFilters,
} from "./interview-discovery-model";
import { discoveryRegionDialog, RegionDialog, type RegionGroup } from "./region-dialog";
import * as styles from "./interview-discovery.css";

type FilterOption = { code: string; label: string };

export type DiscoveryFilterCatalogs = {
  jobRoleGroups: JobRoleGroup[];
  methods: FilterOption[];
  regions: RegionGroup[];
  rounds: FilterOption[];
};

function getRegionLabel(regions: RegionGroup[], sigunguId: string | null) {
  if (sigunguId === null) return null;

  for (const sido of regions) {
    const sigungu = sido.sigungus.find((item) => String(item.sigunguId) === sigunguId);

    if (sigungu) return `${sido.shortName} ${sigungu.name}`;
  }

  return null;
}

type SearchOption =
  | { companyId: string; kind: "company"; label: string }
  | {
      jobPostingId: string;
      kind: "jobPosting";
      label: string;
      secondaryLabel: string | null;
    };

type CompanyPostingSearchProps = {
  onChange: (value: DiscoveryTarget | null) => void;
  value: DiscoveryTarget | null;
};

function getSearchOptionKey(option: SearchOption) {
  return option.kind === "company"
    ? `company:${option.companyId}`
    : `posting:${option.jobPostingId}`;
}

function formatSearchOption(option: SearchOption) {
  return option.kind === "jobPosting" && option.secondaryLabel
    ? `[${option.secondaryLabel}] ${option.label}`
    : option.label;
}

function getSelectedSearchOption(value: DiscoveryTarget | null): SearchOption | null {
  if (value === null) return null;

  return value.kind === "company"
    ? value
    : {
        jobPostingId: value.jobPostingId,
        kind: value.kind,
        label: value.label,
        secondaryLabel: null,
      };
}

function CompanyPostingSearch({ onChange, value }: CompanyPostingSearchProps) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState(value?.label ?? "");
  const [searchResults, setSearchResults] = useState<SearchOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SearchOption | null>(() =>
    getSelectedSearchOption(value),
  );
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const nextOption = getSelectedSearchOption(value);

    setSelectedOption((current) =>
      current && nextOption && getSearchOptionKey(current) === getSearchOptionKey(nextOption)
        ? current
        : nextOption,
    );
    setInputValue(value?.label ?? "");
  }, [value]);

  const items = useMemo(() => {
    if (
      selectedOption === null ||
      searchResults.some((item) => getSearchOptionKey(item) === getSearchOptionKey(selectedOption))
    ) {
      return searchResults;
    }

    return [...searchResults, selectedOption];
  }, [searchResults, selectedOption]);
  const query = inputValue.trim();
  const selectedLabel = value?.label ?? "";
  const status = isPending
    ? "회사와 공고를 검색하고 있어요."
    : (searchError ??
      (!query
        ? "회사명이나 공고명을 입력해 주세요."
        : searchResults.length === 0 && query !== selectedLabel
          ? `“${query}” 검색 결과가 없어요.`
          : null));

  const clearSelection = () => {
    setSelectedOption(null);
    setSearchResults([]);
    setInputValue("");
    setSearchError(null);
    onChange(null);
  };

  return (
    <Combobox.Root<SearchOption>
      filter={null}
      inputValue={inputValue}
      isItemEqualToValue={(item, selected) =>
        getSearchOptionKey(item) === getSearchOptionKey(selected)
      }
      itemToStringLabel={formatSearchOption}
      itemToStringValue={getSearchOptionKey}
      items={items}
      onInputValueChange={(nextValue, details) => {
        setInputValue(nextValue);

        if (details.reason === "item-press") return;

        void queryClient.cancelQueries({ queryKey: searchJobPostingsQueryKey() });
        const nextQuery = nextValue.trim();

        if (!nextQuery || nextQuery === selectedLabel) {
          setSearchResults([]);
          setSearchError(null);
          return;
        }

        startTransition(async () => {
          setSearchError(null);

          try {
            const response = await queryClient.fetchQuery(
              searchJobPostingsOptions({ query: { query: nextQuery } }),
            );
            const responseData = response.data;

            if (responseData?.query !== nextQuery) return;

            const companyItems: SearchOption[] = responseData.companies.map((company) => ({
              companyId: String(company.companyId),
              kind: "company",
              label: company.name,
            }));
            const postingItems: SearchOption[] = responseData.jobPostings.map((posting) => ({
              jobPostingId: String(posting.jobPostingId),
              kind: "jobPosting",
              label: posting.postingName,
              secondaryLabel: posting.company?.name ?? null,
            }));

            startTransition(() => setSearchResults([...companyItems, ...postingItems]));
          } catch (error) {
            if (!isCancelledError(error)) {
              startTransition(() => {
                setSearchResults([]);
                setSearchError("검색에 실패했어요. 다시 시도해 주세요.");
              });
            }
          }
        });
      }}
      onOpenChangeComplete={(open) => {
        if (!open) {
          void queryClient.cancelQueries({ queryKey: searchJobPostingsQueryKey() });
          setInputValue(selectedOption ? formatSearchOption(selectedOption) : "");
          setSearchResults(selectedOption ? [selectedOption] : []);
          setSearchError(null);
        }
      }}
      onValueChange={(nextValue) => {
        if (nextValue === null) {
          clearSelection();
          return;
        }

        const nextTarget: DiscoveryTarget =
          nextValue.kind === "company"
            ? {
                companyId: nextValue.companyId,
                kind: "company",
                label: nextValue.label,
              }
            : {
                jobPostingId: nextValue.jobPostingId,
                kind: "jobPosting",
                label: formatSearchOption(nextValue),
              };

        setSelectedOption(nextValue);
        onChange(nextTarget);
        setInputValue(nextTarget.label);
        setSearchResults([nextValue]);
      }}
      value={selectedOption}
    >
      <Combobox.InputGroup className={styles.searchInputGroup}>
        <Search aria-hidden="true" className={styles.searchIcon} size={17} strokeWidth={1.75} />
        <Combobox.Input
          aria-label="회사 또는 채용 공고 검색"
          autoComplete="off"
          className={styles.searchInput}
          maxLength={50}
          placeholder="회사명 또는 공고명"
          spellCheck={false}
        />
        {value ? (
          <button
            aria-label="회사·공고 필터 해제"
            className={styles.inputClearButton}
            onClick={clearSelection}
            type="button"
          >
            <X aria-hidden="true" size={16} />
          </button>
        ) : null}
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner className={styles.comboboxPositioner} sideOffset={4}>
          <Combobox.Popup aria-busy={isPending || undefined} className={styles.comboboxPopup}>
            <Combobox.Status>
              {status ? <div className={styles.comboboxStatus}>{status}</div> : null}
            </Combobox.Status>
            <Combobox.List className={styles.comboboxList}>
              {(item: SearchOption) => (
                <Combobox.Item
                  className={styles.comboboxItem}
                  key={getSearchOptionKey(item)}
                  value={item}
                >
                  <Combobox.ItemIndicator className={styles.comboboxIndicator}>
                    <Check aria-hidden="true" size={14} />
                  </Combobox.ItemIndicator>
                  <span className={styles.resultKind}>
                    {item.kind === "company" ? "회사" : "공고"}
                  </span>
                  <span className={styles.resultCopy}>
                    <span className={styles.resultName}>{item.label}</span>
                    {item.kind === "jobPosting" && item.secondaryLabel ? (
                      <span className={styles.resultCompany}>{item.secondaryLabel}</span>
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

type SelectControlProps = {
  ariaLabel: string;
  className?: string;
  items: Array<{ label: string; value: string }>;
  onChange: (value: string | null) => void;
  placeholder: string;
  value: string | null;
};

function SelectControl({
  ariaLabel,
  className,
  items,
  onChange,
  placeholder,
  value,
}: SelectControlProps) {
  return (
    <Select.Root
      items={items}
      onValueChange={(nextValue) => onChange(nextValue === "ALL" ? null : nextValue)}
      value={value ?? "ALL"}
    >
      <Select.Trigger
        aria-label={ariaLabel}
        className={`${styles.selectTrigger} ${className ?? ""}`}
      >
        <Select.Value placeholder={placeholder} />
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

type FilterFieldsProps = {
  catalogs: DiscoveryFilterCatalogs;
  filters: InterviewDiscoveryFilters;
  jobRoleLabel: string | null;
  onChange: (filters: InterviewDiscoveryFilters) => void;
  onOpenJobRole: () => void;
  onOpenRegion: () => void;
  onTargetChange: (target: DiscoveryTarget | null) => void;
  regionLabel: string | null;
  target: DiscoveryTarget | null;
};

function FilterFields({
  catalogs,
  filters,
  jobRoleLabel,
  onChange,
  onOpenJobRole,
  onOpenRegion,
  onTargetChange,
  regionLabel,
  target,
}: FilterFieldsProps) {
  const update = <Key extends keyof InterviewDiscoveryFilters>(
    key: Key,
    value: InterviewDiscoveryFilters[Key],
  ) => onChange({ ...filters, [key]: value });

  return (
    <div className={styles.filterFields}>
      <section className={styles.filterSection}>
        <h2 className={styles.filterLabel}>회사·공고</h2>
        <CompanyPostingSearch onChange={onTargetChange} value={target} />
      </section>

      <section className={styles.filterSection}>
        <h2 className={styles.filterLabel}>직무</h2>
        <button className={styles.filterDialogTrigger} onClick={onOpenJobRole} type="button">
          <span>{jobRoleLabel ?? "직무를 선택해 주세요"}</span>
          <ChevronDown aria-hidden="true" size={16} />
        </button>
      </section>

      <section className={styles.filterSection}>
        <h2 className={styles.filterLabel}>면접 전형</h2>
        <ToggleGroup
          aria-label="면접 전형"
          className={styles.toggleGroup}
          multiple={false}
          onValueChange={(values) => update("round", (values.at(-1) as DiscoveryRound) ?? null)}
          value={filters.round === null ? [] : [filters.round]}
        >
          {catalogs.rounds.map((round) => (
            <Toggle className={styles.filterToggle} key={round.code} value={round.code}>
              {round.label}
            </Toggle>
          ))}
        </ToggleGroup>
      </section>

      <section className={styles.filterSection}>
        <h2 className={styles.filterLabel}>진행 방식</h2>
        <ToggleGroup
          aria-label="진행 방식"
          className={styles.toggleGroup}
          multiple={false}
          onValueChange={(values) => update("method", (values.at(-1) as DiscoveryMethod) ?? null)}
          value={filters.method === null ? [] : [filters.method]}
        >
          {catalogs.methods.map((method) => (
            <Toggle className={styles.filterToggle} key={method.code} value={method.code}>
              {method.label}
            </Toggle>
          ))}
        </ToggleGroup>
      </section>

      <section className={styles.filterSection}>
        <h2 className={styles.filterLabel}>지역</h2>
        <button className={styles.filterDialogTrigger} onClick={onOpenRegion} type="button">
          <span>{regionLabel ?? "지역을 선택해 주세요"}</span>
          <ChevronDown aria-hidden="true" size={16} />
        </button>
      </section>
    </div>
  );
}

type InterviewDiscoveryFiltersProps = {
  catalogs: DiscoveryFilterCatalogs;
  filters: InterviewDiscoveryFilters;
  jobRoleLabel: string | null;
  onChange: (filters: InterviewDiscoveryFilters) => void;
  onTargetChange: (target: DiscoveryTarget | null) => void;
  selectedFilterCount: number;
  target: DiscoveryTarget | null;
};

const discoveryJobRoleDialog = Dialog.createHandle<void>();

export function InterviewDiscoveryFilters({
  catalogs,
  filters,
  jobRoleLabel,
  onChange,
  onTargetChange,
  selectedFilterCount,
  target,
}: InterviewDiscoveryFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);
  const [draftTarget, setDraftTarget] = useState(target);
  const selectedJobRoleId = Number(mobileOpen ? draftFilters.jobRoleId : filters.jobRoleId) || null;
  const selectedSigunguId = Number(mobileOpen ? draftFilters.sigunguId : filters.sigunguId) || null;

  const openMobileFilters = () => {
    setDraftFilters(filters);
    setDraftTarget(target);
    setMobileOpen(true);
  };

  const updateJobRole = (jobRoleId: number | null) => {
    const nextValue = jobRoleId === null ? null : String(jobRoleId);

    if (mobileOpen) {
      setDraftFilters((current) => ({ ...current, jobRoleId: nextValue }));
    } else {
      onChange({ ...filters, jobRoleId: nextValue });
    }
  };

  const updateRegion = (sigunguId: number | null) => {
    const nextValue = sigunguId === null ? null : String(sigunguId);

    if (mobileOpen) {
      setDraftFilters((current) => ({ ...current, sigunguId: nextValue }));
    } else {
      onChange({ ...filters, sigunguId: nextValue });
    }
  };

  const clearDesktopFilters = () => {
    onTargetChange(null);
    onChange({ ...DEFAULT_DISCOVERY_FILTERS, sort: filters.sort });
  };

  return (
    <>
      <aside className={styles.desktopFilters}>
        <div className={styles.filterHeadingRow}>
          <h2 className={styles.filterHeading}>필터</h2>
          {selectedFilterCount > 0 ? (
            <button className={styles.resetButton} onClick={clearDesktopFilters} type="button">
              <RotateCcw aria-hidden="true" size={15} />
              초기화
            </button>
          ) : null}
        </div>
        <FilterFields
          catalogs={catalogs}
          filters={filters}
          jobRoleLabel={jobRoleLabel}
          onChange={onChange}
          onOpenJobRole={() => discoveryJobRoleDialog.open(null)}
          onOpenRegion={() => discoveryRegionDialog.open(null)}
          onTargetChange={(nextTarget) => {
            onTargetChange(nextTarget);
            onChange({
              ...filters,
              companyId: nextTarget?.kind === "company" ? nextTarget.companyId : null,
              jobPostingId: nextTarget?.kind === "jobPosting" ? nextTarget.jobPostingId : null,
            });
          }}
          regionLabel={getRegionLabel(catalogs.regions, filters.sigunguId)}
          target={target}
        />
      </aside>

      <button className={styles.mobileFilterButton} onClick={openMobileFilters} type="button">
        <Filter aria-hidden="true" size={17} />
        필터
        {selectedFilterCount > 0 ? (
          <span className={styles.filterCount}>{selectedFilterCount}</span>
        ) : null}
      </button>

      <Dialog.Root onOpenChange={setMobileOpen} open={mobileOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className={styles.mobileFilterBackdrop} />
          <Dialog.Popup className={styles.mobileFilterPopup}>
            <header className={styles.mobileFilterHeader}>
              <Dialog.Title className={styles.mobileFilterTitle}>필터</Dialog.Title>
              <Dialog.Close aria-label="필터 닫기" className={styles.closeButton} type="button">
                <X aria-hidden="true" size={22} />
              </Dialog.Close>
            </header>
            <div className={styles.mobileFilterBody}>
              <FilterFields
                catalogs={catalogs}
                filters={draftFilters}
                jobRoleLabel={
                  catalogs.jobRoleGroups
                    .flatMap((group) => group.roles)
                    .find((role) => String(role.jobRoleId) === draftFilters.jobRoleId)
                    ?.displayName ?? null
                }
                onChange={setDraftFilters}
                onOpenJobRole={() => discoveryJobRoleDialog.open(null)}
                onOpenRegion={() => discoveryRegionDialog.open(null)}
                onTargetChange={(nextTarget) => {
                  setDraftTarget(nextTarget);
                  setDraftFilters((current) => ({
                    ...current,
                    companyId: nextTarget?.kind === "company" ? nextTarget.companyId : null,
                    jobPostingId:
                      nextTarget?.kind === "jobPosting" ? nextTarget.jobPostingId : null,
                  }));
                }}
                regionLabel={getRegionLabel(catalogs.regions, draftFilters.sigunguId)}
                target={draftTarget}
              />
            </div>
            <footer className={styles.mobileFilterFooter}>
              <Button
                onClick={() => {
                  setDraftFilters({ ...DEFAULT_DISCOVERY_FILTERS, sort: filters.sort });
                  setDraftTarget(null);
                }}
                type="button"
                variant="secondary"
              >
                초기화
              </Button>
              <Button
                onClick={() => {
                  onTargetChange(draftTarget);
                  onChange(draftFilters);
                  setMobileOpen(false);
                }}
                type="button"
              >
                적용
              </Button>
            </footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <JobRoleDialog
        groups={catalogs.jobRoleGroups}
        handle={discoveryJobRoleDialog}
        mode="single"
        onValueChange={updateJobRole}
        value={selectedJobRoleId}
      />
      <RegionDialog
        handle={discoveryRegionDialog}
        onValueChange={updateRegion}
        regions={catalogs.regions}
        value={selectedSigunguId}
      />
    </>
  );
}

export function DiscoverySortSelect({
  onChange,
  value,
}: {
  onChange: (value: InterviewDiscoveryFilters["sort"]) => void;
  value: InterviewDiscoveryFilters["sort"];
}) {
  return (
    <SelectControl
      ariaLabel="면접 정렬"
      className={styles.sortSelect}
      items={[
        { label: "일정 빠른 순", value: "SCHEDULE" },
        { label: "최근 등록 순", value: "RECENT" },
      ]}
      onChange={(nextValue) => onChange(nextValue === "RECENT" ? "RECENT" : "SCHEDULE")}
      placeholder="정렬"
      value={value}
    />
  );
}
