"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { iconSizes, media } from "@/styles/tokens";
import { SCENE_COMPONENTS, type SceneKey } from "./hero-demo-scenes";
import { FRAME_MS, FRAMES, type Frame } from "./hero-demo-timing";
import * as styles from "./hero-demo.css";

type SceneDefinition = {
  key: SceneKey;
  label: string;
  screenTitle: string;
  description: string;
};

const SCENES = [
  {
    key: "find",
    label: "면접 찾기",
    screenTitle: "면접",
    description: "회사·직무, 차수, 지역으로 열린 모의면접을 찾아요.",
  },
  {
    key: "apply",
    label: "참가 신청",
    screenTitle: "면접 상세",
    description: "이력서를 첨부해 신청하고, 방장이 수락하면 참여가 확정돼요.",
  },
  {
    key: "room",
    label: "룸에서 준비",
    screenTitle: "면접 룸",
    description: "서로의 이력서 요약을 보고 댓글로 진행 방식을 맞춰요.",
  },
  {
    key: "review",
    label: "후기 남기기",
    screenTitle: "후기 작성",
    description: "면접이 끝나면 후기를 남기고, 기록이 신뢰 정보로 쌓여요.",
  },
] as const satisfies readonly SceneDefinition[];

const LAST_FRAME = FRAMES[FRAMES.length - 1];

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(media.reducedMotion);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(media.reducedMotion).matches;
const getServerReducedMotion = () => false;

type HeroDemoProps = {
  intro: ReactNode;
  action: ReactNode;
};

export function HeroDemo({ action, intro }: HeroDemoProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [frame, setFrame] = useState<Frame>(0);
  // 진행 막대의 key이자 타이머 Effect의 의존성. 같은 장면을 다시 고르면 막대와 타이머를 함께 재시작한다.
  const [playCount, setPlayCount] = useState(0);
  const isPlaying = !prefersReducedMotion && !isPaused;
  const visibleFrame = prefersReducedMotion ? LAST_FRAME : frame;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setTimeout(() => {
      if (frame < LAST_FRAME) {
        setFrame(FRAMES[frame + 1]);
        return;
      }
      setSceneIndex((sceneIndex + 1) % SCENES.length);
      setFrame(0);
    }, FRAME_MS);

    return () => window.clearTimeout(timer);
  }, [frame, isPlaying, playCount, sceneIndex]);

  const restartScene = (index: number) => {
    setSceneIndex(index);
    setFrame(0);
    setPlayCount((count) => count + 1);
  };

  const scene = SCENES[sceneIndex];
  const Scene = SCENE_COMPONENTS[scene.key];

  return (
    <div className={styles.layout}>
      <div className={styles.side}>
        {intro}
        <ol aria-label="모이면 이용 흐름" className={styles.stepList}>
          {SCENES.map((item, index) => {
            const isCurrent = index === sceneIndex;

            return (
              <li key={item.key}>
                <button
                  aria-current={isCurrent ? "step" : undefined}
                  className={styles.stepButton}
                  data-done={index < sceneIndex || undefined}
                  onClick={() => {
                    setIsPaused(false);
                    restartScene(index);
                  }}
                  type="button"
                >
                  <span className={styles.stepTrack}>
                    {isCurrent && !prefersReducedMotion ? (
                      <span
                        className={styles.stepFill}
                        data-paused={isPaused || undefined}
                        key={playCount}
                      />
                    ) : null}
                  </span>
                  <span className={styles.stepLabel}>
                    <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                    {item.label}
                  </span>
                  <span className={styles.stepDescription}>{item.description}</span>
                </button>
              </li>
            );
          })}
        </ol>
        {action}
      </div>

      <div className={styles.demoWindow}>
        <div className={styles.windowBar}>
          <span aria-hidden="true" className={styles.windowDots}>
            <span className={styles.windowDot} />
            <span className={styles.windowDot} />
            <span className={styles.windowDot} />
          </span>
          <span aria-hidden="true" className={styles.windowTitle}>
            모이면 · {scene.screenTitle}
          </span>
          <span aria-hidden="true" className={styles.windowBadge}>
            예시
          </span>
          {prefersReducedMotion ? null : (
            <button
              aria-label={isPaused ? "이용 흐름 재생" : "이용 흐름 일시정지"}
              className={styles.playButton}
              onClick={() => {
                // 진행 막대와 장면 타이머가 어긋나지 않도록 현재 장면을 처음부터 재생한다.
                if (isPaused) restartScene(sceneIndex);
                setIsPaused(!isPaused);
              }}
              type="button"
            >
              {isPaused ? (
                <Play aria-hidden="true" size={iconSizes.sm} />
              ) : (
                <Pause aria-hidden="true" size={iconSizes.sm} />
              )}
            </button>
          )}
        </div>
        <div aria-hidden="true" className={styles.windowBody} key={scene.key}>
          <Scene frame={visibleFrame} />
        </div>
      </div>
    </div>
  );
}
