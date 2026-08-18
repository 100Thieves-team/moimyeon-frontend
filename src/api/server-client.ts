import "server-only";

import { cookies } from "next/headers";
import { createClient } from "./generated/client";
import { createClientConfig } from "./hey-api";

export async function createServerClient() {
  const cookieHeader = (await cookies()).toString();
  const config = cookieHeader ? { headers: { Cookie: cookieHeader } } : undefined;

  return createClient(createClientConfig(config));
}
