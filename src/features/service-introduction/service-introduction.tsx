import { LinkButton } from "@/components/button";
import { SiteHeader } from "@/features/navigation/site-header";
import { ServiceIntroductionFaq } from "./service-introduction-faq";
import * as styles from "./service-introduction.css";

export function ServiceIntroduction() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main">
        본문 바로가기
      </a>
      <SiteHeader variant="introduction">
        <LinkButton className={styles.headerButton} href="/" size="sm">
          스터디 찾기
        </LinkButton>
      </SiteHeader>

      <main className={styles.main} id="main" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="intro-title">
          <div className={styles.wrap}>
            <p className={styles.heroEyebrow}>함께 준비하는 모의면접, 모이면</p>
            <h1 id="intro-title" className={styles.heroTitle}>
              <span className={styles.heroSubtitle}>사람 모으는 수고는 덜고,</span>
              모의면접에 집중하세요.
            </h1>
            <p className={styles.lead}>
              모집글 올리고, 카톡방 만들고, 직무를 일일이 물어보고.
              <br className={styles.leadBreak} />
              흩어져 있던 모집 과정을 한곳에서 해결하세요.
            </p>
            <div className={styles.actions}>
              <LinkButton className={styles.cta} href="/">
                모의면접 스터디 찾기 <span aria-hidden="true">→</span>
              </LinkButton>
              <a className={styles.textLink} href="#how">
                이용 방법 알아보기 <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ul className={styles.heroPoints}>
              {["기업·직무별 탐색", "신청자 정보 확인", "참여 확정까지 한곳에서"].map((point) => (
                <li className={styles.heroPoint} key={point}>
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="benefits-title">
          <div className={styles.wrap}>
            <div className={styles.centeredHead}>
              <p className={styles.sectionEyebrow}>
                면접 준비보다, 사람 모으는 일이 더 번거로웠다면
              </p>
              <h2 id="benefits-title" className={styles.sectionTitle}>
                모집할 때마다 반복하던 일,
                <br />
                모이면에서 간편하게.
              </h2>
            </div>
            <div className={styles.pains}>
              <article className={styles.pain}>
                <span className={styles.painLabel}>사람 찾기</span>
                <h3 className={styles.painTitle}>
                  “같은 기업 준비하는 분,
                  <br />
                  어디서 찾죠?”
                </h3>
                <p className={styles.painAnswer}>
                  기업·직무·면접 단계로
                  <br />
                  나에게 맞는 스터디를 찾아요.
                </p>
              </article>
              <article className={styles.pain}>
                <span className={styles.painLabel}>조건 확인</span>
                <h3 className={styles.painTitle}>
                  “어느 직무세요?
                  <br />몇 차 면접 보세요?”
                </h3>
                <p className={styles.painAnswer}>
                  회사·직무·일정을 미리 안내해
                  <br />
                  같은 질문을 반복하는 수고를 덜어요.
                </p>
              </article>
              <article className={styles.pain}>
                <span className={styles.painLabel}>참여 관리</span>
                <h3 className={styles.painTitle}>
                  “그래서 토요일에
                  <br />
                  누가 오는 거죠?”
                </h3>
                <p className={styles.painAnswer}>
                  신청과 참여 확정을 구분해
                  <br />
                  함께할 사람을 한눈에 확인해요.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="how" className={styles.whiteSection} aria-labelledby="how-title">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <p className={styles.sectionEyebrow}>모집자가 되어도, 복잡하지 않게</p>
              <h2 id="how-title" className={styles.sectionTitle}>
                조건을 정하고, 확인하고, 확정해요.
              </h2>
              <p className={styles.sectionDescription}>
                모집글 작성부터 함께할 사람을 정하는 순간까지 이어집니다.
              </p>
            </div>
            <ol className={styles.steps}>
              <li className={styles.step}>
                <div className={styles.stepContent}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    01
                  </span>
                  <h3 className={styles.stepTitle}>모집 조건 안내</h3>
                  <p className={styles.stepDescription}>
                    회사·직무·일정·진행 방식과
                    <br />
                    모집 인원을 한 번에 정해요.
                  </p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepContent}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    02
                  </span>
                  <h3 className={styles.stepTitle}>참여 신청 확인</h3>
                  <p className={styles.stepDescription}>
                    프로필과 이력서 요약을 보고
                    <br />
                    함께 준비할 사람을 살펴봐요.
                  </p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepContent}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    03
                  </span>
                  <h3 className={styles.stepTitle}>함께할 사람 확정</h3>
                  <p className={styles.stepDescription}>
                    신청을 수락하고 참여 명단을 확인해요.
                    <br />
                    이제 면접 준비를 시작하세요.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="practice-title">
          <div className={styles.practice}>
            <div>
              <p className={styles.inlineEyebrow}>모였다면, 준비도 함께</p>
              <h2 id="practice-title" className={styles.practiceTitle}>
                서로의 면접관이 되어
                <br />
                답변을 연습하세요.
              </h2>
              <p className={styles.practiceDescription}>
                이력서를 읽고 질문을 준비하고,
                <br />
                모의면접 후에는 서로의 피드백으로 답변을 돌아보세요.
              </p>
            </div>
            <ol className={styles.practiceSteps}>
              <li className={styles.practiceStep}>
                <span className={styles.practiceNumber} aria-hidden="true">
                  01
                </span>
                서로를 위한 질문 준비
              </li>
              <li className={styles.practiceStep}>
                <span className={styles.practiceNumber} aria-hidden="true">
                  02
                </span>
                답변과 꼬리질문 연습
              </li>
              <li className={styles.practiceStep}>
                <span className={styles.practiceNumber} aria-hidden="true">
                  03
                </span>
                자기 평가와 동료 피드백
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.whiteSection} aria-labelledby="faq-title">
          <div className={styles.faq}>
            <h2 id="faq-title" className={styles.faqTitle}>
              시작하기 전에 궁금한 점
            </h2>
            <ServiceIntroductionFaq />
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <div className={styles.wrap}>
            <p className={styles.inlineEyebrow}>같은 면접을 앞둔 사람들과, 모이면</p>
            <h2 id="closing-title" className={styles.closingTitle}>
              이번 모의면접, 함께 준비해요.
            </h2>
            <p className={styles.sectionDescription}>
              같은 기업과 직무를 준비하는 스터디를 찾아보세요.
            </p>
            <div className={styles.closingActions}>
              <LinkButton className={styles.cta} href="/">
                모의면접 스터디 둘러보기 <span aria-hidden="true">→</span>
              </LinkButton>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerRow}>
          <span>
            <strong className={styles.footerBrand}>모이면</strong>함께 준비하는 모의면접
          </span>
          <span>서비스 소개</span>
        </div>
      </footer>
    </div>
  );
}
