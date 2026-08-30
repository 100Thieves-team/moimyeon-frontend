"use client";

import { Suspense, use, type ReactNode } from "react";

const mockingEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_MOCK_INTERVIEW_DISCOVERY === "true";

const mockingEnabledPromise =
  typeof window !== "undefined" && mockingEnabled
    ? import("./browser").then(async ({ worker }) => {
        await worker.start({ onUnhandledRequest: "bypass" });
      })
    : Promise.resolve();

export function MSWProvider({ children }: { children: ReactNode }) {
  if (!mockingEnabled) return children;

  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
}

function MSWProviderWrapper({ children }: { children: ReactNode }) {
  use(mockingEnabledPromise);
  return children;
}
