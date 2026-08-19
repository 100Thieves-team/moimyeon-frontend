import {
  defaultShouldDehydrateQuery,
  environmentManager,
  QueryClient,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
        shouldRedactErrors: () => false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  /* 서버 환경에서는 항상 새로운 QueryClient를 생성 */
  if (environmentManager.isServer()) {
    return makeQueryClient();
  }

  /* 브라우저 환경에서는 싱글톤 QueryClient를 반환 */
  browserQueryClient ??= makeQueryClient();

  return browserQueryClient;
}
