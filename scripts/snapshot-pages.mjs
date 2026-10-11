// Visual check: runs the sample flow and saves a PNG of every printed page.
// Usage: node scripts/snapshot-pages.mjs [baseUrl] [outDir]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "test-results/pages";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
await page.goto(base);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.getByRole("button", { name: /try a sample story/i }).click();
await page.getByRole("button", { name: /next: choose grade/i }).click();
await page.getByRole("button", { name: /next: review/i }).click();
await page.getByRole("button", { name: /make my doodle notes/i }).click();
await page.getByRole("heading", { name: /your notes are ready/i }).waitFor({ timeout: 120_000 });
await page.waitForTimeout(500);

// Reveal the print copy on screen, exactly as it will print.
await page.addStyleTag({
  content: `.no-print{display:none!important}.print-root{position:static!important;visibility:visible!important}
  .print-root .ls-page{margin:0 0 24px;outline:1px solid #f00}`,
});
const pages = page.locator(".print-root .ls-page");
const n = await pages.count();
for (let i = 0; i < n; i++) {
  const el = pages.nth(i);
  const id = await el.getAttribute("data-page-id");
  await el.screenshot({ path: `${out}/${id}.png` });
  const { over, spare } = await el.evaluate((p) => {
    const b = p.querySelector('.ls-body');
    const last = b.lastElementChild;
    const spare = last ? Math.round(b.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom) : 0;
    return { over: b.scrollHeight - b.clientHeight, spare };
  });
  console.log(id, over > 2 ? `OVERFLOW by ${over}px` : `fits, ${spare}px spare`);
}
await browser.close();
