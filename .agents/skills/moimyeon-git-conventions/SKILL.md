---
name: moimyeon-git-conventions
description: 커밋 작성, 브랜치 생성, PR 생성 등 모든 git 작업 시 팀 컨벤션을 적용한다. "커밋해줘", "브랜치 만들어줘", "PR 올려줘" 요청이나 작업 완료 후 커밋/PR을 만들기 전에 반드시 참조.
---

# 커밋

- Conventional Commits 형식: `타입: 제목` — 제목은 **한국어**, 명사형 종결(…구현, …추가, …제거)
- 허용 타입: `feat` `fix` `docs` `style` `refactor` `test` `chore`
- 스코프는 사용하지 않는다 (저장소 관례)
- 본문이 필요하면 한국어 불릿으로 작성한다
- 예시 (실제 이력):
  - `feat: 디자인 시스템 파운데이션을 Vanilla Extract로 구현`
  - `docs: DESIGN.md에 spacing 스케일 추가`
  - `chore: 주석 정리 및 미사용 remBase 상수 제거`

# 브랜치

- 형식: `{Linear 식별자(소문자)}-{영문 슬러그}` — 예: `moi-357-wireframe-design`
- 식별자는 반드시 Linear 이슈에서 가져온다 (예: `MOI-357` → `moi-357`). 이슈 조회는 Linear MCP(`get_issue`/`list_issues`) 사용
- 슬러그는 이슈 제목·작업 내용을 **영어로 요약**해 kebab-case로 작성한다 (소문자, 하이픈 구분, 2~5단어)
- Linear가 제공하는 `gitBranchName`은 한글 제목이 그대로 포함되므로 사용하지 않는다
- 어떤 이슈 작업인지 불명확하면 사용자에게 확인한다

# PR

- 제목: 커밋과 동일한 형식에 Linear identifier를 덧붙인다 — `feat: 세션 생성 화면 구현 (MOI-328)`
- 본문: `.github/pull_request_template.md` 구조를 그대로 채운다
  - `gh pr create --body` 사용 시 템플릿이 자동 적용되지 않으므로, 템플릿 파일을 읽어 각 섹션을 채운 본문을 전달한다
  - `## 개요`: 변경 내용 요약 (한국어)
  - `## to-be`: 변경 후 상태·스크린샷
  - `## Figma` / `## Slack`: 링크를 알면 기입하고, 모르면 사용자에게 확인한다 (임의 생략 금지)
- 제목·본문 모두 **한국어**로 작성한다
- base 브랜치는 `main`

## 커밋 후 본문 동기화

- 커밋이 성공할 때마다 현재 브랜치에 연결된 열린 PR을 확인한다
- 열린 PR이 있으면 최신 커밋의 변경 내용과 실제 검증 결과를 기존 PR 본문에 누적 반영한다
- `.github/pull_request_template.md`의 섹션 구조, 사용자가 작성한 링크·설명, 자동 생성 주석 영역을 보존한다
- 수정 후 PR 본문을 다시 읽어 변경 내용이 반영됐는지 확인한다
- 열린 PR이 없으면 본문 동기화를 건너뛰고 그 사실을 알린다. 명시적인 요청 없이 PR을 새로 만들지 않는다
