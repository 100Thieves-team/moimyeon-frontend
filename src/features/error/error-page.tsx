import type { ReactNode } from "react";
import Link from "next/link";
import * as styles from "./error-page.css";

type ErrorPageProps = {
  actions: ReactNode;
  description: string;
  documentTitle: string;
  title: string;
};

export function ErrorPage({ actions, description, documentTitle, title }: ErrorPageProps) {
  return (
    <>
      <title>{documentTitle}</title>
      <div className={styles.page}>
        <header className={styles.header}>
          <Link aria-label="모이면 홈" className={styles.brand} href="/">
            모이면
          </Link>
        </header>

        <main className={styles.main}>
          <div className={styles.content}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.actions}>{actions}</div>
          </div>
        </main>
      </div>
    </>
  );
}
