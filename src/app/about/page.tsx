import type { Metadata } from "next";
import { ServiceIntroduction } from "@/features/service-introduction/service-introduction";

export const metadata: Metadata = {
  title: "서비스 소개",
  description:
    "사람 모으는 수고는 덜고, 모의면접에 집중하세요. 모집 조건 안내부터 신청자 확인, 참여 확정까지 모이면에서.",
};

export default function AboutPage() {
  return <ServiceIntroduction />;
}
