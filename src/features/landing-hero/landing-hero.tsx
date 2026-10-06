import { ArrowDown } from "lucide-react";
import { LinkButton } from "@/components/button";
import { iconSizes } from "@/styles/tokens";
import { HeroDemo } from "./hero-demo";
import * as styles from "./landing-hero.css";

export const INTERVIEW_LIST_ID = "interview-list";

export function LandingHero() {
  return (
    <section aria-labelledby="landing-hero-title" className={styles.hero}>
      <div className={styles.inner}>
        <HeroDemo
          action={
            <LinkButton className={styles.browseButton} href={`#${INTERVIEW_LIST_ID}`} size="lg">
              면접 둘러보기
              <ArrowDown aria-hidden="true" size={iconSizes.md} />
            </LinkButton>
          }
          intro={
            <div className={styles.textBlock}>
              <p className={styles.eyebrow}>함께 준비하는 모의면접</p>
              <h1 className={styles.title} id="landing-hero-title">
                같은 면접을 준비하는 사람과
                <br />
                실전처럼 연습해요
              </h1>
              <p className={styles.lead}>
                회사·직무별 모의면접 룸에 참여해 함께 준비하고, 끝나면 서로 후기를 남겨요.
              </p>
            </div>
          }
        />
      </div>
    </section>
  );
}
