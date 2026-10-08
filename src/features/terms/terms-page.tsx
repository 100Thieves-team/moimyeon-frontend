import type { ComponentProps } from "react";
import Markdown from "react-markdown";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkGfm from "remark-gfm";
import { SiteErrorPage } from "@/features/error/error-page";
import * as styles from "./terms-page.css";
import { termsList } from "@/api/generated/sdk.gen";

type TermsType = "SERVICE" | "PRIVACY";

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

function TermsTable({ children }: ComponentProps<"table">) {
  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- 키보드로도 넓은 표를 가로 스크롤할 수 있어야 한다.
    <section className={styles.tableScroll} aria-label="약관 표" tabIndex={0}>
      <table>{children}</table>
    </section>
  );
}

function TermsColumnHeader({ children, style }: ComponentProps<"th">) {
  return (
    <th scope="col" style={style}>
      {children}
    </th>
  );
}

export async function TermsPage({ type }: TermsPageProps) {
  const { data: response } = await termsList({
    cache: "no-store",
    throwOnError: false,
  });

  const term = response?.data?.terms.find((candidate) => candidate.type === type) ?? null;

  if (!term) {
    return (
      <div role="alert">
        <SiteErrorPage
          title="약관을 불러오지 못했어요."
          description="잠시 후 다시 확인해 주세요."
        />
      </div>
    );
  }

  const effectiveDate = formatEffectiveDate(term.effectiveFrom);
  const content = term.content.replace(/\r\n/g, "\n");
  const repeatedHeader = `# ${term.title}\n\n문서 버전: ${term.version} · 시행일: ${effectiveDate}\n\n`;
  // API 본문의 제목·시행일이 페이지 머리말과 같을 때만 중복 표시를 제거한다.
  const body = content.startsWith(repeatedHeader) ? content.slice(repeatedHeader.length) : content;

  return (
    <div className={styles.page}>
      <main className={styles.article}>
        <article>
          <h1 className={styles.title}>{term.title}</h1>
          <p className={styles.meta}>
            버전 {term.version} · 시행일 {effectiveDate}
          </p>
          <div className={styles.content}>
            <Markdown
              remarkPlugins={[remarkGfm, remarkCjkFriendly]}
              components={{ h1: "h2", table: TermsTable, th: TermsColumnHeader }}
              skipHtml
            >
              {body}
            </Markdown>
          </div>
        </article>
      </main>
    </div>
  );
}
