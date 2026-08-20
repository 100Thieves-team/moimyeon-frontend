export type MockInterviewMethod = "online" | "offline";
export type MockInterviewRelation = "host" | "none" | "participant" | "pending";
export type MockInterviewRole = "backend" | "data" | "frontend" | "pm";
export type MockInterviewRound = "documents" | "first" | "other" | "second";
export type MockInterviewStatus = "closing" | "open";
export type MockRoomPhase = "completed" | "confirmed" | "in-progress" | "preparing" | "recruiting";

export type MockInterview = {
  company: string;
  currentParticipants: number;
  dateGroup: "next-week" | "this-week" | "weekend";
  dateLabel: string;
  duration: string;
  host: {
    bio: string;
    completedInterviews: number;
    nickname: string;
    reviewTags: string[];
  };
  id: string;
  introduction: string;
  jobPosting: string;
  jobRole: MockInterviewRole;
  jobRoleLabel: string;
  maxParticipants: number;
  method: MockInterviewMethod;
  methodLabel: string;
  minParticipants: number;
  notes: string[];
  region: "부산" | "서울" | "온라인" | "판교";
  relation: MockInterviewRelation;
  round: MockInterviewRound;
  roundLabel: string;
  status: MockInterviewStatus;
  timeLabel: string;
  title: string;
};

type MockInterviewTemplate = Omit<MockInterview, "id">;

const templates: MockInterviewTemplate[] = [
  {
    company: "한빛커머스",
    currentParticipants: 3,
    dateGroup: "weekend",
    dateLabel: "7월 26일 (일)",
    duration: "90분",
    host: {
      bio: "백엔드 면접을 준비하며 서로의 답변을 구체적으로 다듬고 있어요.",
      completedInterviews: 12,
      nickname: "꼼꼼한 여우 12",
      reviewTags: ["시간을 잘 지켜요", "피드백이 구체적이에요"],
    },
    introduction:
      "한빛커머스 백엔드 2차 면접을 함께 준비해요. 실제 면접처럼 답변하고 서로 피드백을 주고받을 예정이에요.",
    jobPosting: "커머스 플랫폼 백엔드 개발자",
    jobRole: "backend",
    jobRoleLabel: "백엔드 개발",
    maxParticipants: 5,
    method: "online",
    methodLabel: "온라인",
    minParticipants: 3,
    notes: [
      "각자 이력서 기준 예상 질문 3개를 준비해 주세요.",
      "참여 확정 후 댓글에서 화상 링크를 공유해요.",
    ],
    region: "온라인",
    relation: "none",
    round: "second",
    roundLabel: "2차",
    status: "open",
    timeLabel: "오후 7:00",
    title: "한빛커머스 백엔드 2차 같이 준비해요",
  },
  {
    company: "토스",
    currentParticipants: 4,
    dateGroup: "this-week",
    dateLabel: "7월 23일 (목)",
    duration: "60분",
    host: {
      bio: "제품 감각과 기술적 의사결정을 함께 연습하고 있어요.",
      completedInterviews: 8,
      nickname: "차분한 수달 08",
      reviewTags: ["질문이 날카로워요", "소통이 원활해요"],
    },
    introduction: "프론트엔드 1차 기술 면접 질문을 번갈아 묻고 답변 흐름을 점검해요.",
    jobPosting: "Frontend Developer",
    jobRole: "frontend",
    jobRoleLabel: "프론트엔드",
    maxParticipants: 6,
    method: "offline",
    methodLabel: "오프라인",
    minParticipants: 3,
    notes: ["노트북은 필요하지 않아요.", "답변별로 5분씩 피드백해요."],
    region: "서울",
    relation: "participant",
    round: "first",
    roundLabel: "1차",
    status: "open",
    timeLabel: "오후 8:00",
    title: "토스 프론트엔드 1차 모의면접",
  },
  {
    company: "카카오",
    currentParticipants: 4,
    dateGroup: "next-week",
    dateLabel: "7월 29일 (수)",
    duration: "90분",
    host: {
      bio: "데이터 분석 과제를 말로 설명하는 연습을 함께해요.",
      completedInterviews: 15,
      nickname: "명확한 고래 15",
      reviewTags: ["준비가 성실해요", "피드백이 구체적이에요"],
    },
    introduction: "데이터 직군 과제와 케이스 질문을 중심으로 연습합니다.",
    jobPosting: "Data Analyst",
    jobRole: "data",
    jobRoleLabel: "데이터",
    maxParticipants: 5,
    method: "online",
    methodLabel: "온라인",
    minParticipants: 2,
    notes: [
      "분석 프로젝트 한 가지를 골라 와 주세요.",
      "화면 공유가 가능한 환경에서 참여해 주세요.",
    ],
    region: "온라인",
    relation: "host",
    round: "first",
    roundLabel: "1차",
    status: "closing",
    timeLabel: "오후 7:30",
    title: "카카오 데이터 직군 케이스 면접",
  },
  {
    company: "네이버",
    currentParticipants: 2,
    dateGroup: "weekend",
    dateLabel: "8월 1일 (토)",
    duration: "60분",
    host: {
      bio: "제품 문제를 구조화하고 우선순위를 설명하는 연습을 해요.",
      completedInterviews: 5,
      nickname: "집요한 비버 05",
      reviewTags: ["시간을 잘 지켜요", "준비가 성실해요"],
    },
    introduction: "PM 직무의 제품 감각과 협업 질문을 함께 준비합니다.",
    jobPosting: "Product Manager",
    jobRole: "pm",
    jobRoleLabel: "PM",
    maxParticipants: 4,
    method: "offline",
    methodLabel: "오프라인",
    minParticipants: 2,
    notes: ["최근 인상 깊었던 제품 사례를 준비해 주세요.", "판교역 인근에서 진행해요."],
    region: "판교",
    relation: "none",
    round: "other",
    roundLabel: "기타",
    status: "open",
    timeLabel: "오후 2:00",
    title: "네이버 PM 컬처핏 면접 연습",
  },
  {
    company: "우아한형제들",
    currentParticipants: 3,
    dateGroup: "next-week",
    dateLabel: "7월 30일 (목)",
    duration: "60분",
    host: {
      bio: "서류와 프로젝트 경험을 바탕으로 꼬리 질문을 연습해요.",
      completedInterviews: 10,
      nickname: "든든한 곰 10",
      reviewTags: ["소통이 원활해요", "질문이 날카로워요"],
    },
    introduction: "백엔드 서류 기반 예상 질문을 함께 만들고 답해 봅니다.",
    jobPosting: "백엔드 개발자",
    jobRole: "backend",
    jobRoleLabel: "백엔드 개발",
    maxParticipants: 6,
    method: "online",
    methodLabel: "온라인",
    minParticipants: 3,
    notes: ["대표 프로젝트를 3분으로 정리해 주세요.", "이력서는 참여자에게만 공개해요."],
    region: "온라인",
    relation: "none",
    round: "documents",
    roundLabel: "서류",
    status: "open",
    timeLabel: "오후 9:00",
    title: "우아한형제들 백엔드 서류 기반 질문",
  },
  {
    company: "당근",
    currentParticipants: 4,
    dateGroup: "this-week",
    dateLabel: "7월 24일 (금)",
    duration: "90분",
    host: {
      bio: "협업 경험을 구체적으로 전달하는 연습을 중요하게 생각해요.",
      completedInterviews: 7,
      nickname: "성실한 사슴 07",
      reviewTags: ["준비가 성실해요", "시간을 잘 지켜요"],
    },
    introduction: "프론트엔드 2차 면접을 가정해 기술과 협업 질문을 연습해요.",
    jobPosting: "Software Engineer, Frontend",
    jobRole: "frontend",
    jobRoleLabel: "프론트엔드",
    maxParticipants: 5,
    method: "offline",
    methodLabel: "오프라인",
    minParticipants: 3,
    notes: ["포트폴리오 한 가지를 골라 와 주세요.", "서울 강남권에서 진행해요."],
    region: "서울",
    relation: "pending",
    round: "second",
    roundLabel: "2차",
    status: "closing",
    timeLabel: "오후 7:00",
    title: "당근 프론트엔드 2차 함께 준비해요",
  },
];

export const mockInterviews: MockInterview[] = Array.from({ length: 24 }, (_, index) => {
  const template = templates[index % templates.length];
  const cycle = Math.floor(index / templates.length);

  if (index === 0) {
    return { ...template, id: "hanbit-backend-second" };
  }

  return {
    ...template,
    id: `mock-room-${String(index + 1).padStart(2, "0")}`,
    title: cycle === 0 ? template.title : `${template.title} · ${cycle + 1}회차`,
  };
});

export const mockResumes = [
  {
    id: "resume-bear",
    fileName: "든든한곰_이력서.pdf",
    summary:
      "Spring 기반 커머스 플랫폼 개발 경험과 트래픽 증가 구간의 병목을 개선한 사례가 돋보여요. 프로젝트별 역할과 성과가 수치로 정리되어 있어요.",
  },
  {
    id: "resume-project",
    fileName: "백엔드_프로젝트_중심.pdf",
    summary:
      "프로젝트 구조와 기술 선택의 이유가 잘 드러나요. 협업 과정에서 해결한 문제를 면접 답변으로 확장하기 좋아요.",
  },
] as const;

export const mockComments = [
  {
    author: "꼼꼼한 여우 12",
    badge: "방장",
    content: "그럼 각자 이력서 기준으로 예상 질문 3개씩 준비해와요. 당일에 순서 정해서 진행할게요.",
    id: "comment-host-latest",
    mine: false,
    time: "7월 21일 오후 2:31",
  },
  {
    author: "든든한 곰 21",
    badge: "나",
    content: "네 좋습니다. 이력서 기준 예상 질문도 각자 정리해오면 좋을 것 같아요.",
    id: "comment-mine",
    mine: true,
    time: "7월 21일 오후 2:22",
  },
  {
    author: "성실한 사슴 03",
    content: "좋아요. 자기소개는 각자 3분 정도 준비하면 될까요?",
    id: "comment-deer",
    mine: false,
    time: "7월 21일 오후 2:20",
  },
  {
    author: "꼼꼼한 여우 12",
    badge: "방장",
    content:
      "다들 반가워요! 7월 26일 저녁 7시에 온라인으로 만나요. 링크는 확정되면 여기 공유할게요.",
    id: "comment-host-first",
    mine: false,
    time: "7월 21일 오후 2:14",
  },
] as const;

export type MockParticipant = {
  bio: string;
  completedInterviews: number;
  id: string;
  initial: string;
  isHost?: boolean;
  isMe?: boolean;
  jobRole: string;
  nickname: string;
  rating: string;
  resumeFileName: string;
  summary: string;
};

export type MockApplicant = MockParticipant & {
  appliedAt: string;
  message: string;
};

export const mockParticipants: MockParticipant[] = [
  {
    bio: "대규모 주문·정산 시스템과 MSA 전환 경험을 바탕으로 질문을 준비해요.",
    completedInterviews: 9,
    id: "fox",
    initial: "여",
    isHost: true,
    jobRole: "백엔드 개발",
    nickname: "꼼꼼한 여우 12",
    rating: "4.9",
    resumeFileName: "꼼꼼한여우_이력서.pdf",
    summary: "커머스 백엔드 5년 차 · 대규모 주문·정산 · MSA 전환",
  },
  {
    bio: "결제 연동과 배치 처리 경험을 면접 답변으로 구체화하고 있어요.",
    completedInterviews: 3,
    id: "deer",
    initial: "사",
    jobRole: "백엔드 개발",
    nickname: "성실한 사슴 03",
    rating: "4.7",
    resumeFileName: "성실한사슴_이력서.pdf",
    summary: "스타트업 백엔드 2년 차 · Node.js·PostgreSQL · 결제 연동",
  },
  {
    bio: "결제 정산 배치와 대사 시스템 경험을 중심으로 준비하고 있어요.",
    completedInterviews: 5,
    id: "bear",
    initial: "곰",
    isMe: true,
    jobRole: "백엔드 개발",
    nickname: "든든한 곰 21",
    rating: "4.6",
    resumeFileName: "든든한곰_이력서.pdf",
    summary: "핀테크 백엔드 3년 차 · 결제 정산 배치·대사 · Kotlin·Spring",
  },
  {
    bio: "주문 시스템 유지보수 경험을 더 논리적으로 설명하는 연습을 해요.",
    completedInterviews: 1,
    id: "otter",
    initial: "수",
    jobRole: "백엔드 개발",
    nickname: "수줍은 수달 21",
    rating: "첫 참여",
    resumeFileName: "수줍은수달_이력서.pdf",
    summary: "SI 백엔드 2년 차 · Java·JPA 주문 시스템 유지보수",
  },
];

export const mockApplicants: MockApplicant[] = [
  {
    ...mockParticipants[1],
    appliedAt: "10분 전",
    message: "결제 정산 도메인 준비 중이라 실전처럼 연습하고 싶어요. 잘 부탁드려요!",
  },
  {
    ...mockParticipants[3],
    appliedAt: "1시간 전",
    message: "주문 시스템 경험을 바탕으로 꼬리질문까지 함께 연습하고 싶어요.",
  },
];

function createScenarioInterview(
  id: string,
  relation: MockInterviewRelation,
  currentParticipants: number,
): MockInterview {
  return {
    ...mockInterviews[0],
    currentParticipants,
    id,
    relation,
    status: relation === "host" ? "open" : "closing",
  };
}

export const mockScenarioInterviews = {
  completed: createScenarioInterview("hanbit-completed", "participant", 4),
  confirmedParticipant: createScenarioInterview("hanbit-participant-confirmed", "participant", 4),
  hostRecruiting: createScenarioInterview("hanbit-host-recruiting", "host", 4),
  hostShortStaffed: createScenarioInterview("hanbit-host-short", "host", 2),
  hostToday: createScenarioInterview("hanbit-host-today", "host", 4),
} as const;

export function getMockInterview(roomId: string) {
  return (
    mockInterviews.find((interview) => interview.id === roomId) ??
    Object.values(mockScenarioInterviews).find((interview) => interview.id === roomId)
  );
}
