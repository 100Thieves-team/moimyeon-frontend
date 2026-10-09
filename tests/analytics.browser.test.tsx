import { StrictMode, useState } from "react";
import { beforeEach, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { AnalyticsSession } from "@/features/analytics/analytics-session";
import { initializeAnalytics, capturePageview } from "@/features/analytics/analytics";
import { useCreationEntry, useRoomEntry } from "@/features/analytics/use-analytics-entry";
import type { CreationStep } from "@/features/analytics/analytics-contract";

const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  get_property: vi.fn(),
}));
vi.mock("posthog-js", () => ({ default: sdk }));

beforeEach(() => {
  vi.clearAllMocks();
  initializeAnalytics({
    enabled: "true",
    projectToken: "phc_mock",
    host: "https://us.i.posthog.com",
    environment: "dev",
    nodeEnv: "development",
  });
  capturePageview("/reset-test-visit");
  sdk.capture.mockClear();
});

function CreationJourney() {
  const [step, setStep] = useState<CreationStep>("interview-info");
  const [renders, setRenders] = useState(0);
  useCreationEntry(step);
  return (
    <>
      <button onClick={() => setStep("method-and-schedule")}>다음 단계</button>
      <button onClick={() => setStep("interview-info")}>이전 단계</button>
      <button onClick={() => setRenders(renders + 1)}>재조회</button>
      <p>
        {step} {renders}
      </p>
    </>
  );
}

it("Strict Mode에서도 생성 진입은 한 번 기록하고 재렌더링 없이 단계 왕복을 구분한다", async () => {
  window.history.replaceState(null, "", "/interviews/new?private=query#private");
  const screen = await render(
    <StrictMode>
      <AnalyticsSession memberId="member-host">
        <CreationJourney />
      </AnalyticsSession>
    </StrictMode>,
  );
  await expect
    .poll(
      () => sdk.capture.mock.calls.filter(([name]) => name === "interview_create_started").length,
    )
    .toBe(1);
  expect(sdk.identify).toHaveBeenCalledExactlyOnceWith("member-host");
  expect(sdk.capture.mock.calls.filter(([name]) => name === "$pageview")).toHaveLength(1);
  await screen.getByRole("button", { name: "재조회" }).click();
  expect(
    sdk.capture.mock.calls.filter(([name]) => name === "interview_create_step_viewed"),
  ).toHaveLength(1);
  await screen.getByRole("button", { name: "다음 단계" }).click();
  await screen.getByRole("button", { name: "이전 단계" }).click();
  expect(
    sdk.capture.mock.calls
      .filter(([name]) => name === "interview_create_step_viewed")
      .map(([, props]) => props.step),
  ).toEqual(["interview-info", "method-and-schedule", "interview-info"]);
  expect(
    sdk.capture.mock.calls.every(
      ([, props]) => props.is_authenticated && props.page_path === "/interviews/new",
    ),
  ).toBe(true);
});

function DetailScreen() {
  useRoomEntry("interview_detail_viewed", "room-a", "visitor");
  return <p>면접 상세</p>;
}

it("계정 전환은 이전 사용자 식별을 지우고 상세 재렌더링은 조회 이벤트를 늘리지 않는다", async () => {
  window.history.replaceState(null, "", "/interviews/room-a");
  const screen = await render(
    <StrictMode>
      <AnalyticsSession memberId="member-a">
        <DetailScreen />
      </AnalyticsSession>
    </StrictMode>,
  );
  await expect
    .poll(
      () => sdk.capture.mock.calls.filter(([name]) => name === "interview_detail_viewed").length,
    )
    .toBe(1);
  await screen.rerender(
    <StrictMode>
      <AnalyticsSession memberId="member-b">
        <DetailScreen />
      </AnalyticsSession>
    </StrictMode>,
  );
  expect(sdk.reset).toHaveBeenCalledTimes(1);
  expect(sdk.identify).toHaveBeenLastCalledWith("member-b");
  expect(
    sdk.capture.mock.calls.filter(([name]) => name === "interview_detail_viewed"),
  ).toHaveLength(1);
});
