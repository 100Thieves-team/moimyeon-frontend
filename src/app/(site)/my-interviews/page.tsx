import type { Metadata } from "next";
import { Suspense } from "react";
import { MyInterviews } from "@/features/interview-mock/my-interviews";

export const metadata: Metadata = { title: "내 면접" };

export default function MyInterviewsPage() {
  return (
    <Suspense fallback={null}>
      <MyInterviews />
    </Suspense>
  );
}
