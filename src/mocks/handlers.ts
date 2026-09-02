import { http, HttpResponse, passthrough } from "msw";
import { getMockInterviewRooms } from "@/features/interview-discovery/interview-discovery-mock";
import {
  getMockInterviewDetail,
  getMockInterviewHostProfile,
} from "@/features/interview-detail/interview-detail-mock";

export const handlers = [
  http.get("*/v1/rooms", ({ request }) => {
    const { searchParams } = new URL(request.url);

    return HttpResponse.json(getMockInterviewRooms(searchParams));
  }),
  http.get("*/v1/rooms/:roomId", ({ params }) => {
    const response = getMockInterviewDetail(String(params.roomId));

    return response ? HttpResponse.json(response) : passthrough();
  }),
  http.get("*/v1/members/:memberId/profile", ({ params }) => {
    const response = getMockInterviewHostProfile(String(params.memberId));

    return response ? HttpResponse.json(response) : passthrough();
  }),
];
