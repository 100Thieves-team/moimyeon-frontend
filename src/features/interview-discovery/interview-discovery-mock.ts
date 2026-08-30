import type { RoomsResponse } from "@/api";

type InterviewRoom = NonNullable<RoomsResponse["data"]>["rooms"][number];

const PAGE_SIZE = 6;
const SECOND_PAGE_CURSOR = "mock-page-2";

function createRoom(
  index: number,
  room: Partial<InterviewRoom> &
    Pick<InterviewRoom, "company" | "jobPosting" | "jobRole" | "title">,
): InterviewRoom {
  return {
    method: "ONLINE",
    methodLabel: "온라인",
    recruit: {
      current: 2,
      max: 4,
      pending: 0,
      recruitStatus: "RECRUITING",
      recruitStatusLabel: "모집 중",
    },
    roomId: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    round: "FIRST",
    roundLabel: "1차",
    schedule: {
      date: `2026-09-${String(index + 1).padStart(2, "0")}`,
      durationMinutes: 60,
      startTime: "19:00",
    },
    viewer: { actions: ["LOGIN_REQUIRED"], relation: "ANONYMOUS" },
    ...room,
  };
}

const MOCK_INTERVIEW_ROOMS = [
  createRoom(1, {
    company: { companyId: 43429, name: "네이버" },
    jobPosting: { jobPostingId: 101, postingName: "Frontend Engineer" },
    jobRole: { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
    method: "OFFLINE",
    methodLabel: "오프라인",
    region: { label: "서울 강남구", sigunguId: 1 },
    title: "네이버 프론트엔드 직무 면접 같이 준비해요",
  }),
  createRoom(2, {
    company: { companyId: 43430, name: "카카오" },
    jobPosting: { jobPostingId: 102, postingName: "Backend Developer" },
    jobRole: { code: "BACKEND", displayName: "백엔드", jobRoleId: 11 },
    recruit: {
      current: 3,
      max: 4,
      pending: 1,
      recruitStatus: "RECRUITING",
      recruitStatusLabel: "모집 중",
    },
    round: "SECOND",
    roundLabel: "2차",
    title: "카카오 백엔드 2차 면접 스터디",
    viewer: { actions: ["VIEW_MY_ROOM"], relation: "PARTICIPANT" },
  }),
  createRoom(3, {
    company: { companyId: 43431, name: "토스" },
    jobPosting: { jobPostingId: 103, postingName: "Product Designer" },
    jobRole: { code: "PRODUCT_DESIGN", displayName: "프로덕트 디자인", jobRoleId: 12 },
    method: "OFFLINE",
    methodLabel: "오프라인",
    recruit: {
      current: 4,
      max: 4,
      pending: 0,
      recruitStatus: "CLOSED",
      recruitStatusLabel: "모집 완료",
    },
    region: { label: "서울 송파구", sigunguId: 2 },
    title: "토스 프로덕트 디자이너 포트폴리오 면접",
    viewer: { actions: ["MANAGE_ROOM"], relation: "HOST" },
  }),
  createRoom(4, {
    company: { companyId: 43432, name: "쿠팡" },
    jobPosting: { jobPostingId: 104, postingName: "Android Engineer" },
    jobRole: { code: "ANDROID", displayName: "안드로이드", jobRoleId: 13 },
    round: "THIRD",
    roundLabel: "3차",
    schedule: { date: "2026-09-06", durationMinutes: 90, startTime: "20:00" },
    title: "쿠팡 안드로이드 시스템 디자인 면접",
  }),
  createRoom(5, {
    company: { companyId: 43433, name: "당근" },
    jobPosting: { jobPostingId: 105, postingName: "iOS Engineer" },
    jobRole: { code: "IOS", displayName: "iOS", jobRoleId: 14 },
    method: "OFFLINE",
    methodLabel: "오프라인",
    region: { label: "경기 성남시", sigunguId: 3 },
    schedule: { date: "2026-09-07", durationMinutes: 60, startTime: "14:00" },
    title: "당근 iOS 라이브 코딩 대비",
  }),
  createRoom(6, {
    company: { companyId: 43434, name: "라인" },
    jobPosting: { jobPostingId: 106, postingName: "Data Engineer" },
    jobRole: { code: "DATA", displayName: "데이터 엔지니어", jobRoleId: 15 },
    round: "ETC",
    roundLabel: "기타",
    schedule: { date: "2026-09-08", durationMinutes: 120, startTime: "19:30" },
    title: "라인 데이터 엔지니어 기술 면접",
  }),
  createRoom(7, {
    company: { companyId: 43435, name: "우아한형제들" },
    jobPosting: { jobPostingId: 107, postingName: "Web Frontend Developer" },
    jobRole: { code: "FRONTEND", displayName: "프론트엔드", jobRoleId: 10 },
    schedule: { date: "2026-09-09", durationMinutes: 60, startTime: "21:00" },
    title: "우아한형제들 프론트엔드 면접 연습",
  }),
  createRoom(8, {
    company: { companyId: 43436, name: "무신사" },
    jobPosting: { jobPostingId: 108, postingName: "Product Manager" },
    jobRole: { code: "PM", displayName: "프로덕트 매니저", jobRoleId: 16 },
    method: "OFFLINE",
    methodLabel: "오프라인",
    region: { label: "서울 성동구", sigunguId: 4 },
    schedule: { date: "2026-09-10", durationMinutes: 60, startTime: "19:00" },
    title: "무신사 PM 케이스 면접 스터디",
  }),
  createRoom(9, {
    company: { companyId: 43437, name: "야놀자" },
    jobPosting: { jobPostingId: 109, postingName: "DevOps Engineer" },
    jobRole: { code: "DEVOPS", displayName: "DevOps", jobRoleId: 17 },
    round: "SECOND",
    roundLabel: "2차",
    schedule: { date: "2026-09-11", durationMinutes: 90, startTime: "20:00" },
    title: "야놀자 DevOps 2차 기술 면접",
  }),
  createRoom(10, {
    company: { companyId: 43438, name: "컬리" },
    jobPosting: { jobPostingId: 110, postingName: "QA Engineer" },
    jobRole: { code: "QA", displayName: "QA", jobRoleId: 18 },
    method: "OFFLINE",
    methodLabel: "오프라인",
    region: { label: "서울 강남구", sigunguId: 1 },
    schedule: { date: "2026-09-12", durationMinutes: 60, startTime: "16:00" },
    title: "컬리 QA 엔지니어 실무 면접",
  }),
] satisfies InterviewRoom[];

export function getMockInterviewRooms(searchParams: URLSearchParams): RoomsResponse {
  const companyId = searchParams.get("companyId");
  const jobPostingId = searchParams.get("jobPostingId");
  const jobRoleId = searchParams.get("jobRoleId");
  const round = searchParams.get("round");
  const method = searchParams.get("method");
  const sigunguId = searchParams.get("sigunguId");
  const sort = searchParams.get("sort") ?? "SCHEDULE";
  const filteredRooms = MOCK_INTERVIEW_ROOMS.filter(
    (room) =>
      (companyId === null || String(room.company?.companyId) === companyId) &&
      (jobPostingId === null || String(room.jobPosting?.jobPostingId) === jobPostingId) &&
      (jobRoleId === null || String(room.jobRole?.jobRoleId) === jobRoleId) &&
      (round === null || room.round === round) &&
      (method === null || room.method === method) &&
      (sigunguId === null || String(room.region?.sigunguId) === sigunguId),
  );
  const sortedRooms = filteredRooms.toSorted((left, right) => {
    if (sort === "RECENT") return right.roomId.localeCompare(left.roomId);

    const leftSchedule = `${left.schedule?.date ?? ""}T${left.schedule?.startTime ?? ""}`;
    const rightSchedule = `${right.schedule?.date ?? ""}T${right.schedule?.startTime ?? ""}`;
    return leftSchedule.localeCompare(rightSchedule);
  });
  const pageStart = searchParams.get("cursor") === SECOND_PAGE_CURSOR ? PAGE_SIZE : 0;
  const rooms = sortedRooms.slice(pageStart, pageStart + PAGE_SIZE);

  return {
    data: {
      nextCursor: pageStart + PAGE_SIZE < sortedRooms.length ? SECOND_PAGE_CURSOR : null,
      rooms,
      sort,
      totalCount: sortedRooms.length,
    },
    result: "SUCCESS",
  };
}
