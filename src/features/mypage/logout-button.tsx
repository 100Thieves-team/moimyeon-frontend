"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authLogoutMutation } from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import * as styles from "./mypage-shell.css";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authLogout = useMutation(authLogoutMutation());
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleLogout() {
    setErrorMessage(undefined);

    try {
      await authLogout.mutateAsync({});
    } catch {
      setErrorMessage("로그아웃하지 못했어요. 다시 시도해 주세요.");
      return;
    }

    queryClient.removeQueries();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className={styles.logoutAction}>
      <Button
        aria-busy={authLogout.isPending}
        disabled={authLogout.isPending}
        focusableWhenDisabled
        onClick={handleLogout}
        size="sm"
        variant="ghost"
      >
        {authLogout.isPending ? "로그아웃 중" : "로그아웃"}
      </Button>
      {errorMessage && (
        <p className={styles.logoutError} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
