import Link from "next/link";
import * as styles from "@/features/terms/terms-page.css";

export default function TermsLoading() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.back} href="/">
          ← 돌아가기
        </Link>
      </header>
      <main className={styles.article}>
        <p className={styles.status}>약관을 불러오는 중이에요.</p>
      </main>
    </div>
  );
}
