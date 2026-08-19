import type { CreateClientConfig } from "./generated/client.gen";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
}

export const createClientConfig: CreateClientConfig = (config) => {
  const devAccessToken = process.env.DEV_ACCESS_TOKEN?.trim();
  const isDevApi = apiBaseUrl.replace(/\/$/, "") === "https://api.dev.moimyeon.plady.io";

  return {
    ...config,
    baseUrl: apiBaseUrl,
    credentials: "include",
    headers: {
      ...config?.headers,
      ...(process.env.NODE_ENV === "development" &&
      typeof window === "undefined" &&
      isDevApi &&
      devAccessToken
        ? { Authorization: `Bearer ${devAccessToken}` }
        : {}),
    },
  };
};
