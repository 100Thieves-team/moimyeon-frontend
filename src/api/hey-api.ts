import type { CreateClientConfig } from "./generated/client.gen";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const resumesPath = "/v1/members/me/resumes";

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
}

function getRequestPath(input: RequestInfo | URL) {
  const requestUrl = input instanceof Request ? input.url : input.toString();

  return new URL(requestUrl, apiBaseUrl).pathname;
}

function normalizeResumesResponse(data: unknown) {
  if (typeof data !== "object" || data === null || !("data" in data)) {
    return data;
  }

  const responseData = data.data;
  if (
    typeof responseData !== "object" ||
    responseData === null ||
    !("resumes" in responseData) ||
    !Array.isArray(responseData.resumes)
  ) {
    return data;
  }

  return {
    ...data,
    data: {
      ...responseData,
      resumes: responseData.resumes.map((resume) => {
        if (typeof resume !== "object" || resume === null) {
          return resume;
        }

        const normalizedResume = {
          ...resume,
          isDefault:
            "isDefault" in resume && typeof resume.isDefault === "boolean"
              ? resume.isDefault
              : "default" in resume
                ? resume.default
                : undefined,
        };

        if ("lastUsed" in normalizedResume && normalizedResume.lastUsed === null) {
          delete normalizedResume.lastUsed;
        }

        return normalizedResume;
      }),
    },
  };
}

function createApiFetch(requestFetch: typeof fetch): typeof fetch {
  return async (input, init) => {
    const response = await requestFetch(input, init);

    if (!response.ok || getRequestPath(input) !== resumesPath) {
      return response;
    }

    const data = await response.clone().json();
    const headers = new Headers(response.headers);
    headers.delete("Content-Length");

    return new Response(JSON.stringify(normalizeResumesResponse(data)), {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  };
}

export const createClientConfig: CreateClientConfig = (config) => {
  const devAccessToken = process.env.DEV_ACCESS_TOKEN?.trim();
  const isDevApi = apiBaseUrl.replace(/\/$/, "") === "https://api.dev.moimyeon.plady.io";
  const requestFetch = config?.fetch ?? globalThis.fetch;

  return {
    ...config,
    baseUrl: apiBaseUrl,
    credentials: "include",
    fetch: createApiFetch(requestFetch),
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
