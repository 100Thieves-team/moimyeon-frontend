"use client";

import { Accordion } from "@base-ui/react/accordion";
import * as styles from "./service-introduction.css";

const questions = [
  {
    question: "직접 모집하지 않고 참여할 수도 있나요?",
    answer:
      "카탈로그에서 준비하는 기업과 직무에 맞는 스터디를 찾아 참여를 신청할 수 있어요. 원하는 스터디가 없다면 직접 모집할 수도 있어요.",
  },
  {
    question: "신청하면 바로 참여가 확정되나요?",
    answer:
      "모집자가 신청을 확인하고 수락하면 참여가 확정돼요. 신청 중인 상태와 참여가 확정된 상태를 구분해서 확인할 수 있어요.",
  },
  {
    question: "온라인과 오프라인 모두 가능한가요?",
    answer:
      "모집글에서 온라인·오프라인 방식과 일정을 확인할 수 있어요. 오프라인 스터디는 지역도 함께 확인해주세요.",
  },
];

export function ServiceIntroductionFaq() {
  return (
    <Accordion.Root multiple>
      {questions.map(({ question, answer }) => (
        <Accordion.Item className={styles.faqItem} key={question} value={question}>
          <Accordion.Header>
            <Accordion.Trigger className={styles.faqTrigger}>
              <span aria-hidden="true" className={styles.faqMarker}>
                ▶
              </span>
              {question}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className={styles.faqPanel} keepMounted>
            <p>{answer}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
