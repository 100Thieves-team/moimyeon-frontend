import { useSyncExternalStore } from "react";
import { vi } from "vitest";

const listeners = new Set<() => void>();

function notifyNavigation() {
  listeners.forEach((listener) => listener());
}

function navigate(href: string, replace: boolean) {
  const method = replace ? "replaceState" : "pushState";
  window.history[method](null, "", href);
  notifyNavigation();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

function useCurrentUrl() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.href,
    () => "http://localhost/",
  );
}

export const routerRefreshMock = vi.fn();
export const routerPushMock = vi.fn((href: string) => navigate(href, false));
export const routerReplaceMock = vi.fn((href: string) => navigate(href, true));

export function useRouter() {
  return {
    push: routerPushMock,
    refresh: routerRefreshMock,
    replace: routerReplaceMock,
  };
}

export function usePathname() {
  return new URL(useCurrentUrl()).pathname;
}

export function useSearchParams() {
  return new URL(useCurrentUrl()).searchParams;
}
