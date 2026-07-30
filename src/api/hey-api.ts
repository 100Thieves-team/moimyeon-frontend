import "client-only";

import type { CreateClientConfig } from "./generated/client.gen";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
}

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseURL: apiBaseUrl,
  withCredentials: true,
});
