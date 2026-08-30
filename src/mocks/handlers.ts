import { http, HttpResponse } from "msw";
import { getMockInterviewRooms } from "@/features/interview-discovery/interview-discovery-mock";

export const handlers = [
  http.get("*/v1/rooms", ({ request }) => {
    const { searchParams } = new URL(request.url);

    return HttpResponse.json(getMockInterviewRooms(searchParams));
  }),
];
