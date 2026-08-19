"use client";

import { Form } from "@base-ui/react/form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  MotionConfig,
  type Transition,
  type Variants,
} from "motion/react";
import * as m from "motion/react-m";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { resumesOptions } from "@/api/generated/@tanstack/react-query.gen";
import type { JobRoleGroup } from "@/features/mypage/mypage-model";
import { motionValues } from "@/styles";
import { InterviewInfoStep } from "./interview-info-step";
import {
  getInterviewCreateDefaultValues,
  getResumesData,
  type InterviewCreateFormValues,
  type ParticipationSlots,
  type Regions,
  type RoomFormOptions,
} from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";
import { IntroductionAndResumeStep } from "./introduction-and-resume-step";
import { MethodAndScheduleStep } from "./method-and-schedule-step";

type InterviewCreateWizardProps = {
  jobRoleGroups: JobRoleGroup[];
  options: RoomFormOptions;
  participationSlots: ParticipationSlots;
  regions: Regions;
};

type StepDefinition = {
  description: string;
  fields: readonly (keyof InterviewCreateFormValues)[];
  label: string;
  slug: string;
  title: string;
};

const stepEnterTransition = {
  duration: 0.25,
  ease: motionValues.ease.out,
  type: "tween",
} satisfies Transition;

const stepExitTransition = {
  duration: motionValues.duration.fast,
  ease: motionValues.ease.out,
  type: "tween",
} satisfies Transition;

const stepVariants = {
  hidden: {
    opacity: 0,
    // Motion cannot interpolate a CSS variable nested inside a transform string.
    transform: "translateY(0.4rem)",
    transition: stepExitTransition,
  },
  visible: {
    opacity: 1,
    transform: "translateY(0rem)",
    transition: stepEnterTransition,
  },
} satisfies Variants;

const steps = [
  {
    description: "공고와 직무, 면접 차수를 선택해요.",
    fields: ["posting", "jobRoleId", "round"],
    label: "면접 정보",
    slug: "interview-info",
    title: "어떤 면접을 준비하나요?",
  },
  {
    description: "진행 방식과 가능한 일정을 정해요.",
    fields: ["method", "minParticipants", "maxParticipants", "schedules", "sigunguId"],
    label: "진행 방식과 일정",
    slug: "method-and-schedule",
    title: "진행 방식과 일정을 정해요",
  },
  {
    description: "면접 소개와 이력서를 준비해요.",
    fields: ["title", "description", "resumeId"],
    label: "소개와 이력서",
    slug: "introduction-and-resume",
    title: "참여할 사람들에게 면접을 소개해요",
  },
  {
    description: "입력한 내용을 마지막으로 확인해요.",
    fields: [],
    label: "최종 확인",
    slug: "final-review",
    title: "입력한 내용을 확인해 주세요",
  },
] as const satisfies readonly StepDefinition[];

export type InterviewCreateStepLabel = (typeof steps)[number]["label"];

function PendingStep({ step }: { step: StepDefinition }) {
  return (
    <section className={`${styles.formCard} ${styles.pendingCard}`}>
      <p className={styles.pendingLabel}>{step.label}</p>
      <p className={styles.pendingDescription}>{step.description}</p>
    </section>
  );
}

export function InterviewCreateWizard({
  jobRoleGroups,
  options,
  participationSlots,
  regions,
}: InterviewCreateWizardProps) {
  const { data: resumesResponse } = useSuspenseQuery(resumesOptions());
  const resumes = getResumesData(resumesResponse);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const methods = useForm<InterviewCreateFormValues>({
    defaultValues: getInterviewCreateDefaultValues(options, resumes),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const stepParam = searchParams.get("step");
  const step = steps.find((item) => item.slug === stepParam) ?? steps[0];
  const currentStep: InterviewCreateStepLabel = step.label;
  const currentStepIndex = steps.findIndex((item) => item.label === currentStep);

  const createStepUrl = useCallback(
    (nextStep: StepDefinition) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", nextStep.slug);

      return `${pathname}?${params.toString()}${window.location.hash}`;
    },
    [pathname, searchParams],
  );

  const moveToStep = useCallback(
    (nextStep: StepDefinition) => {
      router.push(createStepUrl(nextStep), { scroll: false });
    },
    [createStepUrl, router],
  );

  useEffect(() => {
    if (steps.some((item) => item.slug === stepParam)) {
      return;
    }

    router.replace(createStepUrl(steps[0]), { scroll: false });
  }, [createStepUrl, router, stepParam]);

  const goNext = async () => {
    const isValid =
      currentStep === "면접 정보" ||
      (await methods.trigger([...step.fields], { shouldFocus: true }));
    const nextStep = steps[currentStepIndex + 1];

    if (isValid && nextStep) {
      moveToStep(nextStep);
    }
  };

  const goPrevious = () => {
    const previousStep = steps[currentStepIndex - 1];

    if (previousStep) {
      moveToStep(previousStep);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <nav aria-label="면접 만들기 진행 단계" className={styles.stepNavigation}>
          <ol className={styles.stepList}>
            {steps.map((item, index) => {
              const isCurrent = item.label === currentStep;

              return (
                <li className={styles.stepItem} key={item.label}>
                  <button
                    aria-current={isCurrent ? "step" : undefined}
                    className={styles.stepButton}
                    disabled={isCurrent}
                    onClick={() => moveToStep(item)}
                    type="button"
                  >
                    <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.stepLabel}>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <section className={styles.wizardMain}>
          <div className={styles.mobileProgress}>
            <span className={styles.mobileStepNumber}>
              {String(currentStepIndex + 1).padStart(2, "0")} /{" "}
              {String(steps.length).padStart(2, "0")}
            </span>
            <span>{step.label}</span>
          </div>

          <FormProvider {...methods}>
            <Form
              className={styles.form}
              onSubmit={(event) => {
                event.preventDefault();
                void goNext();
              }}
            >
              <LazyMotion features={domAnimation} strict>
                <MotionConfig reducedMotion="user">
                  <AnimatePresence initial={false} mode="wait">
                    <m.div
                      animate="visible"
                      className={styles.stepContent}
                      exit="hidden"
                      initial="hidden"
                      key={step.slug}
                      variants={stepVariants}
                    >
                      <h1 className={styles.title}>{step.title}</h1>
                      {currentStep === "면접 정보" ? (
                        <InterviewInfoStep jobRoleGroups={jobRoleGroups} options={options} />
                      ) : currentStep === "진행 방식과 일정" ? (
                        <MethodAndScheduleStep
                          options={options}
                          participationSlots={participationSlots}
                          regions={regions}
                        />
                      ) : currentStep === "소개와 이력서" ? (
                        <IntroductionAndResumeStep />
                      ) : (
                        <PendingStep step={step} />
                      )}
                    </m.div>
                  </AnimatePresence>
                </MotionConfig>
              </LazyMotion>

              <footer className={styles.footer}>
                <div className={styles.navigationActions}>
                  {currentStepIndex > 0 ? (
                    <Button onClick={goPrevious} size="sm" type="button" variant="ghost">
                      <ArrowLeft aria-hidden="true" size={16} />
                      이전
                    </Button>
                  ) : null}
                  <Button className={styles.nextButton} size="sm" type="submit">
                    {currentStepIndex === steps.length - 1 ? "확인" : "다음"}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Button>
                </div>
              </footer>
            </Form>
          </FormProvider>
        </section>
      </div>
    </main>
  );
}
