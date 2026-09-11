import type { ResumeResponse, ResumesResponse } from "@/api";

export type Resumes = NonNullable<ResumesResponse["data"]>;
export type ResumeItem = Resumes["resumes"][number];
export type ResumeDetail = NonNullable<ResumeResponse["data"]>;

const JUST_UPLOADED_THRESHOLD_MS = 60 * 60 * 1000;
const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

export function validateResumeFile(file: File) {
  // File.type은 브라우저가 미디어 타입을 판별하지 못하면 빈 문자열일 수 있다. 실제 콘텐츠 검증은 서버(400)가 담당한다.
  const hasInvalidType = file.type !== "" && file.type !== "application/pdf";

  if (hasInvalidType || !file.name.toLowerCase().endsWith(".pdf")) {
    return "PDF 파일만 올릴 수 있어요.";
  }

  if (file.size === 0) {
    return "비어 있는 파일은 올릴 수 없어요.";
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return "이력서는 10MB 이하의 PDF 파일만 올릴 수 있어요.";
  }

  return null;
}

export function getResumesData(response: ResumesResponse): Resumes {
  if (response.data === undefined || response.data === null) {
    throw new Error("Failed to load resumes");
  }

  return response.data;
}

export function getPreferredResumeId(resumes: Resumes) {
  return (
    resumes.resumes.find((resume) => resume.isDefault)?.resumeId ??
    resumes.resumes[0]?.resumeId ??
    ""
  );
}

export function formatFileSize(sizeBytes?: number) {
  if (sizeBytes === undefined) {
    return "크기 정보 없음";
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))}KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")}MB`;
}

export function formatRegisteredMeta(resume: ResumeItem, now = Date.now()) {
  const fileSize = formatFileSize(resume.file?.sizeBytes);
  const registeredTime = new Date(resume.registeredAt).getTime();

  if (Number.isFinite(registeredTime) && now - registeredTime < JUST_UPLOADED_THRESHOLD_MS) {
    return `방금 올림 · ${fileSize}`;
  }

  const match = resume.registeredAt.match(/^\d{4}-(\d{2})-(\d{2})/);

  if (!match) {
    return fileSize;
  }

  return `${Number(match[1])}월 ${Number(match[2])}일 업데이트 · ${fileSize}`;
}

export function upsertResume(current: ResumesResponse | undefined, nextResume: ResumeDetail) {
  if (current?.data === undefined || current.data === null) {
    return current;
  }

  const existingResume = current.data.resumes.find(
    (resume) => resume.resumeId === nextResume.resumeId,
  );
  const mergedResume = { ...existingResume, ...nextResume };
  const hasResume = existingResume !== undefined;

  return {
    ...current,
    data: {
      ...current.data,
      resumes: hasResume
        ? current.data.resumes.map((resume) =>
            resume.resumeId === nextResume.resumeId ? mergedResume : resume,
          )
        : [mergedResume, ...current.data.resumes],
    },
  };
}

export function applyDefaultResume(current: ResumesResponse | undefined, resumeId: string) {
  if (current?.data === undefined || current.data === null) {
    return current;
  }

  return {
    ...current,
    data: {
      ...current.data,
      resumes: current.data.resumes.map((resume) => ({
        ...resume,
        isDefault: resume.resumeId === resumeId,
      })),
    },
  };
}

export function removeResume(current: ResumesResponse | undefined, resumeId: string) {
  if (current?.data === undefined || current.data === null) {
    return current;
  }

  return {
    ...current,
    data: {
      ...current.data,
      resumes: current.data.resumes.filter((resume) => resume.resumeId !== resumeId),
    },
  };
}
