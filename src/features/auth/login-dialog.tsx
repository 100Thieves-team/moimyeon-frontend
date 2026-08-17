"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { LoginReturnTo } from "./auth-intent";
import { DevLoginForm } from "./dev-login-form";
import { loginDialog } from "./login-dialog-handle";
import * as styles from "./login-dialog.css";

type LoginTriggerProps = {
  children: ReactNode;
  className?: string;
  returnTo: LoginReturnTo;
};

type LoginDialogProps = {
  defaultOpen?: boolean;
  errorMessage?: string;
  showDevLogin?: boolean;
};

const loginDialogTitleLines: Record<LoginReturnTo, readonly [string, string]> = {
  "/": ["로그인하고 함께", "면접을 준비해 보세요"],
  "/interviews/new": ["로그인하고", "면접을 만들어 보세요"],
};

export function LoginTrigger({ children, className, returnTo }: LoginTriggerProps) {
  return (
    <Dialog.Trigger className={className} handle={loginDialog} payload={{ returnTo }} type="button">
      {children}
    </Dialog.Trigger>
  );
}

export function LoginDialog({
  defaultOpen = false,
  errorMessage,
  showDevLogin = false,
}: LoginDialogProps) {
  return (
    <Dialog.Root defaultOpen={defaultOpen} handle={loginDialog}>
      {({ payload }) => {
        const returnTo = payload?.returnTo ?? "/";
        const [titleFirstLine, titleSecondLine] = loginDialogTitleLines[returnTo];
        const googleLoginHref = `/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`;

        return (
          <Dialog.Portal>
            <Dialog.Backdrop className={styles.backdrop} />
            <Dialog.Popup className={styles.popup}>
              <Dialog.Close aria-label="로그인 창 닫기" className={styles.close} type="button">
                <X aria-hidden="true" size={20} strokeWidth={2} />
              </Dialog.Close>

              <Dialog.Title className={styles.title}>
                <span className={styles.titleLine}>{titleFirstLine}</span>{" "}
                <span className={styles.titleLine}>{titleSecondLine}</span>
              </Dialog.Title>

              <a className={styles.googleAction} href={googleLoginHref}>
                <svg aria-hidden="true" className={styles.googleMark} viewBox="0 0 18 18">
                  <path
                    d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.715v2.258h2.909c1.702-1.567 2.684-3.874 2.684-6.613Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.468-.806 5.956-2.182l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.955v2.332A9 9 0 0 0 9 18Z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.963 10.705A5.41 5.41 0 0 1 3.682 9c0-.592.102-1.168.281-1.705V4.963H.955A9 9 0 0 0 0 9c0 1.452.347 2.827.955 4.037l3.008-2.332Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.581c1.321 0 2.507.454 3.441 1.346l2.581-2.582C13.464.892 11.426 0 9 0A9 9 0 0 0 .955 4.963l3.008 2.332C4.672 5.166 6.656 3.581 9 3.581Z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google로 계속하기</span>
              </a>

              {errorMessage && (
                <p className={styles.error} role="alert">
                  {errorMessage}
                </p>
              )}

              {showDevLogin && <DevLoginForm returnTo={returnTo} />}

              <Dialog.Description className={styles.terms}>
                계속하면{" "}
                <a
                  className={styles.termsLink}
                  href="/terms/service"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  이용약관
                </a>
                과{" "}
                <a
                  className={styles.termsLink}
                  href="/terms/privacy"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  개인정보 처리방침
                </a>
                에 동의한 것으로 간주됩니다.
              </Dialog.Description>
            </Dialog.Popup>
          </Dialog.Portal>
        );
      }}
    </Dialog.Root>
  );
}
