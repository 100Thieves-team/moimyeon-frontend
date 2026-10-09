# PostHog 주요 사용자 이벤트 (MOI-586)

브라우저에서 발생한 주요 행동을 수집한다. 서버 전체 처리 건수나 서버의 자동 완료를 집계하는 용도로 사용하지 않는다. 후기 작성은 면접 종료 후 선택 행동이며 필수 전환에 넣지 않는다.

## 설정

`.env.example`의 `NEXT_PUBLIC_POSTHOG_*` 항목을 배포 환경에 설정한다. 프로젝트의 **Settings → General → Project token & ID / SDK setup**에서 SDK용 공개 프로젝트 토큰과 수집 호스트를 확인한다. 개인 API 키나 프로젝트 secret API 키를 사용하지 않는다.

- `NEXT_PUBLIC_POSTHOG_ENABLED=true`: 명시적으로 수집 활성화. 기본값은 false.
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`: SDK용 공개 프로젝트 토큰.
- `NEXT_PUBLIC_POSTHOG_HOST`: 프로젝트 수집 호스트. US Cloud는 `https://us.i.posthog.com`.
- `NEXT_PUBLIC_POSTHOG_ENVIRONMENT`: 개발 배포·로컬 검증은 `dev`, 운영 배포는 `live`.

활성화 여부·토큰·호스트·환경이 갖춰지지 않으면 SDK를 초기화하지 않는다. 테스트 환경에서도 초기화하지 않으며 자동 테스트는 SDK를 모킹한다. `NEXT_PUBLIC_*` 값은 Next.js 빌드에 포함되므로 배포 전에 설정해야 한다. 로컬에서 변경한 경우 개발 서버를 재시작한다. 설정값을 저장소에 커밋하지 않는다.

`src/instrumentation-client.ts`에서 SDK를 초기화한다. 자동 클릭·폼, pageview·pageleave, dead/rage click, 세션 리플레이, 성능·에러 추적, 설문, 기능 플래그, 제품 투어·웹 실험 수집을 끈다. SDK 전송은 기다리지 않으며 초기화·식별·전송 오류가 기존 작업의 성공·실패를 바꾸지 않는다. 네트워크 큐와 페이지 이탈 시 전송은 SDK가 관리한다.

## 이벤트 계약

공통 속성은 `event_version=1`, `environment=dev|live`, `page_path`, `is_authenticated`, `event_source=frontend`이다. SDK의 `$identify`는 사용자 연결을 위한 내부 이벤트다.

| 이벤트                           | 수집 시점                                    | 추가 속성                                                                                |
| -------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `$pageview`                      | 최초 진입과 pathname이 바뀌는 실제 경로 이동 | 없음                                                                                     |
| `login_started`                  | Google로 계속하기 클릭                       | 없음                                                                                     |
| `login_completed`                | Google 로그인 복귀 결과와 인증 회원 확인     | 없음                                                                                     |
| `interview_detail_viewed`        | 면접 상세 화면의 데이터가 준비되어 진입      | `room_id`, 확인 가능한 `actor_role`                                                      |
| `interview_create_started`       | 면접 생성 화면 진입                          | 없음                                                                                     |
| `interview_create_step_viewed`   | 생성 단계 진입·이동·이전 단계 복귀           | `step`                                                                                   |
| `interview_created`              | 생성 API 성공                                | 응답의 `room_id`, `actor_role=host`                                                      |
| `interview_apply_started`        | 신청 화면 진입                               | `room_id`, 확인 가능한 `actor_role`                                                      |
| `interview_applied`              | 신청 API 성공                                | `room_id`, 확인 가능한 `actor_role`                                                      |
| `interview_application_accepted` | 방장의 신청 수락 API 성공                    | `room_id`, `actor_role=host`                                                             |
| `interview_application_rejected` | 방장의 신청 반려 API 성공                    | `room_id`, `actor_role=host`                                                             |
| `interview_confirmed`            | 방장의 진행 확정 API 성공                    | `room_id`, `actor_role=host`                                                             |
| `interview_completed`            | 방장의 수동 완료·출석 제출 API 성공          | `room_id`, `actor_role=host`                                                             |
| `review_started`                 | 후기 작성 화면 진입                          | `room_id`, 확인 가능한 `actor_role`                                                      |
| `review_created`                 | 개별 후기 제출 API 성공                      | `room_id`                                                                                |
| `core_action_failed`             | 로그인 또는 위 주요 API·네트워크 실패        | `action`, `failure_type`, 서버가 반환한 `error_code`, 확인 가능한 `room_id`·`actor_role` |

`step`은 `interview-info`, `method-and-schedule`, `introduction-and-resume`, `final-review` 중 하나다. query에 저장한 단계만 바뀌면 `$pageview`를 추가하지 않는다.

`action`은 `login`, `interview_create`, `interview_apply`, `interview_application_accept`, `interview_application_reject`, `interview_confirm`, `interview_complete`, `review_create` 중 하나다. `failure_type`은 `api` 또는 `network`이며, 서버 코드가 없으면 `error_code`를 생략한다. HTTP 실패의 서버 envelope와 네트워크 예외를 구분한다. 폼 검증 실패는 집계하지 않는다.

성공·실패는 생성된 Mutation 함수의 API 결과에서 기록한다. Mutation 후속 콜백의 캐시 재조회 실패를 해당 작업 실패로 수집하지 않는다. 화면 진입과 단계는 현재 pathname의 방문 안에서 중복을 제거한다. 재렌더링, Query 재조회, Strict Mode 재실행은 새로운 방문이 아니며, 다른 경로에 갔다가 돌아오면 다시 수집한다. 개발 중 코드 변경에 따른 Fast Refresh·전체 새로고침은 별도 초기화가 발생할 수 있으므로 중복 검증은 코드 변경 없이 수행한다.

## 식별과 개인정보

익명 방문은 SDK의 개별 익명 ID를 사용한다. 서버가 인증 회원을 확인하면 `memberId`로 identify하고 기존 익명 탐색을 연결한다. 이메일·닉네임을 식별자로 사용하지 않는다. 같은 회원을 다시 조회하면 identify를 반복하지 않는다. 다른 계정으로 바뀌거나 로그아웃에 성공하면 reset한다. 기존 인증 세션 복원·새로고침만으로 `login_completed`를 수집하지 않는다.

Google 로그인 클릭은 세션 저장소에 시작 시각을 남긴다. 기존 로그인 의도와 동일한 10분 이내에 `/auth/callback`이 짧은 복귀 결과 쿠키를 남기고, 브라우저가 인증 결과를 확인한 뒤 쿠키와 시작 표시를 한 번 소비한다. 쿠키에는 성공/실패·실패 종류·서버 코드만 저장한다. 저장소 접근이 차단되면 로그인 기능은 유지되지만 해당 로그인 전환을 집계하지 못할 수 있다.

`actor_role`은 API viewer의 `isHost`·`isParticipating`에서 `host`, `participant`, `visitor`로 결정하며 판단할 수 없으면 생략한다. 수락·반려의 distinct_id는 신청자가 아니라 동작한 방장의 memberId다. 후기 대상의 memberId는 전송하지 않는다.

이메일·닉네임·이력서·소개·신청 전달사항·후기 본문·반려 사유·원본 오류 객체나 오류 메시지를 보내지 않는다. 공통 수집 함수에서 이벤트별 속성을 제한하고 `before_send`에서 SDK가 붙이는 속성까지 다시 제한한다. 현재 URL·referrer는 query와 hash를 제거하고 `/interviews/[roomId]`, `/interviews/[roomId]/apply`, `/interviews/[roomId]/review`, `/terms/[type]`로 정규화한다. 알 수 없는 경로는 `/[unknown]`으로 처리한다. `$set`·`$set_once`와 캠페인·검색어 속성은 전달하지 않는다.

## 퍼널 구성

모든 분석에 `environment=dev` 또는 `live`와 `event_source=frontend` 필터를 적용한다.

### 신청 전환

1. `interview_detail_viewed`
2. `interview_apply_started`
3. `interview_applied`

**Unique users**, **Sequential** 전환으로 구성한다. 같은 방의 전환을 확인할 때 **Filters → 이벤트 속성 room_id = 분석할 방 ID**를 전체 단계에 적용한다. room_id breakdown만으로 단계 간 동일 방을 보장한다고 해석하지 않는다. 익명에서 로그인으로 넘어간 사용자는 identify를 통해 같은 사용자로 연결된다. 실제 데이터에 맞춰 전환 기간을 정한다.

### 방장 진행

생성 시작에는 room_id가 없으므로 두 분석을 구분한다.

- 사용자 단위 생성 전환: `interview_create_started → interview_created`. **Unique users**, **Sequential**로 구성하고 room_id를 고정하지 않는다. `interview_create_step_viewed`와 `step`을 사용해 단계별 진입·이탈을 분석한다.
- 방 단위 진행 전환: `interview_created → interview_confirmed → interview_completed`. **Unique users**, **Sequential**, 전체 단계에 **Filters → 이벤트 속성 room_id = 분석할 방 ID**를 적용한다. 한 회원이 여러 방을 만들 때 이 값은 방의 총 처리 건수가 아니라 전환한 고유 회원 수다. 방별 상태나 건수 확인은 room_id별 별도 이벤트 분석과 서버 데이터를 사용한다.

전체 사용자 여정은 `interview_create_started → interview_created → interview_confirmed → interview_completed`로도 볼 수 있지만 동일한 방의 진행을 보장하지 않는다. 방 진행은 반드시 동일 room_id를 전체 단계에 필터한 별도 분석을 확인한다. `review_started → review_created`는 선택 행동으로 따로 분석하며, `review_created`는 대상별 제출 성공 건수다. 서버 자동 완료와 후기 수정·삭제는 이 이벤트에 포함되지 않는다.

## 검증

- 자동 테스트: SDK 경계를 모킹하여 익명→회원 연결, 로그인 복귀 1회 소비·10분 만료, reset, 화면·단계 중복 제거, payload 정리, API·네트워크 실패, 캐시 재조회 실패, SDK 오류 시 Mutation 성공 보존을 검증한다.
- Chromium 컴포넌트 테스트: Strict Mode 화면·단계 수집, 계정 전환, 실제 참가 신청 폼의 성공·서버 오류·폼 검증·SDK 오류를 확인한다. 기존 사용자 흐름 테스트는 유지한다.
- 실제 dev 수신 결과 및 미검증 범위는 아래에 기록한다.

### Dia 실제 수신 검증 (2026-10-09)

Moimyeon US Cloud 프로젝트의 Activity에서 로컬 개발 서버의 실제 SDK 전송을 확인했다. 토큰은 개발 프로세스에만 주입했고 환경 파일은 변경하지 않았다.

- 실제 개발 API 화면: identify, pageview, 생성 시작·단계, 상세 진입, 신청 시작 수신. URL에서 query/hash가 제외되고 동적 room 경로가 정규화됨을 확인했다.
- MSW 목 면접 끝자리 0201: 사용자 승인 후 진행 확정, 3명 모두 출석으로 수동 완료, 목 참여자 1명에게 테스트 후기 제출. `interview_confirmed`, `interview_completed`, `review_started`, `review_created` 수신을 확인했다. 실제 서버 데이터는 변경하지 않았다.
- 후기 제출 속성: 공통 속성과 room_id만 포함하고 후기 본문·대상 회원 ID를 포함하지 않았다.
- 퍼널 초안에서 environment=dev, event_source=frontend, room_id=목 면접 0201 필터를 모든 단계에 적용하고 확정→완료의 고유 사용자 순차 전환 1명을 확인했다. 분석은 저장하지 않았다. 전체 신청·생성 퍼널은 성공 이벤트를 아직 실제로 발생시키지 않아 검증하지 못했다. 미수신 이벤트는 현재 이벤트 선택 목록에 없었다.
- 실제 Google OAuth 왕복, 생성·신청·수락·반려 성공 및 실제 API 오류 수신은 미검증이다. 자동 테스트와 수집 시점 코드 검증으로 확인했다.

현재 PostHog UI의 순서 옵션은 Sequential이며 Hold property constant 메뉴는 확인되지 않았다. 방별 분석은 위의 전체 단계 room_id 필터를 사용한다. UI와 필터 개념은 [PostHog 공식 퍼널 문서](https://posthog.com/docs/product-analytics/funnels)를 참고한다.
