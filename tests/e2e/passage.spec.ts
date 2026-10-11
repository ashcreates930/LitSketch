import { expect, test, type Page } from "@playwright/test";
import { DEMO_PASSAGE } from "../../lib/ai/demo";

async function generateWith(page: Page, text: string) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByLabel(/Title of the text/).fill("The Keeper's Light");
  await page.getByLabel("Passage", { exact: true }).fill(text);
  await page.getByLabel(/I am allowed to use this passage/).check();
  await page.getByRole("button", { name: /next: choose grade/i }).click();
  await page.getByLabel("Grade level", { exact: true }).selectOption("7");
  await page.getByRole("radio", { name: /ELA\.7\.R\.1\.1/ }).check();
  await page.getByRole("button", { name: /next: review/i }).click();
  await page.getByRole("button", { name: /make my doodle notes/i }).click();
  await expect(page.getByRole("heading", { name: "Your notes are ready" })).toBeVisible({ timeout: 60_000 });
}

/** Paragraph numbers on the printed passage pages, in order, and per-page facts. */
async function passagePages(page: Page) {
  await expect.poll(() => page.locator(".print-root .layout-passage").count()).toBeGreaterThan(1);
  await page.waitForTimeout(300);
  return page.locator(".print-root .layout-passage").evaluateAll((sheets) =>
    sheets.map((s) => ({
      title: s.querySelector(".ptitle")?.textContent ?? "",
      pageLine: s.querySelector(".ppage")?.textContent ?? "",
      numbers: Array.from(s.querySelectorAll(".para .pn")).map((n) => n.textContent ?? ""),
      firstIsContinuation: s.querySelector(".para")?.classList.contains("cont") ?? false,
      fits: s.scrollHeight <= s.clientHeight + 1,
    })),
  );
}

test("a long passage flows over several pages; every page repeats the title and page number", async ({ page }) => {
  const long = Array.from({ length: 6 }, () => DEMO_PASSAGE).join("\n\n"); // 36 paragraphs
  await generateWith(page, long);
  const pages = await passagePages(page);
  const total = pages.length;
  pages.forEach((p, n) => {
    expect(p.title).toBe("The Keeper's Light");
    expect(p.pageLine).toBe(`Passage · page ${n + 1} of ${total}`);
    expect(p.fits, `passage page ${n + 1} fits its sheet`).toBe(true);
  });
  const numbers = pages.flatMap((p) => p.numbers).filter(Boolean);
  expect(numbers).toEqual(Array.from({ length: 36 }, (_, i) => `¶${i + 1}`));
  await expect(page.getByText(/too much text/)).toHaveCount(0);
});

test("a paragraph too long for one page continues on the next, with its ¶ number kept at its start", async ({ page }) => {
  const giant = Array.from({ length: 70 }, (_, i) => `Sentence ${i + 1} keeps the storm going around the lighthouse at Cedar Point.`).join(" ");
  const text = `${DEMO_PASSAGE}\n\n${giant}\n\nThe end came quietly at dawn, and the light kept turning over the calm water.`;
  await generateWith(page, text);
  const pages = await passagePages(page);
  const withSeven = pages.findIndex((p) => p.numbers.includes("¶7"));
  expect(withSeven).toBeGreaterThanOrEqual(0);
  // The next page starts with the rest of ¶7, which carries no number of its own.
  expect(pages[withSeven + 1].firstIsContinuation).toBe(true);
  expect(pages.flatMap((p) => p.numbers).filter(Boolean)).toEqual(["¶1", "¶2", "¶3", "¶4", "¶5", "¶6", "¶7", "¶8"]);
  for (const p of pages) expect(p.fits).toBe(true);
  await expect(page.getByText(/too much text/)).toHaveCount(0);
});

test("an uploaded file's name never becomes the title", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator("#upload").setInputFiles({
    name: "hughes_thank_you_maam.txt",
    mimeType: "text/plain",
    buffer: Buffer.from(DEMO_PASSAGE),
  });
  await expect(page.getByText(/Added the text from/)).toBeVisible();
  await expect(page.getByLabel(/Title of the text/)).toHaveValue("");
  await page.getByLabel(/I am allowed to use this passage/).check();
  await page.getByRole("button", { name: /next: choose grade/i }).click();
  await page.getByLabel("Grade level", { exact: true }).selectOption("7");
  await page.getByRole("radio", { name: /ELA\.7\.R\.1\.1/ }).check();
  await page.getByRole("button", { name: /next: review/i }).click();
  await expect(page.getByText(/hughes|maam/i)).toHaveCount(0);
  await page.getByRole("button", { name: /make my doodle notes/i }).click();
  await expect(page.getByRole("heading", { name: "Your notes are ready" })).toBeVisible({ timeout: 60_000 });
  // The header and every printed page use the AI's title, never the file name.
  await expect(page.locator(".results-head")).not.toContainText(/hughes|maam/i);
  await expect(page.locator(".print-root")).not.toContainText(/hughes_|thank you maam/i);
});
