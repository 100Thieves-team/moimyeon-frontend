import type { ResumesResponse } from "@/api";

export type Resumes = NonNullable<ResumesResponse["data"]>;
export type ResumeItem = Resumes["resumes"][number];

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
