"use client";

import { Form } from "@base-ui/react/form";
import { Toast } from "@base-ui/react/toast";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
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
import { useCallback, useEffect, useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/button";
import {
  createRoomMutation,
  participationSlotsQueryKey,
  resumesOptions,
  resumesQueryKey,
  roomCreationLimitOptions,
  roomCreationLimitQueryKey,
  roomsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import type { JobRoleGroup } from "@/features/mypage/mypage-model";
import { motionValues } from "@/styles";
import { InterviewInfoStep } from "./interview-info-step";
import {
  getInterviewCreateDefaultValues,
  getResumesData,
  isInterviewInfoStepComplete,
  isIntroductionAndResumeStepComplete,
  isMethodAndScheduleStepComplete,
  toCreateRoomBody,
  type InterviewCreateFormValues,
  type ParticipationSlots,
  type Regions,
  type RoomFormOptions,
} from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";
import { FinalReviewStep } from "./final-review-step";
import { IntroductionAndResumeStep } from "./introduction-and-resume-step";
import { MethodAndScheduleStep } from "./method-and-schedule-step";

type InterviewCreateWizardProps = {
  jobRoleGroups: JobRoleGroup[];
  options: RoomFormOptions;
  participationSlots: ParticipationSlots;
  regions: Regions;
};

type StepDefinition = {
  label: string;
  slug: string;
  title: string;
};

const stepEnterTransition = {
  duration: 0.18,
  ease: motionValues.ease.out,
  type: "tween",
} satisfies Transition;

const stepExitTransition = {
  duration: 0.1,
  ease: motionValues.ease.out,
  type: "tween",
} satisfies Transition;

const stepVariants = {
  hidden: {
    opacity: 0,
    // Motion cannot interpolate a CSS variable nested inside a transform string.
    transform: "translateY(0.4rem)",
  },
  visible: {
    opacity: 1,
    transform: "translateY(0rem)",
    transition: stepEnterTransition,
  },
  exit: {
    opacity: 0,
    transform: "translateY(0rem)",
    transition: stepExitTransition,
  },
} satisfies Variants;

const steps = [
  {
    label: "면접 정보",
    slug: "interview-info",
    title: "어떤 면접을 준비하나요?",
  },
  {
    label: "진행 방식과 일정",
    slug: "method-and-schedule",
    title: "진행 방식과 일정을 정해요",
  },
  {
    label: "소개와 이력서",
    slug: "introduction-and-resume",
    title: "참여할 사람들에게 면접을 소개해요",
  },
  {
    label: "최종 확인",
    slug: "final-review",
    title: "만들기 전에 같이 확인해요",
  },
] as const satisfies readonly StepDefinition[];

export type InterviewCreateStepLabel = (typeof steps)[number]["label"];

function getErrorMessage(error: unknown) {
  const fallback = "면접을 만들지 못했어요. 입력한 내용을 확인하고 다시 시도해 주세요.";

  if (typeof error !== "object" || error === null || !("error" in error)) {
    return fallback;
  }

  const detail = error.error;
  if (typeof detail !== "object" || detail === null || !("message" in detail)) {
    return fallback;
  }

  return typeof detail.message === "string" ? detail.message : fallback;
}

export function InterviewCreateWizard({
  jobRoleGroups,
  options,
  participationSlots,
  regions,
}: InterviewCreateWizardProps) {
  const { data: resumesResponse } = useSuspenseQuery(resumesOptions());
  const resumes = getResumesData(resumesResponse);
  const queryClient = useQueryClient();
  const toastManager = Toast.useToastManager();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const methods = useForm<InterviewCreateFormValues>({
    defaultValues: getInterviewCreateDefaultValues(options, resumes),
    mode: "onChange",
  });
  useWatch({ control: methods.control });
  const values = methods.getValues();
  const validJobRoleIds = useMemo(
    () => new Set(jobRoleGroups.flatMap((group) => group.roles.map((role) => role.jobRoleId))),
    [jobRoleGroups],
  );
  const hasCreationLimitParams = values.posting !== null && values.jobRoleId !== null;
  const creationLimitRequest = {
    query: {
      jobPostingId: String(values.posting?.jobPostingId ?? ""),
      jobRoleId: String(values.jobRoleId ?? ""),
    },
  };
  const creationLimitQuery = useQuery({
    ...roomCreationLimitOptions(creationLimitRequest),
    enabled: hasCreationLimitParams,
  });
  const createRoom = useMutation({
    ...createRoomMutation(),
    onError: (error) => {
      methods.setError("root.serverError", {
        message: getErrorMessage(error),
        type: "server",
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: participationSlotsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: resumesQueryKey() }),
        queryClient.invalidateQueries({
          queryKey: roomCreationLimitQueryKey(creationLimitRequest),
        }),
      ]);
      toastManager.add({ title: "1개의 면접을 만들었어요" });
      router.replace("/");
    },
  });
  const canCreateRoom =
    creationLimitQuery.data?.data !== undefined &&
    creationLimitQuery.data.data.remaining > 0 &&
    participationSlots.remaining > 0;
  const completedSteps = [
    isInterviewInfoStepComplete(values, options, validJobRoleIds),
    isMethodAndScheduleStepComplete(values, options, regions, canCreateRoom),
    isIntroductionAndResumeStepComplete(values, resumes),
    false,
  ];
  const isFormComplete = completedSteps.slice(0, 3).every(Boolean);
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

  const moveToStepSlug = useCallback(
    (slug: string) => {
      const nextStep = steps.find((item) => item.slug === slug);

      if (nextStep) {
        methods.clearErrors("root.serverError");
        moveToStep(nextStep);
      }
    },
    [methods, moveToStep],
  );

  useEffect(() => {
    if (steps.some((item) => item.slug === stepParam)) {
      return;
    }

    router.replace(createStepUrl(steps[0]), { scroll: false });
  }, [createStepUrl, router, stepParam]);

  const goNext = () => {
    const nextStep = steps[currentStepIndex + 1];

    if (nextStep) {
      moveToStep(nextStep);
    }
  };

  const goPrevious = () => {
    const previousStep = steps[currentStepIndex - 1];

    if (previousStep) {
      moveToStep(previousStep);
    }
  };

  const submitCreateRoom = methods.handleSubmit((formValues) => {
    methods.clearErrors("root.serverError");
    createRoom.mutate({ body: toCreateRoomBody(formValues) });
  });

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
                    <span className={styles.stepNumber}>
                      {completedSteps[index] ? (
                        <>
                          <Check aria-hidden="true" size={14} strokeWidth={2} />
                          <span className={styles.visuallyHidden}>완료</span>
                        </>
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>
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
                if (currentStepIndex === steps.length - 1) {
                  void submitCreateRoom();
                } else {
                  goNext();
                }
              }}
            >
              <LazyMotion features={domAnimation} strict>
                <MotionConfig reducedMotion="user">
                  <AnimatePresence initial={false} mode="wait">
                    <m.div
                      animate="visible"
                      className={styles.stepContent}
                      exit="exit"
                      initial="hidden"
                      key={step.slug}
                      variants={stepVariants}
                    >
                      <h1 className={styles.title}>{step.title}</h1>
                      {currentStep === "면접 정보" ? (
                        <InterviewInfoStep jobRoleGroups={jobRoleGroups} options={options} />
                      ) : currentStep === "진행 방식과 일정" ? (
                        <MethodAndScheduleStep
                          creationLimit={creationLimitQuery.data?.data}
                          creationLimitIsError={creationLimitQuery.isError}
                          creationLimitIsPending={creationLimitQuery.isPending}
                          hasCreationLimitParams={hasCreationLimitParams}
                          options={options}
                          participationSlots={participationSlots}
                          regions={regions}
                        />
                      ) : currentStep === "소개와 이력서" ? (
                        <IntroductionAndResumeStep />
                      ) : (
                        <FinalReviewStep
                          jobRoleGroups={jobRoleGroups}
                          onEdit={moveToStepSlug}
                          options={options}
                          regions={regions}
                          resumes={resumes}
                          submitError={methods.formState.errors.root?.serverError?.message ?? null}
                        />
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
                  {currentStepIndex === steps.length - 1 ? (
                    <Button
                      className={styles.nextButton}
                      disabled={!isFormComplete || createRoom.isPending}
                      key="submit"
                      size="sm"
                      type="submit"
                    >
                      {createRoom.isPending ? "면접 만드는 중..." : "면접 만들기"}
                    </Button>
                  ) : (
                    <Button
                      className={styles.nextButton}
                      key="next"
                      onClick={goNext}
                      size="sm"
                      type="button"
                    >
                      다음
                      <ArrowRight aria-hidden="true" size={16} />
                    </Button>
                  )}
                </div>
              </footer>
            </Form>
          </FormProvider>
        </section>
      </div>
    </main>
  );
}
