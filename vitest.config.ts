import path from "node:path";
import { fileURLToPath } from "node:url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  optimizeDeps: {
    include: [
      "@base-ui/react/avatar",
      "@base-ui/react/button",
      "@base-ui/react/combobox",
      "@base-ui/react/dialog",
      "@base-ui/react/field",
      "@base-ui/react/form",
      "@base-ui/react/merge-props",
      "@base-ui/react/radio",
      "@base-ui/react/radio-group",
      "@base-ui/react/tabs",
      "@base-ui/react/toast",
      "@base-ui/react/toggle",
      "@base-ui/react/toggle-group",
      "@vanilla-extract/recipes/createRuntimeFn",
      "@vanilla-extract/sprinkles/createRuntimeSprinkles",
    ],
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
            "next/navigation": path.resolve(rootDirectory, "tests/mocks/next-navigation.ts"),
            "server-only": path.resolve(rootDirectory, "tests/mocks/server-only.ts"),
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
