import type { Metadata } from "next";
import { Suspense } from "react";
import { InterviewExplore } from "@/features/interview-mock/interview-explore";

export const metadata: Metadata = {
  title: "면접 탐색",
};

export default function Home() {
  return (
    <Suspense fallback={null}>
      <InterviewExplore />
    </Suspense>
  );
}
