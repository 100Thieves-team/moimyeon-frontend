import { describe, expect, it } from "vitest";
import { getConfirmationDisabledReason } from "@/mocks/room-confirmation-policy";
import { MOCK_INTERVIEW_DETAIL_SCENARIOS } from "@/features/interview-detail/interview-detail-mock";

const now = Date.parse("2026-10-01T19:00:00+09:00");
const base = MOCK_INTERVIEW_DETAIL_SCENARIOS.find(({ room }) => room.viewer?.isHost)!.room;
const room = () => ({
  ...structuredClone(base),
  previouslyConfirmed: false,
  schedule: { startAt: "2026-10-01T20:00:00+09:00", durationMinutes: 90 },
  recruit: { ...base.recruit!, current: 3, min: 3 },
});

describe("모킹 서버의 진행 확정 조건", () => {
  it("최소 인원을 채운 방장은 일정 전에 확정할 수 있다", () => {
    expect(getConfirmationDisabledReason(room(), now)).toBeNull();
  });
  it("최소 인원이 부족하면 필요한 인원을 안내한다", () => {
    const value = room();
    value.recruit.current = 2;
    expect(getConfirmationDisabledReason(value, now)).toBe("진행 확정에는 최소 3명이 필요해요");
  });
  it.each(["2026-10-01T19:00:00+09:00", "2026-10-01T18:59:59+09:00", "2026-10-01T19:00:00"])(
    "시작 시각부터 확정을 차단한다: %s",
    (startAt) => {
      const value = room();
      value.schedule.startAt = startAt;
      expect(getConfirmationDisabledReason(value, now)).toBe("진행 일정이 지나 확정할 수 없어요");
    },
  );
  it("방장 위임 후 과거 확정 이력이 있으면 일정이 지나도 재확정할 수 있다", () => {
    const value = room();
    value.previouslyConfirmed = true;
    value.schedule.startAt = "2026-10-01T18:00:00+09:00";
    expect(getConfirmationDisabledReason(value, now)).toBeNull();
    value.recruit.current = 2;
    expect(getConfirmationDisabledReason(value, now)).toBe("진행 확정에는 최소 3명이 필요해요");
  });
  it.each(["CONFIRMED", "COMPLETED", "CANCELED"])("%s 상태는 확정할 수 없다", (status) => {
    expect(getConfirmationDisabledReason({ ...room(), status }, now)).not.toBeNull();
  });
  it("일반 참여자는 확정할 수 없다", () => {
    expect(
      getConfirmationDisabledReason(
        { ...room(), viewer: { isHost: false, isParticipating: true } },
        now,
      ),
    ).toBe("방장만 진행을 확정할 수 있어요");
  });
  it.each([
    { schedule: null },
    { recruit: null },
    { schedule: { startAt: "invalid", durationMinutes: 90 } },
  ])("인원·일정 정보를 확인할 수 없으면 확정을 차단한다: %j", (override) => {
    expect(getConfirmationDisabledReason({ ...room(), ...override }, now)).toContain(
      "인원·일정 정보를 확인하지 못했어요",
    );
  });
});
