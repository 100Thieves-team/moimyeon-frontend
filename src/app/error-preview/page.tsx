"use client";

import RootError from "@/app/error";

export default function ErrorPreviewPage() {
  return (
    <RootError error={new Error("오류 fallback 미리보기")} reset={() => window.location.reload()} />
  );
}
