// Visual check: runs the sample flow and saves a PNG of every printed sheet,
// for each layout and thinker mode, plus a colored preview and an answer key.
// Usage: node scripts/snapshot-pages.mjs [baseUrl] [outDir]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "test-results/pages";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1.5 });
await page.goto(base);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.getByRole("button", { name: /try a sample story/i }).click();
await page.getByRole("button", { name: /next: choose grade/i }).click();
await page.getByRole("button", { name: /next: review/i }).click();
await page.getByRole("button", { name: /make my doodle notes/i }).click();
await page.getByRole("heading", { name: /your notes are ready/i }).waitFor({ timeout: 120_000 });

async function report(name) {
  await page.waitForTimeout(400);
  const sheets = page.locator(".print-root .sheet");
  const n = await sheets.count();
  for (let i = 0; i < n; i++) {
    const s = sheets.nth(i);
    const info = await s.evaluate((el) => ({
      over: el.scrollHeight - el.clientHeight,
      font: getComputedStyle(el).fontSize,
    }));
    const file = `${out}/${name}${n > 1 ? `-${i + 1}` : ""}.png`;
    await s.evaluate((el) => {
      const root = el.closest(".print-root");
      root.style.position = "static";
      root.style.visibility = "visible";
    });
    await s.screenshot({ path: file });
    await s.evaluate((el) => {
      const root = el.closest(".print-root");
      root.style.position = "";
      root.style.visibility = "";
    });
    console.log(name, i + 1, info.over > 1 ? `OVERFLOW by ${info.over}px` : "fits", "font", info.font);
  }
}

await page.addStyleTag({ content: ".no-print .print-root{}" });
for (const layout of ["Doodle vocabulary", "Story map", "Guided notes"]) {
  await page.getByRole("button", { name: new RegExp(`^${layout}`) }).click();
  for (const mode of ["Convergent", "Divergent"]) {
    await page.getByRole("tab", { name: new RegExp(mode) }).click();
    await report(`${layout.split(" ")[1] ?? layout}-${mode}`.toLowerCase().replace(/\s+/g, "-"));
  }
}

// Screen views: colored preview and answers, as the teacher sees them
await page.getByRole("button", { name: /^Story map/ }).click();
await page.getByRole("tab", { name: /Convergent/ }).click();
await page.getByRole("button", { name: "Preview colored" }).click();
await page.locator(".ls-screen .sheet").first().screenshot({ path: `${out}/screen-map-colored.png` });
await page.getByRole("button", { name: "Preview colored" }).click();
await page.getByRole("button", { name: "Show answers" }).click();
await page.locator(".ls-screen .sheet").first().screenshot({ path: `${out}/screen-map-answers.png` });
await browser.close();
