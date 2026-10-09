"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { capturePageview, syncAnalyticsMember } from "./analytics";
import { completeLoginTracking } from "./login-tracking";

export function AnalyticsSession({
  memberId,
  children,
}: {
  memberId: string | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  // Identity must be ready before children's passive screen-entry effects run.
  useLayoutEffect(() => {
    syncAnalyticsMember(memberId);
    completeLoginTracking(memberId);
  }, [memberId]);
  useEffect(() => {
    capturePageview(pathname);
  }, [pathname]);
  return children;
}
