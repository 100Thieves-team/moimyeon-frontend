import type { ReactNode } from "react";
import * as styles from "./error-page.css";

type ErrorPageProps = {
  actions?: ReactNode;
  description: string;
  documentTitle: string;
  title: string;
};

type ErrorContentProps = Omit<ErrorPageProps, "documentTitle">;

function ErrorContent({ actions, description, title }: ErrorContentProps) {
  return (
    <section className={styles.content}>
      <h1
        className={`${styles.title} ${title === "404" || title === "오류" ? styles.shortTitle : ""}`}
      >
        {title}
      </h1>
      <p className={styles.description}>{description}</p>
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}

export function SiteErrorPage(props: ErrorContentProps) {
  return (
    <main className={styles.siteMain}>
      <ErrorContent {...props} />
    </main>
  );
}

export function ErrorPage({ actions, description, documentTitle, title }: ErrorPageProps) {
  return (
    <>
      <title>{documentTitle}</title>
      <div className={styles.page}>
        <main className={styles.main}>
          <ErrorContent actions={actions} description={description} title={title} />
        </main>
      </div>
    </>
  );
}
