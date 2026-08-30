"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSuspenseInfiniteQuery, useSuspenseQueries } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  jobRolesOptions,
  regionsOptions,
  roomFormOptionsOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import { InterviewCard } from "./interview-card";
import {
  DiscoverySortSelect,
  InterviewDiscoveryFilters as InterviewDiscoveryFilterControls,
  type DiscoveryFilterCatalogs,
} from "./interview-discovery-filters";
import {
  interviewRoomsInfiniteOptions,
  type DiscoveryTarget,
  type InterviewDiscoveryFilters,
  writeInterviewDiscoveryFilters,
} from "./interview-discovery-model";
import * as styles from "./interview-discovery.css";

function targetMatchesFilters(target: DiscoveryTarget, filters: InterviewDiscoveryFilters) {
  return target.kind === "company"
    ? target.companyId === filters.companyId
    : target.jobPostingId === filters.jobPostingId;
}

type InterviewDiscoveryContentProps = {
  filters: InterviewDiscoveryFilters;
};

export function InterviewDiscoveryContent({ filters }: InterviewDiscoveryContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTarget, setSelectedTarget] = useState<DiscoveryTarget | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [{ data: jobRolesResponse }, { data: regionsResponse }, { data: roomFormOptionsResponse }] =
    useSuspenseQueries({
      queries: [jobRolesOptions(), regionsOptions(), roomFormOptionsOptions()],
    });
  const roomsQuery = useSuspenseInfiniteQuery(interviewRoomsInfiniteOptions(filters));
  const {
    data: roomsData,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  } = roomsQuery;

  const jobRoles = jobRolesResponse.data;
  const regions = regionsResponse.data;
  const roomFormOptions = roomFormOptionsResponse.data;

  if (jobRoles === undefined || regions === undefined || roomFormOptions === undefined) {
    throw new Error("Failed to load interview discovery filters");
  }

  const rooms = roomsData.pages.flatMap((page) => page.data?.rooms ?? []);
  const firstPageData = roomsData.pages[0]?.data;

  if (firstPageData === undefined) {
    throw new Error("Failed to load interviews");
  }

  const catalogs: DiscoveryFilterCatalogs = {
    jobRoleGroups: jobRoles.groups,
    methods: roomFormOptions.methods,
    regions: regions.sidos,
    rounds: roomFormOptions.rounds,
  };
  const allJobRoles = catalogs.jobRoleGroups.flatMap((group) => group.roles);
  const target =
    selectedTarget && targetMatchesFilters(selectedTarget, filters) ? selectedTarget : null;
  const jobRoleLabel =
    allJobRoles.find((role) => String(role.jobRoleId) === filters.jobRoleId)?.displayName ?? null;
  const roundLabel = catalogs.rounds.find((round) => round.code === filters.round)?.label ?? null;
  const methodLabel =
    catalogs.methods.find((method) => method.code === filters.method)?.label ?? null;
  const selectedRegion = catalogs.regions
    .flatMap((sido) =>
      sido.sigungus.map((sigungu) => ({
        label: `${sido.shortName} ${sigungu.name}`,
        value: String(sigungu.sigunguId),
      })),
    )
    .find((region) => region.value === filters.sigunguId);
  const regionLabel = selectedRegion?.label ?? null;
  const selectedFilters = [
    target
      ? {
          key: target.kind,
          label: target.label,
          remove: () => {
            setSelectedTarget(null);
            replaceFilters({ ...filters, companyId: null, jobPostingId: null });
          },
        }
      : null,
    jobRoleLabel
      ? {
          key: "jobRole",
          label: jobRoleLabel,
          remove: () => replaceFilters({ ...filters, jobRoleId: null }),
        }
      : null,
    roundLabel
      ? {
          key: "round",
          label: roundLabel,
          remove: () => replaceFilters({ ...filters, round: null }),
        }
      : null,
    methodLabel
      ? {
          key: "method",
          label: methodLabel,
          remove: () => replaceFilters({ ...filters, method: null }),
        }
      : null,
    regionLabel
      ? {
          key: "region",
          label: regionLabel,
          remove: () => replaceFilters({ ...filters, sigunguId: null }),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  function replaceFilters(nextFilters: InterviewDiscoveryFilters) {
    const nextSearchParams = writeInterviewDiscoveryFilters(
      new URLSearchParams(searchParams.toString()),
      nextFilters,
    );
    const queryString = nextSearchParams.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  useEffect(() => {
    const targetElement = loadMoreRef.current;

    if (targetElement === null || !hasNextPage || isFetchNextPageError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(targetElement);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  return (
    <div className={styles.shell}>
      <div className={styles.discoveryLayout}>
        <InterviewDiscoveryFilterControls
          catalogs={catalogs}
          filters={filters}
          jobRoleLabel={jobRoleLabel}
          onChange={replaceFilters}
          onTargetChange={setSelectedTarget}
          selectedFilterCount={selectedFilters.length}
          target={target}
        />

        <section aria-labelledby="discovery-title" className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.titleRow}>
              <h1 className={styles.title} id="discovery-title">
                면접
              </h1>
              <span className={styles.totalCount}>{firstPageData.totalCount}</span>
            </div>
            <DiscoverySortSelect
              onChange={(sort) => replaceFilters({ ...filters, sort })}
              value={filters.sort}
            />
          </div>

          {selectedFilters.length > 0 ? (
            <div aria-label="적용된 필터" className={styles.appliedFilters}>
              {selectedFilters.map((filter) => (
                <button
                  className={styles.appliedFilter}
                  key={filter.key}
                  onClick={filter.remove}
                  type="button"
                >
                  {filter.label}
                  <X aria-hidden="true" size={14} />
                </button>
              ))}
            </div>
          ) : null}

          {rooms.length > 0 ? (
            <div className={styles.cardGrid}>
              {rooms.map((room) => (
                <InterviewCard key={room.roomId} room={room} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>조건에 맞는 면접이 없어요.</h2>
              <p className={styles.emptyDescription}>필터를 바꾸거나 나중에 다시 확인해 주세요.</p>
            </div>
          )}

          <div aria-hidden="true" className={styles.loadMoreSentinel} ref={loadMoreRef} />
          {isFetchingNextPage ? (
            <p className={styles.paginationStatus}>면접을 더 불러오는 중이에요.</p>
          ) : null}
          {isFetchNextPageError ? (
            <div className={styles.paginationError}>
              <p>다음 면접을 불러오지 못했어요.</p>
              <Button onClick={() => void fetchNextPage()} size="sm" variant="secondary">
                다시 시도
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
