"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { capturePageview } from "./analytics";

export function AnalyticsPageviews() {
  const pathname = usePathname();
  useEffect(() => {
    // Site routes wait for the server-authenticated AnalyticsSession.
    if (pathname === "/" || pathname === "/mypage" || pathname.startsWith("/interviews/")) return;
    capturePageview(pathname);
  }, [pathname]);
  return null;
}
