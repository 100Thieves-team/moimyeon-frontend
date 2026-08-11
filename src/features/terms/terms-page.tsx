import { termsList, type TermsListResponse } from "@/api/generated";
import * as styles from "./terms-page.css";

type TermsType = "SERVICE" | "PRIVACY";

type Term = NonNullable<TermsListResponse["data"]>["terms"][number];

type TermsPageProps = {
  type: TermsType;
};

function formatEffectiveDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
  }).format(date);
}

async function loadTerm(type: TermsType): Promise<Term | null> {
  try {
    const { data: response } = await termsList({
      cache: "no-store",
      throwOnError: true,
    });

    return response.data?.terms.find((candidate) => candidate.type === type) ?? null;
  } catch {
    return null;
  }
}

export async function TermsPage({ type }: TermsPageProps) {
  const term = await loadTerm(type);

  return (
    <div className={styles.page}>
      <main className={styles.article}>
        {term ? (
          <article>
            <h1 className={styles.title}>{term.title}</h1>
            <p className={styles.meta}>
              버전 {term.version} · 시행일 {formatEffectiveDate(term.effectiveFrom)}
            </p>
            <div className={styles.content}>{term.content}</div>
          </article>
        ) : (
          <p className={styles.status} role="alert">
            약관을 불러오지 못했어요.
          </p>
        )}
      </main>
    </div>
  );
}
