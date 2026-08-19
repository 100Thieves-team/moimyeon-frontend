---
name: frontend-pattern
description: 모이면의 React, Next.js App Router, Base UI, React Hook Form, TanStack Query, Vanilla Extract 및 Hey API 생성 코드 규칙을 적용한다. src/app, src/features, src/components, src/api의 프론트엔드 컴포넌트, 폼, 서버 상태 흐름, API 연동을 구현·리팩터링·리뷰할 때 사용한다.
---

## 컴포넌트와 UI 경계

- React 상태, effect, 이벤트 핸들러, 브라우저 API, 클라이언트 Query hook이 필요하지 않으면 Server Component로 유지한다.
- 새로운 UI를 구현하기 전에 기존 디자인 시스템 컴포넌트, Base UI 컴포넌트, 디자인 토큰을 확인하고 재사용한다.
- UI 동작과 접근성은 Base UI가 담당하고, 스타일은 Vanilla Extract로 작성하되 기존 디자인 토큰을 우선 사용한다.

## 폼

- Base UI `Form`과 React Hook Form의 `handleSubmit`으로 제출을 처리한다.
- Base UI 및 사용자 정의 controlled input에는 `Controller`를 사용한다.
- 필드 단위 검증은 `Controller.rules`에 둔다.
- 각 Controller를 다음과 같이 명시적으로 연결한다.
  - `field.name`, `fieldState.invalid`, `fieldState.isTouched`, `fieldState.isDirty`를 `Field.Root`에 전달한다.
  - `field.value`, `field.onBlur`, `field.onChange`를 Base UI 컴포넌트의 값 관련 props에 연결한다. 폼 값과 컴포넌트 값의 타입이 다르면 Controller의 render 안에서 배열, null, 사용자 정의 callback 형식을 변환한다.
  - `field.ref`를 `ref` 또는 `inputRef`를 통해 실제 포커스 대상으로 전달한다.
  - 컨트롤에 맞는 표시용 label(`Field.Label`), 필요시 `Field.Description`, 오류 메시지를 담은 `Field.Error match={Boolean(fieldState.error)}`를 렌더링한다.
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
