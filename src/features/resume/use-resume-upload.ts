"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createResumeMutation, resumesQueryKey } from "@/api/generated/@tanstack/react-query.gen";

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

export function useResumeUpload() {
  const queryClient = useQueryClient();
  const {
    control,
    clearErrors,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<{ file: File | null }>({
    defaultValues: { file: null },
  });
  const createResume = useMutation({
    ...createResumeMutation(),
    onSuccess: async (response) => {
      const uploadedResume = response.data;

      if (uploadedResume === undefined || uploadedResume === null) {
        throw new Error("Resume response did not include data.");
      }

      await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
    },
    onError: (error) => {
      setError("root.server", {
        type: "server",
        message: getErrorMessage(error, "이력서를 올리지 못했어요. 다시 시도해 주세요."),
      });
    },
  });

  return {
    createResume,
    handleSubmit,
    control,
    resetUploadError: () => clearErrors(),
    uploadError: errors.file?.message ?? errors.root?.server?.message,
  };
}
