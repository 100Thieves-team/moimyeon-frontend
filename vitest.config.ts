import path from "node:path";
import { fileURLToPath } from "node:url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  optimizeDeps: {
    include: ["@vanilla-extract/sprinkles/createRuntimeSprinkles"],
  },
  plugins: [vanillaExtractPlugin(), react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDirectory, "src"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          include: ["tests/**/*.unit.test.ts"],
          name: "unit",
        },
      },
      {
        extends: true,
        resolve: {
          alias: {
            "next/link": path.resolve(rootDirectory, "tests/mocks/next-link.tsx"),
          },
        },
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [
              {
                browser: "chromium",
                name: "chromium-light",
                provider: playwright({ contextOptions: { colorScheme: "light" } }),
              },
              {
                browser: "chromium",
                name: "chromium-dark",
                provider: playwright({ contextOptions: { colorScheme: "dark" } }),
              },
            ],
            provider: playwright(),
          },
          include: ["tests/**/*.browser.test.tsx"],
          name: "browser",
        },
      },
    ],
  },
});
