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
    "@hey-api/sdk",
    {
      name: "@hey-api/client-fetch",
      runtimeConfigPath: "./src/api/hey-api",
    },
  ],
});
