---
name: frontend-pattern
description: 모이면의 React, Next.js App Router, Base UI, React Hook Form, TanStack Query, Vanilla Extract 및 Hey API 생성 코드 규칙을 적용한다. src/app, src/features, src/components, src/api의 프론트엔드 컴포넌트, 폼, 서버 상태 흐름, API 연동을 구현·리팩터링·리뷰할 때 사용한다.
---

## 컴포넌트와 UI 경계

- React 상태, effect, 이벤트 핸들러, 브라우저 API, 클라이언트 Query hook이 필요하지 않으면 Server Component로 유지한다.
- 새로운 UI를 구현하기 전에 기존 디자인 시스템 컴포넌트, Base UI 컴포넌트, 디자인 토큰을 확인하고 재사용한다.
- UI 동작과 접근성은 Base UI가 담당하고, 스타일은 Vanilla Extract로 작성하되 기존 디자인 토큰을 우선 사용한다.

## 폼

- 모든 폼의 제출, 입력 검증, 오류 상태는 React Hook Form으로 일관되게 관리한다. 검증 오류를 별도 `useState`로 중복 관리하거나 이벤트 핸들러에서 직접 검증 후 mutation을 호출하지 않는다.
- Base UI `Form`의 `onSubmit`에 React Hook Form의 `handleSubmit`으로 만든 제출 핸들러를 연결한다. 파일 선택 즉시 업로드하는 흐름도 `handleSubmit`을 거쳐 검증된 값으로 mutation을 호출한다.
- 필드 연결에는 `useController` 훅 대신 `Controller` 컴포넌트를 사용한다. 공용 훅은 `useForm`의 `control`과 제출 핸들러를 반환하고, 입력을 렌더링하는 컴포넌트에서 `Controller`를 배치한다.
- 필드 단위 검증은 `Controller.rules`에 둔다. 재사용하는 순수 검증 함수는 `rules.validate`에서 호출한다.
- 각 Controller를 다음과 같이 명시적으로 연결한다.
  - `field.name`, `fieldState.invalid`, `fieldState.isTouched`, `fieldState.isDirty`를 `Field.Root`에 전달한다.
  - `field.value`, `field.onBlur`, `field.onChange`를 Base UI 컴포넌트의 값 관련 props에 연결한다. 폼 값과 컴포넌트 값의 타입이 다르면 Controller의 render 안에서 배열, null, 사용자 정의 callback 형식을 변환한다.
  - `field.ref`를 `ref` 또는 `inputRef`를 통해 실제 포커스 대상으로 전달한다.
  - 컨트롤에 맞는 표시용 label(`Field.Label`), 필요시 `Field.Description`, 오류 메시지를 담은 `Field.Error match={Boolean(fieldState.error)}`를 렌더링한다.
- 파일 input은 `Controller`의 render 안에서 `event.currentTarget.files`를 폼 값으로 변환한다. `File` 객체를 input의 `value`에 전달하지 않는다.
- 서버의 필드 오류는 `setError`로 표현하고, 특정 필드에 속하지 않는 오류는 root error로 관리한다. 사용자가 관련 입력을 수정하면 오래된 서버 오류를 제거한다.

## 서버 상태와 Suspense 스트리밍

- 클라이언트 컴포넌트에서 캐시, 재조회, Mutation 상태를 관리할 때는 생성된 *Options, *QueryKey, *Mutation helper와 React Query를 사용한다. Server Component에서 한 번 조회해 렌더링하는 데이터는 SDK를 직접 호출한다.
- 서버에서는 사용자 요청 간 캐시가 공유되지 않도록 요청마다 QueryClient와 인증 쿠키가 설정된 API client를 생성한다. 브라우저에서는 캐시를 유지하기 위해 하나의 QueryClient를 재사용한다.
- 스트리밍할 수 있는 비차단 작업은 `queryClient.prefetchQuery(...)`를 await하지 않고 시작한다.
- 클라이언트 소비자를 `HydrationBoundary state={dehydrate(queryClient)}`와 적절한 `Suspense` boundary로 감싼다. 클라이언트 컴포넌트에서는 같은 생성 options와 query key로 `useSuspenseQuery` 또는 `useSuspenseQueries`를 호출한다.
- 쿼리가 성공해도 생성된 응답 타입의 내부 `data`는 optional일 수 있으므로 API envelope를 검증한다.
- Server Component에서만 사용하는 데이터는 SDK로 직접 조회한다. 클라이언트 컴포넌트가 React Query 캐시를 사용할 때만 prefetch와 hydration을 적용한다. 같은 데이터를 React Query 캐시와 prop으로 중복 전달하지 않는다.

## 생성 API와 Mutation

- `src/api/generated`는 직접 수정하지 않는다. OpenAPI 스키마 또는 generator 설정을 변경한 뒤 pnpm generate:api로 SDK를 다시 생성한다. 생성 후 전체 diff를 확인하고, 원격 OpenAPI의 다른 변경으로 생긴 예상하지 못한 결과는 현재 작업에 포함할지 확인한다.
- SDK는 기본적으로 API 실패를 throw한다. 이 경우 성공 결과만 반환되므로 오류는 catch 또는 error boundary에서 처리한다. 특정 상태 코드나 API 오류 코드를 반환값으로 분기해야 할 때만 throwOnError: false를 사용하고 result.error와 result.response를 직접 확인한다.
- Mutation 성공 후 변경된 데이터를 사용하는 생성 query key를 invalidate한다.

## 개발 모킹

- Server Component의 prefetch는 브라우저 Service Worker가 가로챌 수 없으므로 Node용 MSW `setupServer`도 함께 사용한다.
- Next.js가 `globalThis.fetch`를 다시 패치해 먼저 설치된 MSW interceptor를 무효화할 수 있으므로, Node MSW는 `instrumentation.ts`가 아닌 Next의 fetch 패치 이후 평가되는 루트 `src/app/layout.tsx` 모듈에서 시작한다.
- 브라우저에서는 `src/mocks/msw-provider.tsx`가 `worker.start()` 완료까지 렌더링을 보류해야 한다. 초기 요청이 Service Worker 등록보다 먼저 실행되는 경합을 만들지 않는다.

### 출처

- [Next.js discussion #56446: instrumentation은 Next.js의 전역 fetch 패치보다 먼저 실행됨](https://github.com/vercel/next.js/discussions/56446)
- [Next.js PR #68193: 사용자 fetch 패치를 보존하기 위한 복원 시점 변경과 루트 layout 기반 MSW 예제](https://github.com/vercel/next.js/pull/68193)
- [MSW examples PR #101: App Router에서 루트 layout과 Suspense 기반 MSW Provider를 구성한 예제](https://github.com/mswjs/examples/pull/101)
- [MSW issue #1644: Next.js App Router의 서버 프로세스와 전역 interceptor 제약 조사](https://github.com/mswjs/msw/issues/1644)
