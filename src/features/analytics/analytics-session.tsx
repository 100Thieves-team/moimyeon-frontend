"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { capturePageview, syncAnalyticsMember, type AnalyticsMemberProperties } from "./analytics";
import { completeLoginTracking } from "./login-tracking";

export function AnalyticsSession({
  memberId,
  memberProperties,
  children,
}: {
  memberId: string | null;
  memberProperties?: AnalyticsMemberProperties;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { name, email, member_status } = memberProperties ?? {};
  // Identity must be ready before children's passive screen-entry effects run.
  useLayoutEffect(() => {
    syncAnalyticsMember(
      memberId,
      name !== undefined && email !== undefined && member_status !== undefined
        ? { name, email, member_status }
        : undefined,
    );
    completeLoginTracking(memberId);
  }, [memberId, name, email, member_status]);
  useEffect(() => {
    capturePageview(pathname);
  }, [pathname]);
  return children;
}
