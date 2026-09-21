"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptApplicationMutation,
  getInterviewOverviewQueryKey,
  rejectApplicationMutation,
  roomApplicationsQueryKey,
  roomDetailQueryKey,
  roomParticipantsQueryKey,
  roomsQueryKey,
} from "@/api/generated/@tanstack/react-query.gen";

export function useApplicationActions(roomId: string) {
  const queryClient = useQueryClient();
  const accept = useMutation({
    ...acceptApplicationMutation(),
    onSettled: refresh,
  });
  const reject = useMutation({
    ...rejectApplicationMutation(),
    onSettled: refresh,
  });
  const processing = accept.isPending ? "accept" : reject.isPending ? "reject" : null;

  async function refresh() {
    // 조회 실패는 query 상태로 표시하고, 성공한 mutation을 실패로 바꾸지 않는다.
    await Promise.all(
      [
        roomApplicationsQueryKey({ path: { roomId } }),
        roomDetailQueryKey({ path: { roomId } }),
        roomParticipantsQueryKey({ path: { roomId } }),
        roomsQueryKey(),
        getInterviewOverviewQueryKey(),
      ].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    );
  }

  return { processing, accept, reject, refresh };
}
