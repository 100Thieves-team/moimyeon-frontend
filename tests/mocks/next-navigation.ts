import { vi } from "vitest";

export const routerRefreshMock = vi.fn();
export const routerReplaceMock = vi.fn();

export function useRouter() {
  return {
    refresh: routerRefreshMock,
    replace: routerReplaceMock,
  };
}
