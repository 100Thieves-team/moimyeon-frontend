# 저장소 가이드라인

## 프로젝트 구조 및 모듈 구성

이 프로젝트는 strict TypeScript를 사용하는 Next.js 16 App Router 애플리케이션이다.

- 라우트와 레이아웃: `src/app`
- 도메인 코드는 `src/features/<domain>`
- 재사용 가능한 컴포넌트: `src/components`
- 디자인 시스템 Primitive 토큰: `src/styles`
- API 설정: `src/api`
- 테스트와 Mock: `tests`
- 정적 에셋: `public`

## 에이전트 전용 지침

- 프론트엔드 구현, 리팩터링, 리뷰 전에는 [프론트엔드 패턴](.agents/skills/frontend-pattern/SKILL.md)을 참고
- 테스트를 계획하거나 추가, 수정하기 전에는 [핵심 사용자 흐름 테스트](.agents/skills/test-user-flows/SKILL.md)를 참고
- 커밋, 브랜치, rebase, push 또는 PR 작업 전에는 [Git 컨벤션](.agents/skills/git-conventions/SKILL.md)을 참고

## 환경 변수

`.env.example`을 `.env.local`로 복사한다. 토큰, `.env.local`, `DEV_ACCESS_TOKEN`은 커밋하지 않는다.
