// Visual check of the app screens at iPhone SE, iPad, and desktop sizes, in each display mode.
// Usage: node scripts/snapshot-screens.mjs [baseUrl] [outDir]
import { webkit, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "test-results/screens";
await mkdir(out, { recursive: true });
const browser = await webkit.launch();
const shots = [
  { name: "iphone-se", device: { ...devices["iPhone SE"], viewport: { width: 375, height: 667 } }, theme: null },
  { name: "ipad-dark", device: devices["iPad (gen 7)"], theme: "dark" },
  { name: "desktop-contrast", device: devices["Desktop Safari"], theme: "contrast" },
];
for (const s of shots) {
  const ctx = await browser.newContext(s.device);
  const page = await ctx.newPage();
  await page.goto(base);
  await page.evaluate((t) => { localStorage.clear(); if (t) localStorage.setItem("litsketch:theme", t); }, s.theme);
  await page.reload();
  await page.screenshot({ path: `${out}/${s.name}-1.png`, fullPage: true });
  await page.getByRole("button", { name: /try a sample story/i }).click();
  await page.getByRole("button", { name: /next: choose grade/i }).click();
  await page.screenshot({ path: `${out}/${s.name}-2.png` });
  await page.getByRole("button", { name: /next: review/i }).click();
  await page.getByRole("button", { name: /make my doodle notes/i }).click();
  await page.getByRole("heading", { name: /your notes are ready/i }).waitFor({ timeout: 60_000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${s.name}-3.png`, fullPage: false });
  await page.getByRole("tab", { name: /divergent/i }).click();
  await page.locator(".ls-screen .ls-page").first().screenshot({ path: `${out}/${s.name}-4.png` });
  await ctx.close();
}
await browser.close();
console.log("done");
