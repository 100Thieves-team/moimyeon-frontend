import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input:
    "https://100thieves-team.github.io/moimyeon-backend/api/branches/dev/openapi/openapi3.yaml",
  output: {
    path: "src/api/generated",
    postProcess: ["oxfmt"],
  },
  plugins: [
    "@hey-api/typescript",
    {
      name: "@hey-api/sdk",
      validator: {
        response: "zod",
      },
    },
    {
      name: "zod",
      compatibilityVersion: 4,
    },
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "./src/api/hey-api",
      throwOnError: true,
    },
  ],
});
