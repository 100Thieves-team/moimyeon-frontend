"use client";

import { SiteErrorPage } from "@/features/error/error-page";

export default function MyInterviewsError() {
  return (
    <SiteErrorPage title="내 면접을 불러오지 못했어요" description="잠시 후 다시 확인해 주세요." />
  );
}
