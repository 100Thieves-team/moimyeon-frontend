"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, useState } from "react";
import type { ResumesResponse } from "@/api";
import { createResumeMutation, resumesQueryKey } from "@/api/generated/@tanstack/react-query.gen";
import { type ResumeDetail, upsertResume, validateResumeFile } from "./resume-model";

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("error" in error)) {
    return fallback;
  }

  const detail = error.error;

  if (typeof detail !== "object" || detail === null || !("message" in detail)) {
    return fallback;
  }

  return typeof detail.message === "string" ? detail.message : fallback;
}

export function useResumeUpload(onUploaded?: (resume: ResumeDetail) => void) {
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const createResume = useMutation({
    ...createResumeMutation(),
    onSuccess: async (response) => {
      const uploadedResume = response.data;

      if (uploadedResume === undefined || uploadedResume === null) {
        throw new Error("Resume response did not include data.");
      }

      queryClient.setQueryData<ResumesResponse>(resumesQueryKey(), (current) =>
        upsertResume(current, uploadedResume),
      );
      onUploaded?.(uploadedResume);
      await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
    },
    onError: (error) => {
      setUploadError(getErrorMessage(error, "이력서를 올리지 못했어요. 다시 시도해 주세요."));
    },
  });

  const uploadResume = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    setUploadError(null);
    const validationError = validateResumeFile(file);

    if (validationError !== null) {
      setUploadError(validationError);
      return;
    }

    createResume.mutate({ body: { file } });
  };

  return {
    isUploading: createResume.isPending,
    resetUploadError: () => setUploadError(null),
    uploadError,
    uploadResume,
  };
}
