"use client";

import { useSearchParams } from "next/navigation";
import { LoginDialog } from "./login-dialog";

type LoginDialogControllerProps = {
  showDevLogin?: boolean;
};

export function LoginDialogController({ showDevLogin = false }: LoginDialogControllerProps) {
  const searchParams = useSearchParams();
  const hasLoginError = searchParams.get("authError") === "login_failed";

  return (
    <LoginDialog
      defaultOpen={hasLoginError}
      errorMessage={hasLoginError ? "로그인에 실패했어요. 다시 시도해 주세요." : undefined}
      showDevLogin={showDevLogin}
    />
  );
}
