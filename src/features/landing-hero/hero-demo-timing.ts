// 장면 컴포넌트는 이 단계 목록을 기준으로 요소를 순서대로 보여준다.
export const FRAMES = [0, 1, 2, 3] as const;
export const FRAME_MS = 1300;
export const SCENE_DURATION_MS = FRAME_MS * FRAMES.length;

export type Frame = (typeof FRAMES)[number];
