"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { createResumeMutation, resumesQueryKey } from "@/api/generated/@tanstack/react-query.gen";
import { type ResumeDetail, validateResumeFile } from "./resume-model";

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
  const {
    control,
    clearErrors,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<{ file: File | null }>({
    defaultValues: { file: null },
  });
  const { field } = useController({
    control,
    name: "file",
    rules: {
      validate: (file) =>
        file ? (validateResumeFile(file) ?? true) : "이력서 파일을 선택해 주세요.",
    },
  });
  const createResume = useMutation({
    ...createResumeMutation(),
    onSuccess: async (response) => {
      const uploadedResume = response.data;

      if (uploadedResume === undefined || uploadedResume === null) {
        throw new Error("Resume response did not include data.");
      }

      await queryClient.invalidateQueries({ queryKey: resumesQueryKey() });
      onUploaded?.(uploadedResume);
    },
    onError: (error) => {
      setError("root.server", {
        type: "server",
        message: getErrorMessage(error, "이력서를 올리지 못했어요. 다시 시도해 주세요."),
      });
    },
  });

  const submitUpload = handleSubmit(({ file }) => {
    if (file) createResume.mutate({ body: { file } });
  });

  const uploadResume = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;

    clearErrors();
    field.onChange(file);
    void submitUpload();
  };

  return {
    isUploading: createResume.isPending,
    fileField: { name: field.name, onBlur: field.onBlur, ref: field.ref },
    resetUploadError: () => clearErrors(),
    uploadError: errors.file?.message ?? errors.root?.server?.message,
    uploadResume,
  };
}
