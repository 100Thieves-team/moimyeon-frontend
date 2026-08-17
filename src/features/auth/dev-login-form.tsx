"use client";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { issueDevSession } from "@/api";
import { Button } from "@/components/button";
import type { LoginReturnTo } from "./auth-intent";
import * as styles from "./login-dialog.css";
import { loginDialog } from "./login-dialog-handle";

type DevLoginFormProps = {
  returnTo: LoginReturnTo;
};

type DevLoginValues = {
  memberId: string;
};

export function DevLoginForm({ returnTo }: DevLoginFormProps) {
  const router = useRouter();
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<DevLoginValues>({
    defaultValues: {
      memberId: "",
    },
  });

  const submitForm = handleSubmit(async ({ memberId }) => {
    const result = await issueDevSession({
      baseUrl: "/api",
      body: { memberId: memberId.trim() },
      credentials: "same-origin",
      throwOnError: false,
    });

    const errorCode = result.error?.error?.code;

    if (errorCode === "E400") {
      setError(
        "memberId",
        { message: "회원 UUID 형식을 확인해 주세요.", type: "server" },
        { shouldFocus: true },
      );

      return;
    }

    if (errorCode === "E1006") {
      setError(
        "memberId",
        { message: "dev 환경에 존재하지 않는 회원이에요.", type: "server" },
        { shouldFocus: true },
      );

      return;
    }

    if (result.error) {
      setError("root.serverError", {
        type: "server",
        message: "dev 로그인에 실패했어요. 잠시 후 다시 시도해 주세요.",
      });

      return;
    }

    loginDialog.close();
    router.replace(returnTo);
    router.refresh();
  });

  const formError = errors.root?.serverError?.message;

  return (
    <section className={styles.devSection} aria-labelledby="dev-login-title">
      <h2 className={styles.devTitle} id="dev-login-title">
        개발 환경 전용 로그인
      </h2>

      <Form className={styles.devForm} onSubmit={submitForm}>
        <Controller
          control={control}
          name="memberId"
          rules={{
            validate: (value) => value.trim().length > 0 || "회원 UUID를 입력해 주세요.",
          }}
          render={({
            field: { name, onBlur, onChange, ref, value },
            fieldState: { error, invalid, isDirty, isTouched },
          }) => (
            <Field.Root
              className={styles.devField}
              dirty={isDirty}
              invalid={invalid}
              name={name}
              touched={isTouched}
            >
              <Field.Label className={styles.devLabel}>회원 UUID</Field.Label>
              <Field.Description className={styles.devDescription}>
                dev DB에 등록된 회원 UUID를 입력해 주세요.
              </Field.Description>
              <Field.Control
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                className={styles.devInput}
                onBlur={onBlur}
                onValueChange={(nextValue) => {
                  onChange(nextValue);
                  clearErrors("root.serverError");
                }}
                placeholder="00000000-0000-0000-0000-000000000000"
                ref={ref}
                spellCheck={false}
                type="text"
                value={value}
              />
              <Field.Error className={styles.devError} match={Boolean(error)} role="alert">
                {error?.message}
              </Field.Error>
            </Field.Root>
          )}
        />

        {formError && (
          <p className={styles.devError} role="alert">
            {formError}
          </p>
        )}

        <Button className={styles.devSubmit} disabled={isSubmitting} type="submit">
          {isSubmitting ? "로그인 중..." : "dev 계정으로 로그인"}
        </Button>
      </Form>
    </section>
  );
}
