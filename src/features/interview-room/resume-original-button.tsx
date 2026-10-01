"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "@base-ui/react/toast";
import {
  roomDetailQueryKey,
  roomParticipantsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";
import { resumeSubmissionViewUrl } from "@/api/generated/sdk.gen";
import { Button } from "@/components/button";
import { getRoomRequestError, type RoomParticipant } from "./participant-model";
import * as styles from "./interview-room.css";

export function ResumeOriginalButton({
  roomId,
  participant,
}: {
  roomId: string;
  participant: RoomParticipant;
}) {
  const client = useQueryClient();
  const toast = Toast.useToastManager();
  const available = participant.canViewOriginal && participant.resumeSubmissionId != null;
  const mutation = useMutation({
    mutationFn: async (target: Window) => {
      try {
        const { data: response } = await resumeSubmissionViewUrl({
          path: { roomId, resumeSubmissionId: String(participant.resumeSubmissionId) },
          throwOnError: true,
        });
        if (!response.data?.url) throw response;
        target.location.replace(response.data.url);
      } catch (error) {
        target.close();
        throw error;
      }
    },
    onError: (error) => {
      const { code } = getRoomRequestError(error);
      if (code === "E1419" || code === "E1429" || code === "E1010") {
        void Promise.allSettled(
          [
            roomDetailQueryKey({ path: { roomId } }),
            roomParticipantsQueryKey({ path: { roomId } }),
          ].map((queryKey) => client.invalidateQueries({ queryKey })),
        );
      }
    },
  });
  if (!available && !mutation.isError) return null;

  return (
    <div className={styles.resumeAction}>
      {available && (
        <Button
          size="sm"
          variant="secondary"
          disabled={mutation.isPending}
          aria-label={`${participant.nickname} 이력서 원본`}
          onClick={() => {
            if (!available || mutation.isPending) return;
            const target = window.open("about:blank", "_blank");
            if (!target) {
              toast.add({ title: "팝업이 차단됐어요. 팝업을 허용한 뒤 다시 열어 주세요." });
              return;
            }
            target.opener = null;
            mutation.mutate(target);
          }}
        >
          {mutation.isPending ? "원본 여는 중..." : "이력서 원본"}
        </Button>
      )}
      {mutation.isError && (
        <p className={styles.error} role="alert">
          {getRoomRequestError(mutation.error).message}
        </p>
      )}
    </div>
  );
}
