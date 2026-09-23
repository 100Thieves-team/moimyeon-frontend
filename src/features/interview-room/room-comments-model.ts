import type { GetRoomCommentsResponse } from "@/api/generated";

export type RoomComments = NonNullable<GetRoomCommentsResponse["data"]>;
export type RoomComment = RoomComments["comments"][number];
export function formatCommentDate(value: string) {
  const date = new Date(/(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}+09:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(date);
}
