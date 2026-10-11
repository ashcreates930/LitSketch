import { defineConfig, devices } from "@playwright/test";

/**
 * WebKit projects stand in for Safari on iPhone and iPad. They are close, not identical:
 * VoiceOver, the iPad print dialog, and Add to Home Screen still need a real-device check
 * (see docs/device-checklist.md).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "iPhone SE", use: { ...devices["iPhone SE"], viewport: { width: 375, height: 667 } } },
    { name: "iPhone 15", use: { ...devices["iPhone 15"] } },
    { name: "iPad portrait", use: { ...devices["iPad (gen 7)"] } },
    { name: "iPad landscape", use: { ...devices["iPad (gen 7) landscape"] } },
    { name: "Narrow 320", use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 640 } } },
    { name: "Desktop Chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "Desktop Safari", use: { ...devices["Desktop Safari"] } },
  ],
});
