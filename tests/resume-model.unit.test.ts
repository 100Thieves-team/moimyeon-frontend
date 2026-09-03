import { describe, expect, it } from "vitest";
import {
  formatRegisteredMeta,
  upsertResume,
  validateResumeFile,
  type ResumeItem,
} from "@/features/resume/resume-model";

const baseResume: ResumeItem = {
  aiSummary: { status: "DONE", text: "요약" },
  file: { contentType: "application/pdf", originalName: "이력서.pdf", sizeBytes: 217_088 },
  isDefault: false,
  name: "이력서.pdf",
  registeredAt: "2026-08-31T11:30:00",
  resumeId: "resume-1",
};

describe("formatRegisteredMeta", () => {
  it("등록한 지 1시간이 지나지 않은 이력서는 방금 올림으로 표시한다", () => {
    const now = new Date("2026-08-31T12:00:00").getTime();

    expect(formatRegisteredMeta(baseResume, now)).toBe("방금 올림 · 212KB");
  });

  it("등록한 지 1시간이 지난 이력서는 등록 날짜로 표시한다", () => {
    const now = new Date("2026-08-31T12:31:00").getTime();

    expect(formatRegisteredMeta(baseResume, now)).toBe("8월 31일 업데이트 · 212KB");
  });

  it("파일 정보가 없으면 크기 정보 없음으로 표시한다", () => {
    const now = new Date("2026-09-30T12:00:00").getTime();

    expect(formatRegisteredMeta({ ...baseResume, file: undefined }, now)).toBe(
      "8월 31일 업데이트 · 크기 정보 없음",
    );
  });
});

describe("upsertResume", () => {
  const currentResponse = {
    data: {
      maxCount: 10,
      resumes: [{ ...baseResume, lastUsed: { usedAt: "2026-08-01T10:00:00" } }],
    },
    result: "SUCCESS",
  };

  it("같은 이력서를 갱신하면 기존 최근 사용 정보를 유지한다", () => {
    const next = upsertResume(currentResponse, {
      ...baseResume,
      aiSummary: { status: "DONE", text: "새 요약" },
    });

    expect(next?.data?.resumes).toHaveLength(1);
    expect(next?.data?.resumes[0].aiSummary?.text).toBe("새 요약");
    expect(next?.data?.resumes[0].lastUsed?.usedAt).toBe("2026-08-01T10:00:00");
  });

  it("새 이력서는 목록 맨 앞에 추가한다", () => {
    const next = upsertResume(currentResponse, { ...baseResume, resumeId: "resume-2" });

    expect(next?.data?.resumes.map((resume) => resume.resumeId)).toEqual(["resume-2", "resume-1"]);
  });
});

describe("validateResumeFile", () => {
  it("10MB 이하의 PDF 파일은 통과한다", () => {
    const file = new File(["pdf"], "이력서.pdf", { type: "application/pdf" });

    expect(validateResumeFile(file)).toBeNull();
  });

  it("MIME 타입이 비어 있어도 확장자가 .pdf면 통과한다", () => {
    const file = new File(["pdf"], "이력서.pdf", { type: "" });

    expect(validateResumeFile(file)).toBeNull();
  });

  it("PDF가 아닌 파일은 거부한다", () => {
    const file = new File(["text"], "resume.txt", { type: "text/plain" });

    expect(validateResumeFile(file)).toBe("PDF 파일만 올릴 수 있어요.");
  });

  it("확장자가 .pdf라도 다른 MIME 타입이면 거부한다", () => {
    const file = new File(["text"], "이력서.pdf", { type: "text/plain" });

    expect(validateResumeFile(file)).toBe("PDF 파일만 올릴 수 있어요.");
  });

  it("비어 있는 파일은 거부한다", () => {
    const file = new File([], "이력서.pdf", { type: "application/pdf" });

    expect(validateResumeFile(file)).toBe("비어 있는 파일은 올릴 수 없어요.");
  });

  it("10MB를 초과하는 파일은 거부한다", () => {
    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "이력서.pdf", {
      type: "application/pdf",
    });

    expect(validateResumeFile(file)).toBe("이력서는 10MB 이하의 PDF 파일만 올릴 수 있어요.");
  });
});
