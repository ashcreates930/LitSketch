import { defineConfig, devices } from "@playwright/test";

/**
 * WebKit projects stand in for Safari on iPhone and iPad. They are close, not identical:
 * VoiceOver, the iPad print dialog, and Add to Home Screen still need a real-device check
 * (see docs/device-checklist.md).
 *
 * The access-code tests run against a production build on port 3100, where the code is
 * required. The code below is a test value for that server only.
 */
export const TEST_ACCESS_CODE = "test-code-4821";
const PROD_URL = "http://localhost:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    // Use the built-in sample content, never the real AI (development server only).
    extraHTTPHeaders: { "x-litsketch-demo": "1" },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : [
        { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120_000 },
        {
          command: "npm run build && npx next start -p 3100",
          url: PROD_URL,
          reuseExistingServer: true,
          timeout: 300_000,
          // OPENAI_API_KEY is blanked so this server uses the sample even when .env.local has a key.
          env: { LITSKETCH_ACCESS_CODE: TEST_ACCESS_CODE, LITSKETCH_DEMO: "1", OPENAI_API_KEY: "" },
        },
      ],
  projects: [
    { name: "iPhone SE", testIgnore: /access\.spec/, use: { ...devices["iPhone SE"], viewport: { width: 375, height: 667 } } },
    { name: "iPhone 15", testIgnore: /access\.spec/, use: { ...devices["iPhone 15"] } },
    { name: "iPad portrait", testIgnore: /access\.spec/, use: { ...devices["iPad (gen 7)"] } },
    { name: "iPad landscape", testIgnore: /access\.spec/, use: { ...devices["iPad (gen 7) landscape"] } },
    { name: "Narrow 320", testIgnore: /access\.spec/, use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 640 } } },
    { name: "Desktop Chrome", testIgnore: /access\.spec/, use: { ...devices["Desktop Chrome"] } },
    { name: "Desktop Safari", testIgnore: /access\.spec/, use: { ...devices["Desktop Safari"] } },
    { name: "Access code (production, iPad)", testMatch: /access\.spec/, use: { ...devices["iPad (gen 7)"], baseURL: PROD_URL } },
  ],
});
