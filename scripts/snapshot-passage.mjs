// Runs a real passage through the local app and saves every layout in both versions.
// Needs OPENAI_API_KEY in .env.local (sample mode is refused, so screenshots are never fake).
// Usage: node scripts/snapshot-passage.mjs <file.pdf|.docx|.txt> <grade> <benchmark> [outDir]
// Example: node scripts/snapshot-passage.mjs "%USERPROFILE%/Downloads/hughes_thank_you_maam.pdf" 6 ELA.6.V.1.1
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const [, , file, grade, benchmark, outArg] = process.argv;
if (!file || !grade || !benchmark) {
  console.error("Usage: node scripts/snapshot-passage.mjs <file> <grade> <benchmark> [outDir]");
  process.exit(2);
}
const out = outArg ?? "test-results/passage";
const base = process.env.BASE_URL ?? "http://localhost:3000";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1.5 });
await page.goto(base);
await page.evaluate(() => localStorage.clear());
await page.reload();

// Step 1: upload the passage the teacher supplied. The title stays blank so the AI names it.
await page.locator("#upload").setInputFiles(file);
await page.getByText(/Added the text from/).waitFor({ timeout: 60_000 });
await page.getByLabel(/I am allowed to use this passage/).check();
await page.getByRole("button", { name: /next: choose grade/i }).click();

// Step 2
await page.getByLabel("Grade level", { exact: true }).selectOption(grade);
await page.getByRole("radio", { name: new RegExp(benchmark.replace(/\./g, "\\.")) }).check();
await page.getByRole("button", { name: /next: review/i }).click();

// Step 3: generate, and refuse sample mode
const started = Date.now();
const [response] = await Promise.all([
  page.waitForResponse((r) => r.url().endsWith("/api/generate"), { timeout: 300_000 }),
  page.getByRole("button", { name: /make my doodle notes/i }).click(),
]);
const data = await response.json();
if (data.demo || !response.ok()) {
  console.error(data.demo ? "Sample mode: add OPENAI_API_KEY to .env.local and restart the dev server." : `Generation failed: ${data.error}`);
  await browser.close();
  process.exit(1);
}
await page.getByRole("heading", { name: /your notes are ready/i }).waitFor({ timeout: 60_000 });
console.log(`generated in ${((Date.now() - started) / 1000).toFixed(1)}s · title: ${data.content.title} · picked: ${data.suggestedLayout}`);
if (data.warnings?.length) console.log("warnings:", data.warnings);

for (const [layout, slug] of [["Doodle vocabulary", "vocab"], ["Story map", "map"], ["Guided notes", "guided"]]) {
  await page.getByRole("button", { name: new RegExp(`^${layout}`) }).click();
  for (const mode of ["Convergent", "Divergent"]) {
    await page.getByRole("tab", { name: new RegExp(mode) }).click();
    await page.waitForTimeout(400);
    const sheet = page.locator(".print-root .sheet").first();
    const info = await sheet.evaluate((el) => {
      const root = el.closest(".print-root");
      root.style.position = "static";
      root.style.visibility = "visible";
      return { over: el.scrollHeight - el.clientHeight, font: getComputedStyle(el).fontSize };
    });
    await sheet.screenshot({ path: `${out}/${slug}-${mode.toLowerCase()}.png` });
    await sheet.evaluate((el) => {
      const root = el.closest(".print-root");
      root.style.position = "";
      root.style.visibility = "";
    });
    console.log(`${slug}-${mode.toLowerCase()}`, info.over > 1 ? `OVERFLOW ${info.over}px` : "fits", info.font);
  }
}
await browser.close();
