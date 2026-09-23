import { Skeleton } from "@/components/skeleton";
import * as skeletonStyles from "./interview-discovery-skeleton.css";
import * as styles from "./interview-discovery.css";

const filterSections = ["company", "job-role", "round", "method", "region"] as const;
const cards = Array.from({ length: 6 }, (_, index) => index);

export function InterviewDiscoverySkeleton() {
  return (
    <section className={styles.shell} aria-label="면접 탐색 불러오는 중" aria-busy="true">
      <div className={styles.discoveryLayout}>
        <aside aria-hidden="true" className={styles.desktopFilters}>
          <div className={styles.filterHeadingRow}>
            <Skeleton className={skeletonStyles.filterHeading} />
          </div>
          <div className={styles.filterFields}>
            {filterSections.map((section) => (
              <div className={styles.filterSection} key={section}>
                <Skeleton className={skeletonStyles.filterLabel} />
                {section === "round" || section === "method" ? (
                  <div className={skeletonStyles.filterToggleRow}>
                    <Skeleton className={skeletonStyles.filterToggle} />
                    <Skeleton className={skeletonStyles.filterToggle} />
                  </div>
                ) : (
                  <Skeleton className={skeletonStyles.filterControl} />
                )}
              </div>
            ))}
          </div>
        </aside>

        <Skeleton className={skeletonStyles.mobileFilter} />

        <section
          aria-busy="true"
          aria-labelledby="interview-discovery-skeleton-title"
          className={styles.results}
        >
          <div className={styles.resultsHeader}>
            <div className={styles.titleRow}>
              <h1 className={styles.title} id="interview-discovery-skeleton-title">
                면접
              </h1>
              <Skeleton className={skeletonStyles.count} />
            </div>
            <Skeleton className={skeletonStyles.sort} />
          </div>

          <div aria-hidden="true" className={styles.cardGrid}>
            {cards.map((card) => (
              <div className={styles.card} key={card}>
                <div className={styles.cardBadgeRow}>
                  <Skeleton className={skeletonStyles.cardMeta} />
                  <Skeleton className={skeletonStyles.cardBadge} />
                </div>
                <div className={styles.cardMain}>
                  <Skeleton className={styles.cardTitle} width="82%" height="2lh" />
                  <Skeleton className={styles.cardDescription} width="70%" height="1lh" />
                </div>
                <div className={styles.cardFooter}>
                  <Skeleton className={styles.cardFooterItem} width="12rem" height="1lh" />
                  <Skeleton className={styles.cardFooterItem} width="5.6rem" height="1lh" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
