"use client";

import { createContext, type ReactNode, useContext, useMemo, useReducer } from "react";
import type { MockRoomPhase } from "./mock-data";

export type MockApplicationStatus = "accepted" | "pending" | "rejected";

export type MockResume = {
  fileName: string;
  id: string;
  isDefault: boolean;
  meta: string;
  status: "done" | "processing";
  summary: string;
};

type MockRoomState = {
  applications: Record<string, MockApplicationStatus>;
  phase: MockRoomPhase;
};

type MockFlowState = {
  reportedReviewIds: string[];
  resumes: MockResume[];
  rooms: Record<string, MockRoomState>;
};

type MockFlowAction =
  | {
      applicantId: string;
      roomId: string;
      status: MockApplicationStatus;
      type: "resolve-application";
    }
  | { roomId: string; type: "confirm-room" }
  | { roomId: string; type: "complete-room" }
  | { resume: MockResume; type: "add-resume" }
  | { resumeId: string; type: "delete-resume" }
  | { resumeId: string; type: "set-default-resume" }
  | { resumeId: string; summary: string; type: "complete-resume-summary" }
  | { reviewId: string; type: "report-review" };

type MockFlowContextValue = MockFlowState & {
  addResume: (resume: MockResume) => void;
  completeResumeSummary: (resumeId: string, summary: string) => void;
  completeRoom: (roomId: string) => void;
  confirmRoom: (roomId: string) => void;
  deleteResume: (resumeId: string) => void;
  reportReview: (reviewId: string) => void;
  resolveApplication: (roomId: string, applicantId: string, status: MockApplicationStatus) => void;
  setDefaultResume: (resumeId: string) => void;
};

const initialState: MockFlowState = {
  reportedReviewIds: [],
  resumes: [
    {
      fileName: "든든한곰_이력서.pdf",
      id: "resume-default",
      isDefault: true,
      meta: "7월 12일 업데이트 · 212KB",
      status: "done",
      summary: "핀테크 백엔드 3년 차 · 결제 정산 배치·대사 · Kotlin·Spring",
    },
    {
      fileName: "든든한곰_이력서_커머스.pdf",
      id: "resume-commerce",
      isDefault: false,
      meta: "6월 28일 업데이트 · 198KB",
      status: "done",
      summary: "커머스 주문·재고 프로젝트 중심 · 대용량 배치 경험 강조",
    },
    {
      fileName: "든든한곰_이력서_시스템설계.pdf",
      id: "resume-system",
      isDefault: false,
      meta: "방금 올림 · 224KB",
      status: "processing",
      summary: "AI 요약을 만들고 있어요 — 잠깐이면 돼요",
    },
  ],
  rooms: {
    "hanbit-completed": { applications: {}, phase: "completed" },
    "hanbit-host-recruiting": {
      applications: { deer: "pending", otter: "pending" },
      phase: "recruiting",
    },
    "hanbit-host-short": { applications: {}, phase: "recruiting" },
    "hanbit-host-today": { applications: {}, phase: "preparing" },
    "hanbit-participant-confirmed": { applications: {}, phase: "confirmed" },
  },
};

function reducer(state: MockFlowState, action: MockFlowAction): MockFlowState {
  switch (action.type) {
    case "resolve-application": {
      const room = state.rooms[action.roomId];
      if (!room) return state;
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.roomId]: {
            ...room,
            applications: { ...room.applications, [action.applicantId]: action.status },
          },
        },
      };
    }
    case "confirm-room": {
      const room = state.rooms[action.roomId];
      if (!room) return state;
      return {
        ...state,
        rooms: { ...state.rooms, [action.roomId]: { ...room, phase: "confirmed" } },
      };
    }
    case "complete-room": {
      const room = state.rooms[action.roomId];
      if (!room) return state;
      return {
        ...state,
        rooms: { ...state.rooms, [action.roomId]: { ...room, phase: "completed" } },
      };
    }
    case "add-resume":
      return { ...state, resumes: [...state.resumes, action.resume] };
    case "delete-resume":
      return { ...state, resumes: state.resumes.filter((resume) => resume.id !== action.resumeId) };
    case "set-default-resume":
      return {
        ...state,
        resumes: state.resumes.map((resume) => ({
          ...resume,
          isDefault: resume.id === action.resumeId,
        })),
      };
    case "complete-resume-summary":
      return {
        ...state,
        resumes: state.resumes.map((resume) =>
          resume.id === action.resumeId
            ? { ...resume, status: "done", summary: action.summary }
            : resume,
        ),
      };
    case "report-review":
      return state.reportedReviewIds.includes(action.reviewId)
        ? state
        : { ...state, reportedReviewIds: [...state.reportedReviewIds, action.reviewId] };
  }
}

const MockFlowContext = createContext<MockFlowContextValue | null>(null);

export function MockFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo<MockFlowContextValue>(
    () => ({
      ...state,
      addResume: (resume) => dispatch({ resume, type: "add-resume" }),
      completeResumeSummary: (resumeId, summary) =>
        dispatch({ resumeId, summary, type: "complete-resume-summary" }),
      completeRoom: (roomId) => dispatch({ roomId, type: "complete-room" }),
      confirmRoom: (roomId) => dispatch({ roomId, type: "confirm-room" }),
      deleteResume: (resumeId) => dispatch({ resumeId, type: "delete-resume" }),
      reportReview: (reviewId) => dispatch({ reviewId, type: "report-review" }),
      resolveApplication: (roomId, applicantId, status) =>
        dispatch({ applicantId, roomId, status, type: "resolve-application" }),
      setDefaultResume: (resumeId) => dispatch({ resumeId, type: "set-default-resume" }),
    }),
    [state],
  );

  return <MockFlowContext.Provider value={value}>{children}</MockFlowContext.Provider>;
}

export function useMockFlow() {
  const value = useContext(MockFlowContext);
  if (!value) throw new Error("useMockFlow must be used inside MockFlowProvider");
  return value;
}
