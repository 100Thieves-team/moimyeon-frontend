import { LoginDialog } from "@/features/auth/login-dialog";
import { TopBar } from "@/features/navigation/top-bar";
import * as styles from "./page.css";

type HomeProps = {
  searchParams: Promise<{
    authError?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { authError } = await searchParams;
  const hasLoginError = authError === "login_failed";

  return (
    <div className={styles.page}>
      <TopBar />

      <LoginDialog
        defaultOpen={hasLoginError}
        errorMessage={hasLoginError ? "로그인에 실패했어요. 다시 시도해 주세요." : undefined}
        showDevLogin={process.env.NODE_ENV === "development"}
      />
    </div>
  );
}
