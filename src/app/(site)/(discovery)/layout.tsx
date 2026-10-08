import type { ReactNode } from "react";
import { INTERVIEW_LIST_ID, LandingHero } from "@/features/landing-hero/landing-hero";
import * as styles from "./layout.css";

type DiscoveryLayoutProps = {
  children: ReactNode;
};

// 소개 데모와 목록 이동 기준점을 레이아웃에 두어 로딩 화면이 페이지로 바뀔 때도 유지한다.
export default function DiscoveryLayout({ children }: DiscoveryLayoutProps) {
  return (
    <main className={styles.page}>
      <LandingHero />
      <div id={INTERVIEW_LIST_ID}>{children}</div>
    </main>
  );
}
