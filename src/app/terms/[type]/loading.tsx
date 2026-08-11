import * as styles from "@/features/terms/terms-page.css";

export default function TermsLoading() {
  return (
    <div className={styles.page}>
      <main className={styles.article}>
        <p className={styles.status}>약관을 불러오는 중이에요.</p>
      </main>
    </div>
  );
}
