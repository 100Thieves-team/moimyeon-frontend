"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getReceivedReviews } from "@/api/generated/sdk.gen";
import { getReceivedReviewsQueryKey } from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import * as panelStyles from "./mypage-panel.css";
import * as styles from "./received-reviews.css";
import * as shellStyles from "./mypage-shell.css";

const PAGE_SIZE = 5;

function pageOptions(lastReviewId?: number) {
  return {
    query: {
      size: String(PAGE_SIZE),
      ...(lastReviewId === undefined ? {} : { lastReviewId: String(lastReviewId) }),
    },
  };
}

export function ReceivedReviewsFallback() {
  return (
    <section aria-label="받은 후기 불러오는 중" className={panelStyles.card}>
      <div className={styles.header}>
        <h2 className={panelStyles.title}>받은 후기</h2>
      </div>
      <ul className={styles.list}>
        {[0, 1, 2].map((index) => (
          <li aria-hidden="true" className={styles.item} key={index}>
            <div className={styles.skeletonTagRow}>
              <span className={styles.skeletonChip} />
              <span className={styles.skeletonChip} />
            </div>
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLineShort} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ReceivedReviews() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryFn: async ({ pageParam }: { pageParam: number | undefined }) => {
      const { data: response } = await getReceivedReviews(pageOptions(pageParam));
      const page = response.data;

      if (page == null) {
        throw new Error("Failed to load received reviews");
      }

      return page;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.reviews.at(-1)?.reviewId : undefined,
    queryKey: getReceivedReviewsQueryKey(pageOptions()),
  });
  const reviews = data.pages.flatMap((page) => page.reviews);
  const totalCount = data.pages[0]?.totalCount ?? 0;

  return (
    <section aria-label="받은 후기" className={styles.container}>
      <div className={panelStyles.card}>
        <div className={styles.header}>
          <h2 className={panelStyles.title}>받은 후기</h2>
          <span className={styles.count}>{totalCount}개</span>
        </div>
        {reviews.length === 0 ? (
          <p className={styles.empty}>
            아직 받은 후기가 없어요. 면접을 완료하면 함께한 분들의 후기가 여기에 쌓여요.
          </p>
        ) : (
          <ul className={styles.list}>
            {reviews.map((review) => (
              <li className={styles.item} key={review.reviewId}>
                {review.tags.length > 0 && (
                  <ul aria-label="평가 태그" className={styles.tagRow}>
                    {review.tags.map((tag) => (
                      <li className={shellStyles.tag} key={String(tag)}>
                        {String(tag)}
                      </li>
                    ))}
                  </ul>
                )}
                {typeof review.content === "string" && review.content !== "" && (
                  <p className={styles.content}>{review.content}</p>
                )}
                <p className={styles.author}>{review.authorNickname}</p>
              </li>
            ))}
          </ul>
        )}
        {hasNextPage && (
          <div className={panelStyles.centeredFooter}>
            <Button
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              size="md"
              type="button"
              variant="ghost"
            >
              {isFetchingNextPage ? "불러오는 중…" : "더 보기"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
