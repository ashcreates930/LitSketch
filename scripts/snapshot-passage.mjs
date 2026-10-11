// Runs a real passage through the local app and saves every layout in both versions,
// plus the numbered passage pages.
// Needs OPENAI_API_KEY in .env.local: sample mode is refused, so note screenshots are never fake.
//
// Usage: node scripts/snapshot-passage.mjs <file.pdf|.docx|.txt> <grade> <benchmark> [outDir] [--passage-only "Title"]
// --passage-only saves just the numbered passage pages and works without a key. It types the
// given title into the Title field (the teacher's path), since sample mode has no AI title.
// Example: node scripts/snapshot-passage.mjs "%USERPROFILE%/Downloads/hughes_thank_you_maam.pdf" 6 ELA.6.V.1.1
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const args = process.argv.slice(2);
const po = args.indexOf("--passage-only");
const passageOnly = po >= 0;
const passageTitle = passageOnly ? args.splice(po, 2)[1] : "";
const [file, grade, benchmark, outArg] = args;
if (!file || !grade || !benchmark) {
  console.error('Usage: node scripts/snapshot-passage.mjs <file> <grade> <benchmark> [outDir] [--passage-only "Title"]');
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
if (passageOnly) await page.getByLabel(/Title of the text/).fill(passageTitle);
await page.getByLabel(/I am allowed to use this passage/).check();
await page.getByRole("button", { name: /next: choose grade/i }).click();

// Step 2
await page.getByLabel("Grade level", { exact: true }).selectOption(grade);
await page.getByRole("radio", { name: new RegExp(benchmark.replace(/\./g, "\\.")) }).check();
await page.getByRole("button", { name: /next: review/i }).click();

// Step 3: generate
const started = Date.now();
const [response] = await Promise.all([
  page.waitForResponse((r) => r.url().endsWith("/api/generate"), { timeout: 300_000 }),
  page.getByRole("button", { name: /make my doodle notes/i }).click(),
]);
const data = await response.json();
if (!response.ok() || (data.demo && !passageOnly)) {
  console.error(data.demo ? "Sample mode: add OPENAI_API_KEY to .env.local and restart the dev server." : `Generation failed: ${data.error}`);
  await browser.close();
  process.exit(1);
}
await page.getByRole("heading", { name: /your notes are ready/i }).waitFor({ timeout: 60_000 });
const shownTitle = (await page.locator(".results-head .lead").textContent())?.split(" · ")[0];
console.log(`generated in ${((Date.now() - started) / 1000).toFixed(1)}s · title: ${shownTitle} · picked: ${data.suggestedLayout}${data.demo ? " · SAMPLE MODE" : ""}`);
if (data.warnings?.length) console.log("warnings:", data.warnings);

async function shoot(sheet, name) {
  const info = await sheet.evaluate((el) => {
    const root = el.closest(".print-root");
    root.style.position = "static";
    root.style.visibility = "visible";
    return { over: el.scrollHeight - el.clientHeight, font: getComputedStyle(el).fontSize };
  });
  await sheet.screenshot({ path: `${out}/${name}.png` });
  await sheet.evaluate((el) => {
    const root = el.closest(".print-root");
    root.style.position = "";
    root.style.visibility = "";
  });
  console.log(name, info.over > 1 ? `OVERFLOW ${info.over}px` : "fits", info.font);
}

if (!passageOnly) {
  for (const [layout, slug] of [["Doodle vocabulary", "vocab"], ["Story map", "map"], ["Guided notes", "guided"]]) {
    await page.getByRole("button", { name: new RegExp(`^${layout}`) }).click();
    for (const mode of ["Convergent", "Divergent"]) {
      await page.getByRole("tab", { name: new RegExp(mode) }).click();
      await page.waitForTimeout(400);
      await shoot(page.locator(".print-root .sheet").first(), `${slug}-${mode.toLowerCase()}`);
    }
  }
}

// The numbered passage pages that print after the notes.
await page.waitForTimeout(400);
const passage = page.locator(".print-root .layout-passage");
const count = await passage.count();
for (let i = 0; i < count; i++) await shoot(passage.nth(i), `passage-${i + 1}`);
await browser.close();
